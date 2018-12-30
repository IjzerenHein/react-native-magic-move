import React from "react";
import { StyleSheet } from "react-native";
import * as MagicMove from "./magic-move";
import * as Animatable from "react-native-animatable";

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  background: {
    flex: 1,
    backgroundColor: "blueviolet",
    justifyContent: "center"
  },
  title: {
    alignSelf: "center",
    textAlign: "center",
    color: "white",
    fontSize: 50
  },
  subTitle: {
    textAlign: "center",
    color: "rgba(255,255,255,0.5)",
    fontWeight: "900",
    fontSize: 19
  },
  text: {
    margin: 24,
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 19,
    lineHeight: 24
  }
});

export default class Scene4 extends React.Component {
  render() {
    return (
      <MagicMove.Scene style={styles.container}>
        <MagicMove.View id="scene4" style={styles.background} useNativeDriver>
          <MagicMove.Text
            id="scene4.title"
            style={styles.title}
            useNativeDriver
          >
            Magic Move
          </MagicMove.Text>
          <Animatable.Text
            style={styles.text}
            animation="fadeInUp"
            delay={400}
            duration={500}
          >
            Magically animate your component from one scene to another.
          </Animatable.Text>
        </MagicMove.View>
      </MagicMove.Scene>
    );
  }
}
