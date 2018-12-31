import React from "react";

function flipTransition(config, props, state, Context) {
  const { container, to, from, animValue } = state;
  const step = config.step || 0.5;

  function interpolate(from, to) {
    if (to === from) return to;
    return animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [from, to]
    });
  }

  function interpolateRotate(from, middle, to) {
    if (to === from) return to;
    return animValue.interpolate({
      inputRange: [0, step, 1],
      outputRange: [from, middle, to]
    });
  }

  const fromComponent = (function() {
    const a = {
      width: from.width,
      height: from.height,
      from: {
        x: from.x - container.x,
        y: from.y - container.y,
        scaleX: 1,
        scaleY: 1
      },
      to: {
        x:
          to.x -
          to.scene.x +
          from.scene.x -
          container.x -
          (from.width - to.width) / 2,
        y:
          to.y -
          to.scene.y +
          from.scene.y -
          container.y -
          (from.height - to.height) / 2,
        scaleX: to.width / from.width,
        scaleY: to.height / from.height
      }
    };
    const newStyle = {
      position: "absolute",
      width: a.width,
      height: a.height,
      left: 0,
      top: 0,
      opacity: animValue.interpolate({
        inputRange: [0, step, step, 1],
        outputRange: [1, 1, 0, 0]
      }),
      transform: [
        { translateX: interpolate(a.from.x, a.to.x) },
        { translateY: interpolate(a.from.y, a.to.y) },
        { scaleX: interpolate(a.from.scaleX, a.to.scaleX) },
        { scaleY: interpolate(a.from.scaleY, a.to.scaleY) },
        {
          rotateX: config.x
            ? interpolateRotate("0deg", "90deg", "180deg")
            : "0deg"
        },
        {
          rotateY: config.y
            ? interpolateRotate("0deg", "90deg", "180deg")
            : "0deg"
        }
      ],
      margin: 0,
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0
    };
    const {
      AnimatedComponent,
      children,
      style,
      ...otherProps
    } = props.from.props; //eslint-disable-line
    delete otherProps.id;
    delete otherProps.Component;
    delete otherProps.useNativeDriver;
    delete otherProps.keepHidden;
    delete otherProps.duration;
    delete otherProps.delay;
    delete otherProps.easing;
    delete otherProps.transition;

    return (
      <AnimatedComponent
        style={[style, newStyle]}
        {...otherProps}
        backfaceVisibility={"hidden"}
      >
        {children}
      </AnimatedComponent>
    );
  })();

  const toComponent = (function() {
    const a = {
      width: to.width,
      height: to.height,
      from: {
        x: from.x - container.x - (to.width - from.width) / 2,
        y: from.y - container.y - (to.height - from.height) / 2,
        scaleX: from.width / to.width,
        scaleY: from.height / to.height
      },
      to: {
        x: to.x - to.scene.x + from.scene.x - container.x,
        y: to.y - to.scene.y + from.scene.y - container.y,
        scaleX: 1,
        scaleY: 1
      }
    };
    const newStyle = {
      position: "absolute",
      width: a.width,
      height: a.height,
      left: 0,
      top: 0,
      opacity: animValue.interpolate({
        inputRange: [0, step, step, 1],
        outputRange: [0, 0, 1, 1]
      }),
      transform: [
        { translateX: interpolate(a.from.x, a.to.x) },
        { translateY: interpolate(a.from.y, a.to.y) },
        { scaleX: interpolate(a.from.scaleX, a.to.scaleX) },
        { scaleY: interpolate(a.from.scaleY, a.to.scaleY) },
        {
          rotateX: config.x
            ? interpolateRotate("180deg", "90deg", "0deg")
            : "0deg"
        },
        {
          rotateY: config.y
            ? interpolateRotate("180deg", "90deg", "0deg")
            : "0deg"
        }
      ],
      margin: 0,
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0
    };
    const {
      AnimatedComponent,
      children,
      style,
      ...otherProps
    } = props.to.props; //eslint-disable-line
    delete otherProps.id;
    delete otherProps.Component;
    delete otherProps.useNativeDriver;
    delete otherProps.keepHidden;
    delete otherProps.duration;
    delete otherProps.delay;
    delete otherProps.easing;
    delete otherProps.transition;

    return (
      <AnimatedComponent
        style={[style, newStyle]}
        {...otherProps}
        backfaceVisibility={"hidden"}
      >
        {children}
      </AnimatedComponent>
    );
  })();

  return (
    <Context.Provider value={true}>
      {fromComponent}
      {toComponent}
    </Context.Provider>
  );
}

export default function createFlipTransition(config) {
  return (props, state, Context) =>
    flipTransition(config, props, state, Context);
}
