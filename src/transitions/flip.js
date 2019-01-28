/* eslint react/prop-types: 0 */

export default function flipTransition(
  { from, to, animValue, interpolate, render },
  flipXCount,
  flipYCount
) {
  //
  // Calculate rotation interpolation based on count
  //
  function interpolateRotate(isTarget, count) {
    if (!count) return "0deg";
    const inputRange = [0];
    const outputRange = [isTarget ? "180deg" : "0deg"];
    const stepCount = count * 2 - 1;
    let stepIndex = 0;
    for (let i = 1; i < count; i++) {
      stepIndex++;
      inputRange.push(stepIndex / stepCount);
      outputRange.push(isTarget ? "360deg" : "180deg");
      inputRange.push(stepIndex / stepCount);
      outputRange.push(isTarget ? "0deg" : "180deg");
      stepIndex++;
      inputRange.push(stepIndex / stepCount);
      outputRange.push(isTarget ? "180deg" : "360deg");
      inputRange.push(stepIndex / stepCount);
      outputRange.push(isTarget ? "180deg" : "0deg");
    }
    inputRange.push(1);
    outputRange.push(isTarget ? "0deg" : "180deg");
    return animValue.interpolate({
      inputRange,
      outputRange
    });
  }

  //
  // Calculate x or y flip based on vector
  //
  if (flipXCount === undefined) {
    const fromCenterX = from.start.x + from.width / 2;
    const fromCenterY = from.start.y + from.height / 2;
    const toCenterX = to.end.x + to.width / 2;
    const toCenterY = to.end.y + to.height / 2;
    const distanceX = Math.abs(fromCenterX - toCenterX);
    const distanceY = Math.abs(fromCenterY - toCenterY);
    flipXCount = distanceY >= distanceX ? 1 : 0;
    flipYCount = flipXCount ? 0 : 1;
  }

  //
  // Move & scale source component from start
  // position/size to the ending position
  //
  from.style.transform = [
    { translateX: interpolate(from.start.x, from.end.x, true) },
    { translateY: interpolate(from.start.y, from.end.y, true) },
    { scaleX: interpolate(from.start.scaleX, from.end.scaleX) },
    { scaleY: interpolate(from.start.scaleY, from.end.scaleY) },
    { rotateX: interpolateRotate(false, flipXCount) },
    { rotateY: interpolateRotate(false, flipYCount) }
  ];
  from.style.backfaceVisibility = "hidden";

  //
  // Move & scale target component from starting
  // position/size to the ending position
  //
  to.style.transform = [
    { translateX: interpolate(to.start.x, to.end.x, true) },
    { translateY: interpolate(to.start.y, to.end.y, true) },
    { scaleX: interpolate(to.start.scaleX, to.end.scaleX) },
    { scaleY: interpolate(to.start.scaleY, to.end.scaleY) },
    { rotateX: interpolateRotate(true, flipXCount) },
    { rotateY: interpolateRotate(true, flipYCount) }
  ];
  to.style.backfaceVisibility = "hidden";

  //
  // Render
  //
  return [render(to), render(from)];
}

flipTransition.defaultProps = {
  useNativeDriver: true,
  nativeContentType: "snapshotImage"
};

function createFlipTransition({ x, y }) {
  const func = function(component) {
    return flipTransition(component, x, y);
  };
  func.defaultProps = flipTransition.defaultProps;
  return func;
}

flipTransition.x = createFlipTransition({ x: 1, y: 0 });
flipTransition.y = createFlipTransition({ x: 0, y: 1 });
flipTransition.xy = createFlipTransition({ x: 1, y: 1 });
flipTransition.create = createFlipTransition;
