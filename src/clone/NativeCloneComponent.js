/* globals Promise */
import React, { PureComponent } from "react";
import {
  Animated,
  requireNativeComponent,
  NativeModules,
  findNodeHandle,
  Image
} from "react-native";
import PropTypes from "prop-types";
import { CloneOption } from "./types";

class MagicMoveNativeCloneComponent extends PureComponent {
  static propTypes = {
    component: PropTypes.any.isRequired,
    options: PropTypes.number.isRequired,
    contentType: PropTypes.number.isRequired,
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
  }

  render() {
    const {
      component,
      style,
      children,
      options,
      onLayout, // eslint-disable-line
      onShow, // eslint-disable-line
      mmContext, // eslint-disable-line
      ...otherProps
    } = this.props;
    return (
      <RCTMagicMoveClone
        ref={options & CloneOption.INITIAL ? this._setRef : undefined}
        id={options & CloneOption.SCENE ? component.id : component.props.id}
        style={style}
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
    const { options, component, contentType, onLayout, onShow } = this.props;
    const { mmContext, imageSizeHint, source } = component.props;
    const { isImage } = component;

    // Initialize native clone
    const { scene, parent } = mmContext;
    const sourceHandle = findNodeHandle(component.ref);
    const parentHandle = findNodeHandle(scene ? scene.ref : parent.ref);
    const layout = await NativeModules.MagicMoveCloneManager.init(
      {
        id: options & CloneOption.SCENE ? component.id : component.props.id,
        source: sourceHandle,
        parent: parentHandle,
        options,
        contentType
      },
      findNodeHandle(this._ref)
    );

    // If the native side wasn't able to obtain
    // the image size, try to obtain it here as a fallback
    // measure
    if (isImage && source && !layout.imageWidth) {
      let imageSize;
      if (typeof source === "number") {
        imageSize = Image.resolveAssetSource(source);
      } else if (imageSizeHint) {
        imageSize = imageSizeHint;
      } else if (source.uri && !onShow) {
        imageSize = await new Promise((resolve, reject) => {
          Image.getSize(
            source.uri,
            (width, height) => resolve({ width, height }),
            reject
          );
        });
      }
      if (imageSize) {
        layout.imageWidth = imageSize.width;
        layout.imageHeight = imageSize.height;
      }
    }

    // Call callbacks
    if (onLayout) onLayout(layout);
    if (onShow) onShow(layout);
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
    MagicMoveNativeCloneComponent.isAvailable = false;
    // eslint-disable-next-line
    console.error(
      `${
        err.message
      } (are you importing two different versions of react-native-magic-move?)`
    );
  }
})();

export default MagicMoveNativeCloneComponent;
