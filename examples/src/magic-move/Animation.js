/* globals Promise */
import React from "react";
import { Animated, View, StyleSheet } from "react-native";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }
});

function measureLayout(ref) {
  return new Promise(resolve => {
    function onMeasure(x, y, width, height, pageX, pageY) {
      if (width || height || pageX || pageY) {
        return resolve({
          x: pageX,
          y: pageY,
          width,
          height
        });
      }
      requestAnimationFrame(() => {
        ref.measure(onMeasure);
      });
    }
    ref.measure(onMeasure);
  });
}

const ANIMATABLE_PROPS = [
  "borderRightColor",
  "borderBottomColor",
  "borderBottomEndRadius",
  "borderBottomLeftRadius",
  "borderBottomRightRadius",
  "borderBottomStartRadius",
  "borderBottomWidth",
  "borderColor",
  "borderEndColor",
  "borderLeftColor",
  "borderLeftWidth",
  "borderRadius",
  "backgroundColor",
  "borderRightWidth",
  "borderStartColor",
  "borderStyle",
  "borderTopColor",
  "borderTopEndRadius",
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderTopStartRadius",
  "borderTopWidth",
  "borderWidth",
  "opacity",
  "elevation"
];

/**
 * 1. Hide to component
 * 2. Get layout to and from component
 * 3. Render MagicMove component
 * 4. Hide from component
 * 5. Animate...
 * 6. Show to component
 * 7. Remove MagicMove component
 */
class MagicMoveAnimation extends React.Component {
  static propTypes = {
    from: PropTypes.object.isRequired,
    to: PropTypes.object.isRequired,
    onCompleted: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      animValue: new Animated.Value(0),
      container: undefined,
      from: undefined,
      to: undefined
    };

    //
    // 1. Hide real to component
    //
    props.to.setOpacity(0);
  }

  componentDidMount() {
    //
    // 2. Get layout for from and to position
    //
    const { to, from } = this.props;
    Promise.all([
      measureLayout(this._ref),
      measureLayout(to.getRef()),
      measureLayout(from.getRef())
    ]).then(layouts => {
      this.setState({
        container: layouts[0],
        to: {
          ...to.getStyle(),
          ...layouts[1]
        },
        from: {
          ...from.getStyle(),
          ...layouts[2]
        }
      });
    });
  }

  interpolate(from, to) {
    return this.state.animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [from, to]
    });
  }

  render() {
    console.log("RENDER");
    const { container, to, from } = this.state;
    let content;

    //
    // 3. Render MagicMove component
    //
    if (container && to && from) {
      const width = to.width;
      const height = to.height;
      const x = this.interpolate(from.x - (to.width - from.width) / 2, to.x);
      const y = this.interpolate(from.y - (to.height - from.height) / 2, to.y);
      const scaleX = this.interpolate(from.width / to.width, 1);
      const scaleY = this.interpolate(from.height / to.height, 1);
      // const backgroundColor = this.interpolate(from)

      const style = {
        position: "absolute",
        width: width,
        height: height,
        left: 0,
        top: 0,
        transform: [
          { translateX: x },
          { translateY: y },
          { scaleX: scaleX },
          { scaleY: scaleY }
        ]
      };
      ANIMATABLE_PROPS.forEach(propName => {
        if (to[propName] || from[propName]) {
          style[propName] = this.interpolate(from[propName], to[propName]);
        }
      });

      content = (
        <Animated.View style={style}>
          {/*this._targetComponent.props.children*/}
        </Animated.View>
      );
    }
    return (
      <View ref={this._setRef} style={styles.container} pointerEvents="none">
        {content}
      </View>
    );
  }

  _setRef = ref => {
    this._ref = ref;
  };

  componentDidUpdate() {
    const { animValue, container, to, from } = this.state;
    if (to && from && container) {
      //
      // 4. Hide from component
      //
      this.props.from.setOpacity(0);

      //
      // 5. Animate...
      //
      const useNativeDriver =
        this.props.to.props.useNativeDriver &&
        this.props.from.props.useNativeDriver;
      Animated.timing(animValue, {
        toValue: 1,
        duration: 400,
        useNativeDriver
      }).start(() => {
        const { to, onCompleted } = this.props;
        to.setOpacity(1);
        onCompleted();
      });
    }
  }
}

export default MagicMoveAnimation;
