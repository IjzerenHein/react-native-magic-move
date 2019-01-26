import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import * as MagicMove from "react-native-magic-move";
import * as Animatable from "react-native-animatable";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1
  },
  box: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 3,
    backgroundColor: "seagreen",
    resizeMode: "cover"
  },
  title: {
    alignSelf: "center",
    textAlign: "center",
    color: "white",
    fontSize: 37
  },
  text: {
    color: "seagreen",
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
        <MagicMove.Image
          id="scene6"
          source={require("../assets/mario.png")}
          imageSizeHint={{ width: 256, height: 256 }}
          style={styles.box}
        />
        <Animatable.Text
          style={styles.text}
          animation="fadeInUp"
          delay={400}
          duration={500}
        >
          Magically animate your component from one scene to another.
        </Animatable.Text>
      </MagicMove.Scene>
    );
  }
}

export default Scene;
