import React from "react";
import { Easing, Dimensions, StyleSheet, ScrollView } from "react-native";
import * as MagicMove from "./magic-move";
import * as Animatable from "react-native-animatable";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  image: {
    width: Dimensions.get("window").width,
    height: 240
  },
  text: {
    margin: 20,
    fontSize: 19,
    letterSpacing: 1,
    lineHeight: 32
  },
  signature: {
    fontSize: 19,
    fontWeight: "bold",
    textAlign: "right",
    marginRight: 20
  }
});

export default class Scene3 extends React.Component {
  render() {
    return (
      <MagicMove.Scene style={styles.container}>
        <ScrollView style={styles.container}>
          <MagicMove.Image
            id="image"
            style={styles.image}
            source={require("./assets/waves.jpg")}
            resizeMode="cover"
            easing={Easing.in(Easing.cubic)}
            duration={400}
            useNativeDriver
          />
          <Animatable.Text
            style={styles.text}
            animation="fadeInUp"
            delay={400}
            duration={500}
          >
            Arise from sleep, old cat, And with great yawns and stretchings...
            Amble out for love
          </Animatable.Text>
          <Animatable.Text
            style={styles.signature}
            animation="fadeInUp"
            delay={600}
            duration={500}
          >
            - Issa, Japanese Haiku
          </Animatable.Text>
        </ScrollView>
      </MagicMove.Scene>
    );
  }
}
