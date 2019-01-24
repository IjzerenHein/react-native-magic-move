/**
 * Calculates the layout (size & position) of an image
 * based on the resizeMode.
 */
function getImageLayout(clone, backupClone) {
  const { width, height, style } = clone;
  let { imageWidth, imageHeight } = clone;
  if (!imageWidth && !imageHeight && backupClone) {
    imageWidth = backupClone.imageWidth;
    imageHeight = backupClone.imageHeight;
  }
  const resizeMode =
    (imageHeight && imageWidth
      ? clone.props.resizeMode || style.resizeMode
      : undefined) || "stretch";
  const aspectRatio = width / height;
  const imageAspectRatio = imageWidth / imageHeight;
  const fitsInside = imageWidth <= width && imageHeight <= height;
  const widthIsLarger = imageAspectRatio >= aspectRatio;
  let newWidth;
  switch (resizeMode) {
    case "stretch":
      return {
        width,
        height,
        left: 0,
        top: 0
      };
    case "repeat":
      newWidth = fitsInside
        ? imageWidth
        : widthIsLarger
        ? imageHeight * imageAspectRatio
        : width;
      return {
        width: newWidth,
        height: newWidth / imageAspectRatio,
        left: 0,
        top: 0
      };
    case "cover":
      newWidth = widthIsLarger ? height * imageAspectRatio : width;
      break;
    case "contain":
      newWidth = widthIsLarger ? width : height * imageAspectRatio;
      break;
    case "center":
      newWidth = fitsInside
        ? imageWidth
        : widthIsLarger
        ? imageHeight * imageAspectRatio
        : width;
      break;
  }
  const newHeight = newWidth / imageAspectRatio;
  return {
    width: newWidth,
    height: newHeight,
    left: (width - newWidth) / 2,
    top: (height - newHeight) / 2
  };
}

export { getImageLayout };
