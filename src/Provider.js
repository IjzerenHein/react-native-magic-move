import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import MagicMoveAdministration from "./Administration";
import { MagicMoveContextProvider } from "./Context";
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
  static propTypes = {
    debug: PropTypes.bool
  };

  _administration = new MagicMoveAdministration();
  _ref = undefined;

  get isProvider() {
    return true;
  }

  get administration() {
    return this._administration;
  }

  get isDebug() {
    return this.props.debug;
  }

  get debugName() {
    return "provider";
  }

  get ref() {
    return this._ref;
  }

  render() {
    const { children } = this.props; //eslint-disable-line
    return (
      <MagicMoveContextProvider value={this}>
        <View style={styles.container} collapsable={false} ref={this._setRef}>
          {children}
        </View>
        <MagicMoveRenderer administration={this._administration} />
      </MagicMoveContextProvider>
    );
  }

  _setRef = ref => {
    this._ref = ref;
  };
}

export default MagicMoveProvider;
