import React, { Component, createContext } from "react";
import { View } from "react-native";
import { PropTypes } from "prop-types";
import MagicMoveAdministration from "./Administration";

const MagicMoveSceneContext = createContext(undefined);

let autoId = 0;

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

  _ref = undefined;
  _uniqueId = "__autoSceneId" + autoId++;

  render() {
    // eslint-disable-next-line
    const { children, id, enabled, active, ...otherProps } = this.props;
    return (
      <View ref={this._setRef} {...otherProps} collapsable={false}>
        <MagicMoveAdministration.Context.Consumer>
          {administration => {
            this._administration = administration;
            return (
              <MagicMoveSceneContext.Provider value={this}>
                {children}
              </MagicMoveSceneContext.Provider>
            );
          }}
        </MagicMoveAdministration.Context.Consumer>
      </View>
    );
  }

  componentDidUpdate() {
    if (this.props.active !== undefined) {
      this._administration.activateScene(this, this.props.active);
    }
  }

  _setRef = ref => {
    this._ref = ref;
  };

  getRef() {
    return this._ref;
  }

  getId() {
    return this._uniqueId;
  }
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
