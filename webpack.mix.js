let mix = require('laravel-mix');

mix
.setResourceRoot('../')
.setPublicPath('dist')
.sourceMaps()

if(mix.inProduction()) {
  mix
  .js(
    'src/cdn.js',
    'dist/js/s-forms.min.js'
  )
} else {
  mix
  .js(
    'src/cdn.js',
    'dist/js/s-forms.js'
  )
}
