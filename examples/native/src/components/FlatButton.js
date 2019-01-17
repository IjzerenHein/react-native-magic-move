import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 16
  },
  text: {
    fontSize: 13,
    fontWeight: "bold",
    color: "dodgerblue"
  }
});

const FlatButton = ({ label, onPress, checked, style }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          style,
          styles.container,
          checked ? { backgroundColor: "dodgerblue" } : undefined
        ]}
      >
        <Text style={[styles.text, checked ? { color: "white" } : undefined]}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

FlatButton.propTypes = {
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  checked: PropTypes.bool,
  style: PropTypes.any
};

export default FlatButton;
