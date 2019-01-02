/* globals Promise, __DEV__ */
import React, { PureComponent, createContext } from "react";
import { Animated, Text, Easing } from "react-native";
import PropTypes from "prop-types";

const MagicMoveAnimationContext = createContext(undefined);

const defaultEasingFn = Easing.inOut(Easing.ease);

function measureLayout(id, name, ref) {
  let i = 0;
  return new Promise((resolve, reject) => {
    function onMeasure(x, y, width, height, pageX, pageY) {
      if (width || height) {
        return resolve({
          x: pageX,
          y: pageY,
          width,
          height
        });
      }
      i++;
      if (x === undefined || i >= 3)
        return reject(
          new Error(
            'Failed to measure MagicMove component "' + id + '" (' + name + ")"
          )
        );
      requestAnimationFrame(() => {
        ref.measure(onMeasure);
      });
    }
    ref.measure(onMeasure);
  });
}

function resolveValue(value, def, other = 0) {
  if (value !== undefined) return value;
  return def || other;
}

/**
 * 1. Hide to component
 * 2. Get layout to and from component
 * 3. Render MagicMove component
 * 4. Hide from component
 * 5. Animate...
 * 6. Show to component
 * 7. Remove MagicMove component
 */
class MagicMoveAnimation extends PureComponent {
  static propTypes = {
    containerRef: PropTypes.object.isRequired,
    from: PropTypes.object.isRequired,
    to: PropTypes.object.isRequired,
    onCompleted: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      animValue: new Animated.Value(0),
      container: undefined,
      from: undefined,
      to: undefined
    };

