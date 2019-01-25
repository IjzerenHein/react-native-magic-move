import React, { PureComponent } from "react";
import {
  Animated,
  requireNativeComponent,
  NativeModules,
  findNodeHandle
} from "react-native";
import PropTypes from "prop-types";
import { CloneOption } from "./CloneOption";

class MagicMoveNativeCloneComponent extends PureComponent {
  static propTypes = {
    component: PropTypes.any.isRequired,
    parentRef: PropTypes.any.isRequired,
    containerLayout: PropTypes.any.isRequired, // Not used by Native clone
    options: PropTypes.number.isRequired,
    onLayout: PropTypes.func,
    onShow: PropTypes.func,
    children: PropTypes.any,
    style: PropTypes.any,
    blurRadius: PropTypes.number
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
      style,
      children,
      options,
      parentRef, // eslint-disable-line
      containerLayout, // eslint-disable-line
      onLayout, // eslint-disable-line
      onShow, // eslint-disable-line
      ...otherProps
    } = this.props;
    return (
      <RCTMagicMoveClone
        ref={options & CloneOption.INITIAL ? this._setRef : undefined}
        id={
          options & CloneOption.SCENE ? component.getId() : component.props.id
        }
        style={style || this.state.style}
        options={options}
        {...otherProps}
      >
        {children}
      </RCTMagicMoveClone>
    );
  }

  _setRef = ref => {
    this._ref = ref;
    this._init();
  };

  async _init() {
    if (!this._ref) return;
    const { options, component, parentRef } = this.props;
    // console.log("INIT #1: ", component.getRef(), parentRef, options);
    const source = findNodeHandle(component.getRef());
    const parent = findNodeHandle(parentRef);
    const layout = await NativeModules.MagicMoveCloneManager.init(
      {
        id:
          options & CloneOption.SCENE ? component.getId() : component.props.id,
        source,
        parent,
        options
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
      /*this.setState({
        style: {
          position: "absolute",
          width: layout.width,
          height: layout.height,
          left: 0,
          top: 0,
          transform: [{ translateX: layout.x }, { translateY: layout.y }]
        }
      });*/
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
