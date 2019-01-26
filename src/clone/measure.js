/* globals Promise */
import { findNodeHandle } from "react-native";

export async function measureRelativeLayout(component) {
  const { mmContext } = component.props;
  const { scene, parent } = mmContext;
  const sceneRef = scene ? scene.ref : parent.ref;
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
        component.ref.measureLayout(
          findNodeHandle(sceneRef),
          onSuccess,
          onFail
        );
      });
    }
    function onFail() {
      if (i++ >= 3)
        return reject(
          new Error(`[MagicMove] Failed to measure ${component.debugName}`)
        );
      requestAnimationFrame(() => {
        component.ref.measureLayout(
          findNodeHandle(sceneRef),
          onSuccess,
          onFail
        );
      });
    }
    component.ref.measureLayout(findNodeHandle(sceneRef), onSuccess, onFail);
  });
}
