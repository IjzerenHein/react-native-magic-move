import React from "react";
import { StyleSheet } from "react-native";
import { storeObserver, StorePropType } from "./Store";
import * as MagicMove from "./magic-move";

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
  text: {
    alignSelf: "center",
    textAlign: "center",
    color: "orange",
    fontSize: 50
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
          id="scene4"
          style={styles.background}
          debug={debug}
          useNativeDriver={false}
        >
          <MagicMove.Text
            id="scene4.title"
            style={styles.text}
            debug={debug}
            useNativeDriver={false}
          >
            Color Change
          </MagicMove.Text>
        </MagicMove.View>
      </MagicMove.Scene>
    );
  }
}
export default storeObserver(Scene);
