const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

module.exports = function withYOLOML(config) {
  // Copy YOLO model into iOS + Android
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
          if (file.includes("yolo")) {
            fs.copyFileSync(path.join(src, file), path.join(dest, file));
          }
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
          if (file.includes("yolo")) {
            fs.copyFileSync(path.join(src, file), path.join(dest, file));
          }
        });
      }

      return config;
    },
  ]);

  return config;
};
