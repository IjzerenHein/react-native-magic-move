import React from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import * as MagicMove from "react-native-magic-move";
import * as Animatable from "react-native-animatable";
import { Actions } from "react-native-router-flux";
import content from "./content";

const ITEM_SIZE = Math.round(Dimensions.get("window").width / 3);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "space-around",
    padding: 20
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  image: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2
  },
  title: {
    textAlign: "center",
    color: "#222222",
    fontSize: 26,
    fontWeight: "bold"
  },
  text: {
    alignSelf: "center",
    color: "seagreen",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 19,
    lineHeight: 24
  }
});

class Scene extends React.Component {
  renderItem(content) {
    const { id, image } = content;
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => Actions.modal2({ content })}
      >
        <MagicMove.Image
          id={id}
          style={styles.image}
          resizeMode="cover"
          source={image}
        />
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <MagicMove.Scene style={styles.container}>
        {/*<Text style={styles.title}>Homage to Escher</Text>*/}
        <View style={styles.row}>
          {this.renderItem(content.waterfall)}
          {this.renderItem(content.cycle)}
        </View>
        <View style={styles.row}>
          {this.renderItem(content.relativity)}
          {this.renderItem(content.metamorphosis)}
        </View>
        <View style={styles.row}>
          {this.renderItem(content.hands)}
          {this.renderItem(content.escher)}
        </View>
        <Animatable.Text
          style={styles.text}
          animation="fadeInUp"
          delay={400}
          duration={500}
        >
          Tap an item to open a Modal
        </Animatable.Text>
      </MagicMove.Scene>
    );
  }
}

export default Scene;
