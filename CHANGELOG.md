# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased][unreleased]

## [1.0.0-1][2016-01-05]
- Passing a value to `next` will cause `.dispatch` to reject the promise.

## [1.0.0-0][2015-12-12]
- Port to TypeScript.

## [0.2.0][2015-07-30]
### Added
- Added `emit` method that more or less behaves like the native Node event emitter.

## [0.1.1][2015-07-13]
## Added
- Added test to confirm `EventDispatcher` is exported by the package main.
- Added test to confirm that `Event` is attached to `EventDispatcher`.
- Added `priority` property to `EventDispatcher` with seven presets.

## [0.1.1][2015-07-09]
### Fixed
- Bug in priorities.
