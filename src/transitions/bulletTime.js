/* eslint react/prop-types: 0 */

export default function bulletTimeTransition({ source, target }) {
  const layerCount = Math.max(5, 2);
  const delayWeight = 0.7;
  const minOpacity = 0.1;

  const result = [];
  for (let i = 0; i < layerCount; i++) {
    const postDelay = (delayWeight / (layerCount - 1)) * i;
    const opacity = minOpacity + ((1 - minOpacity) / layerCount) * i;
    result.push(
      source
        .opacity(opacity)
        .break()
        .delay(delayWeight - postDelay)
        .fade()
        .move(target)
        .scale(target)
        .delay(postDelay)
    );
    result.push(
      target
        .opacity(opacity)
        .break()
        .delay(postDelay)
        .fade()
        .move(source)
        .scale(source)
        .delay(delayWeight - postDelay)
    );
  }
  return result;

  /*return [
    source
      .opacity(0.1)
      .break()
      .pause(0.2)
      .move(target)
      .scale(target),
    source
      .opacity(0.3)
      .break()
      .pause(0.15)
      .move(target)
      .scale(target)
      .pause(0.05),
    source
      .opacity(0.5)
      .break()
      .pause(0.1)
      .move(target)
      .scale(target)
      .pause(0.1),
    source
      .move(target)
      .scale(target)
      .pause(0.2)
  ];*/
}

bulletTimeTransition.defaultProps = {
  useNativeDriver: true,
  nativeContentType: "snapshot",
  nextGen: true
};
