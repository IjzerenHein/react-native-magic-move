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

  _layout = undefined;

  constructor(props, context) {
    super(props, context);
    this.state = {
      opacity: new Animated.Value(1),
      id: props.id
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (state.id !== props.id) {
      throw new Error("The id prop of MagicMove.View cannot be changed");
    }
    return null;
  }

  getContext() {
    return this._context || this.context;
  }

  componentDidMount() {
    this.getContext().mountComponent(this);
  }

  componentWillUmount() {
    // this.getContext().unmountComponent(this);
  }

  componentDidUpdate() {
    this.getContext().updateComponentProps(this);
  }

  render() {
    const { id, style, onLayout, ...otherProps } = this.props; // eslint-disable-line
    const { opacity } = this.state;
    return (
      <MagicMoveContext.Consumer>
        {context => {
          this._context = context;
          return (
            <Animated.View
              style={[style, { opacity }]}
              onLayout={this._onLayout}
              {...otherProps}
            />
          );
        }}
      </MagicMoveContext.Consumer>
    );
  }

  _onLayout = event => {
    this._layout = event.currentTarget.layout;
    //this.context.updateComponentLayout(this);
    // console.log("onLayout", event);

    if (this.props.onLayout) {
      this.props.onLayout(event);
    }
  };

  setOpacity(val) {
    this.state.opacity.setValue(val);
  }

  get style() {
    // TODO
  }

  get layout() {
    return this._layout;
  }
}

// MagicMoveView.contextType = MagicMoveContext;

export default MagicMoveView;
