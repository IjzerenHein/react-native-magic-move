# react-native-magic-move

Create magical move transitions between scenes in react-native

## [Unreleased]

### Removed

- Removed the deprecated `scale` transition

## [0.5.0] - 2019-02-04

### Added

- Added new _smart_ `move` transition, for seamless transitions when source and target are the same, but are sized differently or use different border radii
- Added ability to render multiple clones efficiently and clip and transform their contents
- Added native optimisations for iOS and Android to address flickering issues when animating (to install use `react-native link react-native-magic-move`)
- Added `debug` prop for `Provider` and `Scene`, which also propagates into the rendering hierarchy.
- Upgraded to a new `clone` based architecture to enable native optimisations
- Upgraded the `morph` transition to always use the native driver

### Fixed

- Fixed layout position when view was inside scrollview; and the scrollview offset wasn't zero
- Fixed animations overlapping the scene bounds
- Fixed image flickering through new native optimisations
- Fixed `backfaceVisibility` prop warnings in the `flip` transition

### Changes

- The `move` transition is now the default transition. Use `morph` if the content is distinctly different.
- **[BREAKING CHANGE]** Custom transition functions are now required to return an array, and can no longer return a single clone or `React.Fragment`.
- Removed behaviour that selected the transition of the source when no transition was defined on the target (this proved to be counter productive)

### Deprecated

- The `scale` transition has been deprecated and will be removed in the near future. Use the default `move` transition instead.

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
