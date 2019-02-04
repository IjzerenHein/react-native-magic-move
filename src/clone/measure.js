/* globals Promise */
import fbPerformanceNow from "fbjs/lib/performanceNow";
export const performanceNow =
  global.nativePerformanceNow || global.performanceNow || fbPerformanceNow;

export function measureLayout(component) {
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
          new Error(`[MagicMove] Failed to measure ${component.debugName}`)
        );
      requestAnimationFrame(() => {
        component.ref.measure(onMeasure);
      });
    }
    // console.debug(`[MagicMove] Measuring ${component.debugName} ...`);
    component.ref.measure(onMeasure);
  });
}

export async function measureRelativeLayout(component) {
  const { mmContext } = component.props;
  const { scene, provider } = mmContext;

  const layouts = await Promise.all([
    component.measure(),
    (scene || provider).measure()
  ]);

  return {
    x: layouts[0].x - layouts[1].x,
    y: layouts[0].y - layouts[1].y,
    width: layouts[0].width,
    height: layouts[0].height
  };
}
