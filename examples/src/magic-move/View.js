import React, { Component } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import MagicMoveContext from "./Context";
import MagicMoveScene from "./Scene";
import MagicMoveAnimation from "./Animation";
import scaleTargetTransition from "./transitions/scaleTarget";

/**
 * An Animated view that is magically "moved" to the
 * new position/size that it was mounted on.
 */
class MagicMoveView extends Component {
  static propTypes = {
    Component: PropTypes.any.isRequired,
    AnimatedComponent: PropTypes.any.isRequired,
    id: PropTypes.string.isRequired,
    useNativeDriver: PropTypes.bool,
    keepHidden: PropTypes.bool,
    duration: PropTypes.number,
    delay: PropTypes.number,
    easing: PropTypes.func,
    debug: PropTypes.bool,
    transition: PropTypes.func
  };

  static defaultProps = {
    Component: View,
    AnimatedComponent: Animated.View,
    useNativeDriver: false,
    duration: 400,
    delay: 0,
    easing: Easing.inOut(Easing.ease),
    transition: scaleTargetTransition,
    keepHidden: false,
    debug: false
  };

  _ref = undefined;
  _sceneRef = undefined;

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
    this._isMounted = true;
    if (this._isInsideAnimation) return;
    if (this.props.debug)
      //eslint-disable-next-line
      console.debug(
        '[MagicMove] Mounted component with id "' + this.props.id + '"'
      );
    this.getAdministration().addComponent(this);
  }

  componentWillUnmount() {
    this._isMounted = false;
    if (this._isInsideAnimation) return;
    if (this.props.debug)
      //eslint-disable-next-line
      console.debug(
        '[MagicMove] Unmounted component with id "' + this.props.id + '"'
      );
    this.getAdministration().removeComponent(this);
  }

  componentDidUpdate() {
    //if (this._isInsideAnimation) return;
    // this.getAdministration().updateComponentProps(this);
  }

  render() {
    const { id, style, Component, ...otherProps } = this.props; // eslint-disable-line
    const { opacity } = this.state;
    return (
      <MagicMoveAnimation.Context.Consumer>
        {isInsideAnimation => {
          this._isInsideAnimation = isInsideAnimation;
          return (
            <MagicMoveContext.Consumer>
              {context => {
                this._context = context;
                return (
                  <MagicMoveScene.Context.Consumer>
                    {sceneRef => {
                      this._sceneRef = sceneRef;
                      return (
                        <Component
                          ref={this._setRef}
                          style={[style, { opacity }]}
                          {...otherProps}
                          collapsable={false}
                        />
                      );
                    }}
                  </MagicMoveScene.Context.Consumer>
                );
              }}
            </MagicMoveContext.Consumer>
          );
        }}
      </MagicMoveAnimation.Context.Consumer>
    );
  }

  _setRef = ref => {
    this._ref = ref;
  };

  getRef() {
    return this._ref;
  }

  getSceneRef() {
    return this._sceneRef;
  }

  setOpacity(val) {
    if (this.state.opacity !== val && this._isMounted) {
      if (this.props.debug) {
        //eslint-disable-next-line
        console.debug(
          "[MagicMove] " +
            (val ? "Showing" : "Hiding") +
            ' component with id "' +
            this.props.id +
            '"'
        );
      }
      this.setState({
        opacity: val
      });
    }
  }

  getStyle() {
    return StyleSheet.flatten([this.props.style]);
  }
}

export default MagicMoveView;
