import moveTransition from "./move";
import morphTransition from "./morph";
import flipTransition from "./flip";
import dissolveTransition from "./dissolve";
import shrinkAndGrowTransition from "./shrinkAndGrow";
import squashAndStretchTransition from "./squashAndStretch";
import fadeTransition from "./fade";
import bulletTimeTransition from "./bulletTime";
// import foldTransition from "./fold";
// import blurTransition from "./blur";
// import dottedTransition from "./dotted";

export const move = moveTransition; // default
export const morph = morphTransition;
export const flip = flipTransition;
export const dissolve = dissolveTransition;
export const shrinkAndGrow = shrinkAndGrowTransition;
export const squashAndStretch = squashAndStretchTransition;
export const fade = fadeTransition;
export const bulletTime = bulletTimeTransition;
// export const fold = foldTransition;
// export const blur = blurTransition;
// export const dotted = dottedTransition;
