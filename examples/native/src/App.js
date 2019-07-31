import React from "react";
import { View, Platform } from "react-native";
import {
  createAppContainer,
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";
import Icon from "react-native-vector-icons/Ionicons";
import * as MagicMove from "react-native-magic-move";
import "react-navigation-magic-move";
import { StoreProvider, storeObserver } from "./store";
import DebugButton from "./components/DebugButton";
import Main from "./stack/Main";
import Scene1 from "./stack/Scene1";
import Scene2 from "./stack/Scene2";
import Scene3 from "./stack/Scene3";
import Scene4 from "./stack/Scene4";
import Scene5 from "./stack/Scene5";
import Scene6 from "./stack/Scene6";
import Scene7 from "./stack/Scene7";
import Scene8 from "./stack/Scene8";
import MultiScene from "./multi/MultiScene";
import DebugScene from "./debug/DebugScene";
import ModalScene from "./modal/ModalScene";
import ModalScene2 from "./modal/ModalScene2";
import ExplorerView from "./explorer/ExplorerView";

// eslint-disable-next-line
const TabBarIcon = ({ name, tintColor }) => (
  <Icon
    name={(Platform.OS === "android" ? "md-" : "ios-") + name}
    size={24}
    color={tintColor}
  />
);

const StackIcon = props => <TabBarIcon name="color-wand" {...props} />;
const MultiIcon = props => <TabBarIcon name="microphone" {...props} />;
const DebugIcon = props => <TabBarIcon name="bug" {...props} />;
const ModalIcon = props => <TabBarIcon name="arrow-round-up" {...props} />;
const ExplorerIcon = props => <TabBarIcon name="rocket" {...props} />;

const AppMainStackNavigator = createStackNavigator(
  {
    main: Main,
    scene1: Scene1,
    scene2: Scene2,
    scene3: Scene3,
    scene4: Scene4,
    scene5: Scene5,
    scene6: Scene6,
    scene7: Scene7,
    scene8: Scene8
  },
  {
    initialRouteName: "main",
    navigationOptions: () => {
      return {
        tabBarLabel: "Main",
        tabBarIcon: StackIcon
      };
    },
    defaultNavigationOptions: {
      headerRight: <DebugButton />
    }
  }
);

const AppExplorerStackNavigator = createStackNavigator(
  {
    explorer: ExplorerView
  },
  {
    initialRouteName: "explorer",
    navigationOptions: () => {
      return {
        tabBarLabel: "Explore",
        tabBarIcon: ExplorerIcon
      };
    },
    defaultNavigationOptions: {
      headerRight: <DebugButton />
    }
  }
);

const AppMultiStackNavigator = createStackNavigator(
  {
    multi: MultiScene
  },
  {
    initialRouteName: "multi",
    navigationOptions: () => {
      return {
        tabBarLabel: "Multi",
        tabBarIcon: MultiIcon
      };
    },
    defaultNavigationOptions: {
      headerRight: <DebugButton />
    }
  }
);

const AppDebugStackNavigator = createStackNavigator(
  {
    debug: DebugScene
  },
  {
    initialRouteName: "debug",
    navigationOptions: () => {
      return {
        tabBarLabel: "Debug",
        tabBarIcon: DebugIcon
      };
    }
  }
);

const AppModalStackNavigator = createStackNavigator(
  {
    modal: ModalScene,
    modal2: ModalScene2
  },
  {
    initialRouteName: "modal",
    navigationOptions: () => {
      return {
        tabBarLabel: "Modal",
        tabBarIcon: ModalIcon
      };
    },
    defaultNavigationOptions: {
      headerRight: <DebugButton />
    }
  }
);

export const AppTabNavigator = createBottomTabNavigator({
  main: AppMainStackNavigator,
  explorer: AppExplorerStackNavigator,
  multi: AppMultiStackNavigator,
  debug: AppDebugStackNavigator,
  modal: AppModalStackNavigator
});

const AppContainer = createAppContainer(AppTabNavigator);

const AppInner = storeObserver(({ store }) => (
  <MagicMove.Provider debug={store.debug}>
    <AppContainer />
  </MagicMove.Provider>
));

const App = () => (
  <View style={{ margin: 0, flex: 1 }}>
    <StoreProvider>
      <AppInner />
    </StoreProvider>
  </View>
);

export default App;
