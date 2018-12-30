import React, { Component } from "react";
import MagicMoveAdministration from "./Administration";
import MagicMoveContext from "./Context";
import MagicMoveRenderer from "./Renderer";

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
      <MagicMoveContext.Provider value={this._administration}>
        {children}
        <MagicMoveRenderer administration={this._administration} />
      </MagicMoveContext.Provider>
    );
  }
}

export default MagicMoveProvider;
