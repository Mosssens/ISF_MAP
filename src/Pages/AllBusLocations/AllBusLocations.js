import React, { useState, useEffect, useRef } from "react";
import Map from "../../Components/AllBusLocationsMap/Map";
import "./AllBusLocations.scss";
import Ripples from "react-ripples";
import Select from "react-select";
import { IoMdPin } from "react-icons/io";
import moment from "jalali-moment";
import Loader from "../../Components/Loader/Loader";
import { appConfig } from "../../Constants/config";
import { layerGroup } from "leaflet";

const AllBusLocations = () => {
  // const ws = new WebSocket('ws://193.176.241.150:8080/tms/websocket/getAllBusLocations')
  const [markers, setMarkers] = useState([]);
  const [mapCenter, setMapCenter] = useState(appConfig.mapCenter);
  const [mapZoom, setMapZoom] = useState(12);
  const [busOptions, setBusOptions] = useState([]);
  const [selectedBusOptions, setSelectedBusOptions] = useState([]);
  const [selectedBusOptionsString, setSelectedBusOptionsString] = useState([]);
  const [pinnedMarkers, setPinnedMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState([]);
  const [isPaused, setPause] = useState(false);
  const [ws, setWs] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const actionMenuRef = useRef();
  const searchBoxRef = useRef();
  const overviewBoxRef = useRef();
  const actionMenuHeaderRef = useRef();
  const language = appConfig.language.AllBusLocations;

  useEffect(() => {
    const wsClient = new WebSocket(
      `${appConfig.socketBaseAddress}/websocket/getAllBusLocationsNewDate`
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
      // console.log("e", message);
      // listen to data sent from the websocket server
      // this.setState({dataFromServer: message})
      // console.log(message.payload);
      var tmpBusData = [];
      message.payload.map((item, index) => {
        tmpBusData.push({
          ...item,
          busStatus: persianStatus(item.busStatus),
          fuelType: persianFuelType(item.fuelType),
        });
      });
      var busTempOptions = message.payload.map((item, index) => {
        return {
          value: item.busCode,
          label: item.busCode,
        };
      });
      setMarkers(tmpBusData);

      busTempOptions.push({ value: "All", label: language.select.allBus });
      setBusOptions(busTempOptions);
      // console.log("pinnd", pinnedMarkers);
      if (isFirstMessageReceived === false) {
        setSelectedBusOptions([
          { value: "All", label: language.select.allBus },
        ]);
        // var tempArr = [{value:'All',label:'همه اتوبوس ها'}]
        // busTempOptions.map(item => {
        //     tempArr.push(item.value)
        // })
        setSelectedBusOptionsString(["All"]);
        isFirstMessageReceived = true;
        setIsLoading(false);
      }
    };
  }, [isPaused, ws]);
  const persianFuelType = (fuelType) => {
    switch (fuelType) {
      case "GAS_OIL":
        return language.gasStatuses.GAS_OIL;
      case "GAS":
        return language.gasStatuses.GAS;
      case "ELECTRIC":
        return language.gasStatuses.ELECTRIC;
      default:
        return language.gasStatuses.unknown;
    }
  };
  const persianStatus = (status) => {
    switch (status) {
      case "PA":
        return language.busStatuses.PA;
      case "LI":
        return language.busStatuses.LI;
      case "OF":
        return language.busStatuses.OF;
      case "RS":
        return language.busStatuses.RS;
      case "GA":
        return language.busStatuses.GA;
      case "UN":
        return language.busStatuses.UN;
    }
  };
  const onBusDetailClick = (bus) => {
    setMapZoom(18);
    setMapCenter([bus.latitude, bus.longitude]);
  };
  const onPinButtonClick = (id) => {
    if (pinnedMarkers.includes(id)) {
      setPinnedMarkers(pinnedMarkers.filter((item) => item !== id));
    } else {
      setPinnedMarkers([...pinnedMarkers, id]);
    }
  };
  const getMarkers = () => {
    const filteredMarkers = markers.filter(
      (item) =>
        selectedBusOptionsString.includes(item.busCode) ||
        selectedBusOptionsString.includes("All")
    );
    const markersWithIsPinned = filteredMarkers.map((marker) => {
      return {
        ...marker,
        isPinned: pinnedMarkers.includes(marker.busCode),
      };
    });

    // console.log("markersWithIsPinned", markersWithIsPinned);
    return markersWithIsPinned;
  };
  const onMarkerClick = (id, index) => {
    setSelectedMarker(id);
    // console.log("sss", actionMenuHeaderRef.current.offsetHeight);
    actionMenuRef.current.scrollTo(
      0,
      261 * index + actionMenuHeaderRef.current.offsetHeight - 10,
      { behavior: "smooth" }
    );
  };
  const fitBoundsPinnedMarkers = (markers) => {
    // var latXTotal = 0;
    // var latYTotal = 0;
    // var lonDegreesTotal = 0;
    // var currentLatLong;
    // for (var i = 0; (currentLatLong = markers[i]); i++) {
    //   var latDegrees = currentLatLong.latitude;
    //   var lonDegrees = currentLatLong.longitude;
    //   var latRadians = (Math.PI * latDegrees) / 180;
    //   latXTotal += Math.cos(latRadians);
    //   latYTotal += Math.sin(latRadians);
    //   lonDegreesTotal += lonDegrees;
    // }
    // var finalLatRadians = Math.atan2(latYTotal, latXTotal);
    // var finalLatDegrees = (finalLatRadians * 180) / Math.PI;
    // var finalLonDegrees = lonDegreesTotal / markers.length;
    // setMapCenter([232,232])
  };
  return (
    <section
      className={`all-bus-locations-container ${appConfig.language.direction}`}
    >
      <div className="map-contianer">
        {isLoading ? (
          <Loader />
        ) : (
          <Map
            onMarkerClick={(id, index) => onMarkerClick(id, index)}
            markers={getMarkers()}
            center={mapCenter}
            zoom={mapZoom}
          />
        )}
      </div>
      <div ref={actionMenuRef} className="action-menu">
        <div ref={actionMenuHeaderRef}>
          <Select
            defaultValue="adsda"
            withAll={true}
            ref={searchBoxRef}
            value={selectedBusOptions}
            placeholder={`${language.select.placeholder} ...`}
            isRtl={true}
            onChange={(selectedBuses) => {
              var tempArr = [];
              // console.log('fff',selectedBuses,'sdadd',(selectedBuses.filter(item=>item.value==="All")) )
              if (selectedBuses !== null) {
                if (
                  selectedBuses.filter((item) => item.value === "All").length >
                  0
                ) {
                  selectedBuses = [
                    { value: "All", label: language.select.allBus },
                  ];
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

          {markers.length > 0 ? (
            <div ref={overviewBoxRef} className="overview-container">
              <table>
                <tbody>
                  <tr>
                    <Ripples
                      onClick={() => {
                        setSelectedBusOptions([
                          { value: "All", label: language.select.allBus },
                        ]);
                        setSelectedBusOptionsString(["All"]);
                      }}
                    >
                      <td>
                        <td>{language.allBusCount} :</td>
                        <td>{markers.length}</td>
                      </td>
                    </Ripples>
                  </tr>
                  <tr>
                    <Ripples
                      className="btn"
                      onClick={() => {
                        // console.log(
                        //   "filteredMarkers :",
                        //   markers.filter((item) => item.active === true)
                        // );
                        const filteredMarkers = markers.filter(
                          (item) => item.active === true
                        );
                        var filteredMarkersString = [];
                        var filteredMarkersOptions = [];
                        filteredMarkers.map((item) => {
                          filteredMarkersString.push(item.busCode);
                          filteredMarkersOptions.push({
                            value: item.busCode,
                            label: item.busCode,
                          });
                        });
                        setSelectedBusOptions(filteredMarkersOptions);
                        setSelectedBusOptionsString(filteredMarkersString);
                      }}
                    >
                      <td className="active-buses">
                        <td>{language.activeBuses}:</td>
                        <td>
                          {
                            markers.filter((item) => item.active === true)
                              .length
                          }
                        </td>
                      </td>
                    </Ripples>
                    <Ripples
                      className="btn"
                      onClick={() => {
                        // console.log(
                        //   "filteredMarkers :",
                        //   markers.filter((item) => item.active === false)
                        // );
                        const filteredMarkers = markers.filter(
                          (item) => item.active === false
                        );
                        var filteredMarkersString = [];
                        var filteredMarkersOptions = [];
                        filteredMarkers.map((item) => {
                          filteredMarkersString.push(item.busCode);
                          filteredMarkersOptions.push({
                            value: item.busCode,
                            label: item.busCode,
                          });
                        });
                        setSelectedBusOptions(filteredMarkersOptions);
                        setSelectedBusOptionsString(filteredMarkersString);
                      }}
                    >
                      <td className="deactive-buses">
                        <td>{language.deactiveBuses}:</td>
                        <td>
                          {
                            markers.filter((item) => item.active === false)
                              .length
                          }
                        </td>
                      </td>
                    </Ripples>
                  </tr>
                  <tr>
                    <Ripples
                      className="btn"
                      onClick={() => {
                        // console.log(
                        //   "filteredMarkers :",
                        //   markers.filter((item) => item.busy === true)
                        // );
                        const filteredMarkers = markers.filter(
                          (item) => item.busy === true
                        );
                        var filteredMarkersString = [];
                        var filteredMarkersOptions = [];
                        filteredMarkers.map((item) => {
                          filteredMarkersString.push(item.busCode);
                          filteredMarkersOptions.push({
                            value: item.busCode,
                            label: item.busCode,
                          });
                        });
                        setSelectedBusOptions(filteredMarkersOptions);
                        setSelectedBusOptionsString(filteredMarkersString);
                      }}
                    >
                      <td>
                        <td>{language.busyBuses} :</td>
                        <td>
                          {markers.filter((item) => item.busy === true).length}
                        </td>
                      </td>
                    </Ripples>
                    <Ripples
                      className="btn"
                      onClick={() => {
                        // console.log(
                        //   "filteredMarkers :",
                        //   markers.filter((item) => item.busy === false)
                        // );
                        const filteredMarkers = markers.filter(
                          (item) => item.busy === false
                        );
                        var filteredMarkersString = [];
                        var filteredMarkersOptions = [];
                        filteredMarkers.map((item) => {
                          filteredMarkersString.push(item.busCode);
                          filteredMarkersOptions.push({
                            value: item.busCode,
                            label: item.busCode,
                          });
                        });
                        setSelectedBusOptions(filteredMarkersOptions);
                        setSelectedBusOptionsString(filteredMarkersString);
                      }}
                    >
                      <td className="unbusy-buses">
                        <td>{language.unbusyBuses} :</td>
                        <td>
                          {markers.filter((item) => item.busy === false).length}
                        </td>
                      </td>
                    </Ripples>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="bus-detail-container">
          {markers.map((bus) => {
            return selectedBusOptionsString.includes(bus.busCode) ||
              selectedBusOptionsString.includes("All") ? (
              <Ripples
                key={bus.busCode}
                onClick={() => {
                  onBusDetailClick(bus);
                }}
              >
                <table
                  className={selectedMarker === bus.busCode ? "selected" : ""}
                >
                  <div className="bus-code">
                    <div>{language.busCode} :</div> <div>{bus.busCode}</div>
                    <div
                      className={`pin-btn ${
                        pinnedMarkers.includes(bus.busCode) ? "active" : ""
                      }`}
                      onClick={() => onPinButtonClick(bus.busCode)}
                    >
                      <IoMdPin />
                    </div>
                  </div>
                  <tbody>
                    <tr>
                      <td>
                        <td>{language.speed} :</td>
                        <td className="value">{`${bus.groundSpeed}km`}</td>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>
                        <td>{language.busyStatus}:</td>
                        <td className="value">
                          {bus.busy ? language.busy : language.unbusy}
                        </td>
                      </td>
                      <td>
                        <td>{language.activeStatus} :</td>
                        <td className="value">
                          {bus.active ? language.active : language.deactive}
                        </td>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <td>{language.gasStatus}:</td>
                        <td className="value">{bus.fuelType}</td>
                      </td>
                      <td>
                        <td>{language.busStatus} :</td>
                        <td className="value">{bus.busStatus}</td>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <td>{language.lineCode} :</td>
                        <td className="value">{bus.tripCode}</td>
                      </td>
                      <td>
                        <td>{language.transactionCount} :</td>
                        <td className="value">{bus.dcTransactionCount}</td>
                      </td>
                    </tr>
                    {/* <tr>
                      <td>
                        <td>تراکنش های در جلو :</td>
                        <td>{bus.frontDoorTransactionCount}</td>
                      </td>
                      <td className="col">
                        <td>تراکنش های در عقب :</td>
                        <td>{bus.backDoorTransactionCount}</td>
                      </td>
                    </tr> */}
                    <tr>
                      <td>
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
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </Ripples>
            ) : (
              ""
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AllBusLocations;
