# Activate and configure extensions
# https://middlemanapp.com/advanced/configuration/#configuring-extensions

# Configure where assets are stored
config[:css_dir] = 'assets/stylesheets'
config[:js_dir] = 'assets/javascripts'
config[:images_dir] = 'assets/images'
config[:images_extensions] = %w( svg jpg jpeg gif png webp )

activate :autoprefixer do |prefix|
  prefix.browsers = "last 2 versions"
end

# Layouts
# https://middlemanapp.com/basics/layouts/

# Per-page layout changes
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

# With alternative layout
# page '/path/to/file.html', layout: 'other_layout'

# Pull in assets installed from Yarn
activate :sprockets
sprockets.append_path File.join app.root, "node_modules"

# Use pretty urls `www.example.com/blog`
activate :directory_indexes

# Use middleman-livereload
activate :livereload

# Minimize css/js and fix assets for Build
configure :build do
  activate :autoprefixer
  activate :minify_css
  activate :minify_javascript
  activate :relative_assets
  activate :asset_hash
end
