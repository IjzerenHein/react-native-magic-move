import { observable } from "mobx";
import { Dimensions, Easing } from "react-native";
import { Transition } from "react-native-magic-move";

const MAX_WIDTH = Dimensions.get("window").width;
const MAX_HEIGHT = Dimensions.get("window").height;

const SHAPES = [
  {
    label: "Circle",
    shapeFn: ({ width, height }) => ({
      borderRadius: Math.min(width, height) / 2
    })
  },
  {
    label: "Square",
    shapeFn: () => ({})
  },
  {
    label: "Rounded Square",
    shapeFn: ({ width, height }) => ({
      borderRadius: Math.min(width, height) / 6
    })
  },
  {
    label: "Rectangle (3x1)",
    shapeFn: ({ height }) => ({
      height: height / 3
    })
  },
  {
    label: "Rectangle (1x3)",
    shapeFn: ({ width }) => ({
      width: width / 3
    })
  },
  {
    label: "Rectangle (6x1)",
    shapeFn: ({ height }) => ({
      height: height / 6
    })
  },
  {
    label: "Rectangle (1x6)",
    shapeFn: ({ width }) => ({
      width: width / 6
    })
  }
];

const CONTENTS = [
  { label: "Image 1", imageSource: require("../assets/waves.jpg") },
  { label: "Image 2", imageSource: require("../assets/escher.jpg") },
  { label: "Pink", backgroundColor: "salmon" },
  { label: "Blue", backgroundColor: "steelblue" },
  { label: "Orange", backgroundColor: "orange" },
  { label: "Green", backgroundColor: "seagreen" },
  { label: "Yellow", backgroundColor: "goldenrod" },
  { label: "Black", backgroundColor: "black" },
  { label: "White", backgroundColor: "white" }
];

const SIZES = [
  {
    label: "Tiny",
    width: 16,
    height: 16
  },
  {
    label: "Small",
    width: MAX_WIDTH / 4,
    height: MAX_WIDTH / 4
  },
  {
    label: "Medium",
    width: MAX_WIDTH / 2,
    height: MAX_WIDTH / 2
  },
  {
    label: "Large",
    width: MAX_WIDTH - 40,
    height: MAX_WIDTH - 40
  },
  {
    label: "Max",
    width: MAX_WIDTH,
    height: MAX_HEIGHT
  }
];

const POSITIONS = [
  {
    label: "Center",
    justifyContent: "center",
    alignItems: "center"
  },
  {
    label: "Top",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  {
    label: "Right",
    justifyContent: "center",
    alignItems: "flex-end"
  },
  {
    label: "Bottom",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  {
    label: "Left",
    justifyContent: "center",
    alignItems: "flex-start"
  },
  {
    label: "Top-left",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  {
    label: "Top-right",
    justifyContent: "flex-start",
    alignItems: "flex-end"
  },
  {
    label: "Bottom-left",
    justifyContent: "flex-end",
    alignItems: "flex-start"
  },
  {
    label: "Bottom-right",
    justifyContent: "flex-end",
    alignItems: "flex-end"
  }
];

const TRANSITIONS = [
  { label: "Morph", transition: Transition.morph },
  { label: "Dissolve", transition: Transition.dissolve },
  { label: "Flip (auto)", transition: Transition.flip },
  { label: "Flip X", transition: Transition.flip.x },
  { label: "Flip Y", transition: Transition.flip.y },
  { label: "Scale", transition: Transition.scale },
  { label: "Shrink & Grow", transition: Transition.shrinkAndGrow },
  { label: "Squash & Stretch", transition: Transition.quashAndStretch }
];

const EASINGS = [
  { label: "In Out", easing: Easing.inOut(Easing.ease) },
  {
    label: "Elastic",
    easing: Easing.elastic(1)
  }
];

const DURATIONS = [
  { label: "Ludicrous", duration: 100 },
  { label: "Very Fast", duration: 200 },
  {
    label: "Regular",
    duration: 400
  },
  {
    label: "Slowish",
    duration: 600
  },
  {
    label: "Slow",
    duration: 1000
  },
  {
    label: "Very Slow",
    duration: 2000
  },
  {
    label: "Snail",
    duration: 8000
  }
];

const DISABLEDS = [
  { label: "Yes", disabled: true },
  { label: "No", disabled: false }
];

function getByLabel(array, label) {
  const item = array.find(item => item.label === label);
  if (!item) throw new Error(`Item with label ${label} not found`);
  return item;
}

class StoreComponent {
  constructor({
    shape,
    content,
    size,
    position,
    transition,
    duration,
    easing,
    disabled
  }) {
    this._content = observable.box(getByLabel(CONTENTS, content));
    this._size = observable.box(getByLabel(SIZES, size));
    this._shape = observable.box(getByLabel(SHAPES, shape));
    this._position = observable.box(getByLabel(POSITIONS, position));
    this._transition = observable.box(getByLabel(TRANSITIONS, transition));
    this._duration = observable.box(getByLabel(DURATIONS, duration));
    this._easing = observable.box(getByLabel(EASINGS, easing));
    this._disabled = observable.box(getByLabel(DISABLEDS, disabled));
  }

  get shape() {
    return this._shape.get();
  }
  set shape(val) {
    this._shape.set(val);
  }
  get shapes() {
    return SHAPES;
  }

  get content() {
    return this._content.get();
  }
  set content(val) {
    this._content.set(val);
  }
  get contents() {
    return CONTENTS;
  }

  get size() {
    return this._size.get();
  }
  set size(val) {
    this._size.set(val);
  }
  get sizes() {
    return SIZES;
  }

  get position() {
    return this._position.get();
  }
  set position(val) {
    this._position.set(val);
  }
  get positions() {
    return POSITIONS;
  }

  get transition() {
    return this._transition.get();
  }
  set transition(val) {
    this._transition.set(val);
  }
  get transitions() {
    return TRANSITIONS;
  }

  get duration() {
    return this._duration.get();
  }
  set duration(val) {
    this._duration.set(val);
  }
  get durations() {
    return DURATIONS;
  }

  get easing() {
    return this._easing.get();
  }
  set easing(val) {
    this._easing.set(val);
  }
  get easings() {
    return EASINGS;
  }

  get disabled() {
    return this._disabled.get();
  }
  set disabled(val) {
    this._disabled.set(val);
  }
  get disableds() {
    return DISABLEDS;
  }
}

export default StoreComponent;
