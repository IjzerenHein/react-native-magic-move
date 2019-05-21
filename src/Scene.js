import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { PropTypes } from "prop-types";
import {
  withMagicMoveContext,
  MagicMoveContextProvider,
  MagicMoveContextPropType
} from "./Context";
import { performanceNow, measureLayout } from "./clone/measure";
import MagicMoveClone from "./clone/Clone";

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

let autoId = 0;

class MagicMoveScene extends Component {
  static propTypes = {
    children: PropTypes.any,
    id: PropTypes.string,
    disabled: PropTypes.bool,
    active: PropTypes.bool,
    debug: PropTypes.bool,
    useNativeClone: PropTypes.bool,
    mmContext: MagicMoveContextPropType,
    onWillAppear: PropTypes.func,
    onWillDisappear: PropTypes.func
    // onDidAppear: PropTypes.func,
    // onDidDisappear: PropTypes.func,
  };

  static defaultProps = {
    disabled: false,
    useNativeClone: MagicMoveClone.isNativeAvailable
  };

  _ref = undefined;
  _uniqueId = "__autoSceneId" + autoId++;
  _active = undefined;
  _lastMeasureResult = undefined;
  _lastMeasureTime = 0;

  get isScene() {
    return true;
  }

  get ref() {
    return this._ref;
  }

  get id() {
    return this._uniqueId;
  }

  get isDebug() {
    const { debug, mmContext } = this.props;
    return debug !== undefined ? debug : mmContext.isDebug;
  }

  get debugName() {
    return `scene "${this.props.id || this.id}"`;
  }

  componentDidMount() {
    if (this.isDebug) {
      // eslint-disable-next-line
      console.debug(
        `[MagicMove] Mounted ${this.debugName} (active = ${this.isActive})`
      );
    }
  }

  componentWillUnmount() {
    if (this.isDebug) {
      // eslint-disable-next-line
      console.debug(
        `[MagicMove] Unmounted ${this.debugName} (active = ${this.isActive})`
      );
    }
  }

  render() {
    const {
      children,
      id, // eslint-disable-line
      disabled, // eslint-disable-line
      active, // eslint-disable-line
      debug, // eslint-disable-line
      mmContext, // eslint-disable-line
      useNativeClone, // eslint-disable-line
      ...otherProps
    } = this.props;
    return (
      <View
        ref={this._setRef}
        style={styles.container}
        {...otherProps}
        collapsable={false}
      >
        <MagicMoveContextProvider value={this}>
          {children}
        </MagicMoveContextProvider>
      </View>
    );
  }

  componentDidUpdate() {
    const { isActive, isDebug } = this;
    if (isActive !== undefined) {
      if (this._active !== isActive) {
        this._active = isActive;
        if (isDebug) {
          // eslint-disable-next-line
          console.debug(
            `[MagicMove] ${isActive ? "Activated" : "De-activated"} ${
              this.debugName
            }`
          );
        }
        this.props.mmContext.administration.activateScene(this, isActive);
        if (!isActive) {
          if (this.props.onWillDisappear) {
            this.props.onWillDisappear();
          }
        } else {
          if (this.props.onWillAppear) {
            this.props.onWillAppear();
          }
        }
      }
    }
  }

  _setRef = ref => {
    this._ref = ref;
  };

  get isActive() {
    return this.props.active;
  }

  measure(forceRemeasure) {
    const now = performanceNow();
    if (
      this._lastMeasureResult &&
      (now - this._lastMeasureTime < 16 ||
        (now - this._lastMeasureTime <= 100 && !forceRemeasure))
    ) {
      return this._lastMeasureResult;
    }
    this._lastMeasureTime = now;
    this._lastMeasureResult = measureLayout(this);
    return this._lastMeasureResult;
  }
}

let HookedComponent;
function addHook(Component) {
  HookedComponent = Component;
}

const MagicMoveSceneWrapper = props => {
  const scene = <MagicMoveScene {...props} />;
  if (HookedComponent) {
    return <HookedComponent>{scene}</HookedComponent>;
  } else {
    return scene;
  }
};

const Scene = withMagicMoveContext(MagicMoveSceneWrapper);

Scene.addHook = addHook;

export default Scene;
