var fs = require('fs');
var shell = require('shelljs');

exports.specVersion = '1.1.0';

exports.updateFiles = function (params, cb) {
  // If there is a setup.py, read it in
  if (shell.test('-f', 'setup.py')) {
    fs.readFile('setup.py', 'utf8', function handleFile (err, pythonSetup) {
      // If there is an error, callback with it
      if (err) {
        return cb(err);
      }

      // Otherwise, replace the semver and update the file
      var output = pythonSetup.replace(/version='\d+\.\d+\.\d+'/, 'version=\'' + params.version + '\'');
      fs.writeFile('setup.py', output, 'utf8', cb);
    });
  // Otherwise, continue
  } else {
    process.nextTick(cb);
  }
};

exports.register = function (params, cb) {
  if (shell.test('-f', 'setup.py') && !shell.test('-f', '.pypi-private')) {
    shell.exec('python setup.py register');
  }

  // Callback
  process.nextTick(cb);
};

exports.publish = function (params, cb) {
  if (shell.test('-f', 'setup.py') && !shell.test('-f', '.pypi-private')) {
    // Build and upload the package
    shell.exec('python setup.py sdist --formats=gztar,zip upload');
  }

  // Callback
  process.nextTick(cb);
};
