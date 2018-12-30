import React, { Component, createContext } from "react";
import { View } from "react-native";

const MagicMoveSceneContext = createContext(undefined);

class MagicMoveScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ref: undefined
    };
  }

  render() {
    const { children, ...otherProps } = this.props; //eslint-disable-line
    return (
      <View ref={this._setRef} {...otherProps}>
        <MagicMoveSceneContext.Provider value={this.state.ref}>
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
