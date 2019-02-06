import { StyleSheet } from "react-native";

const Flag = {
  DEFAULT: 0,
  ANIMATED: 1,
  TRANSFORM: 2,
  CONTENT: 4,
  PROP: 8
};

const PROPS = {
  // style props
  width: Flag.DEFAULT,
  height: Flag.DEFAULT,
  opacity: Flag.ANIMATED,
  translateX: Flag.ANIMATED | Flag.TRANSFORM,
  translateY: Flag.ANIMATED | Flag.TRANSFORM,
  scaleX: Flag.ANIMATED | Flag.TRANSFORM,
  scaleY: Flag.ANIMATED | Flag.TRANSFORM,
  rotateX: Flag.ANIMATED | Flag.TRANSFORM,
  rotateY: Flag.ANIMATED | Flag.TRANSFORM,
  rotateZ: Flag.TRANSFORM,
  // content style props
  contentWidth: Flag.CONTENT,
  contentHeight: Flag.CONTENT,
  contentOpacity: Flag.CONTENT | Flag.ANIMATED,
  contentTranslateX: Flag.CONTENT | Flag.ANIMATED | Flag.TRANSFORM,
  contentTranslateY: Flag.CONTENT | Flag.ANIMATED | Flag.TRANSFORM,
  contentScaleX: Flag.CONTENT | Flag.ANIMATED | Flag.TRANSFORM,
  contentScaleY: Flag.CONTENT | Flag.ANIMATED | Flag.TRANSFORM,
  contentRotateX: Flag.CONTENT | Flag.ANIMATED | Flag.TRANSFORM,
  contentRotateY: Flag.CONTENT | Flag.ANIMATED | Flag.TRANSFORM,
  contentRotateZ: Flag.CONTENT | Flag.TRANSFORM,
  // animatable props
  blurRadius: Flag.PROP | Flag.ANIMATED
  // all other props will be treated as 'Flag.PROP'
};

const STRIP_STYLE_PROPS = [
  "position",
  "left",
  "top",
  "right",
  "bottom",
  "start",
  "end",
  "transform",
  "margin",
  "marginLeft",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginStart",
  "marginEnd",
  "marginVertical",
  "marginHorizontal",
  "maxWidth",
  "maxHeight",
  "minWidth",
  "minHeight",
  "alignSelf",
  "aspectRatio"
];

class MagicMoveComposer {
  constructor(backingData, props, parent, weightOrBreak) {
    this._backingData = backingData;
    this._props = props;
    this._parent = parent;
    this._weight = weightOrBreak;
    if (parent && weightOrBreak === undefined) {
      // copy props and break the animation chain
      this._props = this.props;
      this._parent = undefined;
      this._weight = 0;
    }
  }

  static create({ component, isTarget, layout, nativeContentType }) {
    const style = StyleSheet.flatten([component.props.style]);
    STRIP_STYLE_PROPS.forEach(propName => {
      if (style[propName] !== undefined) {
        delete style[propName];
      }
    });
    return new MagicMoveComposer(
      {
        isTarget,
        component,
        imageWidth: layout.imageWidth,
        imageHeight: layout.imageHeight
      },
      {
        ...style,
        nativeContentType,
        width: layout.width,
        height: layout.height,
        translateX: layout.x,
        translateY: layout.y,
        opacity: style.opacity !== undefined ? style.opacity : 1,
        scaleX: 1,
        scaleY: 1,
        rotateX: "0deg",
        rotateY: "0deg"
      },
      undefined,
      0
    );
  }

  get parent() {
    return this._parent;
  }

  get weight() {
    return this._weight;
  }

  get isTarget() {
    return this._backingData.isTarget;
  }

  get component() {
    return this._backingData.component;
  }

  get imageWidth() {
    return this._backingData.imageWidth;
  }

  get imageHeight() {
    return this._backingData.imageHeight;
  }

