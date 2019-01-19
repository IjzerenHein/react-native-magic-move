import React from "react";
import { Text } from "react-native";
import {
  createAppContainer,
  createSwitchNavigator,
  createStackNavigator
} from "react-navigation";

import * as MagicMove from "react-native-magic-move";
import { ReactNavigationScene } from "react-navigation-magic-move";
MagicMove.Scene.addHook(ReactNavigationScene);

class Screen1 extends React.Component {
  render() {
    return (
      <MagicMove.Scene style={{ flex: 1, backgroundColor: "green" }} debug>
        <MagicMove.View
          debug
          id="logoA"
          transition={MagicMove.Transition.flip.x}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text onPress={() => this.props.navigation.navigate("ScreenB")}>
            SAME STACK (GO TO B)
          </Text>
        </MagicMove.View>
        <MagicMove.View
          debug
          id="logo2"
          transition={MagicMove.Transition.flip.x}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text onPress={() => this.props.navigation.navigate("two")}>
            SWITCH STACK (GO TO 2)
          </Text>
        </MagicMove.View>
      </MagicMove.Scene>
    );
  }
}

class Screen2 extends React.Component {
  render() {
    return (
      <MagicMove.Scene style={{ backgroundColor: "red", flex: 1 }} debug>
        <MagicMove.View
          debug
          id="logoA"
          transition={MagicMove.Transition.flip.y}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text onPress={() => this.props.navigation.navigate("ScreenA")}>
            SAME STACK (GO TO A)
          </Text>
        </MagicMove.View>
        <MagicMove.View
          debug
          id="logo2"
          transition={MagicMove.Transition.flip.x}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text onPress={() => this.props.navigation.navigate("one")}>
            SWITCH STACK (GO TO 1)
          </Text>
        </MagicMove.View>
      </MagicMove.Scene>
    );
  }
}

const StackOne = createStackNavigator({
  ScreenA: {
    screen: Screen1
  },
  ScreenB: {
    screen: Screen2
  }
});

const StackTwo = createStackNavigator({
  Screen: {
    screen: Screen2
  }
});

const AppNavigator = createSwitchNavigator({
  one: StackOne,
  two: StackTwo
});

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return (
      <MagicMove.Provider>
        <AppContainer />
      </MagicMove.Provider>
    );
  }
}
