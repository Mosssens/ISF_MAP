import React, { useState, useEffect } from 'react';
import Layout from './Components/Layout/Layout'
import SchematicTripState from './Pages/SchematicTripState/SchematicTripState'
import AllBusLocations from './Pages/AllBusLocations/AllBusLocations'
// var ws = new WebSocket('ws://77.237.74.40:4546/tms/websocket/getAllBusLocations')
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
function App() {
  
  useEffect(() => {
    
    // ws.onopen = () => {
    //   // on connecting, do nothing but log it to the console
    //   console.log('connected')
    //   }
    //   ws.onmessage = evt => {
    //     // listen to data sent from the websocket server
    //     const message = JSON.parse(evt.data)
    //     // this.setState({dataFromServer: message})
    //     console.log(message)
    //     }
  });
  return (


    <Router>
      <Layout>
        <Switch>
          <Route path="/SchematicTripState" component={SchematicTripState} />
          <Route path="/AllBusLocations" component={AllBusLocations} />
          <Route path="/" >
            <div>asdasda</div>
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
