import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import * as MagicMove from "react-native-magic-move";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    overflow: "hidden"
  }
});

class TransitionComponent extends Component {
  static propTypes = {
    componentStore: PropTypes.object.isRequired,
    style: PropTypes.any
  };

  render() {
    const { componentStore } = this.props;
    const {
      id,
      size,
      shape,
      content,
      position,
      transition,
      duration,
      easing,
      disabled
    } = componentStore;
    const { backgroundColor, imageSource, imageSize } = content;
    const style = {
      margin: 10,
      width: size.width,
      height: size.height,
      ...shape.shapeFn(size)
    };
    if (backgroundColor) style.backgroundColor = backgroundColor;
    if (size.label === "Max") {
      style.margin = 0;
      style.height = undefined;
      style.flex = 1;
    }

    const compProps = {
      id,
      style,
      transition: transition.transition,
      duration: duration.duration,
      easing: easing.easing,
      disabled: disabled.disabled
    };
    return (
      <View
        style={[
          styles.container,
          this.props.style,
          {
            justifyContent: position.justifyContent,
            alignItems: position.alignItems
          }
        ]}
      >
        {imageSource ? (
          <MagicMove.Image
            source={imageSource}
            resizeMode="cover"
            {...compProps}
          />
        ) : (
          <MagicMove.View {...compProps} />
        )}
      </View>
    );
  }
}

export default observer(TransitionComponent);
