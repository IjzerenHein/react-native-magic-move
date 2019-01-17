import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { observable } from "mobx";
import { inject, observer, Provider } from "mobx-react";

class Store {
  constructor() {
    this._debug = observable.box(false);
  }

  get debug() {
    return this._debug.get();
  }
  set debug(val) {
    this._debug.set(val);
  }
}

class StoreProvider extends PureComponent {
  state = {
    store: new Store()
  };

  render() {
    return <Provider store={this.state.store} {...this.props} />;
  }
}

function storeObserver(WrappedComponent) {
  return inject("store")(observer(WrappedComponent));
}

const StorePropType = PropTypes.any.isRequired;

export { Store, StoreProvider, storeObserver, StorePropType };
