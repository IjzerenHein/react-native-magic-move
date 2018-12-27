import React from "react";
import { StyleSheet, View } from "react-native";
import MagicMove from "./magic-move";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  box: {
    width: 200,
    height: 200,
    backgroundColor: "purple",
    borderRadius: 30,
    borderColor: "green"
  }
});

export default class Scene2 extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <MagicMove.View id="box" style={styles.box} />
      </View>
    );
  }
}
