import React from "react";
import { StyleSheet } from "react-native";
import * as MagicMove from "react-native-magic-move";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1
  },
  background: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center"
  },
  text: {
    alignSelf: "center",
    textAlign: "center",
    color: "orange",
    fontSize: 50
  }
});

class Scene extends React.Component {
  render() {
    return (
      <MagicMove.Scene style={styles.container}>
        <MagicMove.View
          id="scene4"
          style={styles.background}
          transition={MagicMove.Transition.morph}
        >
          <MagicMove.Text
            id="scene4.title"
            style={styles.text}
            transition={MagicMove.Transition.morph}
          >
            Color Change
          </MagicMove.Text>
        </MagicMove.View>
      </MagicMove.Scene>
    );
  }
}
export default Scene;
