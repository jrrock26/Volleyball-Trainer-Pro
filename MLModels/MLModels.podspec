Pod::Spec.new do |s|
  s.name         = "MLModels"
  s.version      = "1.0.0"
  s.summary      = "Machine learning models for VolleyballTrainerPro"
  s.source       = { :path => "." }
  s.platform     = :ios, "13.0"

  # Include the model files
  s.resources = [
    "MLModels/pose_landmarker.task",
    "MLModels/yolov8n.mlpackage"
  ]
end
