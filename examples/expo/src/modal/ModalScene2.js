import React from "react";
import { Dimensions, StyleSheet, ScrollView, View } from "react-native";
import * as MagicMove from "react-native-magic-move";
import * as Animatable from "react-native-animatable";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1
  },
  flex: {
    flex: 1
  },
  image: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.6,
    resizeMode: "cover"
  },
  content: {
    margin: 20
  },
  titleContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    transform: [{ translateY: -80 }]
  },
  title: {
    color: "white",
    fontSize: 37
  },
  text: {
    color: "#222222",
    fontWeight: "bold",
    fontSize: 19,
    lineHeight: 24
  }
});

class Scene extends React.Component {
  static propTypes = {
    content: PropTypes.object.isRequired
  };
  render() {
    const { id, image, title, description } = this.props.content;
    return (
      <MagicMove.Scene style={styles.container}>
        <ScrollView style={styles.flex}>
          <MagicMove.Image
            pointerEvents="none"
            id={id}
            source={image}
            style={styles.image}
          />
          <View style={styles.content} pointerEvents="none">
            <View style={styles.titleContainer}>
              <Animatable.Text
                style={styles.title}
                animation="fadeInLeft"
                delay={400}
                duration={500}
              >
                {title}
              </Animatable.Text>
            </View>
            <Animatable.Text
              style={styles.text}
              animation="fadeInUp"
              delay={400}
              duration={500}
            >
              {description}
            </Animatable.Text>
          </View>
        </ScrollView>
      </MagicMove.Scene>
    );
  }
}

export default Scene;
