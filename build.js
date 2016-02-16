const fs = require('fs');
const mkdir = require('mkdirp');
const browserify = require('browserify');


mkdir('./dist');

browserify('./src/app.js')
  .transform('babelify', { presets: [ 'es2015' ]})
  .bundle()
  .pipe(fs.createWriteStream('./dist/bundle.js'));
