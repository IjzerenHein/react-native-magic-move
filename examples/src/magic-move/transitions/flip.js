/* eslint react/prop-types: 0 */
import React from "react";

function flipTransition(config, { from, to, animValue, interpolate, render }) {
  const step = config.step || 0.5;

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
    { translateX: interpolate(from.start.x, from.end.x) },
    { translateY: interpolate(from.start.y, from.end.y) },
    { scaleX: interpolate(from.start.scaleX, from.end.scaleX) },
    { scaleY: interpolate(from.start.scaleY, from.end.scaleY) }
  ];

  //
  // Move & scale target component from starting
  // position/size to the ending position
  //
  to.style.transform = [
    { translateX: interpolate(to.start.x, to.end.x) },
    { translateY: interpolate(to.start.y, to.end.y) },
    { scaleX: interpolate(to.start.scaleX, to.end.scaleX) },
    { scaleY: interpolate(to.start.scaleY, to.end.scaleY) }
  ];

  //
  // Flip and hide source component
  //
  from.style.opacity = animValue.interpolate({
    inputRange: [0, step, step, 1],
    outputRange: [1, 1, 0, 0]
  });
  if (config.x)
    from.style.transform.push({
      rotateX: interpolateRotate("0deg", "90deg", "180deg")
    });
  if (config.y)
    from.style.transform.push({
      rotateY: interpolateRotate("0deg", "90deg", "180deg")
    });
  from.props.backfaceVisibility = "hidden";

  //
  // Flip and show target component
  //
  to.style.opacity = animValue.interpolate({
    inputRange: [0, step, step, 1],
    outputRange: [0, 0, 1, 1]
  });
  if (config.x)
    to.style.transform.push({
      rotateX: interpolateRotate("180deg", "90deg", "0deg")
    });
  if (config.y)
    to.style.transform.push({
      rotateY: interpolateRotate("180deg", "90deg", "0deg")
    });
  to.props.backfaceVisibility = "hidden";

  //
  // Render
  //
  return (
    <React.Fragment>
      {render(from)}
      {render(to)}
    </React.Fragment>
  );
}

flipTransition.defaultProps = {
  useNativeDriver: true
};

export default function createFlipTransition(config) {
  return (props, state, Context) =>
    flipTransition(config, props, state, Context);
}
