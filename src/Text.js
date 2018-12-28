import React from "react";
import { Animated, Text } from "react-native";
import MagicMoveView from "./View";

const MagicMoveText = props => {
  return (
    <MagicMoveView
      Component={Text}
      AnimatedComponent={Animated.Text}
      {...props}
    />
  );
};

export default MagicMoveText;
