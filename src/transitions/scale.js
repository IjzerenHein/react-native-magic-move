/* eslint react/prop-types: 0 */
import moveTransition from "./move";

export default function scaleTransition(config) {
  // eslint-disable-next-line
  console.warn(
    `[MagicMove] Scale transition has been deprecated and will be removed in the near future, use the default 'move' transition instead`
  );
  return moveTransition(config);
}

scaleTransition.defaultProps = moveTransition.defaultProps;
