import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import MagicMove from "./magic-move";
import { Actions } from "react-native-router-flux";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "column",
    padding: 10
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20
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
    color: "white",
    fontSize: 20
  }
});

export default class Main extends React.Component {
  renderItem({ id, color, text, onPress }) {
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
        <MagicMove.View
          id={id}
          style={[styles.box, { backgroundColor: color }]}
        >
          <Text id={`${id}.title2`} style={styles.text}>
            {text}
          </Text>
        </MagicMove.View>
      </TouchableOpacity>
    );
  }

  renderImageItem({ id, source, onPress }) {
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
        <MagicMove.Image id={id} source={source} style={[styles.box]} />
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <MagicMove.Scene style={styles.container}>
        <View style={styles.row}>
          {this.renderItem({
            id: "scene1",
            color: "green",
            text: "Scene1",
            onPress: () => Actions.push("scene1")
          })}
          {this.renderItem({
            id: "list2",
            color: "purple",
            text: "Scene2",
            onPress: () => Actions.push("scene2")
          })}
        </View>
        <View style={styles.row}>
          {this.renderImageItem({
            id: "image",
            source: require("./assets/waves.jpg"),
            text: "Image",
            onPress: () => Actions.push("scene3")
          })}
          {this.renderItem({
            id: "scene4",
            color: "orange",
            text: "Scene4"
          })}
        </View>
      </MagicMove.Scene>
    );
  }
}
