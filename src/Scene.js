import React, { Component, createContext } from "react";
import { View } from "react-native";
import { PropTypes } from "prop-types";

const MagicMoveSceneContext = createContext(undefined);

class MagicMoveScene extends Component {
  static propTypes = {
    children: PropTypes.any,
    id: PropTypes.string,
    animate: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    active: PropTypes.bool
  };

  static defaultProps = {
    animated: true
  };

  state = {
    ref: undefined
  };

  render() {
    const { children, id, animate, active, ...otherProps } = this.props;
    const { ref } = this.state;
    return (
      <View ref={this._setRef} {...otherProps} collapsable={false}>
        <MagicMoveSceneContext.Provider
          value={{
            ref,
            id,
            animate,
            active
          }}
        >
          {children}
        </MagicMoveSceneContext.Provider>
      </View>
    );
  }

  _setRef = ref => {
    if (this.state.ref !== ref) {
      this.setState({ ref });
    }
  };
}

MagicMoveScene.Context = MagicMoveSceneContext;

export default MagicMoveScene;
