# react-native-magic-move <!-- omit in toc -->

Create magical move transitions between scenes in react-native 🐰🎩✨

### [Try it with Expo](https://expo.io/@ijzerenhein/react-native-magic-move-demo) <!-- omit in toc -->

![MagicMoveGif](magicmove4.gif)

- [Usage](#usage)
- [Documentation](#documentation)
  - [Components](#components)
  - [Props](#props)
  - [Scenes](#scenes)
  - [Transitions](#transitions)
- [Examples](#examples)
- [Disclaimer 🐰🎩](#disclaimer-%F0%9F%90%B0%F0%9F%8E%A9)

## Usage

Installation

```
$ yarn add react-native-magic-move
```

Wrap your app with the `<MagicMove.Provider>` context.

```js
import * as MagicMove from 'react-native-magic-move';

const App = () => (
  <MagicMove.Provider>
    {...}
  </MagicMove.Provider>
);
```

Add the `<MagicMove.{View|Image|Text}>` component to your views. Whenever the Magic Move component
is mounted while another Magic Move component with the same `id` is already mounted, then a magic transition between the components is performed.

```js
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


## Documentation

### Components

The following magic-move components are supported out of the box.

- `MagicMove.View`
- `MagicMove.Text`
- `MagicMove.Image`

You can also create your own custom MagicMove components.

```js
MyCustomComponent = MagicMove.createMagicMoveComponent(MyCustomComponent);
```

### Props

| Property          | Type       | Default                      | Description                                                         |
| ----------------- | ---------- | ---------------------------- | ------------------------------------------------------------------- |
| `id`              | `string`   | **(required)**               | Unique id of the magic-move instance                                |
| `transition`      | `function` | `MagicMove.Transition.morph` | Transition effect, see below                                        |
| `duration`        | `number`   | `400`                        | Length of the animation (milliseconds)                              |
| `delay`           | `number`   | `0`                          | Amount of msec to wait before starting the animation                |
| `easing`          | `function` | `Easing.inOut(Easing.ease)`  | Easing function to define the curve                                 |
| `useNativeDriver` | `boolean`  | `true`                       | Use the native-driver                                               |
| `keepHidden`      | `boolean`  | `false`                      | Keeps the source component hidden after the animation has completed |
| `debug`           | `boolean`  | `false`                      | Enables debug-mode to analyze animations                            |

### Scenes

Use `<MagicMove.Scene>` to mark the start of a scene within the rendering hierarchy.
This is important so that Magic Move can correctly assess the destination-position of an animation.
`MagicMove.Scene` is implemented using a regular `View` and supports all its properties.


### Transitions

The following transition functions are available out of the box.

| Transition                                 | Description                                                                                                    |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `MagicMove.Transition.morph` **(default)** | Morphs the shape, size and colours  of the target to look like the source                                      |
| `MagicMove.Transition.scale`               | Simple move that scales the target to the size of the source                                                   |
| `MagicMove.Transition.dissolve`            | Cross fade the source into the target                                                                          |
| `MagicMove.Transition.flip`                | Flip the source to reveal the target on the backside (auto choose axis)                                        |
| `MagicMove.Transition.flip.x`              | Flip the source to reveal the target on the backside (over x-axis)                                             |
| `MagicMove.Transition.flip.y`              | Flip the source to reveal the target on the backside (over y-axis)                                             |
| `MagicMove.Transition.flip.xy`             | Flip the source to reveal the target on the backside (over x- and y-axes)                                      |
| `MagicMove.Transition.shrinkAndGrow`       | Shrink and let the source disappear while letting the target appear and grow                                   |
| `MagicMove.Transition.squashAndStretch`    | Scale the target to the size of the source and squash and stretch to give it the illusion of momentum and mass |

You can also create your own transition functions, see [`src/transitions`](./src/transitions) for examples.


## Examples

Example with scene transitions using `react-native-router-flux`.

```jsx
import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Router, Stack, Scene, Actions } from "react-native-router-flux";
import * as MagicMove from "react-native-magic-move";

const Scene1 = () => (
  <MagicMove.Scene>
    <TouchableOpacity onPress={() => Actions.scene2()}>
      <MagicMove.View id="myView" style={{
        alignSelf: "center",
        width: 100,
        height: 100,
        backgroundColor: "green",
        borderRadius: 20
      }} />
    </TouchableOpacity>
  </MagicMove.Scene>
);

const Scene2 = () => (
  <MagicMove.Scene>
    <MagicMove.View id="myView" style={{
      height: 300,
      backgroundColor: "purple"
    }} />
  </MagicMove.Scene>
);

const App = () => (
  <MagicMove.Provider>
    <Router>
      <Stack key="root">
        <Scene key="scene1" component={Scene1} />
        <Scene key="scene2" component={Scene2} />
      </Stack>
    </Router>
  </MagicMove.Provider>
);
```

See [`examples/src`](./examples/src) for more code examples.


## Disclaimer 🐰🎩

Magic-move creates the illusion of transitioning/morphing components from one scene to another. _It however doesn't actually move components to different scenes._ As with real magic tricks, there will be situations where the illusion will not work for you. And as with magic tricks, you may need to **"set the stage"** (e.g. change some stuff in your app) to create the transition that you want. So now that you've received this reality check ✅, go forth and create some bad-ass illusions. Drop me a note of the cool stuff you've built with it. Grand wizard, IjzerenHein

## License <!-- omit in toc -->

[MIT](./LICENSE.txt)
