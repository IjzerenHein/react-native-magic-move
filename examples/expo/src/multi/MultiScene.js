import React from "react";
import { StyleSheet, View, Text } from "react-native";
import * as MagicMove from "react-native-magic-move";
import * as Animatable from "react-native-animatable";
import Bar from "./Bar";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1
  },
  content: {
    flex: 1,
    justifyContent: "center"
  },
  box: {
    alignSelf: "center",
    backgroundColor: "goldenrod",
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
    color: "goldenrod",
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
        <Bar hideId="scene5" />
        <View style={styles.content}>
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
            Magically animate your component from one scene to another.
          </Animatable.Text>
        </View>
      </MagicMove.Scene>
    );
  }
}
export default Scene;
