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

  # Local pod
  s.source       = { :path => "." }

  # Only include files inside this folder
  s.source_files = "ReplayKitRecorder/**/*.{swift,h,m}"

  # Public headers (required for Swift bridging)
  s.public_header_files = "ReplayKitRecorder/**/*.h"

  # Ensure module name is stable
  s.module_name = "ReplayKitRecorder"

  # React Native dependency
  s.dependency "React-Core"
end

