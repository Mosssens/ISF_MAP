import React, { useEffect, useRef, useState } from "react";
import Map from "../../Components/Map/Map";
import "./SchematicTripState.scss";
import { FaAngleDoubleRight } from "react-icons/fa";
import data from "./data.js";
const SchematicTripState = () => {
  const forwardLineRef = useRef();
  const backwardLineRef = useRef();
  const ws = new WebSocket(
    "ws://193.176.241.150:8080/tms/websocket/getSchematicTripState"
  );
  const [inboundBusStops, setInboundBusStops] = useState([]);
  const [inboundBuses, setInboundBuses] = useState([]);
  const [outboundBusStops, setOutboundBusStops] = useState([]);
  const [outboundBuses, setOutboundBuses] = useState([]);
  const makeRnd = () => {
    return (Math.random() * (9.0 - 1.0 + 1.0) + 1.0).toFixed(2);
  };

  const getRandomColor = () => {
    var letters = "0123456789ABCDEF".split("");
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  };

  useEffect(() => {
    ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log("connected");
      ws.send(
        JSON.stringify({
          messageType: "getSchematicTripState",
          payloadType: "getSchematicTripState",
          payload: 9,
        })
      );
    };
  }, []);
  useEffect(() => {
    ws.onmessage = (evt) => {
      // listen to data sent from the websocket server
      const message = JSON.parse(evt.data);
      // this.setState({dataFromServer: message})
      console.log(message);
      const busStopsTemp = message.payload.inboundPoints.filter(
        (item) => item.stopName !== null
      );
      const busStopsTempFinal = busStopsTemp.map((busStop, index) => {
        return {
          ...busStop,
          marginLeft:
            (parseFloat(
              forwardLineRef.current.offsetWidth -
                20 +
                parseFloat(forwardLineRef.current.offsetWidth - 20) /
                  busStopsTemp.length
            ) /
              busStopsTemp.length) *
            index,
        };
      });

      setInboundBusStops(busStopsTempFinal);
      const busesTemp = message.payload.inboundBusList.map((bus, indexBus) => {
        var marginLeft;
        busStopsTempFinal.map((busStop, indexBusStop) => {
          if (
            busStop.order <= bus.pointOrder &&
            busStopsTempFinal[
              busStopsTempFinal.length === indexBusStop + 1
                ? indexBusStop
                : indexBusStop + 1
            ].order >= bus.pointOrder
          ) {
            marginLeft =
              (parseFloat(
                forwardLineRef.current.offsetWidth -
                  20 +
                  parseFloat(forwardLineRef.current.offsetWidth - 20) /
                    busStopsTemp.length
              ) /
                busStopsTempFinal.length) *
              indexBusStop -
              (busStopsTempFinal[indexBusStop].order -
                bus.pointOrder);
          }
        });
        return {
          ...bus,
          marginLeft: marginLeft,
        };
      });
      setInboundBuses(busesTemp);
      //outBound
      const outboundBusStopsTemp = message.payload.outboundPoints.filter(
        (item) => item.stopName !== null
      );
      const outboundBusStopsTempFinal = outboundBusStopsTemp.map(
        (busStop, index) => {
          return {
            ...busStop,
            marginRight:
              (parseFloat(
                backwardLineRef.current.offsetWidth -
                  20 +
                  parseFloat(backwardLineRef.current.offsetWidth - 20) /
                    outboundBusStopsTemp.length
              ) /
                outboundBusStopsTemp.length) *
              index,
          };
        }
      );
      // console.log("oi", outboundBusStopsTempFinal);

      setOutboundBusStops(outboundBusStopsTempFinal);
      //fff
      const outbusesTemp = message.payload.outboundBusList.map(
        (bus, indexBus) => {
          var marginLeft;
          outboundBusStopsTempFinal.map((busStop, indexBusStop) => {
            if (
              busStop.order <= bus.pointOrder &&
              outboundBusStopsTempFinal[
                outboundBusStopsTempFinal.length === indexBusStop + 1
                  ? indexBusStop
                  : indexBusStop + 1
              ].order >= bus.pointOrder
            ) {
              marginLeft =
                (parseFloat(
                  forwardLineRef.current.offsetWidth -
                    20 +
                    parseFloat(forwardLineRef.current.offsetWidth - 20) /
                      outboundBusStopsTempFinal.length
                ) /
                  outboundBusStopsTempFinal.length) *
                  indexBusStop -
                (outboundBusStopsTempFinal[indexBusStop].order -
                  bus.pointOrder);
            }
          });
          return {
            ...bus,
            marginLeft: marginLeft,
          };
        }
      );
      //addd
      // const outbusesTemp = message.payload.outboundBusList.map(
      //   (bus, indexBus) => {
      //     var marginRight;
      //     outboundBusStopsTempFinal.map((busStop, indexBusStop) => {
      //       if (
      //         busStop.order <= bus.pointOrder &&
      //         outboundBusStopsTempFinal[
      //           outboundBusStopsTempFinal.length === indexBusStop + 1
      //             ? indexBusStop
      //             : indexBusStop + 1
      //         ].order >= bus.pointOrder
      //       ) {
      //         marginRight =
      //         (parseFloat(
      //           backwardLineRef.current.offsetWidth -
      //             20 +
      //             parseFloat(backwardLineRef.current.offsetWidth - 20) /
      //               outboundBusStopsTemp.length
      //         ) /
      //           outboundBusStopsTemp.length) *
      //           indexBusStop
      //       }
      //     });
      //     return {
      //       ...bus,
      //       marginRight: marginRight,
      //     };
      //   }
      // );
      setOutboundBuses(outbusesTemp);
      // console.log("sada", outbusesTemp);
    };
  }, [outboundBusStops, inboundBusStops, ws.onmessage]);
  useEffect(() => {
    return () => {
      ws.close();
    };
  }, []);

  // useEffect(() => {

  //   console.log(
  //     "width",
  //     forwardLineRef.current ? forwardLineRef.current.offsetWidth : 0
  //   );
  // }, [ws.onmessage]);
  return (
    <section className="SchematicTripState">
      <div className="card">
        <div className="header">مسیر رفت :</div>
        <div className="line forward" ref={forwardLineRef}>
          {inboundBuses.map((bus, index) => {
            return (
              <div key={index} className="bus" style={{ left: bus.marginLeft }}>
                <div className="pos pin">
                  <div
                    className="pin-marker"
                    // style={{ background: getRandomColor() }}
                  ></div>
                  <div className="bus-name">{bus.busCode}</div>
                </div>
              </div>
            );
          })}
          {inboundBusStops.map((busStop, index) => {
            return (
              <div
                key={index}
                className="bus-stop"
                style={{ left: busStop.marginLeft }}
              >
                <div className="bus-stop-counter">{busStop.stopCode}</div>
                <div className="bus-stop-name">{busStop.stopName}</div>
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
        <div className="line backwards" ref={backwardLineRef}>
          {outboundBuses.map((bus, index) => {
            return (
              <div key={index} className="bus" style={{ left: bus.marginLeft }}>
                <div className="pos pin">
                  <div
                    className="pin-marker"
                    // style={{ background: getRandomColor() }}
                  ></div>
                  <div className="bus-name">{bus.busCode}</div>
                </div>
              </div>
            );
          })}
          {outboundBusStops.map((busStop, index) => {
            return (
              <div
                key={index}
                className="bus-stop"
                style={{ left: busStop.marginRight }}
              >
                <div className="bus-stop-counter">{busStop.stopCode}</div>
                <div className="bus-stop-name">{busStop.stopName}</div>
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
