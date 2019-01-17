import React from "react";
import { View, Platform } from "react-native";
import { Router, Stack, Scene, Tabs, Modal } from "react-native-router-flux";
import Icon from "react-native-vector-icons/Ionicons";
import * as MagicMove from "react-native-magic-move";
// import "react-navigation-magic-move";
import { StoreProvider } from "./store";
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

const App = () => (
  <View style={{ margin: 0, flex: 1 }}>
    <MagicMove.Provider>
      <StoreProvider>
        <Router>
          <Tabs>
            <Stack key="tab1" tabBarLabel={"Stack"} icon={StackIcon}>
              <Scene
                key="main"
                component={Main}
                title="react-native-magic-move"
                titleStyle={{ width: 300 }}
                renderRightButton={() => <DebugButton />}
              />
              <Scene key="scene1" component={Scene1} title="Scale" />
              <Scene key="scene2" component={Scene2} title="ScrollView" />
              <Scene key="scene3" component={Scene3} title="Image" />
              <Scene key="scene4" component={Scene4} title="Color Change" />
              <Scene key="scene5" component={Scene5} title="Flip" />
              <Scene key="scene6" component={Scene6} title="Dissolve" />
              <Scene key="scene7" component={Scene7} title="Shrink & Grow" />
              <Scene key="scene8" component={Scene8} title="Squash & Stretch" />
            </Stack>
            <Scene
              key="explorer"
              component={ExplorerView}
              title="Transition Explorer"
              tabBarLabel="Explorer"
              icon={ExplorerIcon}
              renderRightButton={() => <DebugButton />}
            />
            <Scene
              key="tab2"
              component={MultiScene}
              title="Tab"
              icon={MultiIcon}
              renderRightButton={() => <DebugButton />}
            />
            <Scene
              key="tab3"
              component={DebugScene}
              title="Debug"
              icon={DebugIcon}
            />
            <Modal
              title="Modal"
              icon={ModalIcon}
              renderRightButton={() => <DebugButton />}
            >
              <Scene key="tab3" component={ModalScene} title="Modal" />
              <Scene key="modal" component={ModalScene2} title="Modal" />
            </Modal>
          </Tabs>
        </Router>
      </StoreProvider>
    </MagicMove.Provider>
  </View>
);
export default App;
