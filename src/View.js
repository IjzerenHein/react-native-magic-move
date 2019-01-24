import React, { Component } from "react";
import { Animated, View } from "react-native";
import PropTypes from "prop-types";
import MagicMoveAdministration from "./Administration";
import MagicMoveScene from "./Scene";
import MagicMoveContext from "./Context";

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
  disabled: PropTypes.bool,
  transition: PropTypes.func,
  imageSizeHint: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number
  })
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
    scene: PropTypes.any
  };

  static defaultProps = {
    Component: View,
    AnimatedComponent: Animated.View,
    disabled: false,
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

  render() {
    const {
      Component,
      style,
      isClone,
      id, // eslint-disable-line
      AnimatedComponent, // eslint-disable-line
      useNativeDriver, // eslint-disable-line
      keepHidden, // eslint-disable-line
      duration, // eslint-disable-line
      delay, // eslint-disable-line
      easing, // eslint-disable-line
      debug, // eslint-disable-line
      disabled, // eslint-disable-line
      transition, // eslint-disable-line
      isTarget, // eslint-disable-line
      administration, // eslint-disable-line
      scene, // eslint-disable-line
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
    return `${(Component.render ? Component.render.name : undefined) ||
      "component"} "${id}"`;
  }

  getRef() {
    return this._ref;
  }

  setOpacity(val) {
    if (this.state.opacity !== val && this._isMounted) {
      this.setState({
        opacity: val
      });
    }
  }
}

const MagicMoveWrappedView = props => {
  return (
    <MagicMoveContext>
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
                  scene={scene}
                />
              )}
            </MagicMoveScene.Context.Consumer>
          )}
        </MagicMoveAdministration.Context.Consumer>
      )}
    </MagicMoveContext>
  );
};
MagicMoveWrappedView.propTypes = propTypes;
MagicMoveWrappedView.defaultProps = MagicMoveView.defaultProps;

export default MagicMoveWrappedView;
