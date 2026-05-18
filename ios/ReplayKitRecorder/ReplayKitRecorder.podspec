Pod::Spec.new do |s|
  s.name         = "ReplayKitRecorder"
  s.version      = "1.0.0"
  s.summary      = "Native ReplayKit screen recording module for VolleyballTrainerPro"
  s.description  = "Provides start/stop recording using ReplayKit with Swift bridging."
  s.homepage     = "https://example.com/replaykitrecorder"
  s.license      = { :type => "MIT", :file => "LICENSE" }
  s.author       = { "Jason" => "you@example.com" }

  s.platform     = :ios, "14.0"
  s.swift_version = "5.0"

  # Local pod — CocoaPods uses the folder as the source
  s.source       = { :path => "." }

  # Include all Swift/ObjC files
  s.source_files = "**/*.{swift,h,m,mm}"

  # React Native dependency
  s.dependency "React-Core"
end
