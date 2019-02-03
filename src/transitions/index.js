import moveTransition from "./move";
import morphTransition from "./morph";
import flipTransition from "./flip";
import dissolveTransition from "./dissolve";
import shrinkAndGrowTransition from "./shrinkAndGrow";
import squashAndStretchTransition from "./squashAndStretch";
import scaleTransition from "./scale";
// import foldTransition from "./fold";
// import fadeTransition from "./fade";
// import blurTransition from "./blur";
// import dottedTransition from "./dotted";

export const move = moveTransition; // default
export const morph = morphTransition;
export const flip = flipTransition;
export const dissolve = dissolveTransition;
export const shrinkAndGrow = shrinkAndGrowTransition;
export const squashAndStretch = squashAndStretchTransition;
export const scale = scaleTransition; // DEPRECATED
// export const fold = foldTransition;
// export const fade = fadeTransition;
// export const blur = blurTransition;
// export const dotted = dottedTransition;
