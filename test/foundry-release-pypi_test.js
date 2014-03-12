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
var initialParams = {
  version: '0.1.0',
  message: 'Release 0.1.0',
  description: null
};
describe.skip('Setting the version', function () {
  describe('in a PyPI package', function () {
    var fixtureDir = fixtureUtils.fixtureDir('pypi');
    before(function setVersion (done) {
      this.execStub = sinon.stub(shell, 'exec');
      pypiRelease.setVersion(initialParams, done);
    });
    after(function unstub () {
      this.execStub.restore();
      delete this.execStub;
    });

    it('updates the `setup.py` version', function () {
      var pkgPython = fs.readFileSync(fixtureDir + '/setup.py', 'utf8');
      expect(pkgPython).to.contain('version=\'0.1.0\'');
    });
  });
});

describe('Registering', function () {
  function register(params) {
    before(function regsiterFn (done) {
      this.execStub = sinon.stub(shell, 'exec');
      pypiRelease.register(params, done);
    });
    after(function unstub () {
      this.execStub.restore();
      delete this.execStub;
    });
  }

  describe('a new PyPI package', function () {
    var fixtureDir = fixtureUtils.fixtureDir('pypi');
    register(initialParams);

    it('registers the package', function () {
      expect(this.execStub.args[0]).to.deep.equal(['python setup.py register']);
    });
  });

  describe('in a private PyPI package', function () {
    var fixtureDir = fixtureUtils.fixtureDir('pypi-private');
    register(initialParams);

    it('does not register the package', function () {
      expect(this.execStub.args).to.have.property('length', 0);
    });
  });
});

describe('Publishing', function () {
  function publish(params) {
    before(function publishFn (done) {
      this.execStub = sinon.stub(shell, 'exec');
      pypiRelease.publish(params, done);
    });
    after(function unstub () {
      this.execStub.restore();
      delete this.execStub;
    });
  }

  describe('a new PyPI package', function () {
    var fixtureDir = fixtureUtils.fixtureDir('pypi');
    publish(initialParams);

    it('publishes the package', function () {
      expect(this.execStubPublish.args[0][0]).to.contain(['python setup.py sdist']);
    });
  });

  describe('in a private PyPI package', function () {
    var fixtureDir = fixtureUtils.fixtureDir('pypi-private');
    publish(initialParams);

    it('does not publish the package', function () {
      expect(this.execStub.args).to.have.property('length', 0);
    });
  });
});
