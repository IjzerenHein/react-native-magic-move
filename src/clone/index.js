import MagicMoveNativeClone from "./NativeClone";
import MagicMoveJSClone from "./JSClone";

export default (MagicMoveNativeClone.isAvailable
  ? MagicMoveNativeClone
  : MagicMoveJSClone);
