import React , { useState, useEffect } from 'react';
import Layout from './Components/Layout/Layout'
// var ws = new WebSocket('ws://77.237.74.40:4546/tms/websocket/getAllBusLocations')
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
   <Layout />
  );
}

export default App;
