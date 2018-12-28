import React from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import MagicMoveContext from "./Context";

/**
 * An Animated view that is magically "moved" to the
 * new position/size that it was mounted on.
 */
class MagicMoveView extends React.Component {
  static propTypes = {
    Component: PropTypes.any.isRequired,
    AnimatedComponent: PropTypes.any.isRequired,
    id: PropTypes.string.isRequired,
    useNativeDriver: PropTypes.bool,
    keepHidden: PropTypes.bool,
    duration: PropTypes.number,
    delay: PropTypes.number,
    easing: PropTypes.func,
    debug: PropTypes.bool
  };

  static defaultProps = {
    Component: View,
    AnimatedComponent: Animated.View,
    useNativeDriver: false,
    duration: 500,
    delay: 0,
    easing: Easing.inOut(Easing.ease),
    keepHidden: false,
    debug: false
  };

  _ref = undefined;

  constructor(props, context) {
    super(props, context);
    this.state = {
      opacity: 1,
      id: props.id
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (state.id !== props.id) {
      throw new Error("The id prop of MagicMove.View cannot be changed");
    }
    return null;
  }

  getAdministration() {
    return this._context || this.context;
  }

  componentDidMount() {
    this.getAdministration().addComponent(this);
  }

  componentWillUnmount() {
    this.getAdministration().removeComponent(this);
  }

  componentDidUpdate() {
    // this.getAdministration().updateComponentProps(this);
  }

  render() {
    const { id, style, Component, ...otherProps } = this.props; // eslint-disable-line
    const { opacity } = this.state;
    return (
      <MagicMoveContext.Consumer>
        {context => {
          this._context = context;
          return (
            <Component
              ref={this._setRef}
              style={[style, { opacity }]}
              {...otherProps}
            />
          );
        }}
      </MagicMoveContext.Consumer>
    );
  }

  _setRef = ref => {
    this._ref = ref;
  };

  getRef() {
    return this._ref;
  }

  setOpacity(val) {
    if (this.state.opacity !== val) {
      this.setState({
        opacity: val
      });
    }
  }

  getStyle() {
    return StyleSheet.flatten([this.props.style]);
  }
}

// MagicMoveView.contextType = MagicMoveContext;

export default MagicMoveView;
