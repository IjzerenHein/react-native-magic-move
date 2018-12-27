import React from "react";
import { Animated } from "react-native";

class MagicMoveAnimation {
  constructor(id, sourceComponent, targetComponent) {
    this._id = id;
    this._animValue = new Animated.Value(0);
    this._sourceComponent = sourceComponent;
    this._targetComponent = targetComponent;
  }

  get id() {
    return this._id;
  }

  start(onComplete) {
    this._sourceComponent.setOpacity(0);
    this._targetComponent.setOpacity(0);
    Animated.timing(
      this._animValue,
      {
        toValue: 1,
        duration: 400
      },
      () => {
        this._sourceComponent.setOpacity(1);
        this._targetComponent.setOpacity(1);
        onComplete();
      }
    ).start();
  }

  render() {
    return (
      <Animated.View>{this._sourceComponent.props.children}</Animated.View>
    );
  }
}

export default MagicMoveAnimation;
