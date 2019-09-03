# Important `react-native-shared-element` update! <!-- omit in toc -->

A follow up project called [react-native-shared-element](https://github.com/IjzerenHein/react-native-shared-element) has been created which can be considered
the successor to `react-native-magic-move`. It it an all native solution that provides superior
performance (no more passes over the react-native bridge) and transitions.
It however does not support some of the more exotic transition types (flip, shrinkAndGrow) that
Magic Move does. It also doesn't support the web-platform **yet** and requires **native** extensions to run.
New users are advised to use `react-native-shared-element` when possible.
As for Magic Move, no more new developments will be started for Magic Move, merely critical bug-fixes.
This notification will be updated as development on `react-native-shared-element` progresses.

# react-native-magic-move <!-- omit in toc -->

Create magical move transitions between scenes in react-native 🐰🎩✨

### [Try it with Expo](https://expo.io/@ijzerenhein/react-native-magic-move-demo) <!-- omit in toc -->

![MagicMoveGif](magicmove5.gif)

- [Usage](#usage)
- [react-navigation](#react-navigation)
- [Documentation](#documentation)
  - [Components](#components)
  - [Props](#props)
  - [Transitions](#transitions)
  - [Scenes](#scenes)
  - [Context](#context)
- [Resources](#resources)
  - [React Europe Talk](#react-europe-talk)
  - [react-native-magic-move-presentation](#react-native-magic-move-presentation)
  - [react-navigation-magic-move](#react-navigation-magic-move)
  - [examples/expo/src](#examplesexposrc)
- [Disclaimer 🐰🎩](#disclaimer-%F0%9F%90%B0%F0%9F%8E%A9)

## Usage

Installation

```
$ yarn add react-native-magic-move
```

Link the native extensions *(\* recommended but not required)*

```
$ react-native link react-native-magic-move 
```

\* *The native extensions are recommended to get the best performance, but they are not required.
This makes it possible to use `react-native-magic-move` with [expo](expo.io) or [react-native-web](https://github.com/necolas/react-native-web). If you're having trouble installing the native extensions, please see [this guide](./docs/NativeInstallation.md) on how to install them manually.*

Wrap your app with the `<MagicMove.Provider>` context.

```jsx
import * as MagicMove from 'react-native-magic-move';

const App = () => (
  <MagicMove.Provider>
    {...}
  </MagicMove.Provider>
);
```

Add the `<MagicMove.{View|Image|Text}>` component to your views. Whenever the Magic Move component
is mounted while another Magic Move component with the same `id` is already mounted, then a magic transition between the components is performed.

```jsx
import * as MagicMove from 'react-native-magic-move';

const Scene1 = () => (
  <MagicMove.Scene>
    <MagicMove.View id="logo" style={{
        width: 100,
        height: 100,
        backgroundColor: "green",
        borderRadius: 50
      }} />
  </MagicMove.Scene>
);

const Scene2 = () => (
  <MagicMove.Scene>
    <MagicMove.View id="logo" style={{
        width: 200,
        height: 200,
        backgroundColor: "purple",
        borderRadius: 0
      }} />
  </MagicMove.Scene>
);
```

## react-navigation

When you are using [react-navigation](https://reactnavigation.org/) (or [react-native-router-flux](https://github.com/aksonov/react-native-router-flux)), then also install the following binding:

- [react-navigation-magic-move](https://github.com/IjzerenHein/react-navigation-magic-move)


## Documentation

### Components

The following magic-move components are supported out of the box.

- `MagicMove.View`
- `MagicMove.Text`
- `MagicMove.Image`

You can also create your own custom MagicMove components.

```js
const MyMagicMoveComponent = MagicMove.createMagicMoveComponent(MyComponent);

// When creating a custom image component (e.g. FastImage) also specify the `image` attribute
// so that the `move` transition treats this as an image.
const MagicMoveFastImage = MagicMove.createMagicMoveComponent(FastImage, {ComponentType: 'image'});

// Full signature
/* MagicMove.createMagicMoveComponent(Component, {
  AnimatedComponent,
  ComponentType,
  ...props
});*/
```

### Props

| Property          | Type                              | Default                     | Description                                                                                                                                                      |
| ----------------- | --------------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`              | `string`                          | **(required)**              | Unique id of the magic-move instance                                                                                                                             |
| `transition`      | `function`                        | `MagicMove.Transition.move` | Transition effect, see below                                                                                                                                     |
| `duration`        | `number`                          | `400`                       | Length of the animation (milliseconds)                                                                                                                           |
| `delay`           | `number`                          | `0`                         | Amount of msec to wait before starting the animation                                                                                                             |
| `easing`          | `function`                        | `Easing.inOut(Easing.ease)` | Easing function to define the curve                                                                                                                              |
| `disabled`        | `bool`                            | `false`                     | Disables transitions to this component                                                                                                                           |
| `zIndex`          | `number`                          | `0`                         | Z-index to control the drawing order of the rendered animation. A component with a greater z-index is always drawn in front of a component with a lower z-index. |
| `useNativeDriver` | `boolean`                         | `true`                      | Use the native-driver                                                                                                                                            |
| `debug`           | `boolean`                         | `false`                     | Enables debug-mode to analyze animations                                                                                                                         |
| `useNativeClone`  | `boolean`                         |                             | Use this prop to disable native clone optimisations for this component (when applicable).                                                                        |
| `imageSizeHint`   | `{width: number, height: number}` |                             | Optional size of the image that may be provided as a hint to the transition function                                                                             |

### Transitions

The following transition functions are available out of the box.

| Transition                                | Description                                                                                                                                                            |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MagicMove.Transition.move` **(default)** | Moves the component while adjusting for border-radii and size. Takes the image `resizeMode` into account to create a seamless image transition without any stretching. |
| `MagicMove.Transition.morph`              | Morphs the shape, size and colours  of the target to look like the source                                                                                              |
| `MagicMove.Transition.dissolve`           | Cross fade the source into the target                                                                                                                                  |
| `MagicMove.Transition.flip`               | Flip the source to reveal the target on the backside (auto choose axis)                                                                                                |
| `MagicMove.Transition.flip.x`             | Flip the source to reveal the target on the backside (over x-axis)                                                                                                     |
| `MagicMove.Transition.flip.y`             | Flip the source to reveal the target on the backside (over y-axis)                                                                                                     |
| `MagicMove.Transition.flip.xy`            | Flip the source to reveal the target on the backside (over x- and y-axes)                                                                                              |
| `MagicMove.Transition.shrinkAndGrow`      | Shrink and let the source disappear while letting the target appear and grow                                                                                           |
| `MagicMove.Transition.squashAndStretch`   | Scale the target to the size of the source and squash and stretch to give it the illusion of momentum and mass                                                         |

You can also create your own transition functions, see [`src/transitions`](./src/transitions) for examples.

### Scenes

Use `<MagicMove.Scene>` to mark the start of a scene within the rendering hierarchy.
This is important so that Magic Move can correctly assess the destination-position of an animation.
`MagicMove.Scene` is implemented using a regular `View` and supports all its properties.

| Property          | Type       | Default | Description                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ----------------- | ---------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `disabled`        | `bool`     | `false` | Disable transitions to this scene.                                                                                                                                                                                                                                                                                                                                                                                           |
| `active`          | `bool`     |         | This special prop is intended for integrating magic-move with 3rd party navigators such as `react-navigation`. *Do not use it unless you know what you are doing.* By setting it to `true` or `false` the navigation package can control which scene is active and which is no longer active. See [react-navigation-magic-move](https://github.com/IjzerenHein/react-navigation-magic-move) for an example on how to use it. |
| `debug`           | `boolean`  | `false` | Enables debug-mode to analyze animations                                                                                                                                                                                                                                                                                                                                                                                     |
| `onWillAppear`    | `function` |         | Callback that is called when the scene is about to appear                                                                                                                                                                                                                                                                                                                                                                    |
| `onWillDisappear` | `function` |         | Callback that is called when the scene is about to disappear                                                                                                                                                                                                                                                                                                                                                                 |

### Context

When a magic-move is performend, a temporary clone of the source and/or target component is rendered onto the screen. Now imagine you have some animations that run when your component is mounted (e.g. `Animatable.View`), that would also mean these animations are run on the cloned component. This is probably not what you want and you might want to hide those components entirely in the cloned component. To do so you can use the `<MagicMove.Context>` API. It allows you to detect whether the component is rendered as a clone and whether it is the source or target of a magic move animation.

**Example**

```jsx
<MagicMove.View>
  <MagicMove.Context>
    {({isClone, isTarget}) => (
      <Animatable.View animation={isClone ? undefined : 'zoomIn'} />
    )}
  </MagicMove.Context>
</MagicMove.View>
```


## Resources

### [React Europe Talk](https://www.youtube.com/watch?v=Uj7aWfrtey8&list=FLsxiG7-SUK8s8xReSGAH4lQ)
### [react-native-magic-move-presentation](https://github.com/IjzerenHein/react-native-magic-move-presentation)
### [react-navigation-magic-move](https://github.com/IjzerenHein/react-navigation-magic-move)
### [examples/expo/src](./examples/expo/src)

## Disclaimer 🐰🎩

Magic-move creates the illusion of transitioning/morphing components from one scene to another. _It however doesn't actually move components to different scenes._ As with real magic tricks, there will be situations where the illusion will not work for you. And as with magic tricks, you may need to **"set the stage"** (e.g. change some stuff in your app) to create the transition that you want. So now that you've received this reality check ✅, go forth and create some bad-ass illusions.


## License <!-- omit in toc -->

[MIT](./LICENSE.txt)

## Cool? <!-- omit in toc -->

Do you think this cool and useful? Consider buying me a coffee!<br/><a href="https://www.buymeacoffee.com/ijzerenhein" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>
