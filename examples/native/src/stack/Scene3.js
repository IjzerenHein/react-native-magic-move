import React from "react";
import { Easing, Dimensions, StyleSheet, ScrollView } from "react-native";
import * as MagicMove from "react-native-magic-move";
import * as Animatable from "react-native-animatable";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1
  },
  image: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.65
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

class Scene extends React.Component {
  render() {
    return (
      <MagicMove.Scene style={styles.container}>
        <ScrollView style={styles.container}>
          <MagicMove.Image
            id="image"
            style={styles.image}
            source={require("../assets/waterfall.jpg")}
            resizeMode="cover"
            easing={Easing.in(Easing.cubic)}
            duration={400}
          />
          <Animatable.Text
            style={styles.text}
            animation="fadeInUp"
            delay={400}
            duration={500}
          >
            Images are animated seamlessly to reveal the full content, without
            any stretching or tearing
          </Animatable.Text>
          {/*<Animatable.Text
            style={styles.signature}
            animation="fadeInUp"
            delay={600}
            duration={500}
          >
            - Issa, Japanese Haiku
          </Animatable.Text>*/}
        </ScrollView>
      </MagicMove.Scene>
    );
  }
}
export default Scene;
