import React, { useState, useEffect, useRef, useCallback } from "react";
import Map from "../../Components/LineSimulationMap/Map";
import "./LineSimulation.scss";
import Ripples from "react-ripples";
import Select from "react-select";
import {
  FaPlay,
  FaStop,
  FaPause,
  FaMapMarkerAlt,
  FaFastForward,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import randomColor from "randomcolor";
// import moment from "jalali-moment";
import Loader from "../../Components/Loader/Loader";
import moment from "moment-jalaali";
import DatePicker from "react-datepicker2";
import { marker } from "leaflet";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./time-picker.css";
import TimePicker from "rc-time-picker";

import { appConfig } from "../../Constants/config";
import { from, lang } from "jalali-moment";
const language = appConfig.language.LineSimulation;

// import {baseURL} from '../../Constants/config'
const Pins = React.memo((props) => {
  var pins = null;

  if (props.markers.length) {
    // console.log(playbackBarRef.current.offsetWidth  )
    var avrgPinsSpace = props.playbackBarWidth / props.markers.length;
    // if (avrgPinsSpace < 1) {
    //   avrgPinsSpace = 1;
    // }
    var theDate = moment(props.markers[0].clientDate, "YYYYMMDDHHmmss");
    var nowDate = moment(
      props.markers[props.markers.length - 1].clientDate,
      "YYYYMMDDHHmmss"
    );
    var duration = moment.duration(nowDate.diff(theDate));
    var diffSeconds = duration.asSeconds();

    pins = props.markers.map((pin, id) => {
      var theDate = moment(props.markers[0].clientDate, "YYYYMMDDHHmmss");
      var nowDate = moment(props.markers[id].clientDate, "YYYYMMDDHHmmss");
      var duration = moment.duration(nowDate.diff(theDate));
      var seconds = duration.asSeconds();
      var growPercentage = (seconds / diffSeconds) * 100;
      // console.log(MATH.abs( seconds), "/", diffSeconds ,"*", 100)

      return (
        <div
          className={`pin`}
          onClick={() => props.onMarkerClick(id)}
          style={{
            left: (props.playbackBarWidth / 100) * growPercentage,
            width: avrgPinsSpace / 2,
          }}
        >
          <div className="tooltip">
            {`${id + 1} / ${pin.busCode} : ${moment(
              pin.clientDate,
              "YYYYMMDDHHmmss"
            ).format("HH:mm:ss")}`}
          </div>
        </div>
      );
    });
    return pins;
  }
});
const averageGeolocation = (coords) => {
  if (coords.length === 1) {
    return coords[0];
  }

  let x = 0.0;
  let y = 0.0;
  let z = 0.0;

  for (let coord of coords) {
    let latitude = (coord.latitude * Math.PI) / 180;
    let longitude = (coord.longitude * Math.PI) / 180;

    x += Math.cos(latitude) * Math.cos(longitude);
    y += Math.cos(latitude) * Math.sin(longitude);
    z += Math.sin(latitude);
  }

  let total = coords.length;

  x = x / total;
  y = y / total;
  z = z / total;

  let centralLongitude = Math.atan2(y, x);
  let centralSquareRoot = Math.sqrt(x * x + y * y);
  let centralLatitude = Math.atan2(z, centralSquareRoot);

  return {
    latitude: (centralLatitude * 180) / Math.PI,
    longitude: (centralLongitude * 180) / Math.PI,
  };
};

const TimeSlices = (props) => {
  // alert(props.currentBuffer)
  return props.buffers.map((buffer, index) => {
    return (
      <div
        onClick={() => props.onBufferClick(index)}
        className={`time-slice ${props.currentBuffer == index ? "active" : ""}`}
        key={index}
      >
        <div>
          {moment(buffer[0].clientDate, "YYYYMMDDHHmmss").format("HH:mm:ss")}
        </div>
        <div>
          {moment(
            buffer[buffer.length - 1].clientDate,
            "YYYYMMDDHHmmss"
          ).format("HH:mm:ss")}
        </div>
      </div>
    );
  });
};
const Records = React.memo((props) => {
  return (
    <div className="col col-1">
      {props.markers.map((bus, rcdIndex) => {
        var filteredBusIndex = props.buses.findIndex(
          (tmpBus) => tmpBus.busCode === bus.busCode
        );
        // console.log('a',filteredBusIndex)
        var color = props.buses[filteredBusIndex].color;

        return (
          <div
            onClick={() => props.onMarkerClick(rcdIndex)}
            key={rcdIndex}
            className={`bus-detail   ${
              props.activeMarker == rcdIndex ? "active" : ""
            }`}
          >
            <table>
              <tbody>
                <tr style={{ backgroundColor: color }}>
                  <td className="index">{rcdIndex + 1}</td>
                  <td className="speed">
                    <td>{language.speed} :</td>
                    <td className="value">{`${bus.groundSpeed}km`}</td>
                  </td>
                  <td className="date">
                    <td>{language.date} :</td>
                    <td
                      className="value"
                      style={{ direction: "ltr", textAlign: "right" }}
                    >
                      {appConfig.language.language === "persian"
                        ? moment(bus.clientDate, "YYYYMMDDHHmmss").format(
                            "jYYYY/jM/jD HH:mm:ss"
                          )
                        : moment(bus.clientDate, "YYYYMMDDHHmmss").format(
                            "YYYY/M/D HH:mm:ss"
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
  );
});
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
const LineSimulation = (props) => {
  // const ws = new WebSocket('ws://193.176.241.150:8080/tms/websocket/getBusSimulation')
  const [markers, setMarkers] = useState([[], []]);
  const [mapCenter, setMapCenter] = useState(appConfig.mapCenter);
  const [mapZoom, setMapZoom] = useState(12);
  const [busOptions, setBusOptions] = useState([]);
  const [selectedLineOptions, setselectedLineOptions] = useState([]);
  const [inBoundBusStopPoints, setInBoundBusStopPoints] = useState([]);
  const [outBoundBusStopPoints, setOutBoundBusStopPoints] = useState([]);
  const [selectedLineOptionsString, setselectedLineOptionsString] = useState(
    []
  );

  const [isLoading, setIsLoading] = useState(false);
  //   const [busOptions,setBusOptions]=useState(false)
  const actionMenuRef = useRef();
  const searchBoxRef = useRef();
  const overviewBoxRef = useRef();
  const actionMenuHeaderRef = useRef();
  const nextMarkerRef = useRef();
  const playbackBarRef = useRef();
  const TimeSlicesRef = useRef();

  const [fromDate, setFromDate] = useState(moment().format("YYYYMMDD"));
  const [fromTime, setFromTime] = useState(moment().format("HHmmss"));
  const [toTime, setToTime] = useState(moment().format("HHmmss"));
  const [isBusDataIsLoading, setIsBusDataIsLoading] = useState(false);
  const [markerInterval, setMarkerInterval] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [fitMarkerIntervalBounds, setFitMarkerIntervalBounds] = useState(false);
  const [skipZeroPoints, setSkipZeroPoints] = useState(true);
  const busDetailsContainerRef = useRef();
  const [diffsecond, setDiffSecond] = useState(0);
  const [timeLineInterval, setTimeLineInterval] = useState(0);
  const [bufferMarkers, setBufferMarkers] = useState([]);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);
  const [bufferInfo, setBufferInfo] = useState({
    currentBuffer: 0,
    bufferCount: 0,
    bufferSize: 500,
    buffers: [],
  });
  const [buses, setBuses] = useState([]);
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
    {
      id: 3,
      speed: 100,
      lable: "6x",
      selected: false,
    },
  ]);
  const [inBoundPoints, setInBoundPoints] = useState([]);
  const [outBoundPoints, setOutBoundPoints] = useState([]);

  function toggleTimer() {
    if (bufferMarkers.length === 0) {
      Notify({
        type: "error",
        msg: language.messages.fillRequiredField,
      });
      return;
    }
    setIsTimerActive(!isTimerActive);
  }
  function resetTimer() {
    setMarkerInterval(0);
    setIsTimerActive(false);
    setTimeLineInterval(0);
    busDetailsContainerRef.current.scrollTo(0, 0, {
      behavior: "smooth",
    });
  }
  const moveMarker = (step) => {};
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
  const changeBusPosition = (markerInterval) => {
    // console.log(markerInterval);
    var filteredBusIndex = buses.findIndex(
      (bus) => bus.busCode === bufferMarkers[markerInterval].busCode
    );

    var TmpBuses = buses;
    TmpBuses[filteredBusIndex].busPosition = [
      bufferMarkers[markerInterval].latitude,
      bufferMarkers[markerInterval].longitude,
    ];
    TmpBuses[filteredBusIndex].time = moment(
      bufferMarkers[markerInterval].clientDate,
      "YYYYMMDDHHmmss"
    ).format("HH:mm:ss");
    setBuses(buses);
  };
  const handler = useCallback(
    (e) => {
      // Update coordinates
      if (e.key === "ArrowRight") {
        // console.log(nextMarkerRef)
        // setIsTimerActive(false);
        if (bufferMarkers.length === 0) {
          Notify({
            type: "error",
            msg: language.messages.fillRequiredField,
          });
          return;
        }

        setMarkerInterval(markerInterval + 1);
        changeBusPosition(markerInterval + 1);
        // if (fitMarkerIntervalBounds) {
        //   setMapZoom(13);
        //   var busLocations = [];
        //   buses.map((bus) => {
        //     busLocations.push({
        //       latitude: bus.busPosition[0],
        //       longitude: bus.busPosition[1],
        //     });
        //   });
        //   const center = averageGeolocation(busLocations);
        //   setMapCenter([center.latitude, center.longitude]);
        // }
        var theDate = moment(bufferMarkers[0].clientDate, "YYYYMMDDHHmmss");
        var nowDate = moment(
          bufferMarkers[markerInterval + 1].clientDate,
          "YYYYMMDDHHmmss"
        );
        var duration = moment.duration(nowDate.diff(theDate));
        var seconds = duration.asSeconds();
        setTimeLineInterval(seconds);
        if (markerInterval + 2 === bufferInfo.bufferSize) {
          busDetailsContainerRef.current.scrollTo(0, 0, {
            behavior: "smooth",
          });
        } else {
          busDetailsContainerRef.current.scrollTo(
            0,
            busDetailsContainerRef.current.offsetHeight *
              parseInt(
                (markerInterval + 1) /
                  (busDetailsContainerRef.current.offsetHeight / 45)
              ) +
              45,
            {
              behavior: "smooth",
            }
          );
        }
      }
      if (e.keyCode == 0 || e.keyCode == 32) {
        toggleTimer();
      }
      if (e.key === "ArrowLeft") {
        // console.log(nextMarkerRef)
        // setIsTimerActive(false);
        if (bufferMarkers.length === 0) {
          Notify({
            type: "error",
            msg: language.messages.fillRequiredField,
          });
          return;
        }
        if (markerInterval === 0) {
          if (bufferInfo.currentBuffer > 0) {
            setBufferInfo({
              ...bufferInfo,
              currentBuffer: bufferInfo.currentBuffer - 1,
            });

            setBufferMarkers(bufferInfo.buffers[bufferInfo.currentBuffer - 1]);
            setDiffSecond(
              moment(
                bufferInfo.buffers[bufferInfo.currentBuffer - 1][
                  bufferInfo.buffers[bufferInfo.currentBuffer - 1].length - 1
                ].clientDate,
                "YYYYMMDDHHmmss"
              ).diff(
                moment(
                  bufferInfo.buffers[bufferInfo.currentBuffer - 1][0]
                    .clientDate,
                  "YYYYMMDDHHmmss"
                ),
                "seconds"
              )
            );
            setMarkerInterval(bufferInfo.bufferSize - 2);
            changeBusPosition(bufferInfo.bufferSize - 2);
            setTimeLineInterval(
              moment(
                bufferInfo.buffers[bufferInfo.currentBuffer - 1][
                  bufferInfo.buffers[bufferInfo.currentBuffer - 1].length - 1
                ].clientDate,
                "YYYYMMDDHHmmss"
              ).diff(
                moment(
                  bufferInfo.buffers[bufferInfo.currentBuffer - 1][0]
                    .clientDate,
                  "YYYYMMDDHHmmss"
                ),
                "seconds"
              )
            );
            busDetailsContainerRef.current.scrollTo(
              0,
              busDetailsContainerRef.current.offsetHeight *
                parseInt(
                  bufferInfo.bufferSize /
                    (busDetailsContainerRef.current.offsetHeight / 45)
                ) +
                45,
              {
                behavior: "smooth",
              }
            );
          }
          return;
        }

        setMarkerInterval(markerInterval - 1);
        changeBusPosition(markerInterval - 1);
        var theDate = moment(bufferMarkers[0].clientDate, "YYYYMMDDHHmmss");
        var nowDate = moment(
          bufferMarkers[markerInterval - 1].clientDate,
          "YYYYMMDDHHmmss"
        );
        var duration = moment.duration(nowDate.diff(theDate));
        var seconds = duration.asSeconds();
        setTimeLineInterval(seconds);
        busDetailsContainerRef.current.scrollTo(
          0,
          busDetailsContainerRef.current.offsetHeight *
            parseInt(
              (markerInterval - 1) /
                (busDetailsContainerRef.current.offsetHeight / 45)
            ) +
            45,
          {
            behavior: "smooth",
          }
        );
      }
    },
    [fitMarkerIntervalBounds, isTimerActive, bufferMarkers, markerInterval]
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
    const selectedSpeedOption = speedOptions.filter(
      (item) => item.selected === true
    )[0].speed;
    // if (bufferMarkers.length > markers[1].length) {

    // } else {
    //   if (markers[1].length === markerInterval + 1) {
    //     setIsTimerActive(false);
    //     setMarkerInterval(0);
    //     setTimeLineInterval(0)
    //   }
    // }

    if (bufferMarkers.length === markerInterval + 1) {
      if (bufferInfo.currentBuffer + 1 >= bufferInfo.bufferCount) {
        setIsTimerActive(false);
        setTimeLineInterval(diffsecond);
      } else {
        setMarkerInterval(0);

        setTimeLineInterval(0);
        if (bufferInfo.currentBuffer !== bufferInfo.bufferCount) {
        }
        setBufferInfo({
          ...bufferInfo,
          currentBuffer: bufferInfo.currentBuffer + 1,
        });

        TimeSlicesRef.current.scrollLeft =
          TimeSlicesRef.current.offsetWidth *
          parseInt(
            (bufferInfo.currentBuffer + 1) /
              (TimeSlicesRef.current.offsetWidth / 70)
          );
        setBufferMarkers(bufferInfo.buffers[bufferInfo.currentBuffer + 1]);
        setDiffSecond(
          moment(
            bufferInfo.buffers[bufferInfo.currentBuffer + 1][
              bufferInfo.buffers[bufferInfo.currentBuffer + 1].length - 1
            ].clientDate,
            "YYYYMMDDHHmmss"
          ).diff(
            moment(
              bufferInfo.buffers[bufferInfo.currentBuffer + 1][0].clientDate,
              "YYYYMMDDHHmmss"
            ),
            "seconds"
          )
        );
      }
    }
    if (isTimerActive) {
      interval = setInterval(() => {
        // setTimeLineInterval((timeLineInterval) => timeLineInterval + 1);
        // setMarkerInterval((markerInterval) => markerInterval + 1);
        if (skipZeroPoints) {
          if (
            bufferMarkers[markerInterval].groundSpeed < 4 &&
            bufferMarkers[markerInterval + 1].groundSpeed < 4
          ) {
            const slicedMarkers = bufferMarkers.slice(markerInterval);
            var nextNotZeroIndex;
            slicedMarkers.some((item, index) => {
              if (item.groundSpeed > 4) {
                nextNotZeroIndex = index;
                return true;
              }
            });

            if (!isNaN(nextNotZeroIndex)) {
              busDetailsContainerRef.current.scrollTo(
                0,
                busDetailsContainerRef.current.offsetHeight *
                  parseInt(
                    (markerInterval + nextNotZeroIndex) /
                      (busDetailsContainerRef.current.offsetHeight / 45)
                  ) +
                  45,
                {
                  behavior: "smooth",
                }
              );
              setMarkerInterval(markerInterval + nextNotZeroIndex);
              changeBusPosition(markerInterval + nextNotZeroIndex);
            } else {
              setMarkerInterval(bufferMarkers.length - 1);
              changeBusPosition(bufferMarkers.length - 1);
            }
          } else {
            setMarkerInterval(markerInterval + 1);
            changeBusPosition(markerInterval + 1);
          }
        } else {
          setMarkerInterval(markerInterval + 1);
          changeBusPosition(markerInterval + 1);
        }
        // if (fitMarkerIntervalBounds) {
        //   setMapZoom(13);
        //   var busLocations = [];
        //   buses.map((bus) => {
        //     busLocations.push({
        //       latitude: bus.busPosition[0],
        //       longitude: bus.busPosition[1],
        //     });
        //   });
        //   const center = averageGeolocation(busLocations);
        //   setMapCenter([center.latitude, center.longitude]);
        // }
        var theDate = moment(bufferMarkers[0].clientDate, "YYYYMMDDHHmmss");
        var nowDate = moment(
          bufferMarkers[markerInterval].clientDate,
          "YYYYMMDDHHmmss"
        );
        var duration = moment.duration(nowDate.diff(theDate));
        var seconds = duration.asSeconds();
        setTimeLineInterval(seconds);

        // console.log("ts", futureTime);
        // if (
        //   !(
        //     bufferMarkers[markerInterval].clientDate <= newDate &&
        //     bufferMarkers[markerInterval + 1].clientDate >= newDate
        //   )
        // ) {
        // setMarkerInterval(markerInterval + 1);
        // }
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
      }, selectedSpeedOption);
    } else if (!isTimerActive && markerInterval !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, markerInterval]);

  useEffect(() => {
    getLines().then((data) => {
      console.log("lines", data);
      data = data.sort((a, b) => (a.code > b.code ? 1 : -1));
      var busTempOptions = data.map((item, index) => {
        return {
          value: item.code,
          label: `${item.code}: ${item.name}`,
        };
      });
      setBusOptions(busTempOptions);
    });
  }, []);
  async function getBuses() {
    let response = await fetch(
      `${appConfig.apiBaseAddress}api/reactService/bus/all`
    );
    console.log(response);
    let data = await response.json();
    return data;
  }
  const getRandomColor = () => {
    var letters = "0123456789ABCDEF".split("");
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.round(Math.random() * 10)];
    }
    return color;
  };

  async function getSelectedLineData(inputJson) {
    let response = await fetch(
      `${appConfig.apiBaseAddress}api/reactService/bus/track`,
      {
        headers: { "content-type": "application/json" },
        method: "POST",
        body: JSON.stringify(inputJson),
      }
    );
    let data = await response.json();
    return data;
  }
  function pickPropsFromObject(o, ...fields) {
    return fields.reduce((a, x) => {
      if (o.hasOwnProperty(x)) a[x] = o[x];
      return a;
    }, {});
  }
  const onSubmitBtnClick = () => {
    if (isSubmitButtonDisabled) {
      Notify({
        type: "message",
        msg: language.messages.gettingData,
      });
      return;
    }
    setFitMarkerIntervalBounds(false);

    setMarkers([
      // data[0].busData[0],
      [],
      [],
    ]);
    setBufferInfo({
      currentBuffer: 0,
      bufferCount: 0,
      bufferSize: 500,
      buffers: [],
    });
    setBufferMarkers([]);
    setDiffSecond(0);
    resetTimer();
    setMapCenter(appConfig.mapCenter);
    setMapZoom(12);
    // if (selectedLineOptions.length < 2) {
    //   Notify({ type: "error", msg: "دو اتوبوس را انتخاب کنید!" });
    //   return;
    // }
    var fromDateTime = `${fromDate}${fromTime}`;
    var toDateTime = `${fromDate}${toTime}`;

    if (selectedLineOptions.length == 0) {
      Notify({ type: "error", msg: language.messages.selectLine });
      return;
    }
    if (!fromDateTime || !toDateTime) {
      Notify({ type: "error", msg: language.messages.selectFromToDate });
      return;
    }
    var theDate = moment(fromDateTime, "YYYYMMDDHHmmss");
    var nowDate = moment(toDateTime, "YYYYMMDDHHmmss");
    var duration = moment.duration(nowDate.diff(theDate));
    var seconds = duration.asSeconds();
    if (seconds < 0) {
      Notify({ type: "error", msg: language.messages.inCorrectFromToDate });
      return;
    }
    setIsSubmitButtonDisabled(true);
    setIsBusDataIsLoading(true);
    getSelectedLineData({
      busCode1: 0,
      busCode2: 0,
      tripCode: selectedLineOptions.value,
      fromDate: fromDateTime,
      toDate: toDateTime,
    }).then((data) => {
      var markers = [];

      data[0].busData.map((dataItem, dataIndex) => {
        dataItem.map((item) => {
          markers.push(
            pickPropsFromObject(
              item,
              "clientDate",
              "busCode",
              "latitude",
              "longitude",
              "groundSpeed"
            )
          );
        });
      });
      // console.log("ajaaab", markers);
      if (!markers.length > 0) {
        Notify({
          type: "message",
          msg: language.messages.noRecordForLine(selectedLineOptions.label),
        });
        setIsSubmitButtonDisabled(false);
        setIsBusDataIsLoading(false);
        return;
      }
      var buses = [];
      data[0].busData
        .filter((busData) => busData.length > 0)
        .map((busData, busDataIndx) => {
          if (busData.length > 0) {
            // console.log(busDataIndx,busData.length,busData[0][0])

            buses.push({
              busCode: busData[0].busCode,
              busMarkerInterval: 0,
              busPosition: [busData[0].latitude, busData[0].longitude],
              time: moment(busData[0].clientDate, "YYYYMMDDHHmmss").format(
                "HH:mm:ss"
              ),
              isTooltipActive: false,
              color: appConfig.colors[busDataIndx],
            });
          }
        });
      console.log("buses :", buses);
      setBuses(buses);
      markers = markers.sort((a, b) => {
        if (a.clientDate < b.clientDate) {
          return -1;
        }
        if (a.clientDate > b.clientDate) {
          return 1;
        }
        return 0;
      });
      console.log("markers :", markers);

      setInBoundPoints(
        data[0].inboundPoints
      );
      setOutBoundPoints(
        data[0].outboundPoints
      );
      setInBoundBusStopPoints(
        data[0].inboundPoints.filter((item) => item.stopCode != null)
      );
      setOutBoundBusStopPoints(
        data[0].outboundPoints.filter((item) => item.stopCode != null)
      );
      var bufferCount = Math.ceil(markers.length / bufferInfo.bufferSize);

      var buffers = [];
      for (var i = 0; i < bufferCount; i++) {
        var bufferI = markers.slice(
          bufferInfo.bufferSize * i,
          bufferInfo.bufferSize * (i + 1)
        );
        buffers.push(bufferI);
      }
      // console.log("buffers :", buffers);
      setBufferInfo({
        ...bufferInfo,
        buffers: buffers,
        bufferCount: Math.ceil(markers.length / bufferInfo.bufferSize),
        currentBuffer: 0,
      });
      // console.log(
      //   data[0].busData[0].length / bufferInfo.bufferSize,
      //   Math.floor(data[0].busData[0].length / bufferInfo.bufferSize),
      //   "buffers:",
      //   buffers
      // );
      setBufferMarkers(markers.slice(0, bufferInfo.bufferSize));
      setDiffSecond(
        moment(
          markers.slice(0, bufferInfo.bufferSize)[
            markers.slice(0, bufferInfo.bufferSize).length - 1
          ].clientDate,
          "YYYYMMDDHHmmss"
        ).diff(moment(markers[0].clientDate, "YYYYMMDDHHmmss"), "seconds")
      );
      setIsBusDataIsLoading(false);
      setIsSubmitButtonDisabled(false);
      // setFitMarkerIntervalBounds(true);
      // setMapZoom(17);
      // setMapCenter([markers[0].latitude, markers[0].longitude]);
      var markers = setMarkers([
        // data[0].busData[0],
        markers,
        [],
      ]);
    });
  };
  const getTimeLineTime = () => {
    if (bufferMarkers.length) {
      var theDate = moment(
        bufferMarkers[markerInterval].clientDate,
        "YYYYMMDDHHmmss"
      ).format("HH:mm:ss");
    } else {
      var theDate = "00:00:00";
    }
    return theDate;
  };

  const onMarkerClick = (id) => {
    setMarkerInterval(id);

    var theDate = moment(bufferMarkers[0].clientDate, "YYYYMMDDHHmmss");
    var nowDate = moment(bufferMarkers[id].clientDate, "YYYYMMDDHHmmss");
    var duration = moment.duration(nowDate.diff(theDate));
    var seconds = duration.asSeconds();
    setTimeLineInterval(seconds);
    busDetailsContainerRef.current.scrollTo(
      0,
      busDetailsContainerRef.current.offsetHeight *
        parseInt(id / (busDetailsContainerRef.current.offsetHeight / 45)) +
        45,
      {
        behavior: "smooth",
      }
    );
    setMapCenter([bufferMarkers[id].latitude, bufferMarkers[id].longitude]);
    var filteredBusIndex = buses.findIndex(
      (bus) => bus.busCode === bufferMarkers[id].busCode
    );
    var TmpBuses = buses;

    TmpBuses[filteredBusIndex] = {
      ...TmpBuses[filteredBusIndex],
      time: moment(bufferMarkers[id].clientDate, "YYYYMMDDHHmmss").format(
        "HH:mm:ss"
      ),
      busPosition: [bufferMarkers[id].latitude, bufferMarkers[id].longitude],
    };
    setBuses(TmpBuses);
    console.log("ajab", buses);
    // setMapZoom()
  };
  async function getLines(name) {
    let response = await fetch(
      `${appConfig.apiBaseAddress}api/reactService/trip/all`
    );
    let data = await response.json();
    return data;
  }
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
        nextSelectedItem = 3;
        break;
      case 3:
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
  };
  return (
    <section
      className={`line-simulation-container ${appConfig.language.direction}`}
    >
      <div className="map-contianer">
        {isLoading ? (
          <Loader />
        ) : (
          <Map
            center={mapCenter}
            firstBusPath={markers[0]}
            inBoundPoints={inBoundPoints}
            outBoundPoints={outBoundPoints}
            inBoundBusStopPoints={inBoundBusStopPoints}
            outBoundBusStopPoints={outBoundBusStopPoints}
            buses={buses}
            zoom={mapZoom}
            marker={
              markerInterval + bufferInfo.currentBuffer * bufferInfo.bufferSize
            }
            language={appConfig.language.language}
            fitMarkerIntervalBounds={fitMarkerIntervalBounds}
            onMapMarkerCkick={(busIndex) => {
              // alert(busIndex);
              var TmpBuses = buses;
              TmpBuses[busIndex] = {
                ...TmpBuses[busIndex],
                isTooltipActive: !TmpBuses[busIndex].isTooltipActive,
              };

              setBuses(TmpBuses);
              console.log("tmpbusss", TmpBuses);
            }}
          />
        )}
        <div className="media-controler-container">
          <div className="palyback-slice-container">
            <div className="time-slices-container" ref={TimeSlicesRef}>
              <TimeSlices
                buffers={bufferInfo.buffers}
                currentBuffer={bufferInfo.currentBuffer}
                onBufferClick={(index) => {
                  setBufferInfo({ ...bufferInfo, currentBuffer: index });
                  setBufferMarkers(bufferInfo.buffers[index]);
                  setDiffSecond(
                    moment(
                      bufferInfo.buffers[index][
                        bufferInfo.buffers[index].length - 1
                      ].clientDate,
                      "YYYYMMDDHHmmss"
                    ).diff(
                      moment(
                        bufferInfo.buffers[index][0].clientDate,
                        "YYYYMMDDHHmmss"
                      ),
                      "seconds"
                    )
                  );
                  setMarkerInterval(0);
                  setTimeLineInterval(0);
                  busDetailsContainerRef.current.scrollTo(
                    0,
                    busDetailsContainerRef.current.offsetHeight * 0,
                    {
                      behavior: "smooth",
                    }
                  );
                }}
              />
            </div>
          </div>
          <div className="playback-bar-container">
            <div className="playback-bar">
              <Pins
                onMarkerClick={(id) => onMarkerClick(id)}
                playbackBarWidth={
                  playbackBarRef.current !== undefined
                    ? playbackBarRef.current.offsetWidth
                    : 0
                }
                buses={buses}
                markers={bufferMarkers}
              />
              <progress
                ref={playbackBarRef}
                value={timeLineInterval}
                max={diffsecond}
              ></progress>
            </div>
          </div>
          <div className="buttons">
            <div className="media-buttons">
              <Ripples
                onClick={() => handleSpeedChange()}
                className="speed-control"
                title={language.mediaSpeed}
              >
                <div>
                  {
                    speedOptions.filter((item) => item.selected === true)[0]
                      .lable
                  }
                </div>
              </Ripples>
              <Ripples
                onClick={() => setSkipZeroPoints(!skipZeroPoints)}
                className={`skip-zero-points-marker ${
                  skipZeroPoints ? "active" : ""
                }`}
                title={language.jump}
              >
                <FaFastForward />
              </Ripples>
              <Ripples
                onClick={() => {
                  if (bufferMarkers.length === 0) {
                    Notify({
                      type: "error",
                      msg: language.messages.fillRequiredField,
                    });
                    return;
                  }
                  // setMapZoom(13);
                  var busLocations = [];
                  buses.map((bus) => {
                    busLocations.push({
                      latitude: bus.busPosition[0],
                      longitude: bus.busPosition[1],
                    });
                  });
                  const center = averageGeolocation(busLocations);
                  setMapCenter([center.latitude, center.longitude]);
                  setFitMarkerIntervalBounds(!fitMarkerIntervalBounds);
                }}
                className={`fit-marker ${
                  fitMarkerIntervalBounds ? "active" : ""
                }`}
                title={language.focus}
              >
                <FaMapMarkerAlt />
              </Ripples>

              <Ripples
                onClick={() => {
                  if (bufferMarkers.length === 0) {
                    Notify({
                      type: "error",
                      msg: language.messages.fillRequiredField,
                    });
                    return;
                  }

                  setMarkerInterval(markerInterval + 1);
                  var theDate = moment(
                    bufferMarkers[0].clientDate,
                    "YYYYMMDDHHmmss"
                  );
                  var nowDate = moment(
                    bufferMarkers[markerInterval + 1].clientDate,
                    "YYYYMMDDHHmmss"
                  );
                  var duration = moment.duration(nowDate.diff(theDate));
                  var seconds = duration.asSeconds();
                  setTimeLineInterval(seconds);
                  if (markerInterval + 2 === bufferInfo.bufferSize) {
                    busDetailsContainerRef.current.scrollTo(0, 0, {
                      behavior: "smooth",
                    });
                  } else {
                    busDetailsContainerRef.current.scrollTo(
                      0,
                      busDetailsContainerRef.current.offsetHeight *
                        parseInt(
                          (markerInterval + 1) /
                            (busDetailsContainerRef.current.offsetHeight / 45)
                        ) +
                        45,
                      {
                        behavior: "smooth",
                      }
                    );
                  }
                }}
                title={language.nextStep}
              >
                <FaChevronRight />
              </Ripples>
              <Ripples onClick={toggleTimer} title={language.play}>
                {!isTimerActive ? <FaPlay /> : <FaPause />}
              </Ripples>
              <Ripples
                className="stop-btn"
                onClick={resetTimer}
                title={language.stop}
              >
                <FaStop />
              </Ripples>
              <Ripples
                onClick={() => {
                  if (bufferMarkers.length === 0) {
                    Notify({
                      type: "error",
                      msg: language.messages.fillRequiredField,
                    });
                    return;
                  }
                  if (markerInterval === 0) {
                    if (bufferInfo.currentBuffer > 0) {
                      setBufferInfo({
                        ...bufferInfo,
                        currentBuffer: bufferInfo.currentBuffer - 1,
                      });
                      setBufferMarkers(
                        bufferInfo.buffers[bufferInfo.currentBuffer - 1]
                      );
                      setDiffSecond(
                        moment(
                          bufferInfo.buffers[bufferInfo.currentBuffer - 1][
                            bufferInfo.buffers[bufferInfo.currentBuffer - 1]
                              .length - 1
                          ].clientDate,
                          "YYYYMMDDHHmmss"
                        ).diff(
                          moment(
                            bufferInfo.buffers[bufferInfo.currentBuffer - 1][0]
                              .clientDate,
                            "YYYYMMDDHHmmss"
                          ),
                          "seconds"
                        )
                      );
                      setMarkerInterval(bufferInfo.bufferSize - 2);
                      setTimeLineInterval(
                        moment(
                          bufferInfo.buffers[bufferInfo.currentBuffer - 1][
                            bufferInfo.buffers[bufferInfo.currentBuffer - 1]
                              .length - 1
                          ].clientDate,
                          "YYYYMMDDHHmmss"
                        ).diff(
                          moment(
                            bufferInfo.buffers[bufferInfo.currentBuffer - 1][0]
                              .clientDate,
                            "YYYYMMDDHHmmss"
                          ),
                          "seconds"
                        )
                      );
                      busDetailsContainerRef.current.scrollTo(
                        0,
                        busDetailsContainerRef.current.offsetHeight *
                          parseInt(
                            bufferInfo.bufferSize /
                              (busDetailsContainerRef.current.offsetHeight / 45)
                          ) +
                          45,
                        {
                          behavior: "smooth",
                        }
                      );
                    }
                    return;
                  }

                  setMarkerInterval(markerInterval - 1);
                  var theDate = moment(
                    bufferMarkers[0].clientDate,
                    "YYYYMMDDHHmmss"
                  );
                  var nowDate = moment(
                    bufferMarkers[markerInterval - 1].clientDate,
                    "YYYYMMDDHHmmss"
                  );
                  var duration = moment.duration(nowDate.diff(theDate));
                  var seconds = duration.asSeconds();
                  setTimeLineInterval(seconds);
                  busDetailsContainerRef.current.scrollTo(
                    0,
                    busDetailsContainerRef.current.offsetHeight *
                      parseInt(
                        (markerInterval - 1) /
                          (busDetailsContainerRef.current.offsetHeight / 45)
                      ) +
                      45,
                    {
                      behavior: "smooth",
                    }
                  );
                }}
                title={language.previousStep}
              >
                <FaChevronLeft />
              </Ripples>
            </div>

            <div className="marker-interval">{`${
              markerInterval + 1
            } / ${getTimeLineTime()}`}</div>
          </div>
        </div>
      </div>
      <div ref={actionMenuRef} className="action-menu">
        <div className="action-menu-header" ref={actionMenuHeaderRef}>
          <Select
            isLoading={busOptions.length === 0}
            // defaultValue="adsda"
            closeMenuOnSelect={true}
            withAll={true}
            ref={searchBoxRef}
            value={selectedLineOptions}
            placeholder={language.select.placeholder}
            isRtl={true}
            className="bus-select-input"
            isMulti={false}
            options={busOptions}
            isRtl={true}
            onChange={(selectedLine) => {
              var tempArr = [];

              setselectedLineOptions(selectedLine);

              setselectedLineOptionsString(tempArr);
            }}
          />
          <div className="dates-container">
            <div className="date-input-container">
              <label>{language.date} :</label>
              <DatePicker
                onChange={(value) =>
                  setFromDate(moment(value).format("YYYYMMDD"))
                }
                isGregorian={
                  appConfig.language.language === "persian" ? false : true
                }
                timePicker={false}
                value={moment(fromDate)}
              />
            </div>
            <div className="date-input-container">
              <label>{language.fromDate} :</label>
              <TimePicker
                showSecond={false}
                defaultValue={moment()}
                className="xxx"
                onChange={(value) => {
                  setFromTime(moment(value).format("HHmmss"));
                }}
              />
              <label
                style={
                  appConfig.language.direction === "ltr"
                    ? { marginLeft: "10px" }
                    : { marginRight: "10px" }
                }
              >
                {language.toDate} :
              </label>
              <TimePicker
                showSecond={false}
                defaultValue={moment()}
                className="xxx"
                onChange={(value) => {
                  setToTime(moment(value).format("HHmmss"));
                }}
              />
            </div>
          </div>
          <button className="submit-btn" onClick={onSubmitBtnClick}>
            {language.submitTitle}
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

        <div
          className="bus-detail-container single"
          ref={busDetailsContainerRef}
        >
          <Records
            buses={buses}
            markers={bufferMarkers}
            activeMarker={markerInterval}
            onMarkerClick={(id) => onMarkerClick(id)}
          />
        </div>
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

export default LineSimulation;
