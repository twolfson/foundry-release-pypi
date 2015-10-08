# foundry-release-pypi [![Build status](https://travis-ci.org/twolfson/foundry-release-pypi.png?branch=master)](https://travis-ci.org/twolfson/foundry-release-pypi)

[PyPI][] release library for [foundry][].

This command updates version in a `setup.py` and releases it to [PyPI][] via [foundry][], a modular release management library.

[PyPI]: https://pypi.python.org/pypi
[foundry]: https://github.com/twolfson/foundry

## Documentation
This library was build to match the [foundry release specification][spec] and is written on top of [foundry-release-base][]. Documentation can be found at:

https://github.com/twolfson/foundry-release-spec

https://github.com/twolfson/foundry-release-base

[spec]: https://github.com/twolfson/foundry-release-spec
[foundry-release-base]: https://github.com/twolfson/foundry-release-base

### Actions
- On `update-files`, we update a hardcoded `version` field in `setup.py` (e.g. `version='1.0.0'` -> `version='1.1.0'`)
- On `register`, we run `python setup.py register`
    - If there is a `.pypi-private` file, then we will not run this step
- On `publish`, we run `python setup.py sdist --formats=gztar,zip upload`
    - This will upload a `.zip` and a `.tar.gz` for Windows, GNU/Linux, and OS X compatibility
    - If there is a `.pypi-private` file, then we will not run this step

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint via [grunt](https://github.com/gruntjs/grunt) and test via `npm test`.

## Donating
Support this project and [others by twolfson][gittip] via [gittip][].

[![Support via Gittip][gittip-badge]][gittip]

[gittip-badge]: https://rawgithub.com/twolfson/gittip-badge/master/dist/gittip.png
[gittip]: https://www.gittip.com/twolfson/

## Unlicense
As of Feb 04 2014, Todd Wolfson has released this repository and its contents to the public domain.

It has been released under the [UNLICENSE][].

[UNLICENSE]: UNLICENSE
