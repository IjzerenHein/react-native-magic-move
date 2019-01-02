/* eslint react/prop-types: 0 */

export default function scaleTransition({ to, interpolate, render }) {
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
  // Render
  //
  return render(to);
}

scaleTransition.defaultProps = {
  useNativeDriver: true
};
