# react-native-magic-move

Create magical move transitions between scenes in react-native

## [Unreleased]

## [0.4.0] - 2019-01-09

### Added

- Added support for integration with 3rd party navigation libraries such as `react-navigation` (see `react-navigation-magic-move` on how to enable it)
- Added `disabled` prop for disabling transitions on scenes and components
- Added Context API for checking whether content is rendered inside a cloned component
- Added compatibility with `react-native-web`

### Fixed

- Reduced transition glitches when animating a component that is on a scene that slides away
- Fixed older animation re-shown when starting an animation while the previous hadn't finished
- Fixed `shrinkAndGrow` transition not disappearing entirely
- Fixed `squashAndStretch` transition when animating from top-left to right-bottom
- Fixed end opacity not always correct on `dissolve` transition
- Fixed border-radius on `morph` transition to better look like the source shape

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
