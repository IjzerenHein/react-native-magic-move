import React from "react";
import { StyleSheet, Text } from "react-native";
import * as MagicMove from "react-native-magic-move";
import * as Animatable from "react-native-animatable";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center"
  },
  box: {
    alignSelf: "center",
    backgroundColor: "purple",
    width: 260,
    height: 260,
    borderRadius: 130,
    flexDirection: "column",
    justifyContent: "center"
  },
  title: {
    alignSelf: "center",
    textAlign: "center",
    color: "white",
    fontSize: 30
  },
  text: {
    color: "purple",
    margin: 24,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 19,
    lineHeight: 24
  }
});

class Scene extends React.Component {
  static navigationOptions = {
    title: "Flip"
  };
  render() {
    return (
      <MagicMove.Scene style={styles.container}>
        <MagicMove.View
          id="scene5"
          style={styles.box}
          transition={MagicMove.Transition.flip.x}
        >
          <Text style={styles.title}>Magic Move</Text>
        </MagicMove.View>
        <Animatable.Text
          style={styles.text}
          animation="fadeInUp"
          delay={400}
          duration={500}
        >
          {'Flip either the "x" or "y" axis, or both'}
        </Animatable.Text>
      </MagicMove.Scene>
    );
  }
}
export default Scene;
