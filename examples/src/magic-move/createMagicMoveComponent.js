import React from "react";
import { Animated } from "react-native";
import MagicMoveView from "./View";

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
