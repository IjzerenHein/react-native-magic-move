import React, { PureComponent } from "react";
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

class MagicMoveRenderer extends PureComponent {
  state = {
    layout: {}
  };

  componentDidMount() {
    const { administration } = this.props; //eslint-disable-line
    administration.addListener(() => this.forceUpdate());
  }

  render() {
    const { administration } = this.props; //eslint-disable-line
    return (
      <View
        style={styles.container}
        pointerEvents="none"
        collapsable={false}
        onLayout={this._onLayout}
      >
        {administration.animations.map(({ id, from, to }) => (
          <MagicMoveAnimation
            containerRef={this.state.ref}
            containerLayout={this.state.layout}
            key={id}
            from={from}
            to={to}
            onCompleted={() => administration.removeAnimation(id)}
          />
        ))}
      </View>
    );
  }

  setContainerRef = ref => {
    this.setState({ ref: ref });
  };

  _onLayout = event => {
    const { x, y, width, height } = event.nativeEvent.layout;
    const { layout } = this.state;
    if (
      layout.x !== x ||
      layout.y !== y ||
      layout.width !== width ||
      layout.height !== height
    ) {
      this.setState({
        layout: {
          x,
          y,
          width,
          height
        }
      });
    }
  };
}

export default MagicMoveRenderer;
