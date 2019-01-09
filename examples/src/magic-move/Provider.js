import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import MagicMoveAdministration from "./Administration";
import MagicMoveRenderer from "./Renderer";

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

/**
 * Top level magic move container. Wrap your app or the scene within
 * which you want to perform magic-move transitions with this
 * <MagicMove.Provider> component.
 */
class MagicMoveProvider extends Component {
  constructor(props) {
    super(props);
    this._administration = new MagicMoveAdministration();
  }

  render() {
    const { children } = this.props; //eslint-disable-line
    return (
      <MagicMoveAdministration.Context.Provider value={this._administration}>
        <View
          style={styles.container}
          collapsable={false}
          ref={this._setContainerRef}
        >
          {children}
        </View>
        <MagicMoveRenderer
          ref={this._setRendererRef}
          administration={this._administration}
        />
      </MagicMoveAdministration.Context.Provider>
    );
  }

  _setContainerRef = ref => {
    this._containerRef = ref;
    this._updateRef();
  };

  _setRendererRef = ref => {
    this._rendererRef = ref;
    this._updateRef();
  };

  _updateRef() {
    if (this._rendererRef) {
      this._rendererRef.setContainerRef(this._containerRef);
    }
  }
}

export default MagicMoveProvider;
