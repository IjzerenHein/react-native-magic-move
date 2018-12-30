import React from "react";
import { Animated, Text, Image } from "react-native";
import MagicMoveAdministration from "./Administration";
import MagicMoveView from "./View";
import createMagicMoveComponent from "./createMagicMoveComponent";
import MagicMoveScene from "./Scene";
import MagicMoveContext from "./Context";
import MagicMoveRenderer from "./Renderer";

/**
 * Top level magic move container. Wrap your app or the scene within
 * which you want to perform magic-move transitions with this
 * <MagicMove> component.
 */
class MagicMove extends React.Component {
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

MagicMove.View = MagicMoveView;
MagicMove.Text = createMagicMoveComponent(Text, Animated.Text);
MagicMove.Image = createMagicMoveComponent(Image, Animated.Image);
MagicMove.Scene = MagicMoveScene;
MagicMove.createMagicMoveComponent = createMagicMoveComponent;

export default MagicMove;
