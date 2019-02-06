/* eslint react/prop-types: 0 */

export default function fadeTransition({ source, target }) {
  return [source.fade(), target.fade()];
}

fadeTransition.defaultProps = {
  useNativeDriver: true,
  nativeContentType: "snapshot",
  nextGen: true
};
