# react-navigation-magic-move <!-- omit in toc -->

Bindings for using [react-navigation](https://reactnavigation.org/) with [react-native-magic-move](https://github.com/IjzerenHein/react-native-magic-move) 🐰🎩✨

## Why is this needed

`react-native-magic-move` triggers its animations whenever it detects that a new MagicMove view has been mounted. However, navigation libraries such as `react-navigation` keep components mounted for better performance and faster switching. This means that actions such as back navigation, tab switching or modal popups don't trigger an animation or don't trigger it consistently. This binding solves that problem by installing a hook that forwards the navigator scene information to `react-native-magic-move`.

## Usage

Installation

```
$ yarn add react-navigation-magic-move
```

Import the library somewhere at the top of your code

```jsx
import "react-navigation-magic-move";
```

And make sure that your scenes are wrapped with `<MagicMove.Scene>`

**Example**

```jsx
const Scene1 = () => (
  <MagicMove.Scene>
    ...
    <MagicMove.View
      id="myView"
      style={{
        alignSelf: "center",
        width: 100,
        height: 100,
        backgroundColor: "green",
        borderRadius: 20
      }}
    />
    ...
  </MagicMove.Scene>
);

const Scene2 = () => (
  <MagicMove.Scene>
    ...
    <MagicMove.View
      id="myView"
      style={{
        height: 300,
        backgroundColor: "purple"
      }}
    />
    ...
  </MagicMove.Scene>
);
```

## That's it!

Magic-move will now animate your components when transitioning from one scene to another. If you want to opt-out of transitions, then use the `disabled` prop to turn off transitions towards that scene or component.

![MagicMoveGif](react-navigation-magic-move.gif)
