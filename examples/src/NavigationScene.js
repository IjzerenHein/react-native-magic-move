import React, { Component } from "react";
import { Scene } from "./magic-move";
import { NavigationEvents } from "react-navigation";

class ReactNavigationScene extends Component {
  state = {
    active: false
  };
  render() {
    const { active } = this.state;
    return (
      <React.Fragment>
        <NavigationEvents
          onWillFocus={this.onWillFocus}
          onWillBlur={this.onWillBlur}
          // onDidFocus={payload => console.log("did focus", payload)}
          // onDidBlur={payload => console.log("did blur", payload)}
        />
        {// eslint-disable-next-line
        React.cloneElement(this.props.children, {
          active
        })}
      </React.Fragment>
    );
  }

  onWillFocus = () => {
    this.setState({
      active: true
    });
  };

  onWillBlur = () => {
    this.setState({
      active: false
    });
  };
}

Scene.addHook(ReactNavigationScene);
