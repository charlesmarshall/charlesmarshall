#!/usr/bin/ruby

require "yaml"
require "open-uri"

def fetch(xmlfile, localname, replace)
  writeOut = open(localname, "wb")
  writeOut.write(open(xmlfile).read)
  writeOut.close
end

def download(examples, base_url, replace)
  examples.each do |name, info|
    puts "  #{name} \n"
    fetch("#{base_url}#{info['url']}", "./results/#{info['filename']}", replace)
  end
end


config = YAML::load_file("./_config.yml");
examples = config['pages'].sort

puts "-- fetching examples\n"
download(examples, config['base_url'], config['key'])
puts "-- done\n"