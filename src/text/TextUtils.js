import { StyleSheet } from "react-native";

/**
 * Custom AnimatedText that works around an issue with RN on iOS
 * when animating the opacity of a Text component.
 * Seems like the same issue as reported here:
 * https://github.com/facebook/react-native/issues/12453
 */
export function splitTextStyles(style) {
  const {
    color,
    fontSize,
    fontStyle,
    fontWeight,
    fontFamily,
    fontVariant,
    letterSpacing,
    lineHeight,
    includeFontPadding,
    textAlign,
    textAlignVertical,
    textDecorationLine,
    textDecorationColor,
    textDecorationStyle,
    textShadowColor,
    textShadowRadius,
    textShadowOffset,
    textTransform,
    writingDirection,
    ...otherStyles
  } = StyleSheet.flatten([style]);

  const textStyles = {
    color,
    fontSize,
    fontStyle,
    fontWeight,
    fontFamily,
    fontVariant,
    letterSpacing,
    lineHeight,
    includeFontPadding,
    textAlign,
    textAlignVertical,
    textDecorationLine,
    textDecorationColor,
    textDecorationStyle,
    textShadowColor,
    textShadowRadius,
    textShadowOffset,
    textTransform,
    writingDirection
  };

  return {
    textStyles,
    otherStyles
  };
}
