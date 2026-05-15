Pod::Spec.new do |s|
  s.name         = "MLModels"
  s.version      = "1.0.0"
  s.summary      = "Bundled CoreML and MediaPipe model assets for VolleyballTrainerPro."
  s.description  = "This pod contains the YOLOv8n.mlpackage and pose_landmarker.task model files."
  s.homepage     = "https://github.com/jrrock26/VolleyballTrainerPro"
  s.license      = { :type => "MIT", :file => "LICENSE" }
  s.authors      = { "Jason" => "youremail@example.com" }

  s.source       = { :path => "." }

  s.platform     = :ios, "14.0"

  # Include all model files inside MLModels/
  s.resources    = "MLModels/**/*"
end
