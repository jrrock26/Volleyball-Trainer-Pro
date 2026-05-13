Pod::Spec.new do |s|
  s.name         = "ReplayKitRecorder"
  s.version      = "1.0.0"
  s.summary      = "ReplayKit screen recorder for React Native"
  s.homepage     = "https://yourdomain.com"
  s.license      = "MIT"
  s.author       = "Jason"
  s.platform     = :ios, "14.0"
  s.source       = { :path => "." }

  s.source_files = "**/*.{swift,m}"
  s.requires_arc = true

  s.dependency "React-Core"
end
