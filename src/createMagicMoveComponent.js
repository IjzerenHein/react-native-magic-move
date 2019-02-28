import React from "react";
import { Animated } from "react-native";
import MagicMoveView from "./View";

/**
 * Creates a magically moving component.
 *
 * @param {Component} Component - Source component
 * @param {Object} [props] - Additional options
 * @param {string} [props.ComponentType] - Component type (e.g. "image", "text", etc..)
 * @param {Component} [props.AnimatedComponent] - The animated component
 */
function createMagicMoveComponent(Component, props) {
  let { AnimatedComponent, ComponentType, ...otherProps } = props || {};
  AnimatedComponent =
    AnimatedComponent || Animated.createAnimatedComponent(Component);
  ComponentType = ComponentType || "view";
  const magicMoveComponent = props => {
    return (
      <MagicMoveView
        Component={Component}
        AnimatedComponent={AnimatedComponent}
        ComponentType={ComponentType}
        {...otherProps}
        {...props}
      />
    );
  };
  return magicMoveComponent;
}

export default createMagicMoveComponent;
