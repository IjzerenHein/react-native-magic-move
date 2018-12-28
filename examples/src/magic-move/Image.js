import React from "react";
import { Animated, Image } from "react-native";
import MagicMoveView from "./View";

const MagicMoveImage = props => {
  return (
    <MagicMoveView
      Component={Image}
      AnimatedComponent={Animated.Image}
      {...props}
    />
  );
};

export default MagicMoveImage;
