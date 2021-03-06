import React, { useEffect, useRef, useState } from "react";
import "./SchematicTripState.scss";
import { FaAngleDoubleRight } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { appConfig } from "../../Constants/config";
import { from, lang } from "jalali-moment";
const language = appConfig.language.SchematicTripState;

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
  const [selectedLine, setSelectedLine] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lineDetail, setLineDetail] = useState({
    activeBusCount: 0,
    busCountInLine: 0,
    busCountInGarage: 0,
    busCountInOffSide: 0,
    busCountInParking: 0,
    busCountOutbound: 0,
    inActiveBusCount: 0,
    inboundDistance: 0,
    inboundTripDuration: 0,
    legalSpeed: 0,
    outboundDistance: 0,
    outboundTripDuration: 0,
    busCountInbound: 0,
  });

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
      `${appConfig.socketBaseAddress}websocket/getSchematicTripState`
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

      setIsLoading(false);

      const message = JSON.parse(e.data);
      // this.setState({dataFromServer: message})
      const busStopsTemp = message.payload.inboundPoints.filter(
        (item) => item.stopName !== null
      );
      const stepWidthForwardLine = parseFloat(
        forwardLineRef.current.offsetWidth / busStopsTemp.length
      );
      const busStopsTempFinal = busStopsTemp.map((busStop, index) => {
        return {
          ...busStop,
          marginLeft: stepWidthForwardLine * index,
        };
      });

      setInboundBusStops(busStopsTempFinal);

      var marginLeft;
      const busesTemp = message.payload.inboundBusList.map((bus, indexBus) => {
        var filteredBusStopIndex;
        const filteredBusStop = busStopsTempFinal.filter(
          (busStop, indexBusStop) => {
            filteredBusStopIndex = indexBusStop;
            return (
              busStop.order <= bus.pointOrder &&
              busStopsTempFinal[
                busStopsTempFinal.length === indexBusStop + 1
                  ? indexBusStop
                  : indexBusStop + 1
              ].order >= bus.pointOrder
            );
          }
        )[0];
        var indexOfFiltredBusStop = busStopsTempFinal.indexOf(filteredBusStop);
        var persentOfProgress =
          (bus.pointOrder - filteredBusStop.order) /
          (busStopsTempFinal[indexOfFiltredBusStop + 1].order -
            filteredBusStop.order);
        // console.log("prer", persentOfProgress);
        marginLeft =
          indexOfFiltredBusStop * stepWidthForwardLine +
          stepWidthForwardLine * persentOfProgress;
        return {
          ...bus,
          marginLeft: marginLeft,
        };
      });
      setInboundBuses(busesTemp);
      // console.log("busesTemp", busesTemp);
      // console.log("ibs", busStopsTempFinal);
      //outBound
      const outboundBusStopsTemp = message.payload.outboundPoints.filter(
        (item) => item.stopName !== null
      );
      const stepWidthBackwardLine = parseFloat(
        backwardLineRef.current.offsetWidth / outboundBusStopsTemp.length
      );
      const outboundBusStopsTempFinal = outboundBusStopsTemp.map(
        (busStop, index) => {
          return {
            ...busStop,
            marginLeft: stepWidthBackwardLine * index,
          };
        }
      );

      setOutboundBusStops(outboundBusStopsTempFinal);
      var marginLeft;
      const outBusesTemp = message.payload.outboundBusList.map(
        (bus, indexBus) => {
          var filteredBusStopIndex;
          const filteredBusStop = outboundBusStopsTempFinal.filter(
            (busStop, indexBusStop) => {
              filteredBusStopIndex = indexBusStop;
              return (
                busStop.order <= bus.pointOrder &&
                outboundBusStopsTempFinal[
                  outboundBusStopsTempFinal.length === indexBusStop + 1
                    ? indexBusStop
                    : indexBusStop + 1
                ].order >= bus.pointOrder
              );
            }
          )[0];
          var indexOfFiltredBusStop = outboundBusStopsTempFinal.indexOf(
            filteredBusStop
          );
          var persentOfProgress =
            (bus.pointOrder - filteredBusStop.order) /
            (outboundBusStopsTempFinal[indexOfFiltredBusStop + 1].order -
              filteredBusStop.order);
          // console.log("prer", persentOfProgress);
          marginLeft =
            indexOfFiltredBusStop * stepWidthBackwardLine +
            stepWidthBackwardLine * persentOfProgress;
          return {
            ...bus,
            marginLeft: marginLeft,
          };
        }
      );
      setOutboundBuses(outBusesTemp);
    };
  }, [isPaused, ws]);
  const Notify = (notify) => {
    switch (notify.type) {
      case "error":
        toast.error(notify.msg);
        break;
      case "message":
        toast(notify.msg);
        break;
    }
  };

  const onSubmitBtnClick = () => {
    if (selectedLine === 0) {
      Notify({ type: "error", msg: language.messages.selectLine });
      return;
    }
    setIsLoading(true);
    fetch(
      `${appConfig.apiBaseAddress}api/reactService/trip/tripDetails?tripCode=${selectedLine}`,
      { method: "post" }
    )
      .then((res) => res.json())
      .then((res) => {
        setLineDetail(res);
        console.log("res", res);
      });
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
      `${appConfig.apiBaseAddress}api/reactService/trip/all`
    );
    let data = await response.json();
    return data;
  }
  useEffect(() => {
    getLines().then((data) => {
      setLines(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <section className={`SchematicTripState ${appConfig.language.direction}`}>
      <section className="header-container">
        <div className="header-card line-select-container">
          <div className="line-title">{language.line}:</div>
          <select
            onChange={(e) => {
              let { name, value } = e.target;
              setSelectedLine(value);
            }}
          >
            <option value="0">{language.select.placeholder} ...</option>
            {lines.map((line, index) => (
              <option key={index} value={line.code}>
                {`${line.code}-${line.name}`}
              </option>
            ))}
          </select>
          <button className="submit-btn" onClick={onSubmitBtnClick}>
            {language.submitTitle}
          </button>
          {isLoading ? (
            <div class="loadingio-spinner-dual-ring-wpkltzczrj">
              <div class="ldio-i3rs1wndzvh">
                <div></div>
                <div>
                  <div></div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="header-card line-info-container">
          <table>
            <tbody>
              <tr>
                <td>
                  <td>{language.inboundBusStops} :</td>
                  <td>{inboundBusStops.length}</td>
                </td>
                <td>
                  <td>{language.outboundBusStops} :</td>
                  <td>{outboundBusStops.length}</td>
                </td>
              </tr>
              <tr>
                <td>
                  <td>{language.activeBusCount} :</td>
                  <td>{lineDetail.activeBusCount}</td>
                </td>
                {/* <td>
                  <td>تعداد اتوبوس های در گاراژ :</td>
                  <td>{lineDetail.busCountInGarage}</td>
                </td> */}
                <td>
                  <td>{language.legalSpeed} :</td>
                  <td>{lineDetail.legalSpeed} Km</td>
                </td>
              </tr>
              <tr>
                <td>
                  <td>{language.busCountInbound}:</td>
                  <td>{lineDetail.busCountInbound}</td>
                </td>
                <td>
                  <td>{language.busCountOutbound} :</td>
                  <td>{lineDetail.busCountOutbound}</td>
                </td>
              </tr>
              <tr>
                <td>
                  <td>{language.inboundDistance} :</td>
                  <td>{lineDetail.inboundDistance} Km</td>
                </td>
                <td>
                  <td>{language.outboundDistance} :</td>
                  <td>{lineDetail.outboundDistance} Km</td>
                </td>
              </tr>
              <tr>
                <td>
                  <td>{language.inboundTripDuration} :</td>
                  <td>
                    {lineDetail.inboundTripDuration} {language.minute}
                  </td>
                </td>
                <td>
                  <td>{language.outboundTripDuration} :</td>
                  <td>
                    {lineDetail.outboundTripDuration} {language.minute}
                  </td>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <div className="card">
        <div className="header">{language.inbound} :</div>
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
        </div>
        <div className="gap"></div>
      </div>
      <div className="card">
        <div className="header">{language.outbound} :</div>
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
                style={{ left: busStop.marginLeft }}
              >
                <div className="bus-stop-counter">{busStop.stopCode}</div>
                <div className="bus-stop-name">{busStop.stopName}</div>
              </div>
            );
          })}
        </div>
        <div className="gap"></div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </section>
  );
};
export default SchematicTripState;
