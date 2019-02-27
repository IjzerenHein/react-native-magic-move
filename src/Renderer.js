import React, { PureComponent } from "react";
import { View, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import MagicMoveAnimation from "./Animation";
import MagicMoveClone from "./clone";

class MagicMoveRenderer extends PureComponent {
  static propTypes = {
    administration: PropTypes.object.isRequired
  };

  componentDidMount() {
    const { administration } = this.props;

    // Animations may end at slightly different moments
    // remove the animation from the render tree, until
    // all other animations have finished as well.
    // The currently used solution is a bit hackish, but works for now.
    this._prevAnimCount = administration.animations.length;
    administration.addListener(() => {
      const animCount = administration.animations.length;
      if (
        this._prevAnimCount < animCount ||
        (this._prevAnimCount && !animCount)
      ) {
        this._prevAnimCount = animCount;
        this.forceUpdate();
      }
    });
  }

  render() {
    const { administration } = this.props;

    // Find all "source" scenes that are currently performing
    // animations. When animations without a scene are encountered
    // then "undefined" is added to the scene-array.
    const scenes = [];
    administration.animations.forEach(({ source }) => {
      const { scene } = source;
      if (scenes.indexOf(scene) < 0) scenes.push(scene);
    });

    return (
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
        collapsable={false}
      >
        {scenes.map((scene, sceneIndex) => {
          const children = administration.animations
            .filter(({ source }) => source.scene === scene)
            .sort(
              (a, b) =>
                (a.source.props.zIndex || 0) - (b.source.props.zIndex || 0) ||
                (a.target.props.zIndex || 0) - (b.target.props.zIndex || 0)
            )
            .map(({ id, source, target }) => (
              <MagicMoveAnimation
                key={id}
                source={source}
                target={target}
                onCompleted={() => administration.removeAnimation(id)}
              />
            ));
          if (!scene) {
            return children;
          } else {
            return (
              <MagicMoveClone
                key={`scene${sceneIndex + ""}`}
                mmContext={scene.props.mmContext}
                component={scene}
                options={
                  MagicMoveClone.Option.INITIAL |
                  MagicMoveClone.Option.SCENE |
                  MagicMoveClone.Option.VISIBLE
                }
                nativeContentType={MagicMoveClone.ContentType.CHILDREN}
              >
                {children}
              </MagicMoveClone>
            );
          }
        })}
      </View>
    );
  }
}

export default MagicMoveRenderer;
