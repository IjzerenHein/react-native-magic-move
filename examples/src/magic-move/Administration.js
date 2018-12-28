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

  addComponent(component) {
    const { id } = component.props;
    console.log("mountComp: ", id);
    let array = this._components[id];
    if (!array) {
      array = [];
      this._components[id] = array;
    }
    array.push(component);
    if (array.length >= 2) {
      const prevComponent = array[array.length - 2];
      this._animate(id, component, prevComponent);
    }
  }

  removeComponent(component) {
    const { id } = component.props;
    console.log("unmountComp: ", id);
    let array = this._components[id];
    if (!array)
      throw new Error(
        "MagicMove: Unmounting a component with id " +
          id +
          " that was not mounted"
      );
    const idx = array.indexOf(component);
    if (idx < 0)
      throw new Error(
        "MagicMove: Unmounting a component with id " +
          id +
          " that was not mounted"
      );
    array.splice(idx, 1);
    if (!array.length) {
      delete this._components[id];
    } else {
      // const prevComponent = array[array.length - 2];
      // this._animate(id, prevComponent, component);
    }
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
    console.log("animate: ", id);
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

export default MagicMoveAdministration;
