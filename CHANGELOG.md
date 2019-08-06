# react-native-magic-move

Create magical move transitions between scenes in react-native

## [Unreleased]

## [0.6.5] - 2019-08-06

### Fixed

- Fixed exception on Android "parameter must be a descentdant of this view"

## Update

- Update "Native" example app to use the `react-navigation` API

## [0.6.3] - 2019-06-17

### Added

- Added `podspec` file for when using the new Cocoapods package system
- Added link to ReactEurope talk

## [0.6.2] - 2019-05-21

### Added

- Added `onWillAppear` and `onWillDisappear` Scene life-cycle events
- Added missing docs for `imageSizeHint` and `useNativeClone` props

### Fixed

- Fixed clone snapshot not always correctly visible on iOS, using the native extensions
- Fixed scene not visible when no explicit style was provided to the Scene component
- Reduced glitch where target image is briefly visible on iOS (when using native extensions and ‘move’ transition)
- Improved debug-logging for the target component and native clones

## [0.6.1] - 2019-03-15

### Fixed

- Fixed build warning on Android "Configuration 'compile' is obsolete"

## [0.6.0] - 2019-02-28

### Added

- Added `zIndex` prop for setting the render-order when multiple animations are executed
- Added `useNativeClone` prop for explicitly disabling/enabling the use of native-clones

### Fixed

- Fixed Android build on certain RN/SDK combinations due to hardcoded Android version numbers (thanks @stpch)
- Fixed `duration`, `delay` and `easing` props, which were used from the source component, but they should have been used from the target component
- Fixed animations wrongly coming from the bottom when using the react-navigation Tabs

### Changes

- **[BREAKING CHANGE]** Changed `createMagicMoveComponent` signature to allow pass-through of props (NOW: `createMagicMoveComponent(Component, props)`, see README)

## [0.5.1] - 2019-02-08

### Fixed

- Fixed `BlurEffectWithAmount` linker collision on iOS/Xcode when `react-native-blur` is also installed

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
