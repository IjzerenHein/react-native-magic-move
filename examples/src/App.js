import React from "react";
import { Router, Tabs, Scene } from "react-native-router-flux";
import Scene1 from "./Scene1";
import Scene2 from "./Scene2";
import MagicMove from "./magic-move";

const App = () => (
  <MagicMove>
    <Router>
      <Tabs key="main">
        <Scene key="scene1" component={Scene1} />
        <Scene key="scene2" component={Scene2} />
      </Tabs>
    </Router>
  </MagicMove>
);
export default App;
