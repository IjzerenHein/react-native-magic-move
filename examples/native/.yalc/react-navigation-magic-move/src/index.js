import React, { Component } from "react";
import { Scene } from "react-native-magic-move";
import { NavigationEvents } from "react-navigation";
import PropTypes from "prop-types";

class ReactNavigationScene extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  };

  state = {
    active: false,
    id: undefined
  };

  render() {
    const { active, id } = this.state;
    const { children } = this.props;
    return (
      <React.Fragment>
        <NavigationEvents
          onWillFocus={this.onWillFocus}
          onWillBlur={this.onWillBlur}
          // onDidFocus={payload => console.log("did focus", payload)}
          // onDidBlur={payload => console.log("did blur", payload)}
        />
        {// eslint-disable-next-line
        React.cloneElement(children, {
          active:
            children.props.active !== undefined
              ? children.props.active
              : active,
          id: children.props.id || id // eslint-disable-line
        })}
      </React.Fragment>
    );
  }

  onWillFocus = event => {
    this.setState({
      id: event.state.routeName,
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

export default ReactNavigationScene;
