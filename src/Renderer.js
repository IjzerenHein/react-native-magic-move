import React, { PureComponent } from "react";
import { View, StyleSheet } from "react-native";
import MagicMoveAnimation from "./Animation";
import MagicMoveClone from "./Clone";

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
  _containerLayout = undefined;
  _containerRef = undefined;

  componentDidMount() {
    const { administration } = this.props; //eslint-disable-line
    administration.addListener(() => this.forceUpdate());
  }

  render() {
    const { administration } = this.props; //eslint-disable-line

    // Find all "source" scenes that are currently performing
    // animations. When animations without a scene are encountered
    // then "undefined" is added to the scene-array.
    const scenes = [];
    if (this._containerLayout && this._containerRef) {
      administration.animations.forEach(({ source }) => {
        const { scene } = source.props;
        if (scenes.indexOf(scene) < 0) scenes.push(scene);
      });
    }

    return (
      <View
        style={styles.container}
        pointerEvents="none"
        collapsable={false}
        onLayout={this._onLayout}
      >
        {scenes.map((scene, sceneIndex) => {
          const children = administration.animations
            .filter(({ source }) => source.props.scene === scene)
            .map(({ id, source, target }) => (
              <MagicMoveAnimation
                key={id}
                source={source}
                target={target}
                containerLayout={this._containerLayout}
                onCompleted={() => administration.removeAnimation(id)}
              />
            ));
          if (!scene) {
            return children;
          } else {
            return (
              <MagicMoveClone
                key={`scene${sceneIndex + ""}`}
                isScene
                component={scene}
                parentRef={this._containerRef}
                containerLayout={this._containerLayout}
              >
                {children}
              </MagicMoveClone>
            );
          }
        })}
      </View>
    );
  }

  setContainerRef = ref => {
    this._containerRef = ref;
    if (this._containerRef && this._containerLayout) {
      this.forceUpdate();
    }
  };

  _onLayout = event => {
    const { x, y, width, height } = event.nativeEvent.layout;
    const layout = this._containerLayout;
    if (
      !layout ||
      layout.x !== x ||
      layout.y !== y ||
      layout.width !== width ||
      layout.height !== height
    ) {
      this._containerLayout = {
        x,
        y,
        width,
        height
      };
      if (this._containerRef && this._containerLayout) {
        this.forceUpdate();
      }
    }
  };
}

export default MagicMoveRenderer;
