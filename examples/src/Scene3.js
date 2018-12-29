import React from "react";
import { Easing, Dimensions, StyleSheet, ScrollView, Text } from "react-native";
import MagicMove from "./magic-move";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  image: {
    width: Dimensions.get("window").width - 40,
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
            id="scene3"
            style={styles.image}
            source={require("./assets/waves.jpg")}
            resizeMode="cover"
            easing={Easing.in(Easing.cubic)}
            duration={400}
          />
          <Text style={styles.text}>
            Arise from sleep, old cat, And with great yawns and stretchings...
            Amble out for love
          </Text>
          <Text style={styles.signature}>- Issa, Japanese Haiku</Text>
        </ScrollView>
      </MagicMove.Scene>
    );
  }
}
