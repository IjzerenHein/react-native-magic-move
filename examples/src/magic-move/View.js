import React from "react";
import { StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import MagicMoveContext from "./Context";

/**
 * An Animated view that is magically "moved" to the
 * new position/size that it was mounted on.
 */
class MagicMoveView extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    useNativeDriver: PropTypes.bool
    /** show:
          hide:
          update:*/
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
    const { id, style, ...otherProps } = this.props; // eslint-disable-line
    const { opacity } = this.state;
    return (
      <MagicMoveContext.Consumer>
        {context => {
          this._context = context;
          return (
            <View
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
    //this.state.opacity.setValue(val);
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
