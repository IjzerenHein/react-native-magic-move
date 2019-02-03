import React from "react";
import {
  StyleSheet,
  Image,
  requireNativeComponent,
  NativeModules
} from "react-native";

let MagicMoveImage = Image;

if (NativeModules.MagicMoveCloneManager) {
  const MagicMoveImageViewNativeComponent = requireNativeComponent(
    "RCTMagicMoveImage"
  );

  const styles = StyleSheet.create({
    base: {
      overflow: "hidden"
    }
  });

  MagicMoveImage = {
    ...Image,
    render: (props, forwardedRef) => {
      let source = Image.resolveAssetSource(props.source);
      const defaultSource = Image.resolveAssetSource(props.defaultSource);
      const loadingIndicatorSource = Image.resolveAssetSource(
        props.loadingIndicatorSource
      );

      if (source && source.uri === "") {
        // eslint-disable-next-line
        console.warn("source.uri should not be an empty string");
      }

      if (props.src) {
        // eslint-disable-next-line
        console.warn(
          "The <Image> component requires a `source` property rather than `src`."
        );
      }

      if (props.children) {
        throw new Error(
          "The <Image> component cannot contain children. If you want to render content on top of the image, consider using the <ImageBackground> component or absolute positioning."
        );
      }

      if (props.defaultSource && props.loadingIndicatorSource) {
        throw new Error(
          "The <Image> component cannot have defaultSource and loadingIndicatorSource at the same time. Please use either defaultSource or loadingIndicatorSource."
        );
      }

      if (source && !source.uri && !Array.isArray(source)) {
        source = null;
      }

      let style;
      let sources;
      if (source.uri != null) {
        /* $FlowFixMe(>=0.78.0 site=react_native_android_fb) This issue was found
         * when making Flow check .android.js files. */
        const { width, height } = source;
        style = StyleSheet.flatten([
          { width, height },
          styles.base,
          props.style
        ]);
        /* $FlowFixMe(>=0.78.0 site=react_native_android_fb) This issue was found
         * when making Flow check .android.js files. */
        sources = [{ uri: source.uri }];
      } else {
        style = StyleSheet.flatten([styles.base, props.style]);
        sources = source;
      }

      const { onLoadStart, onLoad, onLoadEnd, onError } = props;
      const nativeProps = {
        ...props,
        style,
        shouldNotifyLoadEvents: !!(
          onLoadStart ||
          onLoad ||
          onLoadEnd ||
          onError
        ),
        src: sources,
        /* $FlowFixMe(>=0.78.0 site=react_native_android_fb) This issue was found
         * when making Flow check .android.js files. */
        headers: source.headers,
        defaultSrc: defaultSource ? defaultSource.uri : null,
        loadingIndicatorSrc: loadingIndicatorSource
          ? loadingIndicatorSource.uri
          : null,
        ref: forwardedRef
      };

      return <MagicMoveImageViewNativeComponent {...nativeProps} />;
    }
  };
}

export default MagicMoveImage;
