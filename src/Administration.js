import { createContext } from "react";
import findLast from "lodash.findlast";

/**
 * The MagicMove administration keeps track of the
 * components that have been mounted/unmounted and
 * between which magic move transitions should be performed.
 * The general use is:
 *
 * - Animate on mount (when sceneActive === undefined)
 * - Animate on mount (when sceneActive = true) (+ set activeSceneId & prevSceneId)
 * - Animate on update (when sceneActive = true && prevComponent.sceneId === ) (+ set activeSceneId & prevSceneId)
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
      if (this._prevScene === this._activeScene) {
        this._prevScene = undefined;
      }

      // Start animations for all components on this scene
      const sceneComps = this._activeScene
        ? this._sceneComponents[this._activeScene.getId()]
        : undefined;
      if (sceneComps) {
        sceneComps.forEach(comp => {
          const { id } = comp.props;
          const comps = this._components[id];
          const prevComp = comps.active;
          comps.active = comp;
          this._checkForAnimate(comp, prevComp);
        });
      }

      // Reset active state on all non-animated components of the
      // previous scene
      const prevSceneComps = this._prevScene
        ? this._sceneComponents[this._prevScene.getId()]
        : undefined;
      if (prevSceneComps) {
        prevSceneComps.forEach(comp => {
          const { id } = comp.props;
          const comps = this._components[id];
          if (comps.active === comp) {
            comps.active = undefined;
          }
        });
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
    let comps = this._components[id];
    if (!comps) {
      comps = {
        active: undefined,
        mounts: [component]
      };
      this._components[id] = comps;
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
    } else if (comps.active === component) {
      const prevComp = findLast(
        comps.mounts,
        ({ props }) =>
          !props.scene ||
          props.scene.props.active === undefined ||
          props.scene.props.active === true
      );
      comps.active = prevComp;
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
    const { id, debug, disabled, scene } = component.props;
    if (component === prevComp) return;
    if (!prevComp) {
      if (debug) {
        // eslint-disable-next-line
        console.debug(
          `[MagicMove] Not animating ${
            component.debugName
          } (no previous component found)`
        );
      }
      return;
    }
    if (disabled) {
      if (debug) {
        // eslint-disable-next-line
        console.debug(
          `[MagicMove] Not animating ${
            component.debugName
          } (component is disabled)`
        );
      }
      return;
    }
    if (scene && scene.disabled) {
      if (debug) {
        // eslint-disable-next-line
        console.debug(
          `[MagicMove] Not animating ${component.debugName} (scene is disabled)`
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
