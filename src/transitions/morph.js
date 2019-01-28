/* eslint react/prop-types: 0 */

function resolveValue(value, def) {
  if (value !== undefined) return value;
  return def || 0;
}

export default function morphTransition({
  from,
  to,
  interpolate,
  animValue,
  render
}) {
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
  from.style.opacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [from.start.opacity, 0]
  });

  //
  // Change border-radius of source so that it looks
  // like the the shape of the target component.
  // The border-radius is calculated using a volumetric
  // approach that takes the scaling of the view into
  // account in order to get as close as possible to the
  // same shape as the target component.
  //
  const interpolateFromBorderRadius = name => {
    const sR = resolveValue(from.style[name], from.style.borderRadius);
    const eR = resolveValue(to.style[name], to.style.borderRadius);
    const p4 = Math.PI / 4;
    const eR2 = eR * eR;
    const eV = eR2 - p4 * eR2;
    const sV = eV / (from.end.scaleX * from.end.scaleY);
    const cR = Math.sqrt(sV / ((p4 - 1) * -1));
    return interpolate(sR, cR);
  };
  const fromBorderRadiusStyles = {
    borderRadius: interpolateFromBorderRadius("borderRadius"),
    borderTopLeftRadius: interpolateFromBorderRadius("borderTopLeftRadius"),
    borderTopRightRadius: interpolateFromBorderRadius("borderTopRightRadius"),
    borderBottomLeftRadius: interpolateFromBorderRadius(
      "borderBottomLeftRadius"
    ),
    borderBottomRightRadius: interpolateFromBorderRadius(
      "borderBottomRightRadius"
    )
  };

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
  to.style.opacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, to.end.opacity]
  });

  //
  // Change border-radius of target so that it looks
  // like the the shape of the source component.
  // The border-radius is calculated using a volumetric
  // approach that takes the scaling of the view into
  // account in order to get as close as possible to the
  // same shape as the source component.
  //
  const interpolateToBorderRadius = name => {
    const sR = resolveValue(from.style[name], from.style.borderRadius);
    const eR = resolveValue(to.style[name], to.style.borderRadius);
    const p4 = Math.PI / 4;
    const sR2 = sR * sR;
    const sV = sR2 - p4 * sR2;
    const eV = sV / (to.start.scaleX * to.start.scaleY);
    const cR = Math.sqrt(eV / ((p4 - 1) * -1));
    return interpolate(cR, eR);
  };
  const toBorderRadiusStyles = {
    borderRadius: interpolateToBorderRadius("borderRadius"),
    borderTopLeftRadius: interpolateToBorderRadius("borderTopLeftRadius"),
    borderTopRightRadius: interpolateToBorderRadius("borderTopRightRadius"),
    borderBottomLeftRadius: interpolateToBorderRadius("borderBottomLeftRadius"),
    borderBottomRightRadius: interpolateToBorderRadius(
      "borderBottomRightRadius"
    )
  };

  //
  // Merge border-radius styles
  //
  from.style = {
    ...from.style,
    ...fromBorderRadiusStyles
  };
  to.style = {
    ...to.style,
    ...toBorderRadiusStyles
  };

  //
  // Render
  //
  return [render(to), render(from)];
}

morphTransition.defaultProps = {
  useNativeDriver: true,
  nativeContentType: "snapshot"
};
