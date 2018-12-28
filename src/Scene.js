import React from "react";
import { View } from "react-native";

const MagicMoveSceneContext = React.createContext(undefined);

class MagicMoveScene extends React.Component {
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
