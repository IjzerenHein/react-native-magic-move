import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { storeObserver, StorePropType } from "../Store";

const DebugButton = ({ store }) => {
  const { debug } = store;
  return (
    <TouchableOpacity onPress={() => (store.debug = !debug)}>
      <View
        style={{
          paddingVertical: 6,
          paddingHorizontal: 8,
          borderRadius: 16,
          marginRight: 8,
          backgroundColor: debug ? "dodgerblue" : "white"
        }}
      >
        <Text
          style={{
            fontSize: 13,
            fontWeight: "bold",
            color: debug ? "white" : "dodgerblue"
          }}
        >
          Debug
        </Text>
      </View>
    </TouchableOpacity>
  );
};

DebugButton.propTypes = {
  store: StorePropType
};

export default storeObserver(DebugButton);
