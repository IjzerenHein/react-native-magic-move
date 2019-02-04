import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import * as MagicMove from "react-native-magic-move";
import { Actions } from "react-native-router-flux";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "column",
    padding: 10
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16
  },
  box: {
    width: 140,
    height: 140,
    borderRadius: 70,
    flexDirection: "column",
    justifyContent: "center"
  },
  text: {
    alignSelf: "center",
    textAlign: "center",
    color: "white",
    fontSize: 20
  }
});

class Main extends Component {
  renderItem({ id, style, text, onPress }) {
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
        <MagicMove.View
          id={id}
          style={[styles.box, style]}
          transition={MagicMove.Transition.morph}
        >
          <MagicMove.Text
            id={`${id}.title`}
            style={styles.text}
            transition={MagicMove.Transition.morph}
          >
            {text}
          </MagicMove.Text>
        </MagicMove.View>
      </TouchableOpacity>
    );
  }

  renderImageItem({ id, source, onPress }) {
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
        <View style={styles.box}>
          <MagicMove.Image
            id={id}
            source={source}
            resizeMode="cover"
            style={[styles.box, StyleSheet.absoluteFill]}
          />
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <MagicMove.Scene style={styles.container}>
        <View style={styles.row}>
          {this.renderItem({
            id: "scene1",
            text: "Move",
            style: {
              backgroundColor: "blueviolet"
            },
            onPress: () => Actions.push("scene1")
          })}
          {this.renderImageItem({
            id: "image",
            source: require("../assets/waterfall.jpg"),
            onPress: () => Actions.push("scene3")
          })}
        </View>
        <View style={styles.row}>
          {this.renderItem({
            id: "list5",
            text: "ScrollView",
            style: {
              backgroundColor: "purple",
              borderRadius: 0
            },
            onPress: () => Actions.push("scene2")
          })}
          {this.renderItem({
            id: "scene4",
            text: "Morph",
            style: {
              backgroundColor: "orange",
              borderTopLeftRadius: 0
            },
            onPress: () => Actions.push("scene4")
          })}
        </View>
        <View style={styles.row}>
          {this.renderItem({
            id: "scene5",
            text: "Flip",
            style: {
              backgroundColor: "goldenrod"
            },
            onPress: () => Actions.push("scene5")
          })}
          {this.renderItem({
            id: "scene6",
            text: "Dissolve",
            style: {
              backgroundColor: "seagreen"
            },
            onPress: () => Actions.push("scene6")
          })}
        </View>
        <View style={styles.row}>
          {this.renderItem({
            id: "scene7",
            text: "Shrink & Grow",
            style: {
              backgroundColor: "salmon"
            },
            onPress: () => Actions.push("scene7")
          })}
          {this.renderItem({
            id: "scene8",
            text: "Squash & Stretch",
            style: {
              backgroundColor: "steelblue"
            },
            onPress: () => Actions.push("scene8")
          })}
        </View>
      </MagicMove.Scene>
    );
  }
}

export default Main;
