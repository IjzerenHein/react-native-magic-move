# react-native-magic-move

Create magical move transitions between scenes in react-native ✨

<video src="./magic-move.mov" width="384" height="795" preload></video>

# WIP go away

- [`Introduction`](#introduction)
- [`Documentation`](#documentation)
- [`Disclaimer`](#disclaimer)

## Introduction



## Documentation

Props

| Property          | Type       | Default                     | Description                                                         |
| ----------------- | ---------- | --------------------------- | ------------------------------------------------------------------- |
| `id`              | `string`   | **(required)**              | Unique id of the magic-move instance                                |
| `duration`        | `number`   | `500`                       | Length of the animation (milliseconds)                              |
| `easing`          | `function` | `Easing.inOut(Easing.ease)` | Easing function to define the curve                                 |
| `delay`           | `number`   | `0`                         | Amount of msec to wait before starting the animation                |
| `useNativeDriver` | `boolean`  | `false`                     | Enables the native-driver                                           |
| `keepHidden`      | `boolean`  | `false`                     | Keeps the source component hidden after the animation has completed |
| `debug`           | `boolean`  | `false`                     | Enables debug-mode to analyze animations                            |




## Disclaimer 🐰🎩

Magic-move creates the illusion of transitioning/morphing components from one scene to another. _It however doesn't actually move components to different scenes._ As with real magic tricks, there will be situations where the illusion will not work for you. And as with magic tricks, you may need to **"set the stage"** (e.g. change some stuff in your app) to create the transition that you want. So now that you've received this reality check ✅, go forth and create some bad-ass illusions. Drop me a note of the cool stuff you've built with it. Grand wizard, IjzerenHein

## License

[MIT](./LICENSE.txt)
