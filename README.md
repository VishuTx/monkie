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

## Prerequisites and SDK Version

Make sure you have the following installed before starting:

* Python 3.8 or newer
* Node.js (version 18 or newer) and npm
* **Expo SDK 57:** The mobile frontend is built on Expo SDK 57.
* **Expo Go App:** To run the application on your mobile phone, download the Expo Go client corresponding to Expo SDK 57 from the official Expo releases website (`https://expo.dev/go`) or direct APK download links rather than standard app store builds.

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

1. Download the Expo Go client for **Expo SDK 57** from the official Expo website (`https://expo.dev/go`) or direct APK download link and install it on your mobile phone.
2. Connect your mobile phone to the exact same Wi-Fi network as your computer.
3. Run `npx expo start` inside the `monkey-detector` folder.
4. A QR code will be displayed in your terminal.
5. Open Expo Go on your phone:
   * **Android:** Open Expo Go, tap **Scan QR code** and scan the terminal QR code.
   * **iOS:** Open the default Camera app, point it at the QR code and tap the notification banner to open Expo Go.
6. The app will build and load on your mobile phone. You can now select photos or take live camera shots to test detection.

---

## Hardware Live Feed and Architecture Upgrade Plan

When connecting physical camera hardware (such as Raspberry Pi units equipped with NOIR night vision cameras and PIR motion sensors), the codebase will be expanded with the following files and structural changes:

### Modified and Created Files for Hardware Streaming

1. **Backend Server (`monkey/`) Changes:**
   * **`stream_manager.py` (New):** Manages incoming RTSP or WebRTC camera video streams from attached Raspberry Pi nodes, samples frames at configurable intervals and passes them to the AI model.
   * **`alert_engine.py` (New):** Evaluates incoming detection confidence scores and triggers physical deterrence outputs (such as bio-acoustic sound generators or strobe lights).
   * **`app.py` (Modified):** Upgraded from standard Flask HTTP routes to include WebSocket endpoints (`/ws/live-stream` and `/ws/alerts`) for real time bi-directional communication.

2. **Frontend Mobile App (`monkey-detector/`) Changes:**
   * **`src/services/hardwareStreamService.ts` (New):** Handles WebSocket and WebRTC video stream connections to display live feed feeds from hardware camera nodes.
   * **`src/screens/LiveHardwareFeedScreen.tsx` (New):** Dedicated screen allowing security staff to view live camera feeds from all deployed campus nodes.
   * **`src/services/pushNotificationService.ts` (New):** Configures background notification handlers using Expo Notifications to ring high priority emergency alerts even when the app is closed.

---

## Real Time Alert Flow when Hardware Triggers

1. **Hardware Detection:** A physical PIR motion sensor attached to a Raspberry Pi camera node detects movement in a monitored perimeter.
2. **Frame Capture:** The camera captures a high resolution image frame and passes it to the local model or posts it to the backend server `/api/alerts/trigger`.
3. **AI Classification:** The classification model verifies whether a primate is present and calculates the confidence percentage.
4. **Alert Broadcast:** If the verdict confirms a primate intrusion, the backend alert engine immediately broadcasts a high priority WebSocket payload and enqueues a push notification.
5. **Mobile Notification:** Connected mobile devices receive an immediate push alert with audio alarm sound, timestamp and exact location metadata.

---

## Layers of Authentication and Access Control

To ensure security and operational order, the system implements a multi-layer Role Based Access Control (RBAC) structure:

1. **Resident and Student Layer:**
   * **Permissions:** Read-only access to general safety status updates and view push notifications for their specific hostel block.
   * **Authentication:** Simple single sign-on or student ID verification.

2. **Warden and Security Personnel Layer:**
   * **Permissions:** Receive priority intrusion alerts, view live hardware feeds, trigger manual deterrence responses (acoustic repellents) and mark incident logs as resolved.
   * **Authentication:** Multi-factor authentication with secure token renewal.

3. **System Administrator Layer:**
   * **Permissions:** Full system access to pair new Raspberry Pi hardware nodes, manage camera configurations, assign spatial location mappings and view global audit logs.
   * **Authentication:** Encrypted administrator credentials with hardware security key support.

---

## Spatial Location Mapping System

When deployed in physical environments, every hardware camera node is assigned precise spatial location metadata. Every alert generated by the system includes detailed spatial attributes so wardens and security staff can respond immediately:

* **Campus Identifier:** e.g. "Main University Campus"
* **Building or Hostel Block:** e.g. "Hostel Block C"
* **Wing Identifier:** e.g. "North Wing"
* **Floor Level:** e.g. "3rd Floor"
* **Zone Descriptor:** e.g. "Balcony Corridor and Dining Area Window"
* **Node ID:** e.g. "NODE-C3-NORTH"

Example Alert Payload:
```json
{
  "alert_id": "ALT_98241",
  "node_id": "NODE-C3-NORTH",
  "location": {
    "campus": "Main University Campus",
    "block": "Hostel Block C",
    "wing": "North Wing",
    "floor": "3rd Floor",
    "zone": "Balcony Corridor"
  },
  "verdict": "Intrusion by Primate Detected",
  "confidence": 96.8,
  "timestamp": "2026-08-16T17:00:00Z"
}
```

---

## Troubleshooting Network Connections

If the mobile app shows a network error when scanning:
1. Ensure your computer and mobile phone are on the exact same Wi-Fi network.
2. Ensure Windows Firewall permits incoming connections on port 5000 so your phone can reach the Flask backend.
3. If local network isolation is enabled on your router, run Expo in tunnel mode:
   ```bash
   npm run tunnel
   ```
