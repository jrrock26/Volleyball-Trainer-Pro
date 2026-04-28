Pod::Spec.new do |s|
  s.name     = "boost"
  s.version  = "1.83.0"
  s.summary  = "Boost C++ Libraries"
  s.homepage = "https://www.boost.org"
  s.license  = { :type => "Boost Software License", :file => "LICENSE" }
  s.source   = { :http => "https://github.com/react-native-community/boost-for-react-native/releases/download/v1.83.0/boost-1.83.0.tar.gz" }
  s.requires_arc = false
  s.header_mappings_dir = "boost"
  s.source_files = "boost/**/*.{h,hpp}"
end
