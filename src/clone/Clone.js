import React, { PureComponent } from "react";
import { StyleSheet } from "react-native";
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
      contentStyle,
      ...otherProps
    } = this.props;
    const CloneComponent = NativeCloneComponent.isAvailable
      ? NativeCloneComponent
      : JSCloneComponent;

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

    const areChildrenVisible =
      children && (!NativeCloneComponent.isAvailable || isScene);

    return (
      <CloneComponent style={style} options={outerOptions} {...otherProps}>
        <CloneComponent
          style={contentStyle || StyleSheet.absoluteFill}
          options={innerOptions}
          {...otherProps}
        >
          {areChildrenVisible ? (
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
          )}
        </CloneComponent>
      </CloneComponent>
    );
  }
}

export default MagicMoveClone;
