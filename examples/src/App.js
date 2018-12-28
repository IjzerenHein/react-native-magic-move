import React from "react";
import { Router, Stack, Scene } from "react-native-router-flux";
import Main from "./Main";
import Scene1 from "./Scene1";
import Scene2 from "./Scene2";
import Scene3 from "./Scene3";
import MagicMove from "./magic-move";

const App = () => (
  <MagicMove>
    <Router>
      <Stack key="root">
        <Scene key="main" component={Main} title="Magic Move" />
        <Scene key="scene1" component={Scene1} />
        <Scene key="scene2" component={Scene2} />
        <Scene key="scene3" component={Scene3} />
      </Stack>
    </Router>
  </MagicMove>
);
export default App;
