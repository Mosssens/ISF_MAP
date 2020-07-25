import React, { useState, useEffect, useRef, useCallback } from "react";
import Map from "../../Components/BusSimulationMap/Map";
import "./BusSimulation.scss";
import Ripples from "react-ripples";
import Select from "react-select";
import {
  FaPlay,
  FaStop,
  FaPause,
  FaMapMarkerAlt,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import moment from "jalali-moment";
import Loader from "../../Components/Loader/Loader";
import { DatePicker } from "jalali-react-datepicker";
import FakeData from "./data";
import { marker } from "leaflet";
// Hook
function useEventListener(eventName, handler, element = window) {
  // Create a ref that stores handler
  const savedHandler = useRef();

  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler ...
  // ... without us needing to pass it in effect deps array ...
  // ... and potentially cause effect to re-run every render.
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      // Make sure element supports addEventListener
      // On
      const isSupported = element && element.addEventListener;
      if (!isSupported) return;

      // Create event listener that calls handler function stored in ref
      const eventListener = (event) => savedHandler.current(event);

      // Add event listener
      element.addEventListener(eventName, eventListener);

      // Remove event listener on cleanup
      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element] // Re-run if eventName or element changes
  );
}
const BusSimulation = () => {
  // const ws = new WebSocket('ws://193.176.241.150:8080/tms/websocket/getBusSimulation')
  const [markers, setMarkers] = useState([[], []]);
  const [mapCenter, setMapCenter] = useState([
    32.654492278497646,
    51.64067001473507,
  ]);
  const [mapZoom, setMapZoom] = useState(12);
  const [busOptions, setBusOptions] = useState([]);
  const [selectedBusOptions, setSelectedBusOptions] = useState([]);
  const [selectedBusOptionsString, setSelectedBusOptionsString] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  //   const [busOptions,setBusOptions]=useState(false)
  const actionMenuRef = useRef();
  const searchBoxRef = useRef();
  const overviewBoxRef = useRef();
  const actionMenuHeaderRef = useRef();
  const nextMarkerRef = useRef();
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(moment().format("YYYYMMDDHHmmss"));
  const [isBusDataIsLoading, setIsBusDataIsLoading] = useState(false);
  const [markerInterval, setMarkerInterval] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [fitMarkerIntervalBounds, setFitMarkerIntervalBounds] = useState(false);
  const [markerIntervalSpeed, setMarkerIntervalSpeed] = useState(1000);
  const busDetailsContainerRef = useRef();
  const [diffsecond,setDiffSecond]=useState(0)
  const [timeLineInterval,setTimeLineInterval]=useState(0)

  const [speedOptions, setSpeedOptions] = useState([
    {
      id: 0,
      speed: 1000,
      lable: "1x",
      selected: true,
    },
    {
      id: 1,
      speed: 500,
      lable: "2x",
      selected: false,
    },
    {
      id: 2,
      speed: 200,
      lable: "4x",
      selected: false,
    },
  ]);
  function toggleTimer() {
    setIsTimerActive(!isTimerActive);
  }
  function resetTimer() {
    setMarkerInterval(0);
    setIsTimerActive(false);
    busDetailsContainerRef.current.scrollTo(0, 0, {
      behavior: "smooth",
    });
  }
  const handler = useCallback(
    (e) => {
      // Update coordinates
      if (e.key === "ArrowRight") {
        // console.log(nextMarkerRef)
        // setIsTimerActive(false);
        setMarkerInterval(markerInterval + 1);
      }
      if (e.key === "ArrowLeft") {
        // console.log(nextMarkerRef)
        // setIsTimerActive(false);
        setMarkerInterval(markerInterval - 1);
      }
    },
    [markerInterval]
  );

  // Add event listener using our hook
  useEventListener("keyup", handler);
  // useEffect(() => {
  //   window.addEventListener("keydown", (e) => keyDownHandler(e));
  //   // window.addEventListener('keyup', upHandler);
  //   // Remove event listeners on cleanup
  //   return () => {
  //     window.removeEventListener('keydown',  (e) => keyDownHandler(e));
  //     // window.removeEventListener('keyup', upHandler);
  //   };
  // }, [markerInterval]); // Empty array ensures that effect is only run on mount and unmount
  useEffect(() => {
    let interval = null;
    
    if (markers[0].length > markers[1].length) {
      if (markers[0].length === markerInterval + 1) {
        setIsTimerActive(false);
        setMarkerInterval(0);
      }
    } else {
      if (markers[1].length === markerInterval + 1) {
        setIsTimerActive(false);
        setMarkerInterval(0);
      }
    }

    if (isTimerActive) {
      interval = setInterval(() => {
        setMarkerInterval((markerInterval) => markerInterval + 1);
        if (markers[1].length === 0) {
          busDetailsContainerRef.current.scrollTo(
            0,
            busDetailsContainerRef.current.offsetHeight *
              parseInt(
                markerInterval /
                  (busDetailsContainerRef.current.offsetHeight / 45)
              ) +
              45,
            {
              behavior: "smooth",
            }
          );
        } else {
          busDetailsContainerRef.current.scrollTo(
            0,
            busDetailsContainerRef.current.offsetHeight *
              parseInt(
                markerInterval /
                  (busDetailsContainerRef.current.offsetHeight / 70.8)
              ) +
              82,
            {
              behavior: "smooth",
            }
          );
        }
      }, speedOptions.filter((item) => item.selected === true)[0].speed);
    } else if (!isTimerActive && markerInterval !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, markerInterval]);

  useEffect(() => {
    // window.addEventListener('keyup', upHandler);
    // Remove event listeners on cleanup

    getBuses().then((data) => {
      console.log(data, "buses");
      var busTempOptions = data.map((item, index) => {
        return {
          value: item.code,
          label: item.code,
        };
      });
      setBusOptions(busTempOptions);
    });
  }, []);
  async function getBuses() {
    let response = await fetch(
      `http://192.168.1.158:4546/tms/api/reactService/bus/all`
    );
    console.log(response);
    let data = await response.json();
    return data;
  }
  async function getSelectedBusesData(inputJson) {
    let response = await fetch(
      `http://192.168.1.158:4546/tms/api/reactService/bus/track`,
      {
        headers: { "content-type": "application/json" },
        method: "POST",
        body: JSON.stringify(inputJson),
      }
    );
    let data = await response.json();
    return data;
  }
  const onSubmitBtnClick = () => {
    setIsBusDataIsLoading(true);
    console.log(selectedBusOptions[0], selectedBusOptions[1]);
    const bus1 =
      selectedBusOptions[0] !== undefined ? selectedBusOptions[0].value : "0";
    const bus2 =
      selectedBusOptions[1] !== undefined ? selectedBusOptions[1].value : "0";
    console.log({
      busCode1: bus1,
      busCode2: bus2,
      tripCode: 0,
      fromDate: fromDate,
      toDate: toDate,
    });
    setDiffSecond(moment(toDate,"YYYYMMDDHHmmss").diff(moment(fromDate,"YYYYMMDDHHmmss"), 'seconds'))
    getSelectedBusesData({
      busCode1: bus1,
      busCode2: bus2,
      tripCode: 0,
      fromDate: fromDate,
      toDate: toDate,
    }).then((data) => {
      // console.log(data, "sdsds");
      setMarkers([
        data[0].busData[0],
        data[1] === undefined ? [] : data[1].busData[0],
      ]);
      setIsBusDataIsLoading(false);
    });
  };
  const handleSpeedChange = () => {
    var selected = speedOptions.filter((item) => item.selected)[0].id;
    // console.log();
    var nextSelectedItem;
    switch (selected) {
      case 0:
        nextSelectedItem = 1;
        break;
      case 1:
        nextSelectedItem = 2;
        break;
      case 2:
        nextSelectedItem = 0;
        break;
    }
    setSpeedOptions(
      speedOptions.map((item) => {
        return {
          ...item,
          selected: item.id === nextSelectedItem ? true : false,
        };
      })
    );
    console.log(speedOptions);
  };
  return (
    <section className="bus-simulation-container">

      <div className="map-contianer">
        {isLoading ? (
          <Loader />
        ) : (
          <Map
            center={mapCenter}
            firstBusPath={markers[0]}
            secondBusPath={markers[1]}
            zoom={mapZoom}
            fitMarkerIntervalBounds={fitMarkerIntervalBounds}
            marker={markerInterval}
          />
        )}
        <div className="media-controler-container">
        <div className="playback-bar">
        <progress  value={markerInterval} max={diffsecond}> 32% </progress>
        </div>
          <div className="buttons">
            <Ripples
              onClick={() => handleSpeedChange()}
              className="speed-control"
            >
              <div>
                {speedOptions.filter((item) => item.selected === true)[0].lable}
              </div>
            </Ripples>
            <Ripples
              onClick={() =>
                setFitMarkerIntervalBounds(!fitMarkerIntervalBounds)
              }
              className={`fit-marker ${
                fitMarkerIntervalBounds ? "active" : ""
              }`}
            >
              <FaMapMarkerAlt />
            </Ripples>
            <Ripples
              onClick={() => {
                setIsTimerActive(false);
                setMarkerInterval(markerInterval + 1);
              }}
            >
              <FaChevronRight />
            </Ripples>
            <Ripples onClick={toggleTimer}>
              {!isTimerActive ? <FaPlay /> : <FaPause />}
            </Ripples>
            <Ripples className="stop-btn" onClick={resetTimer}>
              <FaStop />
            </Ripples>
            <Ripples
              onClick={() => {
                setIsTimerActive(false);
                setMarkerInterval(markerInterval - 1);
              }}
            >
              <FaChevronLeft />
            </Ripples>
            <div style={{ flexGrow: 1 }}></div>
            <div className="marker-interval">{markerInterval + 1}</div>
          </div>
      
        </div>
       
      </div>
      <div ref={actionMenuRef} className="action-menu">
        <div className="action-menu-header" ref={actionMenuHeaderRef}>
          <Select
            isLoading={busOptions.length === 0}
            // defaultValue="adsda"
            withAll={true}
            ref={searchBoxRef}
            value={selectedBusOptions}
            placeholder="اتوبوس را انتخاب کنید ..."
            isRtl={true}
            onChange={(selectedBuses) => {
              var tempArr = [];
              // console.log('fff',selectedBuses,'sdadd',(selectedBuses.filter(item=>item.value==="All")) )
              if (selectedBuses !== null) {
                if (
                  selectedBuses.filter((item) => item.value === "All").length >
                  0
                ) {
                  selectedBuses = [{ value: "All", label: "همه اتوبوس ها" }];
                  tempArr = ["All"];
                } else {
                  selectedBuses.map((item) => {
                    tempArr.push(item.value);
                  });
                }
              }
              setSelectedBusOptions(selectedBuses);
              setSelectedBusOptionsString(tempArr);
            }}
            className="bus-select-input"
            closeMenuOnSelect={false}
            isMulti={true}
            options={busOptions}
            isRtl={true}
          />
          <div className="dates-container">
            <div className="date-input-container">
              <label>از تاریخ :</label>
              <DatePicker
                onClickSubmitButton={(momentObjFrom) => {
                  setFromDate(
                    moment(momentObjFrom.value._d).format("YYYYMMDDHHmmss")
                  );
                }}
              />
            </div>
            <div className="date-input-container">
              <label>تا تاریخ :</label>
              <DatePicker
                onClickSubmitButton={(momentObjTo) => {
                  setToDate(
                    moment(momentObjTo.value._d).format("YYYYMMDDHHmmss")
                  );
                }}
              />
            </div>
          </div>
          <button className="submit-btn" onClick={onSubmitBtnClick}>
            نمایش اطلاعات
            {isBusDataIsLoading ? (
              <div className="loader">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </div>
            ) : (
              ""
            )}
          </button>
        </div>
        {markers[1].length === 0 ? (
          <div
            className="bus-detail-container single"
            ref={busDetailsContainerRef}
          >
            <div className="col col-1">
              {markers[0].map((bus, rcdIndex) => {
                return (
                  <div
                    onClick={() => setMarkerInterval(rcdIndex)}
                    key={rcdIndex}
                    className={`bus-detail ${
                      markerInterval === rcdIndex ? "active" : ""
                    }`}
                  >
                    <table>
                      <tbody>
                        <tr>
                          <td className="index">{rcdIndex + 1}</td>
                          <td className="speed">
                            <td>سرعت لحظه ای :</td>
                            <td className="value">{`${bus.groundSpeed}km`}</td>
                          </td>
                          <td className="date">
                            <td>تاریخ :</td>
                            <td
                              className="value"
                              style={{ direction: "ltr", textAlign: "right" }}
                            >
                              {moment(bus.clientDate, "YYYYMMDDhhmmss").format(
                                "jYYYY/jM/jD HH:mm:ss"
                              )}
                            </td>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div
            className="bus-detail-container double"
            ref={busDetailsContainerRef}
          >
            <div className="col col-1">
              {markers[0].map((bus, rcdIndex) => {
                return (
                  <div
                    onClick={() => setMarkerInterval(rcdIndex)}
                    key={rcdIndex}
                    className={`bus-detail ${
                      markerInterval === rcdIndex ? "active" : ""
                    }`}
                  >
                    <table>
                      <tbody>
                        <tr>
                          <td className="index">{rcdIndex + 1}</td>
                          <td className="info-container">
                            <td className="speed">
                              <td>سرعت لحظه ای :</td>
                              <td className="value">{`${bus.groundSpeed}km`}</td>
                            </td>
                            <td className="date">
                              <td>تاریخ :</td>
                              <td
                                className="value"
                                style={{ direction: "ltr", textAlign: "right" }}
                              >
                                {moment(
                                  bus.clientDate,
                                  "YYYYMMDDhhmmss"
                                ).format("jYYYY/jM/jD HH:mm:ss")}
                              </td>
                            </td>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
            <div className="col col-2">
              {markers[1].map((bus, rcdIndex) => {
                return (
                  <div
                    onClick={() => setMarkerInterval(rcdIndex)}
                    key={rcdIndex}
                    className={`bus-detail ${
                      markerInterval === rcdIndex ? "active" : ""
                    }`}
                  >
                    <table>
                      <tbody>
                        <tr>
                          <td className="index">{rcdIndex + 1}</td>
                          <td className="info-container">
                            <td className="speed">
                              <td>سرعت لحظه ای :</td>
                              <td className="value">{`${bus.groundSpeed}km`}</td>
                            </td>
                            <td className="date">
                              <td>تاریخ :</td>
                              <td
                                className="value"
                                style={{ direction: "ltr", textAlign: "right" }}
                              >
                                {moment(
                                  bus.clientDate,
                                  "YYYYMMDDhhmmss"
                                ).format("jYYYY/jM/jD HH:mm:ss")}
                              </td>
                            </td>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BusSimulation;
