/* eslint react/prop-types: 0 */

import { getImageLayout } from "./helpers";

function resolveValue(value, def) {
  if (value !== undefined) return value;
  return def || 0;
}

/**
 * Performs a move transition between two elements
 * that are seemingly the same, with as little
 * visual artifacts as possible.
 *
 * This transition produces the best results when
 * the source and target components are visually identical
 * or very close in appearance. In case of images, this
 * transition tries to create a seamless scale from the
 * source image to the target image. This is not trivial
 * because the shape of the components affects how the image
 * is cropped and positioned within the component.
 */
export default function moveTransition(
  { from, to, interpolate, render },
  moveTarget
) {
  //
  // Auto-determine whether it is best to move
  // the source or that target, based on the
  // achievable shape.
  //
  if (moveTarget === undefined) {
    // If the source contains an image, but the target doesn't
    // have that image yet, then always use the source
    if (
      (from.imageWidth || from.imageHeight) &&
      !to.imageWidth &&
      !to.imageHeight
    ) {
      moveTarget = false;
    }

    // If the shape of the source and target are the
    // same, then we can morph without needing a dissolve
    const sourceRatio = from.width / from.height;
    const targetRatio = to.width / to.height;
    if (
      moveTarget === undefined &&
      Math.abs(sourceRatio - targetRatio) < 0.01
    ) {
      moveTarget = from.width > to.width ? false : true;
    }

    // If either the source or the target have no border-radius
    // then a morph without dissolve is also possible
    if (moveTarget === undefined) {
      const fromBR = from.style.borderRadius;
      const hasSourceBorderRadius =
        resolveValue(from.style.borderTopLeftRadius, fromBR) ||
        resolveValue(from.style.borderTopRightRadius, fromBR) ||
        resolveValue(from.style.borderBottomLeftRadius, fromBR) ||
        resolveValue(from.style.borderBottomRightRadius, fromBR);
      const toBR = to.style.borderRadius;
      const hasTargetBorderRadius =
        resolveValue(to.style.borderTopLeftRadius, toBR) ||
        resolveValue(to.style.borderTopRightRadius, toBR) ||
        resolveValue(to.style.borderBottomLeftRadius, toBR) ||
        resolveValue(to.style.borderBottomRightRadius, toBR);
      if (!hasSourceBorderRadius && !hasTargetBorderRadius) {
        moveTarget = true;
      } else if (!hasTargetBorderRadius) {
        moveTarget = false;
      } else if (!hasSourceBorderRadius) {
        moveTarget = true;
      }
    }

    // If no method has been selected, then use the target
    if (moveTarget === undefined) {
      moveTarget = true;
    }
  }

  //
  // Select clone
  //
  const clone = moveTarget ? to : from;
  const otherClone = moveTarget ? from : to;

  //
  // Move & scale source component from start
  // position/size to the ending position
  //
  clone.style.transform = [
    { translateX: interpolate(clone.start.x, clone.end.x) },
    { translateY: interpolate(clone.start.y, clone.end.y) },
    { scaleX: interpolate(clone.start.scaleX, clone.end.scaleX) },
    { scaleY: interpolate(clone.start.scaleY, clone.end.scaleY) }
  ];

  //
  // Change border-radius of source so that it looks
  // like the the shape of the target component.
  // The border-radius is calculated using a volumetric
  // approach that takes the scaling of the view into
  // account in order to get as close as possible to the
  // same shape as the target component.
  //
  const interpolateBorderRadius = name => {
    const sR = resolveValue(from.style[name], from.style.borderRadius);
    const eR = resolveValue(to.style[name], to.style.borderRadius);
    const p4 = Math.PI / 4;
    if (moveTarget) {
      const sR2 = sR * sR;
      const sV = sR2 - p4 * sR2;
      const eV = sV / (to.start.scaleX * to.start.scaleY);
      const cR = Math.sqrt(eV / ((p4 - 1) * -1));
      return interpolate(cR, eR);
    } else {
      const eR2 = eR * eR;
      const eV = eR2 - p4 * eR2;
      const sV = eV / (from.end.scaleX * from.end.scaleY);
      const cR = Math.sqrt(sV / ((p4 - 1) * -1));
      return interpolate(sR, cR);
    }
  };
  const borderRadiusStyles = {
    borderRadius: interpolateBorderRadius("borderRadius"),
    borderTopLeftRadius: interpolateBorderRadius("borderTopLeftRadius"),
    borderTopRightRadius: interpolateBorderRadius("borderTopRightRadius"),
    borderBottomLeftRadius: interpolateBorderRadius("borderBottomLeftRadius"),
    borderBottomRightRadius: interpolateBorderRadius("borderBottomRightRadius")
  };
  clone.style = {
    ...clone.style,
    ...borderRadiusStyles
  };

  //
  // If the content is an image, and the image aspect-ratio
  // is known, then also re-adjust the image so that also
  // transitions neatly from the source to the target.
  //
  if (
    clone.imageWidth ||
    clone.imageHeight ||
    otherClone.imageWidth ||
    otherClone.imageHeight
  ) {
    const layout = getImageLayout(clone, otherClone);
    const otherLayout = getImageLayout(otherClone, clone);
    // console.log("YO, isTarget: ", clone.isTarget);

    const startScaleX = clone.isTarget
      ? otherLayout.width / layout.width / clone.start.scaleX
      : clone.start.scaleX;
    const startScaleY = clone.isTarget
      ? otherLayout.height / layout.height / clone.start.scaleY
      : clone.start.scaleY;
    const endScaleX = clone.isTarget
      ? clone.end.scaleX
      : otherLayout.width / layout.width / clone.end.scaleX;
    const endScaleY = clone.isTarget
      ? clone.end.scaleY
      : otherLayout.height / layout.height / clone.end.scaleY;

    clone.contentStyle = {
      position: "absolute",
      ...layout,
      transform: [
        { scaleX: interpolate(startScaleX, endScaleX) },
        { scaleY: interpolate(startScaleY, endScaleY) }
      ]
    };

    // Clip the contents
    clone.style.overflow = "hidden";

    // When using the native optimisations, we make sure
    // to use the "raw" image as the source, as the snapshot
    // image might be stretched, clipped or have border-radii
    // applied to it.
    clone.nativeContentType = "rawImage";
  }

  //
  // Render
  //
  return [render(clone)];
}

moveTransition.defaultProps = {
  useNativeDriver: true,
  nativeContentType: "snapshot"
};

function createMoveTransition(moveTarget) {
  const func = function(component) {
    return moveTransition(component, moveTarget);
  };
  func.defaultProps = moveTransition.defaultProps;
  return func;
}

moveTransition.source = createMoveTransition(false);
moveTransition.target = createMoveTransition(true);
