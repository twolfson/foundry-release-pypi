var fs = require('fs');
var shell = require('shelljs');

exports.updateFiles = function (params, cb) {
  // Read in our `setup.py`
  fs.readFile('setup.py', 'utf8', function handleFile (err, pythonSetup) {
    // If there is an error, callback with it
    if (err) {
      return cb(err);
    }

    // Otherwise, replace the semver and update the file
    var output = pythonSetup.replace(/version='\d+\.\d+\.\d+'/, 'version=\'' + params.version + '\'');
    fs.writeFile('setup.py', output, 'utf8', cb);
  });
};

exports.register = function (params, cb) {
  if (!shell.test('-f', '.pypi-private')) {
    shell.exec('python setup.py register');
  }

  // Callback
  process.nextTick(cb);
};

exports.publish = function (params, cb) {
  if (!shell.test('-f', '.pypi-private')) {
    // Build and upload the package
    shell.exec('python setup.py sdist --formats=gztar,zip upload');
  }

  // Callback
  process.nextTick(cb);
};
