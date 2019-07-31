import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import * as MagicMove from "react-native-magic-move";
import PropTypes from "prop-types";

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
  static propTypes = {
    navigation: PropTypes.any
  };
  static navigationOptions = {
    title: "react-native-magic-move"
  };
  renderItem({ id, style, text, onPress }) {
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={onPress} key={id}>
        <MagicMove.View
          key={id}
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
      <TouchableOpacity activeOpacity={0.5} onPress={onPress} key={id}>
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
    const { navigation } = this.props;
    return (
      <MagicMove.Scene style={styles.container}>
        <View style={styles.row} key="row1">
          {this.renderItem({
            id: "scene1",
            text: "Move",
            style: {
              backgroundColor: "blueviolet"
            },
            onPress: () => navigation.navigate("scene1")
          })}
          {this.renderImageItem({
            id: "image",
            source: require("../assets/waterfall.jpg"),
            onPress: () => navigation.navigate("scene3")
          })}
        </View>
        <View style={styles.row} key="row2">
          {this.renderItem({
            id: "list5",
            text: "ScrollView",
            style: {
              backgroundColor: "purple",
              borderRadius: 0
            },
            onPress: () => navigation.navigate("scene2")
          })}
          {this.renderItem({
            id: "scene4",
            text: "Morph",
            style: {
              backgroundColor: "orange",
              borderTopLeftRadius: 0
            },
            onPress: () => navigation.navigate("scene4")
          })}
        </View>
        <View style={styles.row} key="row3">
          {this.renderItem({
            id: "scene5",
            text: "Flip",
            style: {
              backgroundColor: "goldenrod"
            },
            onPress: () => navigation.navigate("scene5")
          })}
          {this.renderItem({
            id: "scene6",
            text: "Dissolve",
            style: {
              backgroundColor: "seagreen"
            },
            onPress: () => navigation.navigate("scene6")
          })}
        </View>
        <View style={styles.row} key="row4">
          {this.renderItem({
            id: "scene7",
            text: "Shrink & Grow",
            style: {
              backgroundColor: "salmon"
            },
            onPress: () => navigation.navigate("scene7")
          })}
          {this.renderItem({
            id: "scene8",
            text: "Squash & Stretch",
            style: {
              backgroundColor: "steelblue"
            },
            onPress: () => navigation.navigate("scene8")
          })}
        </View>
      </MagicMove.Scene>
    );
  }
}

export default Main;
