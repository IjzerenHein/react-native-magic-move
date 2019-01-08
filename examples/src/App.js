import React from "react";
import { View } from "react-native";
import { Router, Stack, Scene, Tabs, Modal } from "react-native-router-flux";
import { StoreProvider } from "./Store";
import DebugButton from "./DebugButton";
import Main from "./Main";
import Scene1 from "./Scene1";
import Scene2 from "./Scene2";
import Scene3 from "./Scene3";
import Scene4 from "./Scene4";
import Scene5 from "./Scene5";
import Scene6 from "./Scene6";
import Scene7 from "./Scene7";
import Scene8 from "./Scene8";
import MultiScene from "./MultiScene";
import MultiScene2 from "./MultiScene2";
import ModalScene from "./ModalScene";
import ModalScene2 from "./ModalScene2";
import * as MagicMove from "./magic-move";

const App = () => (
  <View style={{ margin: 0, flex: 1 }}>
    <MagicMove.Provider>
      <StoreProvider>
        <Router>
          <Tabs>
            <Stack key="tab1" tabBarLabel={"First"}>
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
            <Scene key="tab2" component={MultiScene} title="Multi Move" />
            <Scene key="tab3" component={MultiScene2} title="Multi" />
            <Modal title="Modal">
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
