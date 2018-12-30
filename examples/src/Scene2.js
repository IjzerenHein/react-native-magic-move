import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import * as MagicMove from "./magic-move";
import randomColor from "randomcolor";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "column",
    padding: 20
  },
  item: {
    borderRadius: 24,
    marginVertical: 5,
    padding: 10
  },
  text: {
    color: "white",
    fontSize: 24,
    textAlign: "center"
  }
});

export default class Scene2 extends React.Component {
  render() {
    const items = [];
    for (let i = 1; i < 100; i++) {
      items.push(
        <MagicMove.View
          key={i}
          id={`list${i}`}
          style={[
            styles.item,
            { backgroundColor: i === 2 ? "purple" : randomColor() }
          ]}
          useNativeDriver
        >
          <MagicMove.Text
            id={`list${i}.title`}
            style={styles.text}
            useNativeDriver
          >
            ScrollView
          </MagicMove.Text>
        </MagicMove.View>
      );
    }
    return (
      <MagicMove.Scene style={styles.container}>
        <ScrollView>{items}</ScrollView>
      </MagicMove.Scene>
    );
  }
}
