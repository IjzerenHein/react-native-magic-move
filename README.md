# react-native-magic-move

Create magical move transitions between scenes in react-native 🐰🎩✨

# WIP go away

- [`Usage`](#usage)
- [`API Documentation`](#api-documentation)
- [`Example`](#example)
- [`Disclaimer`](#disclaimer)

## Usage

Installation

```
yarn add react-native-magic-move
```

Wrap your app with the magic-move context.

```js
import MagicMove from 'react-native-magic-move';

const App = () => (
  <MagicMove>
    {...}
  </MagicMove>
);
```

Add the MagicMove component to your views. Whenever MagicMove component
is mounted while another MagicMove component is mounted with the same id, then a magic transition between the components is performed.

```js
import MagicMove from 'react-native-magic-move';

const Scene1 = () => (
  <View>
    <MagicMove.View id="logo" style={{
        width: 100,
        height: 100,
        backgroundColor: "green",
        borderRadius: 50
      }} />
  </View>
);

const Scene2 = () => (
  <View>
    <MagicMove.View id="logo" style={{
        width: 200,
        height: 200,
        backgroundColor: "purple",
        borderRadius: 0
      }} />
  </View>
);
```


## API Documentation

The following magic-move components are supported:

- `MagicMove.View`
- `MagicMove.Text`
- `MagicMove.Image`

These components support all the usual props that you expect (they are passed through). 

### Supported props

| Property          | Type       | Default                     | Description                                                         |
| ----------------- | ---------- | --------------------------- | ------------------------------------------------------------------- |
| `id`              | `string`   | **(required)**              | Unique id of the magic-move instance                                |
| `duration`        | `number`   | `500`                       | Length of the animation (milliseconds)                              |
| `easing`          | `function` | `Easing.inOut(Easing.ease)` | Easing function to define the curve                                 |
| `delay`           | `number`   | `0`                         | Amount of msec to wait before starting the animation                |
| `useNativeDriver` | `boolean`  | `false`                     | Enables the native-driver                                           |
| `keepHidden`      | `boolean`  | `false`                     | Keeps the source component hidden after the animation has completed |
| `debug`           | `boolean`  | `false`                     | Enables debug-mode to analyze animations                            |


## Example

Example with scene transitions using `react-native-router-flux`.

```jsx
import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Router, Stack, Scene, Actions } from "react-native-router-flux";
import MagicMove from "react-native-magic-move";

const Scene1 = () => (
  <View>
    <TouchableOpacity onPress={() => Actions.scene2()}>
      <MagicMove.View id="myView" style={{
        alignSelf: "center",
        width: 100,
        height: 100,
        backgroundColor: "green",
        borderRadius: 20
      }} />
    </TouchableOpacity>
  </View>
);

const Scene2 = () => (
  <View>
    <MagicMove.View id="myView" style={{
      height: 300,
      backgroundColor: "purple"
    }} />
  </View>
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

## Disclaimer 🐰🎩

Magic-move creates the illusion of transitioning/morphing components from one scene to another. _It however doesn't actually move components to different scenes._ As with real magic tricks, there will be situations where the illusion will not work for you. And as with magic tricks, you may need to **"set the stage"** (e.g. change some stuff in your app) to create the transition that you want. So now that you've received this reality check ✅, go forth and create some bad-ass illusions. Drop me a note of the cool stuff you've built with it. Grand wizard, IjzerenHein

## License

[MIT](./LICENSE.txt)
