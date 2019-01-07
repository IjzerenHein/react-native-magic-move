import { createContext } from "react";

/**
 * - Animate on mount (when sceneActive === undefined)
 * - Animate on mount (when sceneActive = true) (+ set activeSceneId & prevSceneId)
 * - Animate on update (when sceneActive = true && prevComponent.sceneId === ) (+ set activeSceneId & prevSceneId)
 */

function resolveEnabled(enabled, id, isTarget, scene, currentScene) {
  if (typeof enabled === "function") {
    return enabled({
      id,
      isTarget,
      sceneId: (scene ? scene.props.id : undefined) || "",
      currentSceneId: (currentScene ? currentScene.props.id : undefined) || ""
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
    this._components = {}; // registered components (by id)
    this._sceneComponents = {}; // registered components (by scene)
    this._animations = []; // running animations
    this._listenerCallback = undefined;
    this._prevScene = undefined;
    this._activeScene = undefined;
  }

  addListener(callback) {
    this._listenerCallback = callback;
  }

  activateScene(scene, isActive) {
    if (isActive && this._activeScene !== scene) {
      this._prevScene = this._activeScene || this._prevScene;
      this._activeScene = scene;

      if (this._activeScene && this._prevScene) {
        const sceneComps = this._sceneComponents[this._activeScene.getId()];
        const prevSceneComps = this._sceneComponents[this._prevScene.getId()];
        if (sceneComps && prevSceneComps) {
          sceneComps.forEach(comp => {
            const { id } = comp.props;
            const prevComp = prevSceneComps.find(
              prevComp => prevComp.props.id === id
            );
            this._checkForAnimate(comp, prevComp);
          });
        }
      }
    } else if (!isActive && this._activeScene === scene) {
      this._prevScene = this._activeScene;
      this._activeScene = undefined;
    }
  }

  mountComponent(component) {
    const { id, scene, debug } = component.props;
    const isActive =
      !scene || scene.props.active === undefined ? true : scene.props.active;
    if (debug)
      //eslint-disable-next-line
      console.debug(
        `[MagicMove] Mounted ${component.debugName} (active = ${isActive})`
      );

    // Register component
    const comps = this._components[id];
    if (!comps) {
      this._components[id] = {
        active: undefined,
        mounts: [component]
      };
    } else {
      comps.mounts.push(component);
    }

    // Register within scene
    if (scene) {
      const sceneId = scene.getId();
      const sceneComps = this._sceneComponents[sceneId];
      if (!sceneComps) {
        this._sceneComponents[sceneId] = [component];
      } else {
        sceneComps.push(component);
      }
    }
    if (isActive && comps.active !== component) {
      // TODO - handling when not using scenes
      const prevComp = comps.active;
      comps.active = component;
      this._checkForAnimate(component, prevComp);
    }
  }

  unmountComponent(component) {
    const { id, debug, scene } = component.props;

    // Unregister component with scene
    if (scene) {
      const sceneId = scene.getId();
      const sceneComps = this._sceneComponents[sceneId];
      if (!sceneComps)
        throw new Error(
          `[MagicMove] Unmounting ${component.debugName} that was not mounted`
        );
      const idx = sceneComps.indexOf(component);
      if (idx < 0)
        throw new Error(
          `[MagicMove] Unmounting ${component.debugName} that was not mounted`
        );
      sceneComps.splice(idx, 1);
      if (!sceneComps.length) {
        delete this._sceneComponents[sceneId];
      }
    }

    // Unregister component
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
      // TODO - handling when not using scenes

      comps.mounts.active = comps.mounts[comps.mounts.length - 1];
    }
    if (debug)
      //eslint-disable-next-line
      console.debug(`[MagicMove] Unmounted ${component.debugName}`);
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
    const { id, debug, enabled, scene } = component.props;
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
    const prevScene = prevComp.props.scene;
    if (!resolveEnabled(enabled, id, true, prevScene, scene)) {
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
      scene &&
      !resolveEnabled(scene.props.enabled, id, true, prevScene, scene)
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
    if (!resolveEnabled(prevComp.props.enabled, id, false, scene, prevScene)) {
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
      prevScene &&
      !resolveEnabled(prevScene.props.enabled, id, false, scene, prevScene)
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
