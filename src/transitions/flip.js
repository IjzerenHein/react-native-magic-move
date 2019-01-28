/* eslint react/prop-types: 0 */

export default function flipTransition(
  { from, to, animValue, interpolate, render },
  flipX,
  flipY
) {
  //
  // Calculate stuff
  //
  const step = 0.5;
  if (flipX === undefined) {
    const fromCenterX = from.start.x + from.width / 2;
    const fromCenterY = from.start.y + from.height / 2;
    const toCenterX = to.end.x + to.width / 2;
    const toCenterY = to.end.y + to.height / 2;
    const distanceX = Math.abs(fromCenterX - toCenterX);
    const distanceY = Math.abs(fromCenterY - toCenterY);
    flipX = distanceY >= distanceX ? 180 : 0;
    flipY = flipX ? 0 : 180;
  } else {
    flipX = flipX ? 180 : 0;
    flipY = flipY ? 180 : 0;
  }

  function interpolateRotate(from, middle, to) {
    if (to === from) return to;
    return animValue.interpolate({
      inputRange: [0, step, 1],
      outputRange: [from, middle, to]
    });
  }

  //
  // Move & scale source component from start
  // position/size to the ending position
  //
  from.style.transform = [
    { translateX: interpolate(from.start.x, from.end.x, true) },
    { translateY: interpolate(from.start.y, from.end.y, true) },
    { scaleX: interpolate(from.start.scaleX, from.end.scaleX) },
    { scaleY: interpolate(from.start.scaleY, from.end.scaleY) }
  ];

  //
  // Move & scale target component from starting
  // position/size to the ending position
  //
  to.style.transform = [
    { translateX: interpolate(to.start.x, to.end.x, true) },
    { translateY: interpolate(to.start.y, to.end.y, true) },
    { scaleX: interpolate(to.start.scaleX, to.end.scaleX) },
    { scaleY: interpolate(to.start.scaleY, to.end.scaleY) }
  ];

  //
  // Flip and hide source component
  //
  from.style.opacity = animValue.interpolate({
    inputRange: [0, step, step, 1],
    outputRange: [from.start.opacity, from.start.opacity, 0, 0]
  });
  if (flipX)
    from.style.transform.push({
      rotateX: interpolateRotate("0deg", flipX / 2 + "deg", flipX + "deg")
    });
  if (flipY)
    from.style.transform.push({
      rotateY: interpolateRotate("0deg", flipY / 2 + "deg", flipY + "180deg")
    });
  from.style.backfaceVisibility = "hidden";

  //
  // Flip and show target component
  //
  to.style.opacity = animValue.interpolate({
    inputRange: [0, step, step, 1],
    outputRange: [0, 0, to.end.opacity, to.end.opacity]
  });
  if (flipX)
    to.style.transform.push({
      rotateX: interpolateRotate(flipX + "deg", flipX / 2 + "deg", "0deg")
    });
  if (flipY)
    to.style.transform.push({
      rotateY: interpolateRotate(flipY + "deg", flipY / 2 + "deg", "0deg")
    });
  to.style.backfaceVisibility = "hidden";

  //
  // Render
  //
  return [render(to), render(from)];
}

flipTransition.defaultProps = {
  useNativeDriver: true,
  nativeContentType: "snapshot"
};

function createFlipTransition(x, y) {
  const func = function(component) {
    return flipTransition(component, x, y);
  };
  func.defaultProps = flipTransition.defaultProps;
  return func;
}

flipTransition.x = createFlipTransition(true, false);
flipTransition.y = createFlipTransition(false, true);
flipTransition.xy = createFlipTransition(true, true);
