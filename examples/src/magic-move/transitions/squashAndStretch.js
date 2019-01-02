/* eslint react/prop-types: 0 */
import React from "react";
import { Easing } from "react-native";

export default function shrinkAndGrowTransition({
  from,
  to,
  animValue,
  render
}) {
  //
  // Calculate angle
  //
  const fromCenterX = from.start.x + from.width / 2;
  const fromCenterY = from.start.y + from.height / 2;
  const fromVolume = from.width * from.height;
  const toCenterX = to.end.x + to.width / 2;
  const toCenterY = to.end.y + to.height / 2;
  const toVolume = to.width * to.height;
  const distanceX = Math.abs(fromCenterX - toCenterX);
  const distanceY = Math.abs(fromCenterY - toCenterY);
  const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
  // const fromStretch = Math.min(distance / (Math.sqrt(fromVolume) * 4), 0.75);
  // const toStretch = Math.min(distance / (Math.sqrt(toVolume) * 4), 0.75);
  const fromStretch = 0.5;
  const toStretch = 0.5;

  const stretchXY = Math.atan2(distanceY, distanceX) / Math.PI - 0.5;
  console.log(
    stretchXY,
    distanceX,
    distanceY,
    distance,
    Math.sqrt(fromVolume) * 4,
    fromStretch,
    toStretch
  );

  //
  // Move & scale target component from starting
  // position/size to the ending position
  //
  const step0 = 0.1;
  const step1 = 0.7;
  const step2 = 0.8;
  to.style.transform = [
    {
      translateX: animValue.interpolate({
        inputRange: [0, step1, 1],
        outputRange: [to.start.x, to.end.x, to.end.x]
      })
    },
    {
      translateY: animValue.interpolate({
        inputRange: [0, step1, 1],
        outputRange: [to.start.y, to.end.y, to.end.y]
      })
    },
    {
      scaleX: animValue.interpolate({
        inputRange: [0, step0, step1, step2, 1.0],
        outputRange: [
          to.start.scaleX,
          (to.start.scaleX + (to.end.scaleX - to.start.scaleX) * step0) *
            (1 - stretchXY * (fromStretch + (toStretch - fromStretch) * step0)),
          (to.start.scaleX + (to.end.scaleX - to.start.scaleX) * step1) *
            (1 - stretchXY * (fromStretch + (toStretch - fromStretch) * step1)),
          (to.start.scaleX + (to.end.scaleX - to.start.scaleX) * step2) *
            (1 + stretchXY * (fromStretch + (toStretch - fromStretch) * step2)),
          to.end.scaleX
        ]
      })
    },
    {
      scaleY: animValue.interpolate({
        inputRange: [0, step0, step1, step2, 1.0],
        outputRange: [
          to.start.scaleY,
          (to.start.scaleY + (to.end.scaleY - to.start.scaleY) * step0) *
            (1 + stretchXY * (fromStretch + (toStretch - fromStretch) * step0)),
          (to.start.scaleY + (to.end.scaleY - to.start.scaleY) * step1) *
            (1 + stretchXY * (fromStretch + (toStretch - fromStretch) * step1)),
          (to.start.scaleY + (to.end.scaleY - to.start.scaleY) * step2) *
            (1 - stretchXY * (fromStretch + (toStretch - fromStretch) * step2)),
          to.end.scaleY
        ]
      })
    }
  ];

  //
  // Render
  //
  return <React.Fragment>{render(to)}</React.Fragment>;
}

shrinkAndGrowTransition.defaultProps = {
  easing: Easing.bezier(0.175, 0.885, 0.32, 1.275),
  useNativeDriver: true
};
