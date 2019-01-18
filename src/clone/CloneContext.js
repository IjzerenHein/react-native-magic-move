import { createContext } from "react";

const MagicMoveCloneContext = createContext({
  isClone: false,
  isScene: false,
  isTarget: false
});

export default MagicMoveCloneContext;
