import os
import io
import time
from datetime import datetime
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify, render_template
from PIL import Image

app = Flask(__name__)

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    return response


print("Loading Smart AI Model into memory...")
MODEL_PATH = 'monkey_model1.keras'
model = tf.keras.models.load_model(MODEL_PATH)
print("Model loaded and ready!")


def prepare_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize((224, 224))

    img_array = tf.keras.utils.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)

    # MobileNetV2 expects pixel values in [-1, 1], not [0, 255]
    img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)

    return img_array


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    try:
        image_bytes = file.read()
        processed_image = prepare_image(image_bytes)

        prediction = model.predict(processed_image)
        score = float(prediction[0][0])

        if score >= 0.5:
            result = "Monkey "
            confidence = score * 100
        else:
            result = "Not a Monkey "
            confidence = (1 - score) * 100

        return jsonify({
            'result': result,
            'confidence': f"{confidence:.2f}%"
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/detect', methods=['POST', 'OPTIONS'])
def api_detect():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    start_time = time.time()
    file = request.files.get('file') or request.files.get('image')
    if not file or file.filename == '':
        return jsonify({'error': 'No image file uploaded'}), 400

    try:
        image_bytes = file.read()
        processed_image = prepare_image(image_bytes)

        prediction = model.predict(processed_image)
        score = float(prediction[0][0])

        if score >= 0.5:
            result = "Monkey"
            confidence = round(score * 100, 2)
        else:
            result = "Not a Monkey"
            confidence = round((1 - score) * 100, 2)

        processing_time_ms = int((time.time() - start_time) * 1000)
        timestamp = datetime.utcnow().isoformat() + "Z"

        return jsonify({
            'prediction': result,
            'confidence': confidence,
            'processing_time_ms': processing_time_ms,
            'timestamp': timestamp
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)