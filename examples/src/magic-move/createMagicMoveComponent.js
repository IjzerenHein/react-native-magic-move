import React from "react";
import { Animated } from "react-native";
import MagicMoveView from "./View";

/**
 * Creates a magically moving component.
 *
 * @param {Component} Component - Source component
 * @param {Component} [AnimatedComponent] - When ommited an animated component is created using Animated.createAnimatedComponent
 */
function createMagicMoveComponent(Component, AnimatedComponent) {
  const magicMoveComponent = props => {
    return (
      <MagicMoveView
        Component={Component}
        AnimatedComponent={
          AnimatedComponent || Animated.createAnimatedComponent(Component)
        }
        {...props}
      />
    );
  };
  return magicMoveComponent;
}

export default createMagicMoveComponent;
