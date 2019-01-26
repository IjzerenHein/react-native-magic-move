import React from "react";
import { StyleSheet } from "react-native";
import * as MagicMove from "react-native-magic-move";
import * as Animatable from "react-native-animatable";
import { Actions } from "react-native-router-flux";
import Button from "../components/Button";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  box: {
    marginTop: 40,
    alignSelf: "center",
    backgroundColor: "seagreen",
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
        <Animatable.View
          iterationCount="infinite"
          iterationDelay={10000}
          animation="rubberBand"
        >
          <Button onPress={this.onPressShow} label="Show Modal" />
        </Animatable.View>
        <MagicMove.Image
          id="scene6"
          style={styles.box}
          resizeMode="cover"
          source={require("../assets/mario.png")}
          imageSizeHint={{ width: 256, height: 256 }}
          transition={MagicMove.Transition.flip.x}
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

  onPressShow = () => {
    Actions.modal2();
  };
}

export default Scene;