  add(weightOrBreak, props) {
    if (Array.isArray(weightOrBreak)) {
      const propNames = Object.keys(props);
      let parent = this;
      for (let i = 0; i < weightOrBreak.length; i++) {
        const weight = weightOrBreak[i];
        const newProps = {};
        propNames.forEach(name => (newProps[name] = props[name][i]));
        parent = new MagicMoveComposer(
          this._backingData,
          newProps,
          parent,
          weight
        );
      }
      return parent;
    }
    return new MagicMoveComposer(this._backingData, props, this, weightOrBreak);
  }

  get props() {
    if (!this._propsCache) {
      if (this._props && this._parent) {
        this._propsCache = {
          ...this._parent.props,
          ...this._props
        };
      } else if (this._parent) {
        this._propsCache = this._parent.props;
      } else {
        this._propsCache = this._props || {};
      }
    }
    return this._propsCache;
  }

  getAnimatedProps(animValue) {
    const { nativeContentType, ...otherProps } = this.props;
    const propNames = Object.keys(otherProps);
    const style = { transform: [] };
    const props = {};
    let contentStyle = undefined;
    let contentProps = undefined;
    propNames.forEach(propName => {
      const flags = PROPS[propName];
      const value =
        flags & Flag.ANIMATED
          ? this.getInterpolatedProp(propName, animValue)
          : otherProps[propName];
      if (flags & Flag.CONTENT) {
        propName = `${propName
          .substring(7, 8)
          .toLowerCase()}${propName.substring(8)}`;
        if (flags & Flag.PROP) {
          contentProps = contentProps || [];
          contentProps[propName] = value;
        } else if (flags & Flag.TRANSFORM) {
          contentStyle = contentStyle || { transform: [] };
          const transformObj = {};
          transformObj[propName] = value;
          contentStyle.transform.push(transformObj);
        } else {
          contentStyle = contentStyle || { transform: [] };
          contentStyle[propName] = value;
        }
      } else {
        if (flags & Flag.PROP) {
          props[propName] = value;
        } else if (flags & Flag.TRANSFORM) {
          const transformObj = {};
          transformObj[propName] = value;
          style.transform.push(transformObj);
        } else {
          style[propName] = value;
        }
      }
    });
    style.position = "absolute";
    style.left = 0;
    style.top = 0;
    if (contentStyle) {
      contentStyle.position = "absolute";
      contentStyle.left = 0;
      contentStyle.top = 0;
    }
    return {
      style,
      props,
      contentStyle,
      contentProps,
      nativeContentType
    };
  }

  getInterpolatedProp(name, animValue) {
    const weights = [];
    const values = [];
    let item = this;
    const { isTarget } = this;
    while (item) {
      const { parent, weight } = item;
      if (!item._props) {
        values.push(null);
        weights.push(weight);
      } else {
        const value = item._props[name];
        if (value !== undefined) {
          values.push(value);
          weights.push(weight);
        }
      }
      item = parent;
    }
    if (values.length < 2) return values[0];
    if (!isTarget) {
      values.reverse();
      weights.reverse();
    }

    /*0 / totalWidth
    0 + 1 / totalWidth,
    0 + 1 + 0 / totalWidth
    0 + 1 + 0 + 1 / totalWidth*/

    // Fill in null values
    for (let i = 1; i < values.length; i++) {
      const idx = isTarget ? values.length - i - 1 : i;
      if (values[idx] === null) {
        values[idx] = values[isTarget ? idx + 1 : idx - 1];
      }
    }

    // If no weight available, use the last value
    const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
    if (!totalWeight) {
      return values[0];
    }

    // Calculate input-range based on weight distribution
    let currentWeight = 0;
    const inputRange = weights.map(weight => {
      if (isTarget) {
        const result = currentWeight;
        currentWeight += weight;
        return result / totalWeight;
      } else {
        currentWeight += weight;
        return currentWeight / totalWeight;
      }
    });
    return animValue.interpolate({
      inputRange,
      outputRange: values
    });
  }

  /**
   * Breaks the animation chain.
   * @return {MagicMoveComposer}
   */
  break() {
    return this.add(undefined, undefined);
  }

  /**
   * Delays the operations for the given weight strength
   * @param {Number} [weight] Optional weight (default = 1)
   * @return {MagicMoveComposer}
   */
  delay(weight = 1) {
    return this.add(weight);
  }

