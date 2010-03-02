#!/usr/bin/ruby

require "yaml"
require "open-uri"
require "net/http"
require "CGI"


def get_schemas(schemas, baseurl, basefolder)
  generator_url = "http://www.xmlforasp.net/CodeBank/System_Xml_Schema/BuildSchema/BuildXMLSchema.aspx"
  schemas.each do |name, info |
    xurl = "#{baseurl}#{info['url']}"
    puts "  #{name}\n"
    result = post_schema(generator_url, xurl)
    if result
      writeOut = open("#{basefolder}#{info['filename']}", "wb")
      writeOut.write(CGI.unescapeHTML(result))
      writeOut.close
    else
      puts "!! ERROR - #{name} !!\n"
    end
  end
end

def post_schema(form_url, xml_url)
  #the __VIEWSTATE & __EVENTVALIDATION might change, not sure
  params = {'txtXML' => xml_url, 
            'rdoList'=>0,
            'btnGenerateSchema' => 'Generate Schema',
            '__VIEWSTATE' => '/wEPDwULLTE0NDc4ODY1NjZkZD8xIV1mw4aDZAU2p55EgLM0Vbe0',
            '__EVENTVALIDATION' => '/wEWBgKyvaD5BQKj+/r1AwKM1c/8AwKkyPGDAQK7yPGDAQK0p9vtDZZo8t55cXeilmxwatAyFeQD0njY'
            
            }
  uri = URI.parse(form_url)
  req = Net::HTTP::Post.new(form_url)
  req.set_form_data(params)
  res = Net::HTTP.new(uri.host, uri.port).start { |http| http.request(req) }
  raw = res.body
  if res.body =~ /<textarea name="txtSchema"[^>]*>(.*?)<\/textarea>/im
  	return $1
  else
  	return false;
  end
end

#MAIN
config = YAML::load_file("./example_config.yml");
schemas = config['schema_pages'].sort
puts "-- generating schema\n"
get_schemas(schemas, config['base_url'],"./schema/")
puts "-- done\n"
