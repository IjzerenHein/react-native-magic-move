import { createContext } from "react";

function shouldAnimateComponent(comp, sceneId, isTarget) {
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
}

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
    const { id, isSceneActive } = component.props;
    const isActive = isSceneActive === undefined ? true : isSceneActive;
    // console.log("mountComp: ", id);
    const comps = this._components[id];
    if (!comps) {
      this._components[id] = {
        active: isActive ? component : undefined,
        mounts: [component]
      };
      return;
    }
    comps.mounts.push(component);
    if (isActive && comps.active !== component) {
      const prevComp = comps.active;
      comps.active = component;
      if (prevComp) {
        if (
          shouldAnimateComponent(component, prevComp.props.sceneId, true) &&
          shouldAnimateComponent(prevComp, component.props.sceneId, false)
        ) {
          this._animate(id, component, prevComp);
        }
      }
    }
  }

  unmountComponent(component) {
    const { id } = component.props;
    const comps = this._components[id];
    if (!comps)
      throw new Error(
        "MagicMove: Unmounting a component with id " +
          id +
          " that was not mounted"
      );
    const idx = comps.mounts.indexOf(component);
    if (idx < 0)
      throw new Error(
        "MagicMove: Unmounting a component with id " +
          id +
          " that was not mounted"
      );
    comps.mounts.splice(idx, 1);
    if (!comps.mounts.length) {
      delete this._components[id];
    } else if (comps.mounts.active === component) {
      comps.mounts.active = comps.mounts[comps.mounts.length - 1];
    }
  }

  updateComponent(component) {
    const { id, isSceneActive } = component.props;
    if (isSceneActive === undefined) return;
    const comps = this._components[id];
    if (!comps)
      throw new Error(
        "MagicMove: Updating a component with id " +
          id +
          " that was not mounted"
      );
    const idx = comps.mounts.indexOf(component);
    if (idx < 0)
      throw new Error(
        "MagicMove: Updating a component with id " +
          id +
          " that was not mounted"
      );
    if (isSceneActive && comps.active !== component) {
      const prevComp = comps.active;
      comps.active = component;
      if (prevComp) {
        if (
          shouldAnimateComponent(component, prevComp.props.sceneId, true) &&
          shouldAnimateComponent(prevComp, component.props.sceneId, false)
        ) {
          this._animate(id, component, prevComp);
        }
      }
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
