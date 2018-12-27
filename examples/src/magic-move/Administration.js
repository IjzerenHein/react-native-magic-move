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
    this._map = {};
  }

  async mountComponent(component) {
    const { id } = component.props;
    let array = this._map[id];
    if (!array) {
      array = [];
      this._map[id] = array;
    }
    array.push(component);
    if (array.length >= 2) {
      const prevComponent = array[array.length - 2];
      const prevStyle = prevComponent.getStyle();
      await component.show(prevStyle);
      component.hide();
    }
  }

  unmountComponent(component) {
    const { id } = component.props;
    let array = this._map[id];
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
      delete this._map[id];
    } else {
      // TODO
      /** const prevComponent = array[array.length - 2];
          const prevStyle = prevComponent.getStyle();
          await component.show(prevStyle);
          component.hide();*/
    }
  }
}

export default MagicMoveAdministration;
