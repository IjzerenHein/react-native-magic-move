import React from "react";
import { StyleSheet, Text } from "react-native";
import MagicMove from "./magic-move";

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  background: {
    flex: 1,
    backgroundColor: "green"
  },
  text: {
    marginTop: 20,
    alignSelf: "center",
    textAlign: "center",
    color: "white",
    fontSize: 30
  }
});

export default class Scene1 extends React.Component {
  render() {
    return (
      <MagicMove.Scene style={styles.container}>
        <MagicMove.View id="scene1" style={styles.background}>
          <Text style={styles.text}>Scene 1</Text>
        </MagicMove.View>
      </MagicMove.Scene>
    );
  }
}
