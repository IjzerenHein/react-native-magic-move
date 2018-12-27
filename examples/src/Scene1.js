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
    marginLeft: 50,
    width: 50,
    height: 50,
    backgroundColor: "green",
    borderRadius: 2
  }
});

export default class Scene1 extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <MagicMove.View id="box" style={styles.box} />
      </View>
    );
  }
}
