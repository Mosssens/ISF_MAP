import React, { useState, useEffect } from 'react';
import Layout from './Components/Layout/Layout'
import SchematicTripState from './Pages/SchematicTripState/SchematicTripState'
import AllBusLocations from './Pages/AllBusLocations/AllBusLocations'
import Loader from './Components/Loader/Loader'
// var ws = new WebSocket('ws://77.237.74.40:4546/tms/websocket/getAllBusLocations')
import {
  BrowserRouter as Router,
  HashRouter,
  Switch,
  Route,
  Link
} from "react-router-dom";
function App() {
  return (
    <HashRouter basename="/tms/newreports/">
      <Layout>
        <Switch>
          <Route path="/SchematicTripState" component={SchematicTripState} />
          <Route path="/AllBusLocations" component={AllBusLocations} />
          <Route path="/" >
            <Loader />
          </Route>
        </Switch>
      </Layout>
    </HashRouter>
  );
}

export default App;
