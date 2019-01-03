import React, { Component } from "react";
import { Animated, StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import MagicMoveAdministration from "./Administration";
import MagicMoveScene from "./Scene";
import MagicMoveAnimation from "./Animation";
import morphTransition from "./transitions/morph";

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
    transition: morphTransition,
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
    if (props.id === undefined) {
      // eslint-disable-next-line
      console.error('[MagicMove] Missing "id" prop in MagicMove component');
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (state.id !== props.id) {
      throw new Error(
        "The id prop of MagicMove.View cannot be changed, previous: " +
          state.id +
          ", new: " +
          props.id
      );
    }
    return null;
  }

  getAdministration() {
    return this._administration || this.context;
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isClone) return;
    if (this.props.debug)
      //eslint-disable-next-line
      console.debug(
        '[MagicMove] Mounted component with id "' + this.props.id + '"'
      );
    this.getAdministration().addComponent(this);
  }

  componentWillUnmount() {
    this._isMounted = false;
    if (this._isClone) return;
    if (this.props.debug)
      //eslint-disable-next-line
      console.debug(
        '[MagicMove] Unmounted component with id "' + this.props.id + '"'
      );
    this.getAdministration().removeComponent(this);
  }

  componentDidUpdate() {
    //if (this._isClone) return;
    // this.getAdministration().updateComponentProps(this);
  }

  render() {
    const { id, style, Component, ...otherProps } = this.props; // eslint-disable-line
    const { opacity } = this.state;
    return (
      <MagicMoveAnimation.Context.Consumer>
        {({ isClone }) => {
          this._isClone = isClone;
          return (
            <MagicMoveAdministration.Context.Consumer>
              {administration => {
                this._administration = administration;
                if (
                  isClone &&
                  this.getAdministration().isAnimatingComponent(this)
                ) {
                  return (
                    <Component
                      style={[style, { opacity: 0 }]}
                      {...otherProps}
                    />
                  );
                }
                return (
                  <MagicMoveScene.Context.Consumer>
                    {sceneRef => {
                      this._sceneRef = sceneRef;
                      return (
                        <Component
                          ref={this._setRef}
                          style={[
                            style,
                            opacity !== undefined ? { opacity } : undefined
                          ]}
                          {...otherProps}
                          collapsable={false}
                        />
                      );
                    }}
                  </MagicMoveScene.Context.Consumer>
                );
              }}
            </MagicMoveAdministration.Context.Consumer>
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
