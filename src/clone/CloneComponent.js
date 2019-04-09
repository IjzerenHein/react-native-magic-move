/* globals Promise */
import React, { PureComponent } from "react";
import { StyleSheet, View, Image } from "react-native";
import PropTypes from "prop-types";
import { measureRelativeLayout } from "./measure";
import { CloneOption } from "./types";

class MagicMoveCloneComponent extends PureComponent {
  static propTypes = {
    component: PropTypes.any.isRequired,
    options: PropTypes.number.isRequired,
    children: PropTypes.any,
    style: PropTypes.any,
    onLayout: PropTypes.func,
    onShow: PropTypes.func
  };

  _layout = undefined;
  _isMounted = false;
  _isVisible = false;

  constructor(props) {
    super(props);
    if (props.options & CloneOption.INITIAL) {
      this._getInitialLayout();
    }
  }

  async _getInitialLayout() {
    const { component, options, onLayout } = this.props;
    if (options & CloneOption.DEBUG) {
      //eslint-disable-next-line
      console.debug(
        `[MagicMove] Measuring ${
          options & CloneOption.TARGET ? "target" : "source"
        } ${component.debugName}...`
      );
    }

    // Measure position & size
    const layoutPromise = measureRelativeLayout(component);

    // In case this is an image, also measure the size
    // of the underlying image, so we can perform "perfect"
    // image transitions
    const imageSource =
      component.props.ComponentType === "image"
        ? component.props.source
        : undefined;
    let imageSize;
    if (imageSource) {
      if (typeof imageSource === "number") {
        imageSize = Image.resolveAssetSource(imageSource);
      } else if (component.props.imageSizeHint) {
        imageSize = component.props.imageSizeHint;
      } else if (imageSource.uri) {
        imageSize = await new Promise((resolve, reject) => {
          Image.getSize(
            imageSource.uri,
            (width, height) => resolve({ width, height }),
            reject
          );
        });
      }
    }

    // All done
    const layout = await layoutPromise;
    this._layout = layout;
    if (imageSize) {
      this._layout.imageWidth = imageSize.width;
      this._layout.imageHeight = imageSize.height;
    }
    if (options & CloneOption.DEBUG) {
      //eslint-disable-next-line
      console.debug(
        `[MagicMove] Measuring ${
          options & CloneOption.TARGET ? "target" : "source"
        } ${component.debugName}... DONE (${JSON.stringify(layout)})`
      );
    }
    if (onLayout) onLayout(layout);
    else if (this._isMounted) this.forceUpdate();
  }

  render() {
    return this.props.options & CloneOption.SCENE
      ? this.renderScene()
      : this.renderComponent();
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
    const { component, options, children, style } = this.props;
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
    delete otherProps.disabled;
    delete otherProps.mmContext;
    delete otherProps.parentScaleHint;

    let cloneStyle =
      style ||
      StyleSheet.flatten([
        component.props.style,
        {
          position: "absolute",
          left: 0,
          top: 0,
          width: layout.width,
          height: layout.height,
          transform: [
            { translateX: layout.x },
            { translateY: layout.y },
            { scaleX: layout.scaleX },
            { scaleY: layout.scaleY }
          ],
          margin: 0,
          marginTop: 0,
          marginBottom: 0,
          marginLeft: 0,
          marginRight: 0
        }
      ]);

    if ((options & CloneOption.VISIBLE) === 0) {
      cloneStyle.opacity = 0;
    }

    return (
      <AnimatedComponent style={cloneStyle} {...otherProps}>
        {children}
      </AnimatedComponent>
    );
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

export default MagicMoveCloneComponent;
