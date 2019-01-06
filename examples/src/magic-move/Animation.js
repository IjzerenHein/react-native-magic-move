/* globals Promise */
import React, { PureComponent, createContext } from "react";
import { Animated, Text, Easing } from "react-native";
import PropTypes from "prop-types";
import defaultTransition from "./transitions/morph";

const MagicMoveAnimationContext = createContext({
  isClone: false,
  isTarget: false
});

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
          new Error(`[MagicMove] Failed to measure component "${id}" (${name})`)
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
    if (this.debug) {
      //eslint-disable-next-line
      console.debug(`[MagicMove] Hiding target ${props.to.debugName}`);
    }
    props.to.setOpacity(0.0);
  }

  get debug() {
    return this.props.from.props.debug || this.props.to.props.debug;
  }

  componentDidMount() {
    //
    // 2a. Get layout for from position
    //
    const { to, from, containerRef, onCompleted } = this.props;
    const { id } = to.props;
    function errorHandler(err) {
      console.error(err.message); //eslint-disable-line
      to.setOpacity(undefined);
      from.setOpacity(undefined);
      onCompleted();
    }
    Promise.all([
      measureLayout(id, "container", containerRef),
      measureLayout(id, "from", from.getRef()),
      measureLayout(id, "fromScene", from.getSceneRef() || containerRef)
    ])
      .then(layouts => {
        // console.log(layouts[1], layouts[2]);
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
        {children ? (
          <MagicMoveAnimationContext.Provider
            value={{ isClone: true, isTarget: false }}
          >
            {children}
          </MagicMoveAnimationContext.Provider>
        ) : (
          undefined
        )}
      </AnimatedComponent>
    );
  }

  interpolate = (from, to, clamp) => {
    if (to === from) return to;
    if (clamp) {
      return this.state.animValue.interpolate({
        inputRange: [-0.1, 0, 1, 1.1],
        outputRange: [from, from, to, to]
      });
    } else {
      return this.state.animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [from, to]
      });
    }
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
          <MagicMoveAnimationContext.Provider
            value={{ isClone: true, isTarget: a.isTarget }}
          >
            {children}
          </MagicMoveAnimationContext.Provider>
        ) : (
          undefined
        )}
      </AnimatedComponent>
    );
  }

  createComponentStyle(a, x, y) {
    return {
      ...a.initial.style,
      position: "absolute",
      width: a.width,
      height: a.height,
      left: 0,
      top: 0,
      transform: [{ translateX: x }, { translateY: y }],
      margin: 0,
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0
    };
  }

  getTransition() {
    return (
      this.props.to.props.transition ||
      this.props.from.props.transition ||
      defaultTransition
    );
  }

  renderAnimation() {
    const { container, to, from, animValue } = this.state;
    if (!container || !from || !to) return;

    const source = {
      isTarget: false,
      width: from.width,
      height: from.height,
      start: {
        x: from.x - container.x,
        y: from.y - container.y,
        scaleX: 1,
        scaleY: 1,
        opacity: from.style.opacity !== undefined ? from.style.opacity : 1
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
        scaleY: to.height / from.height,
        opacity: to.style.opacity !== undefined ? to.style.opacity : 1
      },
      initial: from,
      props: {
        ...this.props.from.props
      }
    };
    source.style = this.createComponentStyle(
      source,
      source.start.x,
      source.start.y
    );

    const dest = {
      isTarget: true,
      width: to.width,
      height: to.height,
      start: {
        x: from.x - container.x - (to.width - from.width) / 2,
        y: from.y - container.y - (to.height - from.height) / 2,
        scaleX: from.width / to.width,
        scaleY: from.height / to.height,
        opacity: from.style.opacity !== undefined ? from.style.opacity : 1
      },
      end: {
        x: to.x - to.scene.x + from.scene.x - container.x,
        y: to.y - to.scene.y + from.scene.y - container.y,
        scaleX: 1,
        scaleY: 1,
        opacity: to.style.opacity !== undefined ? to.style.opacity : 1
      },
      initial: to,
      props: {
        ...this.props.to.props
      }
    };
    dest.style = this.createComponentStyle(dest, dest.end.x, dest.end.y);

    this._canUseNativeDriver = undefined;
    return this.getTransition()({
      from: source,
      to: dest,
      animValue,
      Context: MagicMoveAnimationContext,
      render: MagicMoveAnimation.renderComponent,
      interpolate: this.interpolate,
      onCanUseNativeDriver: this.onCanUseNativeDriver
    });
  }

  onCanUseNativeDriver = val => {
    this._canUseNativeDriver = val;
  };

  render() {
    const { to } = this.state;
    return (
      <React.Fragment>
        {this.renderDebugFrom()}
        {this.renderDebugTo()}
        {to ? this.renderAnimation() : this.renderInitialFrom()}
      </React.Fragment>
    );
  }

  componentDidUpdate() {
    const { animValue, container, to, from } = this.state;

    //
    // 4. Hide from component
    //
    if (container && from && !this._isFromHidden) {
      this._isFromHidden = true;
      if (this.debug) {
        //eslint-disable-next-line
        console.debug(`[MagicMove] Hiding source ${this.props.from.debugName}`);
      }
      this.props.from.setOpacity(0);
    }

    //
    // 5. Animate...
    //
    if (container && from && to && !this._isAnimationStarted) {
      this._isAnimationStarted = true;
      const toProps = this.props.to.props;
      const { duration, easing, delay } = toProps;
      const transition = this.getTransition();
      if (this.debug) {
        // eslint-disable-next-line
        console.debug(`[MagicMove] Animating ${this.props.to.debugName}...`);
      }

      let { useNativeDriver } = toProps;
      if (useNativeDriver === undefined) {
        if (this._canUseNativeDriver === false) {
          // eslint-disable-next-line
          console.warn(
            `[MagicMove] Warning, cannot use native animation for ${
              this.props.to.debugName
            } (set 'useNativeDriver' to 'false' to disable this warning)`
          );
          useNativeDriver = false;
        } else if (this._canUseNativeDriver === true) {
          useNativeDriver = true;
        } else {
          useNativeDriver = transition.defaultProps
            ? transition.defaultProps.useNativeDriver
            : false;
        }
      }

      Animated.timing(animValue, {
        toValue: 1,
        duration: this.debug
          ? 8000
          : resolveValue(
              duration,
              transition.defaultProps
                ? transition.defaultProps.duration
                : undefined,
              400
            ),
        delay: resolveValue(
          delay,
          transition.defaultProps ? transition.defaultProps.delay : undefined,
          0
        ),
        easing: resolveValue(
          easing,
          transition.defaultProps ? transition.defaultProps.easing : undefined,
          defaultEasingFn
        ),
        useNativeDriver
      }).start(() => {
        const { to, from, onCompleted } = this.props;
        if (this.debug) {
          // eslint-disable-next-line
          console.debug(
            `[MagicMove] Animating ${this.props.to.debugName}... DONE`
          );
        }
        if (this.debug) {
          //eslint-disable-next-line
          console.debug(
            `[MagicMove] Showing target ${this.props.to.debugName}`
          );
        }
        to.setOpacity(undefined);
        if (!from.props.keepHidden) {
          if (this.debug) {
            //eslint-disable-next-line
            console.debug(
              `[MagicMove] Showing source ${this.props.from.debugName}`
            );
          }
          from.setOpacity(undefined);
        }
        onCompleted();
      });
    }
  }
}

MagicMoveAnimation.Context = MagicMoveAnimationContext;

export default MagicMoveAnimation;
