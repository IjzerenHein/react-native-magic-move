import React from "react";
import { StyleSheet } from "react-native";
import * as MagicMove from "react-native-magic-move";
import * as Animatable from "react-native-animatable";

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
  title: {
    alignSelf: "center",
    textAlign: "center",
    color: "orange",
    fontSize: 50
  },
  text: {
    color: "orange",
    margin: 24,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 19,
    lineHeight: 24
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
            style={styles.title}
            transition={MagicMove.Transition.morph}
          >
            Color Change
          </MagicMove.Text>
          <Animatable.Text
            style={styles.text}
            animation="fadeInUp"
            delay={400}
            duration={500}
          >
            {
              'The "morph" transition combines a shape-shift and dissolve effect'
            }
          </Animatable.Text>
        </MagicMove.View>
      </MagicMove.Scene>
    );
  }
}
export default Scene;
