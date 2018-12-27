import React from "react";
import { Animated } from "react-native";
import PropTypes from "prop-types";
import MagicMoveContext from "./Context";

/**
 * An Animated view that is magically "moved" to the
 * new position/size that it was mounted on.
 */
class MagicMoveView extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired
    /** show:
          hide:
          update:*/
  };

  static contextType = MagicMoveContext;

  constructor(props) {
    super(props);
    this.state = {
      id: props.id
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (state.id !== props.id) {
      throw new Error("The id prop of MagicMove.View cannot be changed");
    }
    return null;
  }

  componenentDidMount() {
    this.context.mountComponent(this);
  }

  componentWillUmount() {
    this.context.unmountComponent(this);
  }

  componentDidUpdate() {
    // TODO UPDATE
  }

  render() {
    const { children } = this.props; // eslint-disable-line
    return <Animated.View>{children}</Animated.View>;
  }

  _getStyle() {}

  async _show(startStyle) {}

  _hide() {}
}

export default MagicMoveView;
