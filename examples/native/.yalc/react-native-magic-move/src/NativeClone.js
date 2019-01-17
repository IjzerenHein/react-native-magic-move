import React, { PureComponent, createContext } from "react";
import {
  Animated,
  requireNativeComponent,
  NativeModules,
  findNodeHandle
} from "react-native";
import PropTypes from "prop-types";

const MagicMoveCloneContext = createContext({
  isClone: false,
  isTarget: false
});

class MagicMoveClone extends PureComponent {
  static propTypes = {
    component: PropTypes.any.isRequired,
    parentRef: PropTypes.any.isRequired,
    containerLayout: PropTypes.any.isRequired,
    isScene: PropTypes.bool,
    isTarget: PropTypes.bool,
    debug: PropTypes.bool,
    onLayout: PropTypes.func,
    onShow: PropTypes.func,
    style: PropTypes.any,
    children: PropTypes.any
  };

  static Context = MagicMoveCloneContext;

  state = {
    initialLayout: undefined
  };

  render() {
    const { isTarget, isScene, children } = this.props;
    return (
      <AnimatedRCTMagicMoveClone
        ref={this._setRef}
        isTarget={isTarget}
        isScene={isScene}
        style={this._getStyle()}
      >
        {isScene ? children : undefined}
      </AnimatedRCTMagicMoveClone>
    );
  }

  _setRef = ref => {
    this._ref = ref;
    this._init();
  };

  async _init() {
    if (!this._ref) return;
    const { isScene, isTarget, debug, component, parentRef } = this.props;
    // console.log("INIT #1: ", component.getRef(), parentRef, isScene, isTarget);
    const source = findNodeHandle(component.getRef());
    const parent = findNodeHandle(parentRef);
    const layout = await NativeModules.MagicMoveCloneManager.init(
      {
        id: component.props.id || "",
        source,
        parent,
        isScene,
        isTarget,
        debug
      },
      findNodeHandle(this._ref)
    );
    if (layout.width * layout.height) {
      if (this.props.onLayout) {
        this.props.onLayout(layout);
      }
      if (this.props.onShow) {
        this.props.onShow(layout);
      }
      this.setState({
        initialLayout: layout
      });
    }
  }

  _getStyle() {
    let { style } = this.props;
    if (!style) {
      const { initialLayout } = this.state;
      if (initialLayout) {
        style = {
          position: "absolute",
          width: initialLayout.width,
          height: initialLayout.height,
          left: 0,
          top: 0,
          transform: [
            { translateX: initialLayout.x },
            { translateY: initialLayout.y }
          ]
        };
      }
    }
    return style;
  }
}

const RCTMagicMoveClone = requireNativeComponent(
  "RCTMagicMoveClone",
  MagicMoveClone
);

const AnimatedRCTMagicMoveClone = Animated.createAnimatedComponent(
  RCTMagicMoveClone
);

export default MagicMoveClone;
