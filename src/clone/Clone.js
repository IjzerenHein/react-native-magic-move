import React, { PureComponent } from "react";
import { Animated, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import MagicMoveCloneContext from "./CloneContext";
import JSCloneComponent from "./CloneComponent";
import NativeCloneComponent from "./NativeCloneComponent";
import { CloneOption } from "./CloneOption";

class MagicMoveClone extends PureComponent {
  static propTypes = {
    component: PropTypes.any.isRequired,
    parentRef: PropTypes.any.isRequired,
    containerLayout: PropTypes.any.isRequired,
    options: PropTypes.number.isRequired,
    useNative: PropTypes.bool,
    contentStyle: PropTypes.any,
    children: PropTypes.any,
    style: PropTypes.any,
    onLayout: PropTypes.func,
    onShow: PropTypes.func
  };

  static Context = MagicMoveCloneContext;
  static Option = CloneOption;
  static isNativeAvailable = NativeCloneComponent.isAvailable;

  render() {
    const {
      children,
      style,
      options,
      useNative,
      contentStyle,
      ...otherProps
    } = this.props;
    const CloneComponent = useNative ? NativeCloneComponent : JSCloneComponent;

    // For convenience of reasoning, deconstruct the options
    const isInitial = options & CloneOption.INITIAL ? true : false;
    const isVisible = options & CloneOption.VISIBLE ? true : false;
    const isTarget = options & CloneOption.TARGET ? true : false;
    const isScene = options & CloneOption.SCENE ? true : false;

    // Do now show the outer content, when an inner content style
    // is specified
    let outerOptions = options;
    if (isVisible && contentStyle) outerOptions -= CloneOption.VISIBLE;

    // Only make the inner content visible, when a content-style
    // is specified
    let innerOptions = options;
    if (isInitial) innerOptions -= CloneOption.INITIAL;
    if (isVisible && !contentStyle) innerOptions -= CloneOption.VISIBLE;

    const cloneChildren = children ? (
      <MagicMoveCloneContext.Provider
        value={{
          isClone: true,
          isTarget,
          isScene
        }}
      >
        {children}
      </MagicMoveCloneContext.Provider>
    ) : (
      undefined
    );

    if (useNative) {
      return (
        <CloneComponent style={style} options={outerOptions} {...otherProps}>
          <CloneComponent
            style={contentStyle || StyleSheet.absoluteFill}
            options={innerOptions}
            {...otherProps}
          >
            {isScene ? cloneChildren : undefined}
          </CloneComponent>
        </CloneComponent>
      );
    } else if (!isInitial && contentStyle) {
      return (
        <Animated.View style={style} options={outerOptions}>
          <CloneComponent
            style={contentStyle}
            options={innerOptions}
            {...otherProps}
          >
            {cloneChildren}
          </CloneComponent>
        </Animated.View>
      );
    } else {
      return (
        <CloneComponent style={style} options={options} {...otherProps}>
          {cloneChildren}
        </CloneComponent>
      );
    }
  }
}

export default MagicMoveClone;
