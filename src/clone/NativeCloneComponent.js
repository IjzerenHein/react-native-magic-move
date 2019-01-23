import React, { PureComponent } from "react";
import {
  Animated,
  requireNativeComponent,
  NativeModules,
  findNodeHandle
} from "react-native";
import PropTypes from "prop-types";

class MagicMoveNativeCloneComponent extends PureComponent {
  static propTypes = {
    component: PropTypes.any.isRequired,
    parentRef: PropTypes.any.isRequired,
    containerLayout: PropTypes.any.isRequired, // TODO?
    isScene: PropTypes.bool.isRequired,
    isTarget: PropTypes.bool.isRequired,
    isInitial: PropTypes.bool,
    onLayout: PropTypes.func,
    onShow: PropTypes.func,
    debug: PropTypes.bool,
    children: PropTypes.any,
    style: PropTypes.any,
    snapshotType: PropTypes.number,
    blurRadius: PropTypes.number
  };

  static defaultProps = {
    debug: false,
    isInitial: false
  };

  static isAvailable = NativeModules.MagicMoveCloneManager ? true : false;

  constructor(props) {
    super(props);
    if (!MagicMoveNativeCloneComponent.isAvailable) {
      throw new Error(
        "MagicMoveNativeCloneComponent is not available, did you forget to use `react-native link react-native-magic-move`?"
      );
    }
    this.state = {
      style: undefined
    };
  }

  render() {
    const {
      component,
      parentRef, // eslint-disable-line
      containerLayout, // eslint-disable-line
      style,
      children,
      isInitial,
      isScene,
      onLayout, // eslint-disable-line
      onShow, // eslint-disable-line
      debug, // eslint-disable-line
      ...otherProps
    } = this.props;
    return (
      <RCTMagicMoveClone
        ref={isInitial ? this._setRef : undefined}
        id={isScene ? component.getId() : component.props.id}
        style={style || this.state.style}
        isScene={isScene}
        {...otherProps}
      >
        {isScene ? children : undefined}
      </RCTMagicMoveClone>
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

const RCTMagicMoveClone = (function() {
  try {
    const RCTMagicMoveClone = MagicMoveNativeCloneComponent.isAvailable
      ? requireNativeComponent(
          "RCTMagicMoveClone",
          MagicMoveNativeCloneComponent
        )
      : undefined;
    const AnimatedRCTMagicMoveClone = RCTMagicMoveClone
      ? Animated.createAnimatedComponent(RCTMagicMoveClone)
      : undefined;
    return AnimatedRCTMagicMoveClone;
  } catch (err) {
    // eslint-disable-next-line
    console.error(
      `${
        err.message
      } (are you importing two different versions of react-native-magic-move?)`
    );
  }
})();

export default MagicMoveNativeCloneComponent;
