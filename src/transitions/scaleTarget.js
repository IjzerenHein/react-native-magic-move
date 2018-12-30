import React from "react";

function resolveValue(value, def) {
  if (value !== undefined) return value;
  return def || 0;
}

const ANIMATABLE_PROPS = {
  // Border-radius affects shape and has dedicated logic
  // borderRadius: 0,
  // borderBottomEndRadius: 0,
  // borderBottomLeftRadius: 0,
  // borderBottomRightRadius: 0,
  // borderBottomStartRadius: 0,
  // borderTopEndRadius: 0,
  // borderTopLeftRadius: 0,
  // borderTopRightRadius: 0,
  // borderTopStartRadius: 0,
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
  opacity: 1,
  elevation: 0,
  // Text,
  // fontSize: undefined,
  color: "black"
};

export default function scaleTarget(props, state, Context) {
  const { container, to, from, animValue } = state;

  function interpolate(from, to) {
    if (to === from) return to;
    return animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [from, to]
    });
  }

  const a = {
    width: to.width,
    height: to.height,
    from: {
      x: from.x - container.x - (to.width - from.width) / 2,
      y: from.y - container.y - (to.height - from.height) / 2,
      scaleX: from.width / to.width,
      scaleY: from.height / to.height,
      borderRadius:
        Math.min((from.borderRadius || 0) / from.width, 0.5) *
        Math.max(to.height, to.width),
      borderTopLeftRadius:
        Math.min(
          resolveValue(from.borderTopLeftRadius, from.borderRadius) /
            Math.min(from.width, from.height),
          0.5
        ) * Math.max(to.height, to.width),
      borderTopRightRadius:
        Math.min(
          resolveValue(from.borderTopRightRadius, from.borderRadius) /
            Math.min(from.width, from.height),
          0.5
        ) * Math.max(to.height, to.width),
      borderBottomLeftRadius:
        Math.min(
          resolveValue(from.borderBottomLeftRadius, from.borderRadius) /
            Math.min(from.width, from.height),
          0.5
        ) * Math.max(to.height, to.width),
      borderBottomRightRadius:
        Math.min(
          resolveValue(from.borderBottomRightRadius, from.borderRadius) /
            Math.min(from.width, from.height),
          0.5
        ) * Math.max(to.height, to.width)
    },
    to: {
      x: to.x - to.scene.x + from.scene.x - container.x,
      y: to.y - to.scene.y + from.scene.y - container.y,
      scaleX: 1,
      scaleY: 1,
      borderRadius: to.borderRadius || 0,
      borderTopLeftRadius: resolveValue(
        to.borderTopLeftRadius,
        to.borderRadius
      ),
      borderTopRightRadius: resolveValue(
        to.borderTopRightRadius,
        to.borderRadius
      ),
      borderBottomLeftRadius: resolveValue(
        to.borderBottomLeftRadius,
        to.borderRadius
      ),
      borderBottomRightRadius: resolveValue(
        to.borderBottomRightRadius,
        to.borderRadius
      )
    }
  };
  const newStyle = {
    position: "absolute",
    width: a.width,
    height: a.height,
    left: 0,
    top: 0,
    transform: [
      { translateX: interpolate(a.from.x, a.to.x) },
      { translateY: interpolate(a.from.y, a.to.y) },
      { scaleX: interpolate(a.from.scaleX, a.to.scaleX) },
      { scaleY: interpolate(a.from.scaleY, a.to.scaleY) }
    ],
    borderRadius: interpolate(a.from.borderRadius, a.to.borderRadius),
    borderTopLeftRadius: interpolate(
      a.from.borderTopLeftRadius,
      a.to.borderTopLeftRadius
    ),
    borderTopRightRadius: interpolate(
      a.from.borderTopRightRadius,
      a.to.borderTopRightRadius
    ),
    borderBottomLeftRadius: interpolate(
      a.from.borderBottomLeftRadius,
      a.to.borderBottomLeftRadius
    ),
    borderBottomRightRadius: interpolate(
      a.from.borderBottomRightRadius,
      a.to.borderBottomRightRadius
    ),
    margin: 0,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0
  };
  Object.keys(ANIMATABLE_PROPS).forEach(propName => {
    let toProp = to[propName];
    let fromProp = from[propName];
    if (toProp === undefined && fromProp === undefined) return;
    let defaultValue = ANIMATABLE_PROPS[propName];
    defaultValue =
      defaultValue === undefined ? toProp || fromProp : defaultValue;
    toProp = toProp === undefined ? defaultValue : toProp;
    fromProp = fromProp === undefined ? defaultValue : fromProp;
    newStyle[propName] =
      toProp === fromProp ? toProp : interpolate(fromProp, toProp);
  });
  const {
    children,
    debug,
    style,
    AnimatedComponent,
    ...otherProps
  } = props.to.props;
  delete otherProps.id;
  delete otherProps.Component;
  delete otherProps.useNativeDriver;
  delete otherProps.keepHidden;
  delete otherProps.duration;
  delete otherProps.delay;
  delete otherProps.easing;
  delete otherProps.transition;
  if (debug) {
    newStyle.opacity = 0.8;
  }
  return (
    <AnimatedComponent style={[style, newStyle]} {...otherProps}>
      {children ? (
        <Context.Provider value={true}>{children}</Context.Provider>
      ) : (
        undefined
      )}
    </AnimatedComponent>
  );
}
