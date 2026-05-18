Pod::Spec.new do |s|
  s.name         = "ReplayKitRecorder"
  s.version      = "1.0.0"
  s.summary      = "ReplayKit screen recorder for VolleyballTrainerPro"
  s.source       = { :path => "." }
  s.platform     = :ios, "14.0"

  s.source_files = "**/*.{swift,m,h}"
  s.swift_version = "5.0"

  s.dependency "React-Core"
end
