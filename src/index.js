import { Animated, Text as CoreText, Image as CoreImage } from "react-native";
import MagicMoveView from "./View";
import MagicMoveProvider from "./Provider";
import MagicMoveScene from "./Scene";
import MagicMoveContext from "./Context";
import createComponent from "./createMagicMoveComponent";
import * as MagicMoveTransition from "./transitions";

export const Provider = MagicMoveProvider;
export const Scene = MagicMoveScene;
export const Context = MagicMoveContext;
export const createMagicMoveComponent = createComponent;
export const View = MagicMoveView;
export const Text = createComponent(CoreText, Animated.Text);
export const Image = createComponent(CoreImage, Animated.Image);
export const Transition = MagicMoveTransition;
