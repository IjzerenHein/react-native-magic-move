/* eslint react/prop-types: 0 */
import { Easing } from "react-native";

export default function shrinkAndGrowTransition({
  from,
  to,
  animValue,
  render
}) {
  //
  // Calculate stuff
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
  const fromStretch = Math.min(distance / (Math.sqrt(fromVolume) * 4), 0.75);
  const toStretch = Math.min(distance / (Math.sqrt(toVolume) * 4), 0.75);
  const stretchXY = (Math.atan2(distanceY, distanceX) / Math.PI) * 2 - 0.5;

  //
  // Move & scale target component from starting
  // position/size to the ending position
  //
  const step0 = 0.1;
  const step1 = 0.95;
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
        inputRange: [0, step0, step1, 1.0, 1.2],
        outputRange: [
          to.start.scaleX,
          (to.start.scaleX + (to.end.scaleX - to.start.scaleX) * step0) *
            (1 - stretchXY * (fromStretch + (toStretch - fromStretch) * step0)),
          (to.start.scaleX + (to.end.scaleX - to.start.scaleX) * step1) *
            (1 - stretchXY * (fromStretch + (toStretch - fromStretch) * step1)),
          to.end.scaleX,
          1 + stretchXY
        ]
      })
    },
    {
      scaleY: animValue.interpolate({
        inputRange: [0, step0, step1, 1.0, 1.2],
        outputRange: [
          to.start.scaleY,
          (to.start.scaleY + (to.end.scaleY - to.start.scaleY) * step0) *
            (1 + stretchXY * (fromStretch + (toStretch - fromStretch) * step0)),
          (to.start.scaleY + (to.end.scaleY - to.start.scaleY) * step1) *
            (1 + stretchXY * (fromStretch + (toStretch - fromStretch) * step1)),
          to.end.scaleY,
          1 - stretchXY
        ]
      })
    }
  ];

  //
  // Render
  //
  return [render(to)];
}

shrinkAndGrowTransition.defaultProps = {
  useNativeDriver: true,
  nativeContentType: "snapshot",
  duration: 400,
  easing: Easing.elastic(1.5)
};
