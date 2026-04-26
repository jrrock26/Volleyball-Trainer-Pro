export default ({ config }) => ({
  ...config,

  name: "Volleyball Trainer Pro",
  slug: "volleyballtrainerpro",

  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  userInterfaceStyle: "light",

  ios: {
    bundleIdentifier: "com.yourteam.volleyballtrainerpro",
    buildNumber: "1",
    supportsTablet: false,
    infoPlist: {
      NSCameraUsageDescription: "This app uses the camera for recording drills.",
      NSMicrophoneUsageDescription: "This app uses the microphone for recording audio.",
      NSPhotoLibraryAddUsageDescription: "This app saves exported videos to your library.",
      NSPhotoLibraryUsageDescription: "This app accesses your library to save videos."
    }
  },

  android: {
    package: "com.yourteam.volleyballtrainerpro",
    versionCode: 1,
    permissions: [
      "CAMERA",
      "RECORD_AUDIO",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE"
    ]
  },

  experiments: {
    reactCompiler: true
  },

  extra: {
    APP_VARIANT: process.env.APP_VARIANT ?? "development",
    eas: {
      projectId: "52419e0b-33fe-413c-90ca-6e800a4872c1"
    }
  }
});






