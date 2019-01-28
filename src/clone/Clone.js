import React, { PureComponent } from "react";
import { Animated, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { MagicMoveContextProvider, MagicMoveContextPropType } from "../Context";
import CloneComponent from "./CloneComponent";
import NativeCloneComponent from "./NativeCloneComponent";
import { CloneOption, CloneContentType } from "./types";

class MagicMoveClone extends PureComponent {
  static propTypes = {
    component: PropTypes.any.isRequired,
    options: PropTypes.number.isRequired,
    nativeContentType: PropTypes.number.isRequired,
    mmContext: MagicMoveContextPropType,
    contentStyle: PropTypes.any,
    children: PropTypes.any,
    style: PropTypes.any,
    onLayout: PropTypes.func,
    onShow: PropTypes.func
  };

  static Option = CloneOption;
  static ContentType = CloneContentType;
  static isNativeAvailable = NativeCloneComponent.isAvailable;

  get isClone() {
    return true;
  }

  get isTarget() {
    return this.options & CloneOption.TARGET ? true : false;
  }

  render() {
    const {
      children,
      style,
      options,
      contentStyle,
      nativeContentType,
      ...otherProps
    } = this.props;

    // For convenience of reasoning, deconstruct the options
    const isInitial = options & CloneOption.INITIAL ? true : false;
    const isVisible = options & CloneOption.VISIBLE ? true : false;

    // Do now show the outer content, when an inner content style
    // is specified
    let outerOptions = options;
    if (isVisible && contentStyle) outerOptions -= CloneOption.VISIBLE;

    // Only make the inner content visible, when a content-style
    // is specified
    let innerOptions = options;
    if (isInitial) innerOptions -= CloneOption.INITIAL;
    if (isVisible && !contentStyle) innerOptions -= CloneOption.VISIBLE;

    // Render content
    let content;
    const cloneChildren =
      !NativeCloneComponent.isAvailable ||
      nativeContentType === CloneContentType.CHILDREN
        ? children
        : undefined;
    if (NativeCloneComponent.isAvailable) {
      if (contentStyle) {
        content = (
          <NativeCloneComponent
            style={style}
            options={outerOptions}
            contentType={
              contentStyle ? CloneContentType.CHILDREN : nativeContentType
            }
            {...otherProps}
          >
            <NativeCloneComponent
              style={contentStyle || StyleSheet.absoluteFill}
              options={innerOptions}
              contentType={nativeContentType}
              {...otherProps}
            >
              {cloneChildren}
            </NativeCloneComponent>
          </NativeCloneComponent>
        );
      } else {
        content = (
          <NativeCloneComponent
            style={style}
            options={options}
            contentType={nativeContentType}
            {...otherProps}
          >
            {cloneChildren}
          </NativeCloneComponent>
        );
      }
    } else if (!isInitial && contentStyle) {
      content = (
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
      content = (
        <CloneComponent style={style} options={options} {...otherProps}>
          {cloneChildren}
        </CloneComponent>
      );
    }

    if (cloneChildren) {
      return (
        <MagicMoveContextProvider value={this}>
          {content}
        </MagicMoveContextProvider>
      );
    } else {
      return content;
    }
  }
}

export default MagicMoveClone;
