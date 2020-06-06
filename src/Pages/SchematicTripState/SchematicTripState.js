import React, { useEffect, useRef, useState } from "react";
import Map from "../../Components/Map/Map";
import "./SchematicTripState.scss";
import { FaAngleDoubleRight } from "react-icons/fa";

const SchematicTripState = () => {
  const forwardLineRef = useRef();
  //   const ws = new WebSocket(
  //     "ws://77.237.74.40:4546/tms/websocket/getSchematicTripState"
  //   );
  const [busStops, setBusStops] = useState([
    {
      id: 1,
      name: "ایستگاه 1",
    },
    {
      id: 2,
      name: "ایستگاه 2",
    },
    {
      id: 3,
      name: "ایستگاه 3",
    },
    {
      id: 4,
      name: "ایستگاه 4",
    },
    {
      id: 5,
      name: "ایستگاه 5",
    },
    {
      id: 6,
      name: "ایستگاه 6",
    },
    {
      id: 7,
      name: "ایستگاه 7",
    },
    {
      id: 8,
      name: "ایستگاه 8",
    },
    {
      id: 9,
      name: "ایستگاه 9",
    },
    {
      id: 10,
      name: "ایستگاه 10",
    },
  ]);
  const makeRnd = () => {
    return (Math.random() * (9.0 - 1.0 + 1.0) + 1.0).toFixed(2);
  };
  const [buses, setBuses] = useState([
    {
      buscode: "234",
      position: makeRnd(),
    },
    {
      buscode: "413",
      position: makeRnd(),
    },
    {
      buscode: "412",
      position: makeRnd(),
    },
    {
      buscode: "111",
      position: makeRnd(),
    },
    {
      buscode: "011",
      position: makeRnd(),
    },
    {
      buscode: "413",
      position: makeRnd(),
    },
    {
      buscode: "412",
      position: makeRnd(),
    },
    {
      buscode: "111",
      position: makeRnd(),
    },
    {
      buscode: "011",
      position: makeRnd(),
    },
    {
      buscode: "413",
      position: makeRnd(),
    },
    {
      buscode: "412",
      position: makeRnd(),
    },
    {
      buscode: "111",
      position: makeRnd(),
    },
    {
      buscode: "011",
      position: makeRnd(),
    },
    {
      buscode: "413",
      position: makeRnd(),
    },
    {
      buscode: "412",
      position: makeRnd(),
    },
    {
      buscode: "111",
      position: makeRnd(),
    },
    {
      buscode: "011",
      position: makeRnd(),
    },
    {
      buscode: "413",
      position: makeRnd(),
    },
    {
      buscode: "412",
      position: makeRnd(),
    },
    {
      buscode: "111",
      position: makeRnd(),
    },
    {
      buscode: "011",
      position: makeRnd(),
    },
  ]);
  const getRandomColor = () => {
    var letters = "0123456789ABCDEF".split("");
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  };
  useEffect(() => {
    console.log(buses);
    // ws.onopen = () => {
    //   // on connecting, do nothing but log it to the console
    //   console.log("connected");
    //   ws.send(
    //     JSON.stringify({
    //       messageType: "getSchematicTripState",
    //       payloadType: "getSchematicTripState",
    //       payload: 9,
    //     })
    //   );
    // };

    // ws.onmessage = (evt) => {
    //   // listen to data sent from the websocket server
    //   const message = JSON.parse(evt.data);
    //   // this.setState({dataFromServer: message})
    //   console.log(message);
    // };

    console.log(
      "width",
      forwardLineRef.current ? forwardLineRef.current.offsetWidth : 0
    );
    setBusStops(
      busStops.map((busStop, index) => {
        return {
          ...busStop,
          marginLeft:
            (parseInt(
              forwardLineRef.current.offsetWidth -
                20 +
                parseInt(forwardLineRef.current.offsetWidth - 20) /
                  busStops.length
            ) /
              busStops.length) *
            index,
        };
      })
    );
    setBuses(
      buses.map((bus, index) => {
        return {
          ...bus,
          marginLeft:
            bus.position *
            (parseInt(forwardLineRef.current.offsetWidth - 20) /
              busStops.length),
        };
      })
    );

    console.log(busStops, buses);
  }, [forwardLineRef.current]);
  return (
    <section className="SchematicTripState">
      <div className="card">
        <div className="header">مسیر رفت :</div>
        <div className="line forward" ref={forwardLineRef}>
          {buses.map((bus, index) => {
            return (
              <div key={index} className="bus" style={{ left: bus.marginLeft }}>
                <div className="pos pin">
                  <div
                    className="pin-marker"
                    // style={{ background: getRandomColor() }}
                  ></div>
                  <div className="bus-name">{bus.buscode}</div>
                </div>
              </div>
            );
          })}
          {busStops.map((busStop, index) => {
            return (
              <div
                key={index}
                className="bus-stop"
                style={{ left: busStop.marginLeft }}
              >
                <div className="bus-stop-counter">{busStop.id}</div>
                <div className="bus-stop-name">{busStop.name}</div>
              </div>
            );
          })}
          {/*                     
                    <div className="arrows">
                        <FaAngleDoubleRight />
                    </div> */}
        </div>
        <div className="gap"></div>
      </div>
      <div className="card">
        <div className="header">مسیر برگشت :</div>
        <div className="line backwards" ref={forwardLineRef}>
        {buses.reverse().map((bus, index) => {
            return (
              <div key={index} className="bus" style={{ left: bus.marginLeft }}>
                <div className="pos pin">
                  <div
                    className="pin-marker"
                    // style={{ background: getRandomColor() }}
                  ></div>
                  <div className="bus-name">{bus.buscode}</div>
                </div>
              </div>
            );
          })} 
          {busStops.reverse().map((busStop, index) => {
            return (
              <div
                key={index}
                className="bus-stop"
                style={{ left: busStop.marginLeft }}
              >
                <div className="bus-stop-counter">{busStop.id}</div>
                <div className="bus-stop-name">{busStop.name}</div>
              </div>
            );
          })}
          {/*                     
                    <div className="arrows">
                        <FaAngleDoubleRight />
                    </div> */}
        </div>
        <div className="gap"></div>
      </div>
    </section>
  );
};
export default SchematicTripState;
