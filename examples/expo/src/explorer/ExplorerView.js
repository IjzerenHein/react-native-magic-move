import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { observer } from "mobx-react";
import SegmentedControlTab from "react-native-segmented-control-tab";
import ExplorerComponent from "./ExplorerComponent";
import ExplorerComponentStore from "./ExplorerComponentStore";
import * as MagicMove from "react-native-magic-move";
import { NavigationEvents } from "react-navigation";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "column"
  },
  segment: {
    marginTop: 10,
    marginHorizontal: 10
  },
  componentContainer: {
    flex: 1
  },
  component: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  }
});

class ExplorerView extends Component {
  state = {
    isTabActive: false,
    componentStores: [
      new ExplorerComponentStore({
        label: "First",
        content: "Image 2",
        size: "Large",
        shape: "Rounded Square",
        position: "Center",
        transition: "Morph",
        duration: "Fast",
        easing: "Elastic",
        disabled: "No"
      }),
      new ExplorerComponentStore({
        label: "Second",
        content: "Green",
        size: "Small",
        shape: "Circle",
        position: "Bottom",
        transition: "Morph",
        duration: "Fast",
        easing: "In Out",
        disabled: "No"
      }),
      new ExplorerComponentStore({
        label: "Third",
        content: "Green",
        size: "Max",
        shape: "Square",
        position: "Center",
        transition: "Morph",
        duration: "Fast",
        easing: "In Out",
        disabled: "No"
      })
    ],
    selectedIndex: 0
  };

  render() {
    const { componentStores, selectedIndex, isTabActive } = this.state;
    return (
      <View style={styles.container}>
        <NavigationEvents
          onWillFocus={this.onWillFocus}
          onWillBlur={this.onWillBlur}
        />
        <View style={styles.segment}>
          <SegmentedControlTab
            values={componentStores.map(({ label }) => label)}
            selectedIndex={selectedIndex}
            onTabPress={this.onChangeTab}
          />
        </View>
        <View style={styles.componentContainer}>
          {componentStores.map((componentStore, index) => {
            const isActive = index === selectedIndex;
            return (
              <MagicMove.Scene
                key={index + ""}
                active={isTabActive && isActive}
                style={[styles.component, { opacity: isActive ? 1 : 0 }]}
                pointerEvents={isActive ? "auto" : "none"}
              >
                <ExplorerComponent componentStore={componentStore} />
              </MagicMove.Scene>
            );
          })}
        </View>
      </View>
    );
  }

  onChangeTab = index => {
    this.setState({
      selectedIndex: index
    });
  };

  onWillFocus = () => {
    this.setState({
      isTabActive: true
    });
  };

  onWillBlur = () => {
    this.setState({
      isTabActive: false
    });
  };
}

export default observer(ExplorerView);
