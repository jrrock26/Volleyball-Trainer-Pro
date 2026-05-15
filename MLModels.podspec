Pod::Spec.new do |s|
  s.name         = "MLModels"
  s.version      = "1.0.0"
  s.summary      = "ML model assets"
  s.source       = { :path => "." }
  s.resources    = "MLModels/*"
end
