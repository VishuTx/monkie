import os
import tensorflow as tf


def main():

    dataset_dir = 'monkey indian'
    train_dir = os.path.join(dataset_dir, 'train')
    test_dir = os.path.join(dataset_dir, 'test')

    IMG_SIZE = (224, 224)
    BATCH_SIZE = 32
    EPOCHS = 10

    print("Scanning folders...")

    try:
        train_dataset = tf.keras.utils.image_dataset_from_directory(
            train_dir,
            shuffle=True,
            batch_size=BATCH_SIZE,
            image_size=IMG_SIZE
        )

        validation_dataset = tf.keras.utils.image_dataset_from_directory(
            test_dir,
            shuffle=True,
            batch_size=BATCH_SIZE,
            image_size=IMG_SIZE
        )
    except Exception as e:
        print("\n❌ ERROR: Keras cannot find your subfolders.")
        print("Did you put your images inside 'monkey' and 'background' subfolders?")
        return

    class_names = train_dataset.class_names
    print(f"✅ Classes found: {class_names}")

    if len(class_names) < 2:
        print(
            "\n❌ ERROR: The AI only sees one class. You MUST add a 'background' folder with non-monkey images to fix the 'everything is a monkey' bug.")
        return


    AUTOTUNE = tf.data.AUTOTUNE
    train_dataset = train_dataset.prefetch(buffer_size=AUTOTUNE)
    validation_dataset = validation_dataset.prefetch(buffer_size=AUTOTUNE)

    data_augmentation = tf.keras.Sequential([
        tf.keras.layers.RandomFlip('horizontal'),
        tf.keras.layers.RandomRotation(0.2),
    ])


    print("Building smart model...")
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=IMG_SIZE + (3,),
        include_top=False,
        weights='imagenet'
    )
    base_model.trainable = False

    inputs = tf.keras.Input(shape=IMG_SIZE + (3,))
    x = data_augmentation(inputs)
    x = tf.keras.applications.mobilenet_v2.preprocess_input(x)
    x = base_model(x, training=False)
    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    x = tf.keras.layers.Dropout(0.2)(x)

    outputs = tf.keras.layers.Dense(1, activation='sigmoid')(x)

    model = tf.keras.Model(inputs, outputs)
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.0001),
        loss=tf.keras.losses.BinaryCrossentropy(),
        metrics=['accuracy']
    )


    print("Training started...")
    model.fit(train_dataset, epochs=EPOCHS, validation_data=validation_dataset)


    model_filename = 'monkey_model1.keras'
    model.save(model_filename)
    print(f"\n✅ Model successfully saved as '{model_filename}'")


    print("\nConverting to TFLite...")
    converter = tf.lite.TFLiteConverter.from_keras_model(tf.keras.models.load_model(model_filename))
    converter.optimizations = [tf.lite.Optimize.DEFAULT]
    with open('monkey_model1.tflite', 'wb') as f:
        f.write(converter.convert())
    print(" TFLite model saved!")


if __name__ == '__main__':
    main()