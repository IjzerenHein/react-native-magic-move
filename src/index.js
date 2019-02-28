import MagicMoveView from "./View";
import MagicMoveProvider from "./Provider";
import MagicMoveScene from "./Scene";
import {
  MagicMoveContextConsumer,
  MagicMoveContextPropType,
  withMagicMoveContext
} from "./Context";
import createComponent from "./createMagicMoveComponent";
import * as MagicMoveTransition from "./transitions";
import BaseImage from "./image/Image";
import AnimatedImage from "./image/AnimatedImage";
import BaseText from "./text/Text";
import AnimatedText from "./text/AnimatedText";

export const Provider = MagicMoveProvider;
export const Scene = MagicMoveScene;
export const Context = MagicMoveContextConsumer;
export const ContextPropType = MagicMoveContextPropType;
export const withContext = withMagicMoveContext;
export const createMagicMoveComponent = createComponent;
export const View = MagicMoveView;
export const Text = createComponent(BaseText, {
  AnimatedComponent: AnimatedText,
  ComponentType: "text"
});
export const Image = createComponent(BaseImage, {
  AnimatedComponent: AnimatedImage,
  ComponentType: "image"
});
export const Transition = MagicMoveTransition;
