/* eslint react/prop-types: 0 */

function resolveValue(value, def) {
  if (value !== undefined) return value;
  return def || 0;
}

export default function dottedTransition({ from, to, render, interpolate }) {
  const colCount = 4;
  const rowCount = 4;

  function convertToTiles(isTarget) {
    function interpolate2(start, end, clamped) {
      return interpolate(
        isTarget ? end : start,
        isTarget ? start : end,
        clamped
      );
    }

    const result = [];
    const clone = isTarget ? to : from;
    const { width, height, style, start, end } = clone;
    const {
      borderRadius,
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomLeftRadius,
      borderBottomRightRadius
    } = style;
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      for (let colIndex = 0; colIndex < colCount; colIndex++) {
        const tileIndex = result.length;

        // Update size to be the size of a tile
        style.width = width / colCount;
        style.height = height / rowCount;

        // Specify content style to show only a portion
        // of the content
        clone.contentStyle = {
          position: "absolute",
          width: width,
          height: height,
          left: colIndex * -style.width,
          top: rowIndex * -style.height
        };

        // Clip the contents
        style.overflow = "hidden";

        // Position the tile
        style.transform = [
          { translateX: (isTarget ? end.x : start.x) + style.width * colIndex },
          {
            translateY: (isTarget ? end.y : start.y) + style.height * rowIndex
          },
          { scaleX: interpolate2(1, 0) },
          { scaleY: interpolate2(1, 0) }
        ];

        // Calculate border-radius for this tile
        style.borderRadius = 0;
        style.borderTopLeftRadius = 0;
        style.borderTopRightRadius = 0;
        style.borderBottomLeftRadius = 0;
        style.borderBottomRightRadius = 0;
        if (rowIndex === 0 && colIndex === 0) {
          style.borderTopLeftRadius = resolveValue(
            borderTopLeftRadius,
            borderRadius
          );
        } else if (rowIndex === 0 && colIndex === colCount - 1) {
          style.borderTopRightRadius = resolveValue(
            borderTopRightRadius,
            borderRadius
          );
        } else if (rowIndex === rowCount - 1 && colIndex === 0) {
          style.borderBottomLeftRadius = resolveValue(
            borderBottomLeftRadius,
            borderRadius
          );
        } else if (rowIndex === rowCount - 1 && colIndex === colCount - 1) {
          style.borderBottomRightRadius = resolveValue(
            borderBottomRightRadius,
            borderRadius
          );
        }

        // Animate border radius into a circle
        const endBorderRadius = Math.max(style.width / 2, style.height / 2);
        style.borderTopLeftRadius = interpolate2(
          style.borderTopLeftRadius,
          endBorderRadius
        );
        style.borderTopRightRadius = interpolate2(
          style.borderTopRightRadius,
          endBorderRadius
        );
        style.borderBottomLeftRadius = interpolate2(
          style.borderBottomLeftRadius,
          endBorderRadius
        );
        style.borderBottomRightRadius = interpolate2(
          style.borderBottomRightRadius,
          endBorderRadius
        );

        // Render
        result.push(render(clone, tileIndex));
      }
    }
    return result;
  }

  const fromTiles = convertToTiles(false);
  const toTiles = convertToTiles(true);

  //
  // Render
  //
  return [...fromTiles, ...toTiles];
}

dottedTransition.defaultProps = {
  useNativeDriver: true,
  nativeContentType: "snapshot"
};
