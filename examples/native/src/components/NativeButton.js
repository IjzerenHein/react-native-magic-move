import React from "react";
import { storeObserver, StorePropType } from "../store";
import FlatButton from "./FlatButton";

const NativeButton = ({ store }) => {
  const { native } = store;
  return (
    <FlatButton
      style={{ marginLeft: 8 }}
      label={
        native === undefined
          ? "Native: Auto"
          : native
          ? "Native: On"
          : "Native: Off"
      }
      onPress={() => {
        if (native === undefined) {
          store.native = true;
        } else if (native === true) {
          store.native = false;
        } else {
          store.native = undefined;
        }
      }}
      checked={native || native === undefined}
    />
  );
};

NativeButton.propTypes = {
  store: StorePropType
};

export default storeObserver(NativeButton);
