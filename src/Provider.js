import React from "react";
import MagicMoveAdministration from "./Administration";
import MagicMoveView from "./View";
import MagicMoveContext from "./Context";

/**
 * Top level magic move container. Wrap your app or the scene within
 * which you want to perform magic-move transitions with this
 * <MagicMove> component.
 */
class MagicMoveProvider extends React.Component {
  static View = MagicMoveView;

  constructor(props) {
    super(props);
    this._administration = new MagicMoveAdministration();
  }

  render() {
    const { children } = this.props; //eslint-disable-line
    return (
      <MagicMoveContext.Provider value={this._administration}>
        {children}
      </MagicMoveContext.Provider>
    );
  }
}

export default MagicMoveProvider;
