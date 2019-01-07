import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { PropTypes } from "prop-types";

const Button = ({ label, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          paddingVertical: 20,
          paddingHorizontal: 12,
          borderRadius: 16,
          marginRight: 8,
          backgroundColor: "dodgerblue",
          minWidth: 200
        }}
      >
        <Text
          style={{
            fontSize: 17,
            fontWeight: "bold",
            color: "white",
            textAlign: "center"
          }}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

Button.propTypes = {
  onPress: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired
};

export default Button;
