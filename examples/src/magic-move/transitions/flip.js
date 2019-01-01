import React from "react";

function flipTransition(config, { from, to, animValue, render }) {
  const step = config.step || 0.5;

  function interpolateRotate(from, middle, to) {
    if (to === from) return to;
    return animValue.interpolate({
      inputRange: [0, step, 1],
      outputRange: [from, middle, to]
    });
  }

  // Flip and fade-out
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

  // Flip and fade-in
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

  // Render
  return (
    <React.Fragment>
      {render(from)}
      {render(to)}
    </React.Fragment>
  );
}

export default function createFlipTransition(config) {
  return (props, state, Context) =>
    flipTransition(config, props, state, Context);
}
