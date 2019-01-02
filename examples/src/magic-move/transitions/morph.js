/* eslint react/prop-types: 0 */
function resolveValue(value, def) {
  if (value !== undefined) return value;
  return def || 0;
}

const ANIMATABLE_STYLES = {
  // View
  borderRightColor: "transparent",
  borderBottomColor: "transparent",
  borderBottomWidth: 0,
  borderColor: "transparent",
  borderEndColor: "transparent",
  borderLeftColor: "transparent",
  borderLeftWidth: 0,
  backgroundColor: "transparent",
  borderRightWidth: 0,
  borderStartColor: "transparent",
  borderStyle: undefined,
  borderTopColor: "transparent",
  borderTopWidth: 0,
  borderWidth: 0,
  elevation: 0,
  // Text,
  color: "black"
  // fontWeight: undefined,
  // letterSpacing: undefined
  // Image
  // tintColor: undefined
  // overlayColor: undefined
};

export default function morphTransition({ from, to, interpolate, render }) {
  const { borderRadius = 0 } = to.style;

  //
  // Move & scale target component from source
  // position/size to the new position
  //
  to.style.transform = [
    { translateX: interpolate(to.start.x, to.end.x) },
    { translateY: interpolate(to.start.y, to.end.y) },
    { scaleX: interpolate(to.start.scaleX, to.end.scaleX) },
    { scaleY: interpolate(to.start.scaleY, to.end.scaleY) }
  ];

  //
  // Update opacity
  //
  to.style.opacity = interpolate(to.start.opacity, to.end.opacity);

  //
  // Change border-radius of target so that it looks
  // like the the shape of the source component.
  // The border-radius is calculated in such a way so
  // that it takes the scaling of the view also into
  // account in order to get as close as possible to the
  // same shape as the source component.
  //
  to.style.borderRadius = interpolate(
    Math.min((from.style.borderRadius || 0) / from.width, 0.5) *
      Math.max(to.height, to.width),
    borderRadius
  );
  to.style.borderTopLeftRadius = interpolate(
    Math.min(
      resolveValue(from.style.borderTopLeftRadius, from.style.borderRadius) /
        Math.min(from.width, from.height),
      0.5
    ) * Math.max(to.height, to.width),
    resolveValue(to.style.borderTopLeftRadius, borderRadius)
  );
  to.style.borderTopRightRadius = interpolate(
    Math.min(
      resolveValue(from.style.borderTopRightRadius, from.style.borderRadius) /
        Math.min(from.width, from.height),
      0.5
    ) * Math.max(to.height, to.width),
    resolveValue(to.style.borderTopRightRadius, borderRadius)
  );
  to.style.borderBottomLeftRadius = interpolate(
    Math.min(
      resolveValue(from.style.borderBottomLeftRadius, from.style.borderRadius) /
        Math.min(from.width, from.height),
      0.5
    ) * Math.max(to.height, to.width),
    resolveValue(to.style.borderBottomLeftRadius, borderRadius)
  );
  to.style.borderBottomRightRadius = interpolate(
    Math.min(
      resolveValue(
        from.style.borderBottomRightRadius,
        from.style.borderRadius
      ) / Math.min(from.width, from.height),
      0.5
    ) * Math.max(to.height, to.width),
    resolveValue(to.style.borderBottomRightRadius, borderRadius)
  );

  //
  // Morph other styles
  //
  Object.keys(ANIMATABLE_STYLES).forEach(styleName => {
    let toValue = to.style[styleName];
    let fromValue = from.style[styleName];
    if (toValue === undefined && fromValue === undefined) return;
    let defaultValue = ANIMATABLE_STYLES[styleName];
    defaultValue =
      defaultValue === undefined ? toValue || fromValue : defaultValue;
    toValue = toValue === undefined ? defaultValue : toValue;
    fromValue = fromValue === undefined ? defaultValue : fromValue;
    to.style[styleName] =
      toValue === fromValue ? toValue : interpolate(fromValue, toValue);
  });

  return render(to);
}
