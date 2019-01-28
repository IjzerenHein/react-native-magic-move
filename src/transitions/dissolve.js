/* eslint react/prop-types: 0 */

export default function dissolveTransition({ from, to, interpolate, render }) {
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
  from.style.opacity = interpolate(from.start.opacity, 0);

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
  to.style.opacity = interpolate(0, to.end.opacity);

  //
  // Render
  //
  return [render(to), render(from)];
}

dissolveTransition.defaultProps = {
  useNativeDriver: true,
  nativeContentType: "snapshot"
};
