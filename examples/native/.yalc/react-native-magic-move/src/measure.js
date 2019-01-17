/* globals Promise */
import { findNodeHandle } from "react-native";

export function measureLayout(id, name, ref) {
  let i = 0;
  return new Promise((resolve, reject) => {
    function onMeasure(x, y, width, height, pageX, pageY) {
      if (width || height) {
        return resolve({
          x: pageX,
          y: pageY,
          width,
          height
        });
      }
      i++;
      if (x === undefined || i >= 3)
        return reject(
          new Error(`[MagicMove] Failed to measure component "${id}" (${name})`)
        );
      requestAnimationFrame(() => {
        ref.measure(onMeasure);
      });
    }
    ref.measure(onMeasure);
  });
}

export async function measureRelativeLayout(
  component,
  sceneRef,
  fallbackLayout
) {
  // Fallback when no sceneRef is available
  if (!sceneRef) {
    const { x, y, width, height } = await measureLayout(
      component.props.id,
      "fallback",
      component.getRef()
    );
    return {
      x: x - fallbackLayout.x,
      y: y - fallbackLayout.y,
      width,
      height
    };
  }

  let i = 0;
  return new Promise((resolve, reject) => {
    function onSuccess(x, y, width, height) {
      if (width || height) {
        return resolve({
          x,
          y,
          width,
          height
        });
      }
      if (i++ >= 3)
        return reject(
          new Error(`[MagicMove] Failed to measure ${component.debugName}`)
        );
      requestAnimationFrame(() => {
        component
          .getRef()
          .measureLayout(findNodeHandle(sceneRef), onSuccess, onFail);
      });
    }
    function onFail() {
      if (i++ >= 3)
        return reject(
          new Error(`[MagicMove] Failed to measure ${component.debugName}`)
        );
      requestAnimationFrame(() => {
        component
          .getRef()
          .measureLayout(findNodeHandle(sceneRef), onSuccess, onFail);
      });
    }
    component
      .getRef()
      .measureLayout(findNodeHandle(sceneRef), onSuccess, onFail);
  });
}
