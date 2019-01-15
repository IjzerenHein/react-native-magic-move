import React from "react";
import { StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import { storeObserver, StorePropType } from "../store";
import ExplorerOption from "./ExplorerOption";
import TransitionComponent from "../components/TransitionComponent";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flexDirection: "column",
    flex: 1
  },
  header: {
    flexDirection: "column",
    paddingHorizontal: 10,
    paddingTop: 8
  },
  headerRow: {
    flexDirection: "row",
    paddingVertical: 10
  }
});

class ExplorerComponent extends React.Component {
  static propTypes = {
    store: StorePropType,
    componentStore: PropTypes.object.isRequired
  };

  render() {
    const { store, componentStore } = this.props;
    const { debug } = store;
    const header = (
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <ExplorerOption
            componentStore={componentStore}
            label="Content"
            name="content"
            values={componentStore.contents}
          />
          <ExplorerOption
            componentStore={componentStore}
            label="Size"
            name="size"
            values={componentStore.sizes}
          />
          <ExplorerOption
            componentStore={componentStore}
            label="Shape"
            name="shape"
            values={componentStore.shapes}
          />
          <ExplorerOption
            componentStore={componentStore}
            label="Position"
            name="position"
            values={componentStore.positions}
          />
        </View>
        <View style={styles.headerRow}>
          <ExplorerOption
            componentStore={componentStore}
            label="Transition"
            name="transition"
            values={componentStore.transitions}
          />
          <ExplorerOption
            componentStore={componentStore}
            label="Duration"
            name="duration"
            values={componentStore.durations}
          />
          <ExplorerOption
            componentStore={componentStore}
            label="Easing"
            name="easing"
            values={componentStore.easings}
          />
          <ExplorerOption
            componentStore={componentStore}
            label="Disabled"
            name="disabled"
            values={componentStore.disableds}
          />
        </View>
      </View>
    );

    return (
      <View style={styles.container}>
        {header}
        <TransitionComponent componentStore={componentStore} debug={debug} />
      </View>
    );
  }
}

export default storeObserver(ExplorerComponent);
