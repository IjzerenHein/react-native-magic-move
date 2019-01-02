/* eslint react/prop-types: 0 */
import React from "react";

export default function shrinkAndGrowTransition({
  from,
  to,
  interpolate,
  render
}) {
  //
  // Move & scale source component from start
  // position/size to the ending position
  //
  from.style.transform = [
    { translateX: from.start.x },
    { translateY: from.start.y },
    { scaleX: interpolate(1, 0.01) },
    { scaleY: interpolate(1, 0.01) }
  ];
  // from.style.opacity = interpolate(1, 0);

  //
  // Move & scale target component from starting
  // position/size to the ending position
  //
  to.style.transform = [
    { translateX: to.end.x },
    { translateY: to.end.y },
    { scaleX: interpolate(0, 1) },
    { scaleY: interpolate(0, 1) }
  ];
  // to.style.opacity = interpolate(0, 1);

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
