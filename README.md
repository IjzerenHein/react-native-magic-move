# react-native-magic-move <!-- omit in toc -->


Create magical move transitions between scenes in react-native 🐰🎩✨

## Work in progress, use at own risk :) <!-- omit in toc -->

- [Usage](#usage)
- [Documentation](#documentation)
  - [Components](#components)
  - [Props](#props)
  - [Scenes](#scenes)
- [Examples](#examples)
- [Disclaimer 🐰🎩](#disclaimer-%F0%9F%90%B0%F0%9F%8E%A9)

## Usage

Installation

```
yarn add react-native-magic-move
```

Wrap your app with the `<MagicMove>` context.

```js
import MagicMove from 'react-native-magic-move';

const App = () => (
  <MagicMove>
    {...}
  </MagicMove>
);
```

Add the `<MagicMove.{View|Image|Text}>` component to your views. Whenever the Magic Move component
is mounted while another Magic Move component with the same `id` is already mounted, then a magic transition between the components is performed.

```js
import MagicMove from 'react-native-magic-move';

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

The following magic-move components are supported:

- `MagicMove.View`
- `MagicMove.Text`
- `MagicMove.Image`

These components support all the usual props that you expect (they are passed through). 

### Props

| Property          | Type       | Default                     | Description                                                         |
| ----------------- | ---------- | --------------------------- | ------------------------------------------------------------------- |
| `id`              | `string`   | **(required)**              | Unique id of the magic-move instance                                |
| `duration`        | `number`   | `500`                       | Length of the animation (milliseconds)                              |
| `easing`          | `function` | `Easing.inOut(Easing.ease)` | Easing function to define the curve                                 |
| `delay`           | `number`   | `0`                         | Amount of msec to wait before starting the animation                |
| `useNativeDriver` | `boolean`  | `false`                     | Enables the native-driver                                           |
| `keepHidden`      | `boolean`  | `false`                     | Keeps the source component hidden after the animation has completed |
| `debug`           | `boolean`  | `false`                     | Enables debug-mode to analyze animations                            |

### Scenes

Use `<MagicMove.Scene>` to mark the start of a scene within the rendering hierarchy.
This is important so that Magic Move can correctly assess the destination-position of an animation.
`MagicMove.Scene` is implemented using a regular `View` and supports all its properties.


## Examples

Example with scene transitions using `react-native-router-flux`.

```jsx
import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Router, Stack, Scene, Actions } from "react-native-router-flux";
import MagicMove from "react-native-magic-move";

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
  <MagicMove>
    <Router>
      <Stack key="root">
        <Scene key="scene1" component={Scene1} />
        <Scene key="scene2" component={Scene2} />
      </Stack>
    </Router>
  </MagicMove>
);
```

See [`examples/src`](./examples/src) for more code examples.


## Disclaimer 🐰🎩

Magic-move creates the illusion of transitioning/morphing components from one scene to another. _It however doesn't actually move components to different scenes._ As with real magic tricks, there will be situations where the illusion will not work for you. And as with magic tricks, you may need to **"set the stage"** (e.g. change some stuff in your app) to create the transition that you want. So now that you've received this reality check ✅, go forth and create some bad-ass illusions. Drop me a note of the cool stuff you've built with it. Grand wizard, IjzerenHein

## License <!-- omit in toc -->

[MIT](./LICENSE.txt)
