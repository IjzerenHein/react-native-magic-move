import React from "react";
import MagicMoveAdministration from "./Administration";
import MagicMoveView from "./View";
import MagicMoveText from "./Text";
import MagicMoveImage from "./Image";
import MagicMoveContext from "./Context";
import MagicMoveRenderer from "./Renderer";

/**
 * Top level magic move container. Wrap your app or the scene within
 * which you want to perform magic-move transitions with this
 * <MagicMove> component.
 */
class MagicMoveProvider extends React.Component {
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

MagicMoveProvider.View = MagicMoveView;
MagicMoveProvider.Text = MagicMoveText;
MagicMoveProvider.Image = MagicMoveImage;

export default MagicMoveProvider;