    //
    // 1. Hide real to component
    //
    props.to.setOpacity(0.0);
  }

  componentDidMount() {
    //
    // 2a. Get layout for from position
    //
    const { to, from, containerRef, onCompleted } = this.props;
    const { id } = to.props;
    function errorHandler(err) {
      if (__DEV__) {
        console.error(err.message); //eslint-disable-line
      } else {
        console.warn(err.message); //eslint-disable-line
      }
      to.setOpacity(1);
      from.setOpacity(1);
      onCompleted();
    }
    Promise.all([
      measureLayout(id, "container", containerRef),
      measureLayout(id, "from", from.getRef()),
      measureLayout(id, "fromScene", from.getSceneRef() || containerRef)
    ])
      .then(layouts => {
        this.setState({
          container: layouts[0],
          from: {
            ...layouts[1],
            style: from.getStyle(),
            scene: layouts[2]
          }
        });
      })
      .catch(errorHandler);

    //
    // 2b. Get layout for to position (this may take slightly longer as the
    //     new component has not been fully rendered/mounted yet.
    //
    Promise.all([
      measureLayout(id, "to", to.getRef()),
      measureLayout(id, "toScene", to.getSceneRef() || containerRef)
    ])
      .then(layouts => {
        this.setState({
          to: {
            ...layouts[0],
            style: to.getStyle(),
            scene: layouts[1]
          }
        });
      })
      .catch(errorHandler);
  }

  renderChildren(children) {
    if (!children) return;
    return (
      <MagicMoveAnimationContext.Provider value={true}>
        {children}
      </MagicMoveAnimationContext.Provider>
    );
  }

  renderDebugFrom() {
    if (!this.props.to.props.debug) return;
    const { container, from } = this.state;
    if (!container || !from) return;
    return (
      <Animated.View
        key={`${this.props.from.props.id}.debugFrom`}
        style={{
          position: "absolute",
          width: from.width,
          height: from.height,
          left: from.x - container.x,
          top: from.y - container.y,
          backgroundColor: "rgba(0, 0, 255, 0.1)",
          borderColor: "royalblue",
          borderWidth: 1,
          borderStyle: "dashed",
          borderTopRightRadius: resolveValue(
            from.style.borderTopRightRadius,
            from.style.borderRadius
          ),
          borderTopLeftRadius: resolveValue(
            from.style.borderTopLeftRadius,
            from.style.borderRadius
          ),
          borderBottomLeftRadius: resolveValue(
            from.style.borderBottomLeftRadius,
            from.style.borderRadius
          ),
          borderBottomRightRadius: resolveValue(
            from.style.borderBottomRightRadius,
            from.style.borderRadius
          ),
          opacity: 0.8,
          justifyContent: "center"
        }}
      >
        <Text style={{ color: "royalblue", textAlign: "center" }}>From</Text>
      </Animated.View>
    );
  }

  renderDebugTo() {
    if (!this.props.to.props.debug) return;
    const { container, from, to } = this.state;
    if (!container || !from || !to) return;
    return (
      <Animated.View
        key={`${this.props.to.props.id}.debugTo`}
        style={{
          position: "absolute",
          width: to.width,
          height: to.height,
          left: to.x - to.scene.x + from.scene.x - container.x,
          top: to.y - to.scene.y + from.scene.y - container.y,
          backgroundColor: "rgba(0, 255, 0, 0.1)",
          borderColor: "green",
          borderWidth: 1,
          borderStyle: "dashed",
          borderTopRightRadius: resolveValue(
            to.style.borderTopRightRadius,
            to.style.borderRadius
          ),
          borderTopLeftRadius: resolveValue(
            to.style.borderTopLeftRadius,
            to.style.borderRadius
          ),
          borderBottomLeftRadius: resolveValue(
            to.style.borderBottomLeftRadius,
            to.style.borderRadius
          ),
          borderBottomRightRadius: resolveValue(
            to.style.borderBottomRightRadius,
            to.style.borderRadius
          ),
          opacity: 0.8,
          justifyContent: "center"
        }}
      >
        <Text style={{ color: "green", textAlign: "center" }}>To</Text>
      </Animated.View>
    );
  }

  renderInitialFrom() {
    const { container, from } = this.state;
    if (!container || !from) return;
    const {
      children,
      style,
      AnimatedComponent,
      ...otherProps
    } = this.props.from.props;
    delete otherProps.id;
    delete otherProps.debug;
    delete otherProps.Component;
    delete otherProps.useNativeDriver;
    delete otherProps.keepHidden;
    delete otherProps.duration;
    delete otherProps.delay;
    delete otherProps.easing;
    delete otherProps.transition;
    return (
      <AnimatedComponent
        key={`${this.props.from.props.id}.initialFrom`}
        style={[
          style,
          {
            position: "absolute",
            width: from.width,
            height: from.height,
            left: from.x - container.x,
            top: from.y - container.y,
            transform: [],
            margin: 0,
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0
          }
        ]}
        {...otherProps}
      >
        {this.renderChildren(children)}
      </AnimatedComponent>
    );
  }

  interpolate = (from, to) => {
    if (to === from) return to;
    return this.state.animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [from, to]
    });
  };

  static renderComponent(a) {
    const { AnimatedComponent, children, ...otherProps } = a.props;
    delete otherProps.style;
    delete otherProps.id;
    delete otherProps.Component;
    delete otherProps.useNativeDriver;
    delete otherProps.keepHidden;
    delete otherProps.duration;
    delete otherProps.delay;
    delete otherProps.easing;
    delete otherProps.transition;
    delete otherProps.debug;

    return (
      <AnimatedComponent style={a.style} {...otherProps}>
        {children ? (
          <MagicMoveAnimationContext.Provider value={true}>
            {children}
          </MagicMoveAnimationContext.Provider>
        ) : (
          undefined
        )}
      </AnimatedComponent>
    );
  }

  createComponentStyle(a) {
    return {
      ...a.initial.style,
      position: "absolute",
      width: a.width,
      height: a.height,
      left: 0,
      top: 0,
      transform: [
        { translateX: this.interpolate(a.start.x, a.end.x) },
        { translateY: this.interpolate(a.start.y, a.end.y) },
        { scaleX: this.interpolate(a.start.scaleX, a.end.scaleX) },
        { scaleY: this.interpolate(a.start.scaleY, a.end.scaleY) }
      ],
      margin: 0,
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0
    };
  }

  renderAnimation() {
    const { container, to, from, animValue } = this.state;
    if (!container || !from || !to) return;

    const source = {
      width: from.width,
      height: from.height,
      start: {
        x: from.x - container.x,
        y: from.y - container.y,
        scaleX: 1,
        scaleY: 1
      },
      end: {
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
      },
      initial: from,
      props: {
        ...this.props.from.props
      }
    };
    source.style = this.createComponentStyle(source);

    const dest = {
      width: to.width,
      height: to.height,
      start: {
        x: from.x - container.x - (to.width - from.width) / 2,
        y: from.y - container.y - (to.height - from.height) / 2,
        scaleX: from.width / to.width,
        scaleY: from.height / to.height
      },
      end: {
        x: to.x - to.scene.x + from.scene.x - container.x,
        y: to.y - to.scene.y + from.scene.y - container.y,
        scaleX: 1,
        scaleY: 1
      },
      initial: to,
      props: {
        ...this.props.to.props
      }
    };
    dest.style = this.createComponentStyle(dest);

    return this.props.to.props.transition({
      from: source,
      to: dest,
      animValue,
      Context: MagicMoveAnimationContext,
      render: MagicMoveAnimation.renderComponent,
      interpolate: this.interpolate
    });
  }

  render() {
    const { to } = this.state;
    return (
      <>
        {this.renderDebugFrom()}
        {this.renderDebugTo()}
        {to ? this.renderAnimation() : this.renderInitialFrom()}
      </>
    );
  }

  componentDidUpdate() {
    const { animValue, container, to, from } = this.state;

    //
    // 4. Hide from component
    //
    if (container && from && !this._isFromHidden) {
      this._isFromHidden = true;
      this.props.from.setOpacity(0);
    }

    //
    // 5. Animate...
    //
    if (container && from && to && !this._isAnimationStarted) {
      this._isAnimationStarted = true;
      const toProps = this.props.to.props;
      if (toProps.debug) {
        // eslint-disable-next-line
        console.debug(
          '[MagicMove] Animating component with id "' + toProps.id + '"...'
        );
      }
      Animated.timing(animValue, {
        toValue: 1,
        duration: toProps.debug ? 8000 : toProps.duration,
        delay: toProps.delay,
        easing: toProps.easing,
        useNativeDriver: toProps.useNativeDriver
      }).start(() => {
        const { to, from, onCompleted } = this.props;
        if (to.props.debug) {
          // eslint-disable-next-line
          console.debug(
            '[MagicMove] Animating component with id "' +
              to.props.id +
              '"... DONE'
          );
        }
        to.setOpacity(1);
        if (!from.props.keepHidden) {
          from.setOpacity(1);
        }
        onCompleted();
      });
    }
  }
}

MagicMoveAnimation.Context = MagicMoveAnimationContext;

export default MagicMoveAnimation;