  /**
   * Sets the opacity to the given value
   * @param {Number} opacity Opacity: 0..1
   * @param {Number} [weight] Optional weight (default = 1)
   * @return {MagicMoveComposer}
   */
  opacity(opacity, weight = 1) {
    return this.add(weight, {
      opacity
    });
  }

  /**
   * Fade the content. When the content is a source, it is
   * faded-out, otherwise it is faded in.
   * @param {Number} [weight] Optional weight (default = 1)
   * @return {MagicMoveComposer}
   */
  fade(weight = 1) {
    return this.add(weight, {
      opacity: 0
    });
  }

  /**
   * Move the content towards the given clone.
   * @param {MagicMoveComposer} Animation-clone to move towards
   * @param {Number} [weight] Optional weight (default = 1)
   * @return {MagicMoveComposer}
   */
  move({ props }, weight = 1) {
    const { width, height } = this.props;
    return this.add(weight, {
      translateX: props.translateX - (width - props.width) / 2,
      translateY: props.translateY - (height - props.height) / 2
    });
  }

  /**
   * Scales the content to the size of the given clone.
   * @param {MagicMoveComposer} Animation-clone to use as a size reference
   * @param {Number} [weight] Optional weight (default = 1)
   * @return {MagicMoveComposer}
   */
  scale({ props }, weight = 1) {
    const { width, height } = this.props;
    return this.add(weight, {
      scaleX: props.width / width,
      scaleY: props.height / height
    });
  }

  /**
   * Flips the content 180 degrees over the X-axis.
   * @param {Number} [weight] Optional weight (default = 1)
   */
  static FLIP_ROTATE = ["0deg", "90deg", "90deg", "180deg"];
  static FLIP_OPACITY = [1, 1, 0, 0];
  static BACKFLIP_ROTATE = ["180deg", "270deg", "270deg", "360deg"];
  static BACKFLIP_OPACITY = [0, 0, 1, 1];
  flipX(weight = 1) {
    const back = this.props.rotateX === "180deg";
    return this.add([0, weight / 2, 0, weight / 2], {
      rotateX: MagicMoveComposer[back ? "BACKFLIP_ROTATE" : "FLIP_ROTATE"],
      opacity: MagicMoveComposer[back ? "BACKFLIP_OPACITY" : "FLIP_OPACITY"]
    });
  }

  /**
   * Flips the content 180 degrees over the Y-axis.
   * @param {Number} [weight] Optional weight
   */
  flipY(weight = 1) {
    const back = this.props.rotateY === "180deg";
    return this.add([0, weight / 2, 0, weight / 2], {
      rotateY: MagicMoveComposer[back ? "BACKFLIP_ROTATE" : "FLIP_ROTATE"],
      opacity: MagicMoveComposer[back ? "BACKFLIP_OPACITY" : "FLIP_OPACITY"]
    });
  }

  /**
   * Create a new clone, clipped to a certain bound of the original.
   * This operation also breaks the animation chain.
   * @param {Number} [left]
   * @param {Number} [top]
   * @param {Number} [right]
   * @param {Number} [bottom]
   */
  clip(left = 0, top = 0, right = 0, bottom = 0) {
    const { width, height, translateX, translateY } = this.props;
    return this.add(undefined, {
      width: width - left - right,
      height: height - top - bottom,
      translateX: translateX + left,
      translateY: translateY + top,
      overflow: "hidden",
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      backgroundColor: undefined,
      contentWidth: width,
      contentHeight: height,
      contentTranslateX: 0 - left,
      contentTranslateY: 0 - top
    });
  }

  /**
   * Converts the content into smaller tiles.
   * @param {Number} [cols] Number of columns
   * @param {Number} [rows] Number of rows
   */
  tiles(cols = 1, rows = 1) {
    const { width, height } = this.props;
    const result = [];
    const tileWidth = width / cols;
    const tileHeight = height / rows;
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        result.push(
          this.clip(
            col * tileWidth,
            row * tileHeight,
            width - (col + 1) * tileWidth,
            height - (row + 1) * tileHeight
          )
        );
      }
    }
    return result;
  }
}

export default MagicMoveComposer;
