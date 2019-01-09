import React from "react";
import { StyleSheet } from "react-native";
import { storeObserver, StorePropType } from "./Store";
import * as MagicMove from "./magic-move";
import * as Animatable from "react-native-animatable";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
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
  text: {
    margin: 24,
    textAlign: "center",
    color: "white",
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
        <MagicMove.View
          id="scene1"
          style={styles.background}
          transition={MagicMove.Transition.scale}
          debug={debug}
        >
          <MagicMove.Text
            id="scene1.title"
            style={styles.title}
            transition={MagicMove.Transition.scale}
            debug={debug}
          >
            Scale
          </MagicMove.Text>
          <MagicMove.Context>
            {({ isClone, isTarget }) =>
              isClone && isTarget ? (
                undefined
              ) : (
                <Animatable.Text
                  style={styles.text}
                  animation="fadeInUp"
                  delay={debug ? 8000 : 400}
                  duration={500}
                >
                  Magically animate your component from one scene to another.
                </Animatable.Text>
              )
            }
          </MagicMove.Context>
        </MagicMove.View>
      </MagicMove.Scene>
    );
  }
}

export default storeObserver(Scene);
