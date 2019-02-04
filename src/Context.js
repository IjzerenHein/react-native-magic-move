import React, { Component, createContext } from "react";
import PropTypes from "prop-types";

const Context = createContext(undefined);

class MagicMoveContextValue {
  constructor(parent) {
    this._parent = parent;
  }

  get parent() {
    return this._parent;
  }

  get provider() {
    let parent = this._parent;
    while (parent) {
      if (parent.isProvider) return parent;
      parent = parent.props.mmContext
        ? parent.props.mmContext.parent
        : undefined;
    }
    //eslint-disable-next-line
    console.error(
      "[MagicMove] Component could not find Provider, did you forget to wrap your App in `<MagicMove.Provider>`?"
    );
    return undefined;
  }

  get administration() {
    const { provider } = this;
    return provider ? provider.administration : undefined;
  }

  get scene() {
    let parent = this._parent;
    while (parent) {
      if (parent.isScene) return parent;
      parent = parent.props.mmContext
        ? parent.props.mmContext.parent
        : undefined;
    }
    return undefined;
  }

  get clone() {
    let parent = this._parent;
    while (parent) {
      if (parent.isClone) return parent;
      parent = parent.props.mmContext
        ? parent.props.mmContext.parent
        : undefined;
    }
    return undefined;
  }

  get isProvider() {
    return this._parent.isProvider;
  }

  get isScene() {
    return this._parent.isScene;
  }

  get isComponent() {
    return this._parent.isComponent;
  }

  get isClone() {
    const { clone } = this;
    return clone ? true : false;
  }

  get isTarget() {
    const { clone } = this;
    return clone ? clone.isTarget : false;
  }

  get isDebug() {
    let parent = this._parent;
    while (parent) {
      if (parent.props.debug) return true;
      parent = parent.props.mmContext
        ? parent.props.mmContext.parent
        : undefined;
    }
    return false;
  }
}

export class MagicMoveContextProvider extends Component {
  static propTypes = {
    value: PropTypes.object.isRequired,
    children: PropTypes.any
  };

  state = {
    value: undefined
  };

  static getDerivedStateFromProps(props, state) {
    if (!state.value || state.value.parent !== props.value) {
      return {
        value: new MagicMoveContextValue(props.value)
      };
    }
    return null;
  }

  render() {
    return (
      <Context.Provider value={this.state.value}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export const MagicMoveContextConsumer = Context.Consumer;

export const MagicMoveContextPropType = PropTypes.object.isRequired;

export function withMagicMoveContext(WrappedComponent) {
  const comp = props => {
    return (
      <Context.Consumer>
        {mmContext => <WrappedComponent {...props} mmContext={mmContext} />}
      </Context.Consumer>
    );
  };
  comp.propTypes = {
    ...(WrappedComponent.propTypes || {})
  };
  delete comp.propTypes.mmContext;
  comp.defaultProps = WrappedComponent.defaultProps;
  return comp;
}
