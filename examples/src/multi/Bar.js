import React from "react";
import { View, StyleSheet } from "react-native";
import { PropTypes } from "prop-types";
import * as MagicMove from "react-native-magic-move";

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "center"
  },
  row: {
    flexDirection: "row"
  },
  item: {
    width: 32,
    height: 32,
    borderRadius: 16,
    margin: 8
  }
});

// eslint-disable-next-line
const Item = ({ color, id, debug }) => (
  <MagicMove.View
    style={[styles.item, { backgroundColor: color }]}
    id={id}
    debug={debug}
  />
);

const Bar = ({ hideId, debug }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {hideId !== "scene5" ? (
          <Item id={"scene5"} color={"goldenrod"} debug={debug} />
        ) : (
          undefined
        )}
        {hideId !== "scene6" ? (
          <Item id={"scene6"} color={"seagreen"} debug={debug} />
        ) : (
          undefined
        )}
        {hideId !== "scene7" ? (
          <Item id={"scene7"} color={"salmon"} debug={debug} />
        ) : (
          undefined
        )}
        {hideId !== "scene8" ? (
          <Item id={"scene8"} color={"steelblue"} debug={debug} />
        ) : (
          undefined
        )}
      </View>
    </View>
  );
};

Bar.propTypes = {
  hideId: PropTypes.string.isRequired,
  debug: PropTypes.bool
};

export default Bar;
