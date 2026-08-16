# Primate Deterrence System

This repository contains a real time primate detection system built to identify ape intrusions and help manage wildlife conflicts in hostel and campus areas.

---

## Folder Structure and Architecture

The project is split into two main folders that work together:

1. **`monkey` (Backend Server)**
   This folder contains the Python Flask backend server and the deep learning classification model (`monkey_model1.keras`). It provides an API endpoint (`/api/detect`) that receives uploaded images, processes them using MobileNetV2 and returns the detection verdict along with confidence metrics.

2. **`monkey-detector` (Frontend Mobile App)**
   This folder contains the React Native Expo application. It provides the user interface for taking live photos, selecting gallery images and reviewing past incident logs. It communicates with the backend server to display whether an area is safe or an intrusion has been detected.

---

## How the System Operates

1. The Flask server inside `monkey` runs on your computer and listens for image scan requests on port 5000.
2. The React Native app inside `monkey-detector` runs on your computer or mobile phone using Expo.
3. When you capture or choose an image in the mobile app, it sends a request over your local network to `http://<YOUR_COMPUTER_IP>:5000/api/detect`.
4. The backend processes the image using the artificial intelligence model and returns the prediction result to the app in real time.

---

## Prerequisites

Make sure you have the following installed before starting:

* Python 3.8 or newer
* Node.js (version 18 or newer) and npm
* Expo Go app installed on your mobile phone (available on Google Play Store for Android and Apple App Store for iOS)

---

## Step by Step Execution Guide

### 1. Start the Backend Server (`monkey`)

Open a terminal window and navigate to the `monkey` folder:
```bash
cd monkey
```

Install the required Python libraries:
```bash
pip install flask tensorflow pillow numpy
```

Start the Flask server:
```bash
python app.py
```
The backend server will run on `http://0.0.0.0:5000`.

---

### 2. Find Your Computer Local IPv4 Address

To allow your mobile phone to connect to your computer backend server, both devices must be connected to the exact same Wi-Fi network.

1. Open Command Prompt or PowerShell on Windows:
   ```cmd
   ipconfig
   ```
2. Find the **IPv4 Address** under your active Wi-Fi adapter (for example `192.168.31.72`).

---

### 3. Start the Frontend App (`monkey-detector`)

Open a second terminal window and navigate to the `monkey-detector` folder:
```bash
cd monkey-detector
```

Install project dependencies:
```bash
npm install
```

Ensure `app.config.ts` points to your computer IP address:
Open `app.config.ts` and set `API_BASE_URL` to match your local IP address:
```typescript
API_BASE_URL: 'http://192.168.31.72:5000'
```

Start the Expo development server:
```bash
npx expo start -c
```

---

## How to Run on Your Mobile Phone Using Expo Go

1. Download and install **Expo Go** from the App Store on iOS or Google Play Store on Android.
2. Connect your mobile phone to the exact same Wi-Fi network as your computer.
3. Run `npx expo start` inside the `monkey-detector` folder.
4. A QR code will be displayed in your terminal.
5. Open Expo Go on your phone:
   * **Android:** Open Expo Go, tap **Scan QR code** and scan the terminal QR code.
   * **iOS:** Open the default Camera app, point it at the QR code and tap the notification banner to open Expo Go.
6. The app will build and load on your mobile phone. You can now select photos or take live camera shots to test detection.

---

## Troubleshooting Network Connections

If the mobile app shows a network error when scanning:
1. Ensure your computer and mobile phone are on the exact same Wi-Fi network.
2. Ensure Windows Firewall permits incoming connections on port 5000 so your phone can reach the Flask backend.
3. If local network isolation is enabled on your router, run Expo in tunnel mode:
   ```bash
   npm run tunnel
   ```
