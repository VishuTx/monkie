# Monkey Detector AI

An intelligent web application powered by Deep Learning that detects whether an uploaded image contains a monkey or not. Built using a custom-trained **MobileNetV2** Convolutional Neural Network (CNN) and served via a lightweight **Flask** backend.

## Overview

This project was built to demonstrate end-to-end machine learning deployment. It takes a lightweight, highly efficient base model (MobileNetV2), fine-tunes it on a custom dataset, and deploys it in a user-friendly web interface. The model is also optimized for edge-device deployment (like a Raspberry Pi) using TensorFlow Lite.

### Features
* **Custom CNN Architecture:** Utilizes Transfer Learning with MobileNetV2 for high accuracy and fast inference.
* **Smart Binary Classification:** Trained on a split dataset of Monkeys vs. Backgrounds (negative examples) to prevent false positives.
* **Interactive Web Interface:** Clean HTML/CSS/JS frontend for easy image uploading and real-time scanning.
* **Edge-Ready:** Includes scripts to compress and export the model to `.tflite` format for IoT devices.

---

## Tech Stack

* **Machine Learning:** TensorFlow, Keras, NumPy, Pillow
* **Backend:** Python, Flask
* **Frontend:** HTML5, CSS3, Vanilla JavaScript

---
Model Training Details
Base Model: MobileNetV2 (ImageNet weights)

Data Augmentation: Random Horizontal Flips & Rotations (0.2)

Input Resolution: 224x224 RGB

Activation Functions: ReLU (Hidden layers), Sigmoid (Output layer)

Loss Function: Binary Crossentropy

Optimizer: Adam (Learning rate: 0.0001)

Future Scope
Multi-Class Detection: Upgrading the dataset and architecture (Softmax) to differentiate between Humans, Monkeys, and Background elements.

Live Video Feed: Integrating OpenCV to process real-time webcam streams instead of static image uploads.

Hardware Deployment: Flashing the .tflite model onto a Raspberry Pi with a camera module for a real-world wildlife monitoring system.

## Project Structure

```text
├── static/
│   ├── css/style.css         # UI Styling
│   └── js/script.js          # Frontend logic and API calls
├── templates/
│   └── index.html            # Main web page
├── app.py                    # Flask server and inference API
├── train_mobilenet.py        # Model training and optimization script
├── monkey_model.keras        # The trained deep learning model
└── monkey_model.tflite       # Quantized model for edge devices (Raspberry Pi)


