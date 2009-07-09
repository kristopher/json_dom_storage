require 'fileutils'

def root_path
  File.dirname(__FILE__)
end

def version
  File.read(File.join(root_path, 'VERSION'))
end

desc "Build autocompleter_jsonsearch" 
task :dist do
  file = File.new(File.join(root_path, 'dist', "json_dom_storage.#{version}.js"), 'w')
  file.write(File.read(File.join(root_path, 'lib', 'json2.min.js')))
  file.write(File.read(File.join(root_path, 'src', "json_dom_storage.js")))
  file.close
  puts "\nGenerated distribution: dist/json_dom_storage.#{version}.js\n\n"
end

desc "Run the specs"
task :spec do
  system "open #{File.join(File.dirname(__FILE__), 'spec', 'suite.html')}"
end
