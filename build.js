const fs = require('fs');
const browserify = require('browserify');

browserify('./src/app.js')
  .transform('babelify', { presets: [ 'es2015' ]})
  .bundle()
  .pipe(fs.createWriteStream('./dist/bundle.js'));
