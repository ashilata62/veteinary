# VetCare Pro Mobile App: Build & Deployment Guide

This guide describes how to configure, build, and deploy the VetCare Pro mobile app for Android (APK) and iOS (IPA) using the Expo ecosystem.

---

## 1. Prerequisites

Before starting, ensure you have the following installed on your machine:
- **Node.js** (v18 or higher recommended)
- **NPM** or **Yarn**
- **Expo CLI** (installed globally: `npm install -g expo-cli`)
- **EAS CLI** (installed globally: `npm install -g eas-cli`)
- **Expo Account**: Create a free account at [expo.dev](https://expo.dev)

---

## 2. Setting Up EAS (Expo Application Services)

EAS is the official toolchain for building, submitting, and updating Expo apps.

1. **Log in to EAS CLI**:
   ```bash
   eas login
   ```
2. **Initialize EAS Project**:
   Run the following command in the `veterinary_mobile` root folder to link the codebase with your Expo account:
   ```bash
   eas project:init
   ```
3. **Configure Build Settings**:
   Generate an `eas.json` configuration file:
   ```bash
   eas build:configure
   ```

---

## 3. Configuring build profiles (`eas.json`)

Ensure your `eas.json` file in the root directory contains the correct profiles. The following configurations are recommended to compile a downloadable **Android APK** and **iOS Ad-Hoc / Simulator** builds:

```json
{
  "cli": {
    "version": ">= 10.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": true
      }
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

- **development**: Compiles custom native code matching your packages. Run with `npx expo start --dev-client` for hot-reloads.
- **preview**:
  * Android: Produces a `.apk` file that can be side-loaded directly onto any Android device.
  * iOS: Configures build for simulator testing (`.tar.gz`).
- **production**:
  * Android: Produces an `.aab` file for Google Play Console submission.
  * iOS: Produces an `.ipa` file for App Store / TestFlight upload.

---

## 4. Android Build Guide (APK)

### Cloud Build (Recommended)
This uses Expo's cloud servers to compile the app, which saves you from installing large Android SDKs and toolchains on your machine.

1. Trigger the Android Preview build:
   ```bash
   eas build --platform android --profile preview
   ```
2. Follow the command-line prompts (accept Android Keystore generation).
3. Once completed, EAS will print a direct download link for the `.apk` file and a QR Code. Scan it with an Android device to install.

### Local Build (No Cloud)
If you prefer to compile locally on your machine (requires Java Development Kit (JDK) and Android SDK configured):
```bash
eas build --platform android --profile preview --local
```

---

## 5. iOS Build Guide

### Simulator Build (Local Test)
To build an app package that runs in the macOS Xcode Simulator:
```bash
eas build --platform ios --profile preview
```
Download the resulting `.tar.gz` archive, extract it, and drag-and-drop the app file into the active Simulator window.

### Ad-Hoc Build (Physical Device Test)
To build a binary that runs on registered testing iPhones (requires a paid Apple Developer Account):
1. Register devices to your provisioning profile:
   ```bash
   eas device:create
   ```
2. Trigger the Ad-Hoc build:
   ```bash
   eas build --platform ios --profile preview
   ```
3. Expo will prompt you to log into your Apple Developer Portal, compile the App, and output a link to download the `.ipa`.

---

## 6. Development Workflow (Expo Go vs Dev Clients)

### Option A: Expo Go (Quick Prototypes)
- Works immediately out-of-the-box for Javascript edits.
- Command: `npx expo start --tunnel`
- *Note*: Biometrics (`expo-local-authentication`) and custom document picks may require compiling a Development Client on physical emulators.

### Option B: Development Client (Native Features Testing)
- Compiles the custom native modules (Biometrics, NetInfo, secure storage) directly into a local testing wrapper.
- Command to build: `eas build --platform android --profile development`
- Command to run: `npx expo start --dev-client`
