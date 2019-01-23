import React, { PureComponent } from "react";
import { StyleSheet, Animated, View } from "react-native";
import PropTypes from "prop-types";
import { measureRelativeLayout } from "./measure";
import MagicMoveCloneContext from "./CloneContext";

class MagicMoveJavaScriptClone extends PureComponent {
  static propTypes = {
    component: PropTypes.any.isRequired,
    parentRef: PropTypes.any.isRequired,
    containerLayout: PropTypes.any.isRequired,
    isInitial: PropTypes.bool,
    isScene: PropTypes.bool.isRequired,
    isTarget: PropTypes.bool.isRequired,
    contentTransform: PropTypes.any,
    snapshotType: PropTypes.number,
    children: PropTypes.any,
    style: PropTypes.any,
    onLayout: PropTypes.func,
    onShow: PropTypes.func,
    debug: PropTypes.bool
  };

  static defaultProps = {
    debug: false,
    isInitial: false
  };

  static Context = MagicMoveCloneContext;

  _layout = undefined;
  _isMounted = false;
  _isVisible = false;

  constructor(props) {
    super(props);
    if (props.isInitial) {
      this._getInitialLayout();
    }
  }

  async _getInitialLayout() {
    const {
      component,
      debug,
      parentRef,
      containerLayout,
      isTarget,
      onLayout
    } = this.props;
    if (debug) {
      //eslint-disable-next-line
      console.debug(
        `[MagicMove] Measuring ${isTarget ? "target" : "source"} ${
          component.debugName
        }...`
      );
    }
    const layout = await measureRelativeLayout(
      component,
      parentRef,
      containerLayout
    );
    if (debug) {
      //eslint-disable-next-line
      console.debug(
        `[MagicMove] Measuring ${
          isTarget ? "target" : "source"
        } ${component}... DONE`
      );
    }
    this._layout = layout;
    if (onLayout) onLayout(layout);
    else if (this._isMounted) this.forceUpdate();
  }

  render() {
    return this.props.isScene ? this.renderScene() : this.renderComponent();
  }

  renderScene() {
    const { children, style } = this.props;
    const layout = this._layout;
    if (!style && !layout) return null;
    return (
      <View
        style={
          style || {
            position: "absolute",
            overflow: "hidden",
            left: layout ? layout.x : 0,
            top: layout ? layout.y : 0,
            width: layout ? layout.width : 0,
            height: layout ? layout.height : 0
          }
        }
      >
        {children}
      </View>
    );
  }

  renderComponent() {
    const {
      component,
      isTarget,
      children,
      style,
      contentTransform
    } = this.props;
    const layout = this._layout;
    if (!style && !layout) return null;
    const { AnimatedComponent, ...otherProps } = component.props;
    delete otherProps.children;
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
    delete otherProps.scene;

    const {
      width,
      height,
      left,
      top,
      transform,
      borderRadius,
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomLeftRadius,
      borderBottomRightRadius,
      backfaceVisibility,
      ...contentStyle
    } =
      style ||
      StyleSheet.flatten([
        component.props.style,
        {
          position: "absolute",
          left: 0,
          top: 0,
          width: layout.width,
          height: layout.height,
          transform: [{ translateX: layout.x }, { translateY: layout.y }],
          margin: 0,
          marginTop: 0,
          marginBottom: 0,
          marginLeft: 0,
          marginRight: 0
        }
      ]);
    const outerStyle = {
      width,
      height,
      left,
      top,
      transform,
      borderRadius,
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomLeftRadius,
      borderBottomRightRadius,
      backfaceVisibility
    };

    if (!style && isTarget) {
      outerStyle.opacity = 0;
    }

    const content = (
      <AnimatedComponent
        style={[
          contentStyle,
          contentTransform ? { transform: contentTransform } : outerStyle
        ]}
        {...otherProps}
      >
        {children ? (
          <MagicMoveCloneContext.Provider
            value={{ isClone: true, isTarget, isScene: false }}
          >
            {children}
          </MagicMoveCloneContext.Provider>
        ) : (
          undefined
        )}
      </AnimatedComponent>
    );

    if (contentTransform) {
      return (
        <Animated.View
          style={{
            ...outerStyle,
            position: "absolute",
            overflow: "hidden"
          }}
        >
          {content}
        </Animated.View>
      );
    } else {
      return content;
    }
  }

  componentDidMount() {
    this._isMounted = true;
    if (!this._isVisible && this._layout) {
      this._isVisible = true;
      if (this.props.onShow) this.props.onShow(this._layout);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate() {
    if (!this._isVisible && this._layout) {
      this._isVisible = true;
      if (this.props.onShow) this.props.onShow(this._layout);
    }
  }
}

export default MagicMoveJavaScriptClone;
