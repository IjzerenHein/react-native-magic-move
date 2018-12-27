import MagicMoveAnimation from "./Animation";

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
    this._animations = {}; // running animations
  }

  mountComponent(component) {
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

  unmountComponent(component) {
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
      const prevComponent = array[array.length - 2];
      this._animate(id, prevComponent, component);
    }
  }

  _animate(id, targetComponent, sourceComponent) {
    console.log("animate: ", id);
    let anim = this._animations[id];
    if (anim) {
      //anim.update(targetComponent);
    } else {
      anim = new MagicMoveAnimation(id, sourceComponent, targetComponent);
      this._animations[id] = anim;
      anim.start(() => {
        delete this._animations[id];
      });
    }
  }
}

export default MagicMoveAdministration;
