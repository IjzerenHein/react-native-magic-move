/* globals Promise, __DEV__ */
import React from "react";
import { Animated } from "react-native";
import PropTypes from "prop-types";

const MagicMoveAnimationContext = React.createContext(undefined);

function measureLayout(id, name, ref) {
  let i = 0;
  return new Promise((resolve, reject) => {
    function onMeasure(x, y, width, height, pageX, pageY) {
      if (width || height || pageX || pageY) {
        return resolve({
          x: pageX,
          y: pageY,
          width,
          height
        });
      }
      i++;
      if (i >= 3)
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

function resolveValue(value, def) {
  if (value !== undefined) return value;
  return def || 0;
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
class MagicMoveAnimation extends React.Component {
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
            ...from.getStyle(),
            ...layouts[1],
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
            ...to.getStyle(),
            ...layouts[0],
            scene: layouts[1]
          }
        });
      })
      .catch(errorHandler);
  }

  renderChildren(children) {
    if (!children) return;
    return (
      <MagicMoveAnimationContext.Provider value={this.props.to.props.id}>
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
        style={{
          position: "absolute",
          width: from.width,
          height: from.height,
          left: from.x - container.x,
          top: from.y - container.y,
          backgroundColor: "blue",
          borderColor: "darkblue",
          borderWidth: 1,
          borderTopRightRadius: resolveValue(
            from.borderTopRightRadius,
            from.borderRadius
          ),
          borderTopLeftRadius: resolveValue(
            from.borderTopLeftRadius,
            from.borderRadius
          ),
          borderBottomLeftRadius: resolveValue(
            from.borderBottomLeftRadius,
            from.borderRadius
          ),
          borderBottomRightRadius: resolveValue(
            from.borderBottomRightRadius,
            from.borderRadius
          ),
          opacity: 0.5
        }}
      />
    );
  }

  renderDebugTo() {
    if (!this.props.to.props.debug) return;
    const { container, from, to } = this.state;
    if (!container || !from || !to) return;
    return (
      <Animated.View
        style={{
          position: "absolute",
          width: to.width,
          height: to.height,
          left: to.x - to.scene.x + from.scene.x - container.x,
          top: to.y - to.scene.y + from.scene.y - container.y,
          backgroundColor: "green",
          borderColor: "darkgreen",
          borderWidth: 1,
          borderTopRightRadius: resolveValue(
            to.borderTopRightRadius,
            to.borderRadius
          ),
          borderTopLeftRadius: resolveValue(
            to.borderTopLeftRadius,
            to.borderRadius
          ),
          borderBottomLeftRadius: resolveValue(
            to.borderBottomLeftRadius,
            to.borderRadius
          ),
          borderBottomRightRadius: resolveValue(
            to.borderBottomRightRadius,
            to.borderRadius
          ),
          opacity: 0.5
        }}
      />
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

  renderAnimation() {
    const { container, to, from } = this.state;
    if (!container || !from || !to) return;
    return this.props.to.props.transition(
      this.props,
      this.state,
      MagicMoveAnimationContext
    );
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
      const fromProps = this.props.from.props;
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
        useNativeDriver: toProps.useNativeDriver && fromProps.useNativeDriver
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
