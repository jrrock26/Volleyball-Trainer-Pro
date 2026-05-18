Pod::Spec.new do |s|
  s.name         = "MLModels"
  s.version      = "1.0.0"
  s.summary      = "Local ML model resources for VolleyballTrainerPro"
  s.description  = "Contains CoreML and MediaPipe model files used by MLBridge."
  s.homepage     = "https://example.com/mlmodels"
  s.license      = { :type => "MIT", :file => "LICENSE" }
  s.author       = { "Jason" => "you@example.com" }

  s.platform     = :ios, "14.0"

  # Local pod — CocoaPods will use the folder itself as the source
  s.source       = { :path => "." }

  # Include all model files
  s.resources = [
    "pose_landmarker_full.task",
    "yolov8n.mlpackage"
  ]

  # No Swift/ObjC source files — this pod only contains resources
end
