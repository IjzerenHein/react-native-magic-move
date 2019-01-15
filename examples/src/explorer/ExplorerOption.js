import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import ActionSheet from "react-native-actionsheet";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 4
  },
  label: {
    fontSize: 11,
    textTransform: "uppercase",
    color: "#888888"
  },
  value: {
    color: "dodgerblue",
    marginTop: 1,
    fontSize: 14,
    fontWeight: "bold"
  }
});

class ExplorerOption extends React.Component {
  static propTypes = {
    componentStore: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    values: PropTypes.array.isRequired
  };
  render() {
    const { componentStore, label, name, values } = this.props;
    const valueLabel = componentStore[name].label;
    return (
      <TouchableOpacity onPress={this.onPress} style={styles.container}>
        <View>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value} numberOfLines={1}>
            {valueLabel}
          </Text>
          <ActionSheet
            ref={this.setActionSheetRef}
            title={`Select a ${label}`}
            options={[...values.map(({ label }) => label), "cancel"]}
            cancelButtonIndex={values.length}
            onPress={this.onSelectOption}
          />
        </View>
      </TouchableOpacity>
    );
  }

  setActionSheetRef = ref => {
    this._actionSheet = ref;
  };

  onPress = () => {
    this._actionSheet.show();
  };

  onSelectOption = index => {
    const { componentStore, name, values } = this.props;
    if (index >= values.length) return;
    componentStore[name] = values[index];
  };
}

export default observer(ExplorerOption);
