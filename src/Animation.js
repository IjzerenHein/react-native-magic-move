import React, { PureComponent } from "react";
import { StyleSheet, Animated, Text, Easing } from "react-native";
import PropTypes from "prop-types";
import defaultTransition from "./transitions/move";
import MagicMoveClone from "./clone";
import { SnapshotType } from "./clone/SnapshotType";

const defaultEasingFn = Easing.inOut(Easing.ease);

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
    source: PropTypes.object.isRequired,
    target: PropTypes.object.isRequired,
    containerLayout: PropTypes.object.isRequired,
    onCompleted: PropTypes.func.isRequired
  };

  state = {
    animValue: new Animated.Value(0),
    sourceLayout: undefined,
    targetLayout: undefined
  };

  /**
   * Upon creating, hide the "target" component as quickly
   * as possible.
   */
  constructor(props) {
    super(props);
    if (this.debug) {
      //eslint-disable-next-line
      console.debug(`[MagicMove] Hiding target ${props.target.debugName}`);
    }
    props.target.setOpacity(0.0);
  }

  get debug() {
    return this.props.target.props.debug;
  }

  /**
   * Renders a visual placeholder of the source
   * component, so it's possible to see what the
   * start position/shape/size is of the source.
   */
  renderDebugSourcePlaceholder() {
    if (!this.debug) return;
    const { sourceLayout } = this.state;
    if (!sourceLayout) return;
    const { source } = this.props;
    const style = StyleSheet.flatten([source.props.style]);
    return (
      <Animated.View
        key={`${source.props.id}.debugFrom`}
        style={{
          position: "absolute",
          width: sourceLayout.width,
          height: sourceLayout.height,
          left: sourceLayout.x,
          top: sourceLayout.y,
          backgroundColor: "rgba(0, 0, 255, 0.1)",
          borderColor: "royalblue",
          borderWidth: 1,
          borderStyle: "dashed",
          borderTopRightRadius: resolveValue(
            style.borderTopRightRadius,
            style.borderRadius
          ),
          borderTopLeftRadius: resolveValue(
            style.borderTopLeftRadius,
            style.borderRadius
          ),
          borderBottomLeftRadius: resolveValue(
            style.borderBottomLeftRadius,
            style.borderRadius
          ),
          borderBottomRightRadius: resolveValue(
            style.borderBottomRightRadius,
            style.borderRadius
          ),
          opacity: 0.8,
          justifyContent: "center"
        }}
      >
        <Text style={{ color: "royalblue", textAlign: "center" }}>From</Text>
      </Animated.View>
    );
  }

  /**
   * Renders a visual placeholder of the target
   * component, so it's possible to see what the
   * start position/shape/size is of the target.
   */
  renderDebugTargetPlaceholder() {
    if (!this.debug) return;
    const { targetLayout } = this.state;
    if (!targetLayout) return;
    const { target } = this.props;
    const style = StyleSheet.flatten([target.props.style]);
    return (
      <Animated.View
        key={`${target.props.id}.debugTo`}
        style={{
          position: "absolute",
          width: targetLayout.width,
          height: targetLayout.height,
          left: targetLayout.x,
          top: targetLayout.y,
          backgroundColor: "rgba(0, 255, 0, 0.1)",
          borderColor: "green",
          borderWidth: 1,
          borderStyle: "dashed",
          borderTopRightRadius: resolveValue(
            style.borderTopRightRadius,
            style.borderRadius
          ),
          borderTopLeftRadius: resolveValue(
            style.borderTopLeftRadius,
            style.borderRadius
          ),
          borderBottomLeftRadius: resolveValue(
            style.borderBottomLeftRadius,
            style.borderRadius
          ),
          borderBottomRightRadius: resolveValue(
            style.borderBottomRightRadius,
            style.borderRadius
          ),
          opacity: 0.8,
          justifyContent: "center"
        }}
      >
        <Text style={{ color: "green", textAlign: "center" }}>To</Text>
      </Animated.View>
    );
  }

  /**
   * Renders the initial clones of the source and
   * target components. The clones are also responsible
   * for measuring the layout of the source/target components
   * and supplying that to this class, so it can start the
   * transition animation with it.
   */
  renderInitialClones() {
    const { source, target, containerLayout } = this.props;
    const transition = this.getTransition();
    const useRawImage = transition.defaultProps
      ? transition.defaultProps.useRawImage
      : false;
    const snapshotType = useRawImage
      ? SnapshotType.RAWIMAGE
      : SnapshotType.IMAGE;
    return [
      <MagicMoveClone
        key="source0"
        component={source}
        parentRef={source.props.scene ? source.props.scene.getRef() : undefined}
        containerLayout={containerLayout}
        isInitial={true}
        isScene={false}
        isTarget={false}
        snapshotType={snapshotType}
        debug={this.debug}
        onShow={this.onShowSourceClone}
      >
        {source.props.children}
      </MagicMoveClone>,
      <MagicMoveClone
        key="target0"
        component={target}
        parentRef={target.props.scene ? target.props.scene.getRef() : undefined}
        containerLayout={containerLayout}
        isInitial={true}
        isScene={false}
        isTarget={true}
        snapshotType={snapshotType}
        debug={this.debug}
        onLayout={this.onLayoutTargetClone}
      >
        {target.props.children}
      </MagicMoveClone>
    ];
  }

  /**
   * Called when the initial source component has calculated
   * its layout and it's clone has becomes visible.
   * It then immediately hides the original source component,
   * so it doesn't appear to move away due to a stack-transition.
   */
  onShowSourceClone = layout => {
    const { source } = this.props;
    if (this.debug) {
      //eslint-disable-next-line
      console.debug(`[MagicMove] Hiding source ${source.debugName}`);
    }
    source.setOpacity(0);
    this.setState({
      sourceLayout: layout
    });
  };

  /**
   * Called whenever the layout of the target component
   * has been calculated. It then stores this layout
   * animation, and in case the layout of the source component
   * has also been obtained, then starts the transition
   * animation between the two.
   */
  onLayoutTargetClone = layout => {
    this.setState({
      targetLayout: layout
    });
  };

  /**
   * Returns the in-use transition function.
   */
  getTransition() {
    return (
      this.props.target.props.transition ||
      this.props.source.props.transition ||
      defaultTransition
    );
  }

  /**
   * Helper interpolation function, which provides
   * a shorthand notation to be used when writing
   * transition functions.
   */
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

  /**
   * Renders a single animation clone onto the screen.
   */
  _renderAnimationClone = (clone, index = 0) => {
    const { containerLayout } = this.props;
    const { style, component, isTarget, contentStyle } = clone;
    const key = `${isTarget ? "target" : "source"}${index + ""}`;
    return (
      <MagicMoveClone
        key={key}
        component={component}
        parentRef={
          component.props.scene ? component.props.scene.getRef() : undefined
        }
        containerLayout={containerLayout}
        isInitial={false}
        isScene={false}
        isTarget={isTarget}
        style={{ ...style }}
        contentStyle={contentStyle}
        // blurRadius={blurRadius}
        debug={this.debug}
      >
        {component.props.children}
      </MagicMoveClone>
    );
  };

  /**
   * Renders the animated clones using the configured
   * transition function.
   */
  renderAnimationClones() {
    const { source, target } = this.props;
    const { sourceLayout, targetLayout, animValue } = this.state;
    const sourceStyle = StyleSheet.flatten([source.props.style]);
    const targetStyle = StyleSheet.flatten([target.props.style]);

    const from = {
      isTarget: false,
      component: source,
      width: sourceLayout.width,
      height: sourceLayout.height,
      imageWidth: sourceLayout.imageWidth,
      imageHeight: sourceLayout.imageHeight,
      blurRadius: 0,
      start: {
        x: sourceLayout.x,
        y: sourceLayout.y,
        scaleX: 1,
        scaleY: 1,
        opacity: sourceStyle.opacity !== undefined ? sourceStyle.opacity : 1
      },
      end: {
        x: targetLayout.x - (sourceLayout.width - targetLayout.width) / 2,
        y: targetLayout.y - (sourceLayout.height - targetLayout.height) / 2,
        scaleX: targetLayout.width / sourceLayout.width,
        scaleY: targetLayout.height / sourceLayout.height,
        opacity: targetStyle.opacity !== undefined ? targetStyle.opacity : 1
      },
      initial: from,
      props: {
        ...source.props
      },
      style: {
        ...sourceStyle,
        position: "absolute",
        width: sourceLayout.width,
        height: sourceLayout.height,
        left: 0,
        top: 0,
        transform: [
          { translateX: sourceLayout.x },
          { translateY: sourceLayout.y }
        ],
        margin: 0,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0
      },
      contentStyle: undefined
    };

    const to = {
      isTarget: true,
      component: target,
      width: targetLayout.width,
      height: targetLayout.height,
      imageWidth: targetLayout.imageWidth,
      imageHeight: targetLayout.imageHeight,
      blurRadius: 0,
      start: {
        x: sourceLayout.x - (targetLayout.width - sourceLayout.width) / 2,
        y: sourceLayout.y - (targetLayout.height - sourceLayout.height) / 2,
        scaleX: sourceLayout.width / targetLayout.width,
        scaleY: sourceLayout.height / targetLayout.height,
        opacity: sourceStyle.opacity !== undefined ? sourceStyle.opacity : 1
      },
      end: {
        x: targetLayout.x,
        y: targetLayout.y,
        scaleX: 1,
        scaleY: 1,
        opacity: targetStyle.opacity !== undefined ? targetStyle.opacity : 1
      },
      props: {
        ...target.props
      },
      style: {
        ...targetStyle,
        position: "absolute",
        width: targetLayout.width,
        height: targetLayout.height,
        left: 0,
        top: 0,
        transform: [
          { translateX: targetLayout.x },
          { translateY: targetLayout.y }
        ],
        margin: 0,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0
      },
      contentStyle: undefined
    };
    return this.getTransition()({
      from,
      to,
      animValue,
      render: this._renderAnimationClone,
      interpolate: this.interpolate
    });
  }

  /**
   * Main render function.
   */
  render() {
    const { sourceLayout, targetLayout } = this.state;
    return (
      <React.Fragment>
        {this.renderDebugSourcePlaceholder()}
        {this.renderDebugTargetPlaceholder()}
        {sourceLayout && targetLayout
          ? this.renderAnimationClones()
          : this.renderInitialClones()}
      </React.Fragment>
    );
  }

  /**
   *
   */
  componentDidUpdate() {
    const { animValue, targetLayout, sourceLayout } = this.state;

    //
    // 5. Animate...
    //
    if (sourceLayout && targetLayout && !this._isAnimationStarted) {
      const { source, target, onCompleted } = this.props;
      this._isAnimationStarted = true;
      const targetProps = source.props;
      const { duration, easing, delay } = targetProps;
      const transition = this.getTransition();
      if (this.debug) {
        // eslint-disable-next-line
        console.debug(`[MagicMove] Animating ${target.debugName}...`);
      }

      // Determine whether the native driver should be used
      const toND = targetProps.useNativeDriver;
      const fromND = target.props.useNativeDriver;
      let useNativeDriver =
        toND === false || fromND === false
          ? false
          : toND === undefined && fromND === undefined
          ? undefined
          : true;
      if (useNativeDriver === undefined) {
        useNativeDriver = transition.defaultProps
          ? transition.defaultProps.useNativeDriver
          : false;
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
        if (this.debug) {
          // eslint-disable-next-line
          console.debug(`[MagicMove] Animating ${target.debugName}... DONE`);
        }
        if (this.debug) {
          //eslint-disable-next-line
          console.debug(`[MagicMove] Showing target ${target.debugName}`);
        }
        target.setOpacity(undefined);
        if (!source.props.keepHidden) {
          if (this.debug) {
            //eslint-disable-next-line
            console.debug(`[MagicMove] Showing source ${source.debugName}`);
          }
          source.setOpacity(undefined);
        }
        onCompleted();
      });
    }
  }
}

export default MagicMoveAnimation;
