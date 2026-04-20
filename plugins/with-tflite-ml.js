const {
  withDangerousMod,
  withAppBuildGradle,
  withPodfile,
} = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

module.exports = function withTFLiteML(config) {
  // iOS: Add TensorFlowLiteSwift pod
  config = withPodfile(config, (config) => {
    const podfile = config.modResults.contents;

    if (!podfile.includes("pod 'TensorFlowLiteSwift'")) {
      config.modResults.contents = podfile.replace(
        "use_expo_modules!",
        `use_expo_modules!
  pod 'TensorFlowLiteSwift'`
      );
    }

    return config;
  });

  // Android: Add TensorFlow Lite AAR dependency
  config = withAppBuildGradle(config, (config) => {
    const gradle = config.modResults.contents;

    if (!gradle.includes("org.tensorflow:tensorflow-lite")) {
      config.modResults.contents = gradle.replace(
        "dependencies {",
        `dependencies {
    implementation 'org.tensorflow:tensorflow-lite:2.12.0'`
      );
    }

    return config;
  });

  // Copy /models into native project
  config = withDangerousMod(config, [
    "ios",
    (config) => {
      const projectRoot = config._internal.projectRoot;
      const src = path.join(projectRoot, "models");
      const dest = path.join(projectRoot, "ios", "models");

      if (fs.existsSync(src)) {
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest, { recursive: true });
        }

        fs.readdirSync(src).forEach((file) => {
          fs.copyFileSync(path.join(src, file), path.join(dest, file));
        });
      }

      return config;
    },
  ]);

  config = withDangerousMod(config, [
    "android",
    (config) => {
      const projectRoot = config._internal.projectRoot;
      const src = path.join(projectRoot, "models");
      const dest = path.join(
        projectRoot,
        "android",
        "app",
        "src",
        "main",
        "assets",
        "models"
      );

      if (fs.existsSync(src)) {
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest, { recursive: true });
        }

        fs.readdirSync(src).forEach((file) => {
          fs.copyFileSync(path.join(src, file), path.join(dest, file));
        });
      }

      return config;
    },
  ]);

  return config;
};
