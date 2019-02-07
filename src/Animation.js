import React, { Component } from "react";
import { StyleSheet, Animated, Text, Easing, Platform } from "react-native";
import PropTypes from "prop-types";
import defaultTransition from "./transitions/move";
import MagicMoveClone from "./clone";
import MagicMoveComposer from "./Composer";

const defaultEasingFn = Easing.inOut(Easing.ease);

function resolveValue(value, def, other = 0) {
  if (value !== undefined) return value;
  return def || other;
}

function contentTypeFromString(str) {
  switch (str) {
    case "children":
      return MagicMoveClone.ContentType.CHILDREN;
    case "snapshot":
      return MagicMoveClone.ContentType.SNAPSHOT;
    case "rawImage":
      return MagicMoveClone.ContentType.RAWIMAGE;
    default:
      throw new Error(
        `[MagicMove] Invalid nativeContentType specified: ${str}`
      );
  }
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
class MagicMoveAnimation extends Component {
  static propTypes = {
    source: PropTypes.object.isRequired,
    target: PropTypes.object.isRequired,
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
    if (this.isDebug) {
      //eslint-disable-next-line
      console.debug(`[MagicMove] Hiding target ${props.target.debugName}`);
    }
    if (!MagicMoveClone.isNativeAvailable || Platform.OS === "android") {
      props.target.setOpacity(0);
    }
  }

  get isDebug() {
    return this.props.target.isDebug;
  }

  getTransition() {
    return this.props.target.props.transition || defaultTransition;
  }

  get isSceneTransition() {
    const transition = this.getTransition();
    return transition.defaultProps
      ? transition.defaultProps.sceneTransition
      : false;
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Optimize render to only execute when both the source & target layout
    // have been obtained.
    return nextState.sourceLayout &&
      nextState.targetLayout &&
      (!this.state.sourceLayout || !this.state.targetLayout)
      ? true
      : false;
  }

  /**
   * Renders a visual placeholder of the source/target
   * component, so it's possible to see what the
   * start position/shape/size is of the source/target.
   */
  renderDebugPlaceholder(isTarget) {
    if (!this.isDebug) return;
    const layout = isTarget ? this.state.targetLayout : this.state.sourceLayout;
    if (!layout) return;
    const clone = isTarget ? this.props.target : this.props.source;
    const style = StyleSheet.flatten([clone.props.style]);
    return (
      <Animated.View
        key={`${clone.id}.${isTarget ? "debugTo" : "debugFrom"}`}
        style={{
          position: "absolute",
          width: layout.width,
          height: layout.height,
          left: layout.x,
          top: layout.y,
          backgroundColor: isTarget
            ? "rgba(0, 255, 0, 0.1)"
            : "rgba(0, 0, 255, 0.1)",
          borderColor: isTarget ? "green" : "royalblue",
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
        <Text
          style={{
            color: isTarget ? "green" : "royalblue",
            textAlign: "center"
          }}
        >
          {isTarget ? "To" : "From"}
        </Text>
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
    const { source, target } = this.props;
    const transition = this.getTransition();
    const nativeContentTypeString =
      (transition.defaultProps
        ? transition.defaultProps.nativeContentType
        : undefined) || "children";
    const nativeContentType = contentTypeFromString(nativeContentTypeString);
    const isSceneTransition =
      (transition.defaultProps
        ? transition.defaultProps.sceneTransition
        : undefined) || false;
    const children = [
      <MagicMoveClone
        key="target0"
        component={target}
        mmContext={target.props.mmContext}
        options={
          MagicMoveClone.Option.INITIAL |
          MagicMoveClone.Option.TARGET |
          (this.isDebug ? MagicMoveClone.Option.DEBUG : 0)
        }
        nativeContentType={nativeContentType}
        onLayout={this.onLayoutTargetComponent}
      >
        {target.props.children}
      </MagicMoveClone>,
      <MagicMoveClone
        key="source0"
        component={source}
        mmContext={source.props.mmContext}
        options={
          MagicMoveClone.Option.INITIAL |
          MagicMoveClone.Option.VISIBLE |
          (this.isDebug ? MagicMoveClone.Option.DEBUG : 0)
        }
        nativeContentType={nativeContentType}
        onShow={this.onShowSourceComponent}
      >
        {source.props.children}
      </MagicMoveClone>
    ];
    const targetScene = target.props.mmContext.scene;
    if (isSceneTransition && targetScene) {
      children.push(
        <MagicMoveClone
          key="targetScene0"
          component={targetScene}
          mmContext={targetScene.props.mmContext}
          options={
            MagicMoveClone.Option.INITIAL |
            MagicMoveClone.Option.TARGET |
            MagicMoveClone.Option.SCENE |
            MagicMoveClone.Option.VISIBLE |
            (this.isDebug ? MagicMoveClone.Option.DEBUG : 0)
          }
          nativeContentType={nativeContentType}
          onLayout={this.onLayoutTargetScene}
        >
          {targetScene.props.children}
        </MagicMoveClone>
      );
    }
    const sourceScene = source.props.mmContext.scene;
    if (isSceneTransition && sourceScene) {
      children.push(
        <MagicMoveClone
          key="sourceScene0"
          component={sourceScene}
          mmContext={sourceScene.props.mmContext}
          options={
            MagicMoveClone.Option.INITIAL |
            MagicMoveClone.Option.SCENE |
            (this.isDebug ? MagicMoveClone.Option.DEBUG : 0)
          }
          nativeContentType={nativeContentType}
          onLayout={this.onLayoutSourceScene}
        >
          {sourceScene.props.children}
        </MagicMoveClone>
      );
    }
    return children;
  }

  /**
   * Called when the initial source component has calculated
   * its layout and it's clone has becomes visible.
   * It then immediately hides the original source component,
   * so it doesn't appear to move away due to a stack-transition.
   */
  onShowSourceComponent = layout => {
    const { source } = this.props;
    if (this.isDebug) {
      //eslint-disable-next-line
      console.debug(`[MagicMove] Hiding source ${source.debugName}`);
    }
    source.setOpacity(0);
    this.setState({
      sourceLayout: layout
    });
  };

  /**
   * Called when the initial source component has calculated
   * its layout and it's clone has becomes visible.
   * It then immediately hides the original source component,
   * so it doesn't appear to move away due to a stack-transition.
   */
  onShowSourceScene = layout => {
    const { scene } = this.prop.source.props.mmContext.scene;
    if (this.isDebug) {
      //eslint-disable-next-line
      console.debug(`[MagicMove] Hiding source ${scene.debugName}`);
    }
    //scene.setOpacity(0);
    this.setState({
      sourceSceneLayout: layout
    });
  };

  /**
   * Called whenever the layout of the target component
   * has been calculated. It then stores this layout
   * animation, and in case the layout of the source component
   * has also been obtained, then starts the transition
   * animation between the two.
   */
  onLayoutTargetComponent = layout => {
    this.setState({
      targetLayout: layout
    });
    if (MagicMoveClone.isNativeAvailable && Platform.OS === "ios") {
      this.props.target.setOpacity(0);
    }
  };
  onLayoutTargetScene = layout => {
    this.setState({
      targetSceneLayout: layout
    });
    /*if (MagicMoveClone.isNativeAvailable && Platform.OS === "ios") {
      this.props.target.setOpacity(0);
    }*/
  };

  /**
   * Helper interpolation function, which provides
   * a shorthand notation to be used when writing
   * transition functions.
   */
  _interpolateClassicAnimation = (from, to, clamp) => {
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
  _renderClassicAnimationClone = (clone, index = 0) => {
    const { style, component, isTarget, contentStyle } = clone;
    const nativeContentType = contentTypeFromString(clone.nativeContentType);
    const key = `${isTarget ? "target" : "source"}${index + ""}`;
    /*console.log(
      `_renderMagicMoveComposer: ${
        component.id
      }, isTarget: ${isTarget}, nativeContentType: ${clone.nativeContentType}`
    );*/
    return (
      <MagicMoveClone
        key={key}
        component={component}
        mmContext={component.props.mmContext}
        options={
          MagicMoveClone.Option.VISIBLE |
          (isTarget ? MagicMoveClone.Option.TARGET : 0) |
          (this.isDebug ? MagicMoveClone.Option.DEBUG : 0)
        }
        style={{ ...style }}
        contentStyle={contentStyle}
        nativeContentType={nativeContentType}
        // blurRadius={blurRadius}
      >
        {component.props.children}
      </MagicMoveClone>
    );
  };

  _createClassicAnimationClone(
    isTarget,
    component,
    layout,
    otherComponent,
    otherLayout,
    nativeContentType
  ) {
    const style = StyleSheet.flatten([component.props.style]);
    const otherStyle = StyleSheet.flatten([otherComponent.props.style]);
    const start = {
      x: layout.x,
      y: layout.y,
      scaleX: 1,
      scaleY: 1,
      opacity: style.opacity !== undefined ? style.opacity : 1
    };
    const end = {
      x: otherLayout.x - (layout.width - otherLayout.width) / 2,
      y: otherLayout.y - (layout.height - otherLayout.height) / 2,
      scaleX: otherLayout.width / layout.width,
      scaleY: otherLayout.height / layout.height,
      opacity: otherStyle.opacity !== undefined ? otherStyle.opacity : 1
    };
    return {
      isTarget,
      component: component,
      width: layout.width,
      height: layout.height,
      imageWidth: layout.imageWidth,
      imageHeight: layout.imageHeight,
      blurRadius: 0,
      start: isTarget ? end : start,
      end: isTarget ? start : end,
      props: {
        ...component.props
      },
      style: {
        ...style,
        position: "absolute",
        width: layout.width,
        height: layout.height,
        left: 0,
        top: 0,
        transform: [{ translateX: layout.x }, { translateY: layout.y }],
        margin: 0,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0
      },
      contentStyle: undefined,
      nativeContentType
    };
  }

  /**
   * Renders the animated clones using the configured
   * transition function.
   */
  renderClassicAnimation(transition) {
    const { source, target } = this.props;
    const { sourceLayout, targetLayout, animValue } = this.state;
    let nativeContentType =
      (transition.defaultProps
        ? transition.defaultProps.nativeContentType
        : undefined) || "children";

    // When a child is being animated, then disable native optimisations
    // as these use a snapshot which also includes that child.
    // Instead, that child should not be visible in this clone,
    // otherwise it would be drawn twice.
    if (
      MagicMoveClone.isNativeAvailable &&
      nativeContentType === "snapshot" &&
      source.props.mmContext.administration.isAnimatingChildOf(source)
    ) {
      if (this.isDebug) {
        // eslint-disable-next-line
        console.debug(
          `[MagicMove] Disabling native image snapshot for ${
            source.debugName
          }, because its child is also being animated`
        );
      }
      nativeContentType = "children";
    }

    const from = this._createClassicAnimationClone(
      false,
      source,
      sourceLayout,
      target,
      targetLayout,
      nativeContentType
    );
    const to = this._createClassicAnimationClone(
      true,
      target,
      targetLayout,
      source,
      sourceLayout,
      nativeContentType
    );
    return transition({
      from,
      to,
      animValue,
      render: this._renderClassicAnimationClone,
      interpolate: this._interpolateClassicAnimation
    });
  }

  /**
   * Renders the animated clones using the configured
   * transition function.
   */
  renderAnimation() {
    const transition = this.getTransition();
    if (!transition.defaultProps || !transition.defaultProps.nextGen) {
      return this.renderClassicAnimation(transition);
    } else {
      return this.renderComposersAnimation(transition);
    }
  }

  /**
   * Renders the new experimental animation
   * using the composers pipeline.
   */
  renderComposersAnimation(transition) {
    const { source, target } = this.props;
    const { sourceLayout, targetLayout, animValue } = this.state;
    let nativeContentType =
      (transition.defaultProps
        ? transition.defaultProps.nativeContentType
        : undefined) || "children";

    // When a child is being animated, then disable native optimisations
    // as these use a snapshot which also includes that child.
    // Instead, that child should not be visible in this clone,
    // otherwise it would be drawn twice.
    if (
      MagicMoveClone.isNativeAvailable &&
      nativeContentType === "snapshot" &&
      source.props.mmContext.administration.isAnimatingChildOf(source)
    ) {
      if (this.isDebug) {
        // eslint-disable-next-line
        console.debug(
          `[MagicMove] Disabling native image snapshot for ${
            source.debugName
          }, because its child is also being animated`
        );
      }
      nativeContentType = "children";
    }
    return transition({
      source: MagicMoveComposer.create({
        component: source,
        isTarget: false,
        layout: sourceLayout,
        nativeContentType
      }),
      target: MagicMoveComposer.create({
        component: target,
        isTarget: true,
        layout: targetLayout,
        nativeContentType
      })
    }).map((clone, index) => {
      const { component, isTarget } = clone;
      const {
        style,
        props,
        contentStyle,
        contentProps,
        nativeContentType
      } = clone.getAnimatedProps(animValue);
      const key = `${isTarget ? "target" : "source"}${index + ""}`;
      return (
        <MagicMoveClone
          key={key}
          {...props}
          component={component}
          mmContext={component.props.mmContext}
          options={
            MagicMoveClone.Option.VISIBLE |
            (isTarget ? MagicMoveClone.Option.TARGET : 0) |
            (this.isDebug ? MagicMoveClone.Option.DEBUG : 0)
          }
          style={style}
          contentStyle={contentStyle}
          contentProps={contentProps}
          nativeContentType={contentTypeFromString(nativeContentType)}
        >
          {component.props.children}
        </MagicMoveClone>
      );
    });
  }

  /**
   * Main render function.
   */
  render() {
    const {
      sourceLayout,
      targetLayout
      /*sourceSceneLayout,
      targetSceneLayout*/
    } = this.state;
    return (
      <React.Fragment>
        {this.renderDebugPlaceholder(false)}
        {this.renderDebugPlaceholder(true)}
        {sourceLayout && targetLayout
          ? this.renderAnimation()
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
      if (this.isDebug) {
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
        duration: this.isDebug
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
        if (this.isDebug) {
          // eslint-disable-next-line
          console.debug(`[MagicMove] Animating ${target.debugName}... DONE`);
        }
        if (this.isDebug) {
          //eslint-disable-next-line
          console.debug(`[MagicMove] Showing target ${target.debugName}`);
        }
        target.setOpacity(undefined);
        if (!source.props.keepHidden) {
          if (this.isDebug) {
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
