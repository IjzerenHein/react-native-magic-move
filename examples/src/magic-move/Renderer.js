import React from "react";
import { View, StyleSheet } from "react-native";
import MagicMoveAnimation from "./Animation";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }
});

class MagicMoveRenderer extends React.Component {
  componentDidMount() {
    const { administration } = this.props; //eslint-disable-line
    administration.addListener(() => this.forceUpdate());
  }
  render() {
    const { administration } = this.props; //eslint-disable-line
    return (
      <View style={styles.container} pointerEvents="none">
        {administration.animations.map(({ id, from, to }) => (
          <MagicMoveAnimation
            key={id}
            from={from}
            to={to}
            onCompleted={() => administration.removeAnimation(id)}
          />
        ))}
      </View>
    );
  }
}

export default MagicMoveRenderer;
