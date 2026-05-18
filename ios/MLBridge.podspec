Pod::Spec.new do |s|
  s.name         = "MLBridge"
  s.version      = "1.0.0"
  s.summary      = "Native ML processing bridge for VolleyballTrainerPro"
  s.description  = "Swift bridge for MediaPipe, CoreML, and custom pose/trajectory logic."
  s.homepage     = "https://example.com/mlbridge"
  s.license      = { :type => "MIT", :file => "LICENSE" }
  s.author       = { "Jason" => "you@example.com" }

  s.platform     = :ios, "14.0"
  s.source       = { :path => "." }

  s.source_files = "MLBridge/**/*.{swift,h,m,mm}"
  s.swift_version = "5.0"

  s.dependency "React-Core"
end
