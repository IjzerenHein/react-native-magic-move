import React from "react";
import { StyleSheet, Text } from "react-native";
import { storeObserver, StorePropType } from "./Store";
import * as MagicMove from "./magic-move";
import * as Animatable from "react-native-animatable";
import { Actions } from "react-native-router-flux";
import Button from "./Button";

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
  static propTypes = {
    store: StorePropType
  };
  render() {
    const { debug } = this.props.store;
    return (
      <MagicMove.Scene style={styles.container}>
        <Animatable.View
          iterationCount="infinite"
          iterationDelay={10000}
          animation="rubberBand"
        >
          <Button onPress={this.onPressShow} label="Show Modal" />
        </Animatable.View>
        <MagicMove.View
          id="scene6"
          style={styles.box}
          transition={MagicMove.Transition.flip.x}
          debug={debug}
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
      </MagicMove.Scene>
    );
  }

  onPressShow = () => {
    Actions.modal();
  };
}

export default storeObserver(Scene);
