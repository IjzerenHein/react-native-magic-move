import React, { Component, createContext } from "react";
import { View } from "react-native";
import { PropTypes } from "prop-types";

const MagicMoveSceneContext = createContext(undefined);

class MagicMoveScene extends Component {
  static propTypes = {
    children: PropTypes.any,
    id: PropTypes.string,
    enabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    active: PropTypes.bool
  };

  static defaultProps = {
    enabled: true
  };

  state = {
    ref: undefined
  };

  render() {
    const { children, id, enabled, active, ...otherProps } = this.props;
    const { ref } = this.state;
    return (
      <View ref={this._setRef} {...otherProps} collapsable={false}>
        <MagicMoveSceneContext.Provider
          value={{
            ref,
            id,
            enabled,
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

let HookedComponent;
function addHook(Component) {
  HookedComponent = Component;
}

const MagicMoveSceneWrapper = props => {
  const scene = <MagicMoveScene {...props} />;
  if (HookedComponent) {
    return <HookedComponent>{scene}</HookedComponent>;
  } else {
    return scene;
  }
};

MagicMoveSceneWrapper.Context = MagicMoveSceneContext;
MagicMoveSceneWrapper.addHook = addHook;

export default MagicMoveSceneWrapper;
