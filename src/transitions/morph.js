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

export default function morphTransition({
  from,
  to,
  interpolate,
  render,
  onCanUseNativeDriver
}) {
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
  // The border-radius is calculated using a volumetric
  // approach that takes the scaling of the view into
  // account in order to get as close as possible to the
  // same shape as the source component.
  //
  const toBorderRadius = to.style.borderRadius;
  const interpolateBorderRadius = name => {
    const sR = resolveValue(from.style[name], from.style.borderRadius);
    const eR = resolveValue(to.style[name], toBorderRadius);
    const p4 = Math.PI / 4;
    const sR2 = sR * sR;
    const sV = sR2 - p4 * sR2;
    const eV = sV / (to.start.scaleX * to.start.scaleY);
    const cR = Math.sqrt(eV / ((p4 - 1) * -1));
    return interpolate(cR, eR);
  };
  to.style.borderRadius = interpolateBorderRadius("borderRadius");
  to.style.borderTopLeftRadius = interpolateBorderRadius("borderTopLeftRadius");
  to.style.borderTopRightRadius = interpolateBorderRadius(
    "borderTopRightRadius"
  );
  to.style.borderBottomLeftRadius = interpolateBorderRadius(
    "borderBottomLeftRadius"
  );
  to.style.borderBottomRightRadius = interpolateBorderRadius(
    "borderBottomRightRadius"
  );

  //
  // Morph other styles
  //
  let canUseNativeDriver = true;
  Object.keys(ANIMATABLE_STYLES).forEach(styleName => {
    let toValue = to.style[styleName];
    let fromValue = from.style[styleName];
    if (toValue === undefined && fromValue === undefined) return;
    let defaultValue = ANIMATABLE_STYLES[styleName];
    defaultValue =
      defaultValue === undefined ? toValue || fromValue : defaultValue;
    toValue = toValue === undefined ? defaultValue : toValue;
    fromValue = fromValue === undefined ? defaultValue : fromValue;
    if (toValue !== fromValue) {
      canUseNativeDriver = false;
      to.style[styleName] = interpolate(fromValue, toValue);
    } else {
      to.style[styleName] = toValue;
    }
  });
  onCanUseNativeDriver(canUseNativeDriver);

  return render(to);
}
