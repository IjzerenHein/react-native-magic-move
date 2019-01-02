# react-native-magic-move

Create magical move transitions between scenes in react-native

## [Unreleased]

## [0.3.0] - 2019-01-02

### Added

- Added official transition API
- Added transitions: `morph, scale, flip, flip.x, flip.y, flip.xy, dissolve, shrinkAndGrow, squashAndStretch`
- Added 'debug' option to demo to show the animations slowed down and with debug-view information

### Fixed

- Fixed the opacity when set to any other value than 1
- Fixed layout issue when rendering nested MagicMove views

### Changed

- `useNativeDriver` is now automatically enabled so you don't need to specify it explicitely. A warning is shown when animating props that cannot be handled my the native driver.
- Improved appearence when using the `debug` option

### Removed

- The experimental flip transition API has been removed in favour of the new official API.

## [0.2.3] - 2018-12-31

### Added

- Initial release
