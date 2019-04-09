import React from "react";
import { Animated, Text } from "react-native";
import { splitTextStyles } from "./TextUtils";

/**
 * Custom AnimatedText that works around an issue with RN on iOS
 * when animating the opacity of a Text component.
 * Seems like the same issue as reported here:
 * https://github.com/facebook/react-native/issues/12453
 */
const AnimatedText = props => {
  const { style, ...otherProps } = props;
  const { textStyles, otherStyles } = splitTextStyles(style);
  return (
    <Animated.View style={otherStyles}>
      <Text style={textStyles} {...otherProps} />
    </Animated.View>
  );
};

export default AnimatedText;
