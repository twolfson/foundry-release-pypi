// Load in dependencies
var fs = require('fs');
var childProcess = require('child_process');
var expect = require('chai').expect;
var sinon = require('sinon');
var shell = require('shelljs');
var pypiRelease = require('../');
var fixtureUtils = require('./utils/fixtures');

// Stop childProcess exec and spawn calls too unless people opt in to our methods
// DEV: This is borrowed from https://github.com/twolfson/foundry/blob/0.15.0/test/utils/child-process.js
shell.exec = function () {
  throw new Error('`shell.exec` was being called with ' + JSON.stringify(arguments));
};
childProcess.spawn = function () {
  throw new Error('`childProcess.spawn` was being called with ' + JSON.stringify(arguments));
};
childProcess.exec = function () {
  throw new Error('`childProcess.exec` was being called with ' + JSON.stringify(arguments));
};

// Define our test
var newParams = {
  version: '0.1.0',
  message: 'Release 0.1.0',
  description: null
};
var oldParams = {
  version: '0.3.0',
  message: 'Release 0.3.0',
  description: null
};
describe.only('Setting the version', function () {
  describe('in a new PyPI package', function () {
    var fixtureDir = fixtureUtils.fixtureDir('pypi');

    before(function setVersion (done) {
      // Introduce custom stubbing
      this.execStubRegister = sinon.stub(shell, 'exec');
      pypiRelease.setVersion(initialParams, done);
    });
    after(function unstub () {
      this.execStubPublish.restore();
    });

    it('updates the `setup.py` version', function () {
      var pkgPython = fs.readFileSync(fixtureDir + '/setup.py', 'utf8');
      expect(pkgPython).to.contain('version=\'0.1.0\'');
    });
});


    // it('registers the package', function () {
    //   expect(this.execStubRegister.args[0]).to.deep.equal(['python setup.py register']);
    // });

    // it('publishes the package', function () {
    //   expect(this.execStubPublish.args[0][0]).to.contain(['python setup.py sdist']);
    // });

  describe('in a registered PyPI package', function () {
    var fixtureDir = fixtureUtils.fixtureDir('pypi-registered');
    before(function release (done) {
      // Introduce custom stubbing
      var program = foundryUtils.create({
        allowSetVersion: true
      });

      // Monitor shell.exec calls
      var that = this;
      program.once('publish#before', function () {
        that.execStub = sinon.stub(shell, 'exec');
      });

      // Run through the release
      program.once('publish#after', done);
      program.parse(['node', '/usr/bin/foundry', 'release', '0.3.0']);
    });
    after(function unstub () {
      this.execStub.restore();
    });

    it('updates the setup.py', function () {
      var pkgPython = fs.readFileSync(fixtureDir + '/setup.py', 'utf8');
      expect(pkgPython).to.contain('version=\'0.3.0\'');
    });

    it('does not register the package', function () {
      expect(this.execStub.args[0][0]).to.not.contain('register');
    });
  });

  describe('in a private PyPI package', function () {
    var fixtureDir = fixtureUtils.fixtureDir('pypi-private');
    before(function release (done) {
      // Introduce custom stubbing
      var program = foundryUtils.create({
        allowSetVersion: true
      });

      // Monitor shell.exec calls
      var that = this;
      program.once('publish#before', function () {
        that.execStub = sinon.stub(shell, 'exec');
      });

      // Run through the release
      program.once('publish#after', done);
      program.parse(['node', '/usr/bin/foundry', 'release', '0.3.0']);
    });
    after(function unstub () {
      this.execStub.restore();
    });

    it('updates the setup.py', function () {
      var pkgPython = fs.readFileSync(fixtureDir + '/setup.py', 'utf8');
      expect(pkgPython).to.contain('version=\'0.3.0\'');
    });

    it('does not register or publish the package', function () {
      expect(this.execStub.args).to.have.property('length', 0);
    });
  });
});
