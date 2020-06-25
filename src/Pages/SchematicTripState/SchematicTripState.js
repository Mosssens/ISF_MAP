import React, { useEffect, useRef, useState } from "react";
import Map from "../../Components/Map/Map";
import "./SchematicTripState.scss";
import { FaAngleDoubleRight } from "react-icons/fa";
import data from "./data.js";
const SchematicTripState = () => {
  const forwardLineRef = useRef();
  const backwardLineRef = useRef();
  const [ws, setWs] = useState(null);
  const [isPaused, setPause] = useState(false);
  const [inboundBusStops, setInboundBusStops] = useState([]);
  const [inboundBuses, setInboundBuses] = useState([]);
  const [outboundBusStops, setOutboundBusStops] = useState([]);
  const [outboundBuses, setOutboundBuses] = useState([]);
  const [lines, setLines] = useState([]);
  const [selectedLine, setSelectedLine] = useState([]);
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
    const wsClient = new WebSocket(
      "ws://afc.qom.ir:9051/tms/websocket/getSchematicTripState"
    );
    wsClient.onopen = () => {
      console.log("ws opened");
      setWs(wsClient);
    };
    wsClient.onclose = () => console.log("ws closed");

    return () => {
      wsClient.close();
    };
  }, []);
  useEffect(() => {
    if (!ws) return;
    var isFirstMessageReceived = false;
    ws.onmessage = (e) => {
      if (isPaused) return;
      const message = JSON.parse(e.data);
      // this.setState({dataFromServer: message})
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
              (busStopsTempFinal[indexBusStop].order - bus.pointOrder);
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

      setOutboundBuses(outbusesTemp);
    };
  }, [isPaused, ws]);
  const onSubmitBtnClick = () => {
    ws.send(
      JSON.stringify({
        messageType: "getSchematicTripState",
        payloadType: "getSchematicTripState",
        payload: selectedLine,
      })
    );
  };
  async function getLines(name) {
    let response = await fetch(
      `http://afc.qom.ir:9051/tms/api/reactService/trip/all`
    );
    let data = await response.json();
    return data;
  }
  useEffect(() => {
    getLines().then((data) =>{ setLines(data); console.log(data,'sdasa')});
  }, []);
  
  return (
    <section className="SchematicTripState">
      <section className="header-container">
        <div className="header-card line-select-container">
          <div>خط :</div>
          <select
            onChange={(e) => {
              let { name, value } = e.target;
              setSelectedLine(value);
            }}
          >
            <option value="0">انتخاب کنید ...</option>
            {lines.map((line, index) => (
              <option key={index} value={line.code}>
                {line.name}
              </option>
            ))}
          </select>
          <button className="submit-btn" onClick={onSubmitBtnClick}>
            نمایش
          </button>
        </div>
        <div className="header-card line-info-container">
          <table>
            <tbody>
              <tr>
                <td>
                تعداد ایستگاه های مسیر رفت :
                </td>
                <td>
                  {
                    inboundBusStops.length
                  }
                </td>
              </tr>
              <tr>
                <td>
                   تعداد اتوبوس های مسیر رفت :
                </td>
                <td>
                 {
                   inboundBuses.length
                 }
                </td>
              </tr>
              <tr>
                <td>
                   تعداد ایستگاه های مسیر برگشت :
                </td>
                <td>
                {
                    outboundBusStops.length
                  }
                </td>
              </tr>
              <tr>
                <td>
                   تعداد اتوبوس های مسیر برگشت :
                </td>
                <td>
                  {
                    outboundBuses.length
                  }
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
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
