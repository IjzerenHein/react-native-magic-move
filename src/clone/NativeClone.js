import React, { PureComponent } from "react";
import {
  Animated,
  requireNativeComponent,
  NativeModules,
  findNodeHandle
} from "react-native";
import PropTypes from "prop-types";
import MagicMoveCloneContext from "./CloneContext";

class MagicMoveNativeClone extends PureComponent {
  static propTypes = {
    component: PropTypes.any.isRequired,
    parentRef: PropTypes.any.isRequired,
    containerLayout: PropTypes.any.isRequired, // TODO?
    isScene: PropTypes.bool.isRequired,
    isTarget: PropTypes.bool.isRequired,
    isInitial: PropTypes.bool,
    offsetX: PropTypes.number,
    offsetY: PropTypes.number,
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

  state = {
    style: undefined
  };

  render() {
    const {
      component,
      style,
      children,
      isInitial,
      isScene,
      isTarget,
      offsetX,
      offsetY
    } = this.props;
    return (
      <AnimatedRCTMagicMoveClone
        ref={isInitial ? this._setRef : undefined}
        id={isScene ? component.getId() : component.props.id}
        isScene={isScene}
        isTarget={isTarget}
        style={style || this.state.style}
        offsetX={offsetX}
        offsetY={offsetY}
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
    const {
      isScene,
      isTarget,
      debug,
      component,
      parentRef,
      snapshotType
    } = this.props;
    // console.log("INIT #1: ", component.getRef(), parentRef, isScene, isTarget);
    const source = findNodeHandle(component.getRef());
    const parent = findNodeHandle(parentRef);
    const layout = await NativeModules.MagicMoveCloneManager.init(
      {
        id: isScene ? component.getId() : component.props.id,
        source,
        parent,
        isScene,
        isTarget,
        debug,
        snapshotType
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
        style: {
          position: "absolute",
          width: layout.width,
          height: layout.height,
          left: 0,
          top: 0,
          transform: [{ translateX: layout.x }, { translateY: layout.y }]
        }
      });
    }
  }
}

const RCTMagicMoveClone = requireNativeComponent(
  "RCTMagicMoveClone",
  MagicMoveNativeClone
);

const AnimatedRCTMagicMoveClone = Animated.createAnimatedComponent(
  RCTMagicMoveClone
);

export default MagicMoveNativeClone;
