let mix = require('laravel-mix');

mix
.setResourceRoot('../')
.setPublicPath('dist')
.sourceMaps()

if(mix.inProduction()) {
  mix.js(
    'src/forms.js',
    'js/forms.min.js'
  )
} else {
  mix.js(
    'src/forms.js',
    'js/forms.js'
  )
}
