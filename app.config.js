const IS_DEV = process.env.APP_VARIANT === "development";

module.exports = {
  name: IS_DEV ? "VTP (Dev)" : "Volleyball Trainer Pro",
  slug: "volleyball-trainer-pro",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  userInterfaceStyle: "dark",

  splash: {
    image: "./assets/images/background.png",
    resizeMode: "contain",
    backgroundColor: "#0a0a1a",
  },

  ios: {
    supportsTablet: true,
    bundleIdentifier: IS_DEV
      ? "com.yourteam.volleyballtrainerpro.dev"
      : "com.yourteam.volleyballtrainerpro",
    buildNumber: "2",
    deploymentTarget: "14.0",

    infoPlist: {
      NSCameraUsageDescription:
        "Volleyball Trainer Pro uses your camera for real-time AI form analysis, serve tracking, and drill recording.",
      NSMicrophoneUsageDescription:
        "Volleyball Trainer Pro uses your microphone to capture coaching audio during drills.",
      NSPhotoLibraryUsageDescription:
        "Volleyball Trainer Pro saves drill recordings and AI analysis snapshots to your photo library.",
      NSPhotoLibraryAddUsageDescription:
        "Volleyball Trainer Pro saves drill recordings and AI analysis snapshots to your photo library.",
      UIBackgroundModes: [],
      ITSAppUsesNonExemptEncryption: false
    }
  },

  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/icon.png",
      backgroundColor: "#0a0a1a",
    },
    package: IS_DEV
      ? "com.yourteam.volleyballtrainerpro.dev"
      : "com.yourteam.volleyballtrainerpro",
    permissions: [
      "android.permission.CAMERA",
      "android.permission.RECORD_AUDIO",
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.WRITE_EXTERNAL_STORAGE"
    ]
  },

  plugins: [
    "expo-asset",

    // ⭐ NEW: ML plugins (you will create these next)
    "./plugins/with-tflite-ml",
    "./plugins/with-yolo-ml",
    

  ],

  extra: {
    eas: {
      projectId: "ec1b4630-26b6-4051-b45c-2008426804a0"
    }
  },

  updates: {
    fallbackToCacheTimeout: 0,
    url: "https://u.expo.dev/ec1b4630-26b6-4051-b45c-2008426804a0"
  },

  runtimeVersion: { policy: "appVersion" },

  assetBundlePatterns: ["**/*"]
};


