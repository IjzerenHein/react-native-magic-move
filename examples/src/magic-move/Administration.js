import { createContext } from "react";

function resolveEnabled(enabled, id, isTarget, sceneId, currentSceneId) {
  if (typeof enabled === "function") {
    return enabled({
      id,
      isTarget,
      sceneId: sceneId || "",
      currentSceneId: currentSceneId || ""
    });
  } else if (enabled === undefined) {
    return true;
  }
  return !!enabled;
}
/*
  comp, sceneId, isTarget) {
  const { shouldSceneAnimate } = comp.props;
  if (typeof shouldSceneAnimate === "function") {
    return shouldSceneAnimate({
      sceneId: sceneId || "",
      isTarget
    });
  } else if (shouldSceneAnimate === undefined) {
    return true;
  }
  return !!shouldSceneAnimate;
  }*/

/**
 * The MagicMove administration keeps track of the
 * components that have been mounted/unmounted and
 * between which magic move transitions should be performed.
 * The general use is:
 *
 * - When a component is mounted with the same id of an already
 *   mounted component, then transition to the new component
 * - When a component is unmounted with the same id of an earlier
 *   mounted component, then transition to the previous component
 */
class MagicMoveAdministration {
  constructor() {
    this._components = {}; // registered components
    this._animations = []; // running animations
    this._listenerCallback = undefined;
  }

  addListener(callback) {
    this._listenerCallback = callback;
  }

  mountComponent(component) {
    const { id, debug, isSceneActive } = component.props;
    const isActive = isSceneActive === undefined ? true : isSceneActive;
    if (debug)
      //eslint-disable-next-line
      console.debug(`[MagicMove] Mounted ${component.debugName}`);
    const comps = this._components[id];
    if (!comps) {
      this._components[id] = {
        active: undefined,
        mounts: [component]
      };
    } else {
      comps.mounts.push(component);
    }
    if (isActive && comps.active !== component) {
      const prevComp = comps.active;
      comps.active = component;
      this._checkForAnimate(component, prevComp);
    }
  }

  unmountComponent(component) {
    const { id, debug } = component.props;
    const comps = this._components[id];
    if (!comps)
      throw new Error(
        `[MagicMove] Unmounting ${component.debugName} that was not mounted`
      );
    const idx = comps.mounts.indexOf(component);
    if (idx < 0)
      throw new Error(
        `[MagicMove] Unmounting ${component.debugName} that was not mounted`
      );
    comps.mounts.splice(idx, 1);
    if (!comps.mounts.length) {
      delete this._components[id];
    } else if (comps.mounts.active === component) {
      comps.mounts.active = comps.mounts[comps.mounts.length - 1];
    }
    if (debug)
      //eslint-disable-next-line
      console.debug(`[MagicMove] Unmounted ${component.debugName}`);
  }

  updateComponent(component) {
    const { id, isSceneActive } = component.props;
    if (isSceneActive === undefined) return;
    const comps = this._components[id];
    if (!comps)
      throw new Error(
        `[MagicMove] Updating ${component.debugName} that was not mounted`
      );
    const idx = comps.mounts.indexOf(component);
    if (idx < 0)
      throw new Error(
        `[MagicMove] Updating ${component.debugName} that was not mounted`
      );
    /*if (debug)
      //eslint-disable-next-line
      console.debug(`[MagicMove] Updated component with id "${id}"`);*/
    if (isSceneActive && comps.active !== component) {
      const prevComp = comps.active;
      comps.active = component;
      this._checkForAnimate(component, prevComp);
    }
  }

  isAnimatingComponent(component) {
    const { id } = component.props;
    const idx = this._animations.findIndex(anim => anim.id === id);
    return idx >= 0;
  }

  removeAnimation(id) {
    const idx = this._animations.findIndex(anim => anim.id === id);
    if (idx >= 0) {
      this._animations.splice(idx, 1);
    }
    if (this._listenerCallback) {
      this._listenerCallback();
    }
  }

  _checkForAnimate(component, prevComp) {
    const { id, debug, enabled, sceneId, sceneEnabled } = component.props;
    if (!prevComp) {
      if (debug) {
        // eslint-disable-next-line
        console.debug(
          `[MagicMove] Not animating ${
            component.debugName
          } (no other component found)`
        );
      }
      return;
    }
    if (!resolveEnabled(enabled, id, true, prevComp.props.sceneId, sceneId)) {
      if (debug) {
        // eslint-disable-next-line
        console.debug(
          `[MagicMove] Not animating ${
            component.debugName
          } (target component is disabled)`
        );
      }
      return;
    }
    if (
      !resolveEnabled(sceneEnabled, id, true, prevComp.props.sceneId, sceneId)
    ) {
      if (debug) {
        // eslint-disable-next-line
        console.debug(
          `[MagicMove] Not animating ${
            component.debugName
          } (target scene is disabled)`
        );
      }
      return;
    }
    if (
      !resolveEnabled(
        prevComp.props.enabled,
        id,
        false,
        sceneId,
        prevComp.props.sceneId
      )
    ) {
      if (debug) {
        // eslint-disable-next-line
        console.debug(
          `[MagicMove] Not animating ${
            component.debugName
          } (source component is disabled)`
        );
      }
      return;
    }
    if (
      !resolveEnabled(
        prevComp.props.sceneEnabled,
        id,
        false,
        sceneId,
        prevComp.props.sceneId
      )
    ) {
      if (debug) {
        // eslint-disable-next-line
        console.debug(
          `[MagicMove] Not animating ${
            component.debugName
          } (source scene is disabled)`
        );
      }
      return;
    }
    this._animate(id, component, prevComp);
  }

  _animate(id, to, from) {
    // console.log("animate: ", id);
    const anim = this._animations.find(anim => anim.id === id);
    if (anim) {
      anim.to = to;
    } else {
      this._animations.unshift({ id, from, to });
    }
    if (this._listenerCallback) {
      this._listenerCallback();
    }
  }

  get animations() {
    return this._animations;
  }
}

MagicMoveAdministration.Context = createContext(undefined);

export default MagicMoveAdministration;
