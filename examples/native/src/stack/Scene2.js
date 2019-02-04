import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import * as MagicMove from "react-native-magic-move";
import randomColor from "randomcolor";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    flexDirection: "column",
    padding: 20
  },
  item: {
    borderRadius: 24,
    marginVertical: 5,
    padding: 10
  },
  text: {
    alignSelf: "center",
    color: "white",
    fontSize: 24
  }
});

const colors = [];
function getColor(idx) {
  while (idx >= colors.length) {
    colors.push(randomColor());
  }
  return colors[idx];
}

class Scene extends React.Component {
  render() {
    const items = [];
    for (let i = 1; i < 100; i++) {
      const isEnabled = i === 5;
      items.push(
        <MagicMove.View
          key={i}
          id={`list${i}`}
          style={[
            styles.item,
            { backgroundColor: isEnabled ? "purple" : getColor(i) }
          ]}
          disabled={!isEnabled}
        >
          <MagicMove.Text
            id={`list${i}.title`}
            style={styles.text}
            transition={MagicMove.Transition.morph}
          >
            {"Item " + i}
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

export default Scene;
