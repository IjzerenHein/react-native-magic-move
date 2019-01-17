import React from "react";
import { storeObserver, StorePropType } from "../store";
import FlatButton from "./FlatButton";

const DebugButton = ({ store }) => {
  const { debug } = store;
  return (
    <FlatButton
      style={{ marginRight: 8 }}
      label="Debug"
      onPress={() => (store.debug = !debug)}
      checked={store.debug}
    />
  );
};

DebugButton.propTypes = {
  store: StorePropType
};

export default storeObserver(DebugButton);
