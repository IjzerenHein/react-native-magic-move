import React from "react";
import { Animated } from "react-native";
import MagicMoveView from "./View";

/**
 * Creates a magically moving component.
 *
 * @param {Component} Component - Source component
 * @param {Component} [AnimatedComponent] - The animated component
 * @param {string} [type] - Component type (e.g. "image", "text", etc..)
 */
function createMagicMoveComponent(Component, AnimatedComponent, type) {
  const magicMoveComponent = props => {
    return (
      <MagicMoveView
        Component={Component}
        AnimatedComponent={
          AnimatedComponent || Animated.createAnimatedComponent(Component)
        }
        ComponentType={type || "view"}
        {...props}
      />
    );
  };
  return magicMoveComponent;
}

export default createMagicMoveComponent;
