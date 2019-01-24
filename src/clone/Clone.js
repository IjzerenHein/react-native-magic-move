import React, { PureComponent } from "react";
import { Animated } from "react-native";
import PropTypes from "prop-types";
import MagicMoveCloneContext from "./CloneContext";
import JSCloneComponent from "./CloneComponent";
import NativeCloneComponent from "./NativeCloneComponent";

class MagicMoveClone extends PureComponent {
  static propTypes = {
    component: PropTypes.any.isRequired,
    parentRef: PropTypes.any.isRequired,
    containerLayout: PropTypes.any.isRequired,
    isInitial: PropTypes.bool,
    isScene: PropTypes.bool.isRequired,
    isTarget: PropTypes.bool.isRequired,
    contentStyle: PropTypes.any,
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

  render() {
    const CloneComponent = NativeCloneComponent.isAvailable
      ? NativeCloneComponent
      : JSCloneComponent;
    const {
      children,
      style,
      resizeMode,
      contentStyle,
      ...otherProps
    } = this.props;

    const cloneChildren = children ? (
      <MagicMoveCloneContext.Provider
        value={{
          isClone: true,
          isTarget: otherProps.isTarget,
          isScene: otherProps.isScene
        }}
      >
        {children}
      </MagicMoveCloneContext.Provider>
    ) : (
      undefined
    );

    if (contentStyle) {
      return (
        <Animated.View style={[style, { overflow: "hidden" }]}>
          <CloneComponent style={contentStyle} {...otherProps}>
            {cloneChildren}
          </CloneComponent>
        </Animated.View>
      );
    } else {
      return (
        <CloneComponent style={style} resizeMode={resizeMode} {...otherProps}>
          {cloneChildren}
        </CloneComponent>
      );
    }
  }
}

export default MagicMoveClone;
