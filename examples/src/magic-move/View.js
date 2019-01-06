import React, { Component } from "react";
import { Animated, StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import MagicMoveAdministration from "./Administration";
import MagicMoveScene from "./Scene";
import MagicMoveAnimation from "./Animation";

const propTypes = {
  Component: PropTypes.any.isRequired,
  AnimatedComponent: PropTypes.any.isRequired,
  id: PropTypes.string.isRequired,
  useNativeDriver: PropTypes.bool,
  keepHidden: PropTypes.bool,
  duration: PropTypes.number,
  delay: PropTypes.number,
  easing: PropTypes.func,
  debug: PropTypes.bool,
  enabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  transition: PropTypes.func
};

/**
 * An Animated view that is magically "moved" to the
 * new position/size that it was mounted on.
 */
class MagicMoveView extends Component {
  static propTypes = {
    ...propTypes,
    isClone: PropTypes.bool.isRequired,
    isTarget: PropTypes.bool.isRequired,
    administration: PropTypes.object.isRequired,
    sceneRef: PropTypes.any,
    sceneId: PropTypes.string,
    isSceneActive: PropTypes.bool,
    sceneEnabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func])
  };

  static defaultProps = {
    Component: View,
    AnimatedComponent: Animated.View,
    enabled: true,
    keepHidden: false,
    debug: false
  };

  _ref = undefined;
  _isMounted = false;

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
    const { administration } = this.props;
    if (!administration) {
      //eslint-disable-next-line
      console.error(
        "[MagicMove] Component could not find Provider, did you forget to wrap your App in `<MagicMove.Provider>`?"
      );
    }
    return administration;
  }

  componentDidMount() {
    const { isClone } = this.props;
    this._isMounted = true;
    if (!isClone) {
      this.getAdministration().mountComponent(this);
    }
  }

  componentWillUnmount() {
    const { isClone } = this.props;
    this._isMounted = false;
    if (!isClone) {
      this.getAdministration().unmountComponent(this);
    }
  }

  componentDidUpdate() {
    const { isClone } = this.props;
    if (!this._isMounted || isClone) return;
    this.getAdministration().updateComponent(this);
  }

  render() {
    const {
      id, // eslint-disable-line
      style,
      Component,
      isClone,
      isTarget, // eslint-disable-line
      administration, // eslint-disable-line
      sceneRef, // eslint-disable-line
      sceneId, // eslint-disable-line
      sceneEnabled, // eslint-disable-line
      isSceneActive, // eslint-disable-line
      ...otherProps
    } = this.props;
    const { opacity } = this.state;
    if (isClone && this.getAdministration().isAnimatingComponent(this)) {
      return <Component style={[style, { opacity: 0 }]} {...otherProps} />;
    }

    return (
      <Component
        ref={this._setRef}
        style={[style, opacity !== undefined ? { opacity } : undefined]}
        {...otherProps}
        collapsable={false}
      />
    );
  }

  _setRef = ref => {
    this._ref = ref;
  };

  get debugName() {
    const { Component, id } = this.props;
    return `${Component.render.name || "component"} "${id}"`;
  }

  getRef() {
    return this._ref;
  }

  getSceneRef() {
    return this.props.sceneRef;
  }

  setOpacity(val) {
    if (this.state.opacity !== val && this._isMounted) {
      this.setState({
        opacity: val
      });
    }
  }

  getStyle() {
    return StyleSheet.flatten([this.props.style]);
  }
}

const MagicMoveWrappedView = props => {
  return (
    <MagicMoveAnimation.Context.Consumer>
      {({ isClone, isTarget }) => (
        <MagicMoveAdministration.Context.Consumer>
          {administration => (
            <MagicMoveScene.Context.Consumer>
              {scene => (
                <MagicMoveView
                  {...props}
                  isClone={isClone}
                  isTarget={isTarget}
                  administration={administration}
                  sceneRef={scene ? scene.ref : undefined}
                  sceneId={scene ? scene.id : undefined}
                  sceneEnabled={scene ? scene.enabled : undefined}
                  isSceneActive={scene ? scene.active : undefined}
                />
              )}
            </MagicMoveScene.Context.Consumer>
          )}
        </MagicMoveAdministration.Context.Consumer>
      )}
    </MagicMoveAnimation.Context.Consumer>
  );
};
MagicMoveWrappedView.propTypes = propTypes;
MagicMoveWrappedView.defaultProps = MagicMoveView.defaultProps;

export default MagicMoveWrappedView;
