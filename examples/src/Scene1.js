import React from "react";
import { StyleSheet } from "react-native";
import * as MagicMove from "./magic-move";

const styles = StyleSheet.create({
  container: {
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

export default class Scene1 extends React.Component {
  render() {
    return (
      <MagicMove.Scene style={styles.container}>
        <MagicMove.View id="scene1" style={styles.background}>
          <MagicMove.Text id="scene1.title" style={styles.text}>
            Color Change
          </MagicMove.Text>
        </MagicMove.View>
      </MagicMove.Scene>
    );
  }
}
