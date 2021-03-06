import React, { useState, useEffect, useRef } from "react";
import Map from "../../Components/AllBusLineLocationsMap/Map";
import "./AllBusLineLocations.scss";
import Ripples from "react-ripples";
import Select from "react-select";
import { IoMdPin } from "react-icons/io";
import moment from "jalali-moment";
import Loader from "../../Components/Loader/Loader";
import { appConfig } from "../../Constants/config";
import { ToastContainer, toast } from "react-toastify";
import { lang } from "moment";
const language = appConfig.language.AllBusLineLocations;

const AllBusLineLocations = () => {
  // const ws = new WebSocket('ws://193.176.241.150:8080/tms/websocket/getAllBusLocations')
  const [markers, setMarkers] = useState([]);
  const [mapCenter, setMapCenter] = useState(appConfig.mapCenter);
  const [mapZoom, setMapZoom] = useState(12);
  const [busOptions, setBusOptions] = useState([]);
  const [lineOptions, setLineOptions] = useState([]);
  const [selectedBusOptions, setSelectedBusOptions] = useState([]);
  const [selectedBusOptionsString, setSelectedBusOptionsString] = useState([]);
  const [pinnedMarkers, setPinnedMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState([]);
  const [ws, setWs] = useState(null);
  const [isPaused, setPause] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const actionMenuRef = useRef();
  const searchBoxRef = useRef();
  const overviewBoxRef = useRef();
  const actionMenuHeaderRef = useRef();
  const [selectedLineOptions, setselectedLineOptions] = useState([]);
  const [isBusDataIsLoading, setIsBusDataIsLoading] = useState(false);
  const [selectedLineOptionsString, setselectedLineOptionsString] = useState(
    []
  );
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);
  const [inBoundBusStopPoints, setInBoundBusStopPoints] = useState([]);
  const [outBoundBusStopPoints, setOutBoundBusStopPoints] = useState([]);
  const [inBoundPoints, setInBoundPoints] = useState([]);
  const [outBoundPoints, setOutBoundPoints] = useState([]);

  async function getLines(name) {
    let response = await fetch(
      `${appConfig.apiBaseAddress}api/reactService/trip/all`
    );
    let data = await response.json();
    return data;
  }
  useEffect(() => {
    getLines().then((data) => {
      data = data.sort((a, b) => (a.code > b.code ? 1 : -1));
      var linesTempOptions = data.map((item, index) => {
        return {
          value: item.code,
          label: `${item.code}: ${item.name}`,
        };
      });
      setLineOptions(linesTempOptions);
    });
    const wsClient = new WebSocket(
      `${appConfig.socketBaseAddress}websocket/getBusLocationsByTripNewDate`
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
  useEffect(() => {
    if (!ws) return;

    ws.onmessage = (e) => {
      if (isPaused) return;
      const message = JSON.parse(e.data);
      var tmpBusData = [];
      message.payload.busData.map((item, index) => {
        tmpBusData.push({
          ...item,
          busStatus: persianStatus(item.busStatus),
          fuelType: persianFuelType(item.fuelType),
        });
      });
      console.log("tmpBusData", tmpBusData);
      var busTempOptions = message.payload.busData.map((item, index) => {
        return {
          value: item.busCode,
          label: item.busCode,
        };
      });
      busTempOptions.push({ value: "All", label: language.select.allBus });
      setBusOptions(busTempOptions);
      setMarkers(tmpBusData);
      setInBoundBusStopPoints(
        message.payload.inboundPoints.filter((item) => item.stopCode != null)
      );
      setOutBoundBusStopPoints(
        message.payload.outboundPoints.filter((item) => item.stopCode != null)
      );
      setInBoundPoints(
        message.payload.inboundPoints
      )
      setOutBoundPoints(
        message.payload.outboundPoints
      )
      setIsSubmitButtonDisabled(false);
      setIsBusDataIsLoading(false);
    };
  }, [isPaused, ws]);

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
      256 * index + actionMenuHeaderRef.current.offsetHeight - 10,
      { behavior: "smooth" }
    );
  };
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
    if (isSubmitButtonDisabled) {
      Notify({
        type: "message",
        msg: language.messages.gettingData,
      });
      return;
    }
    setIsSubmitButtonDisabled(true);
    setIsBusDataIsLoading(true);
    ws.send(
      JSON.stringify({
        messageType: "getBusLocationsByTrip",
        payloadType: "getBusLocationsByTrip",
        payload: selectedLineOptions.value,
      })
    );

    setSelectedBusOptions([{ value: "All", label: language.select.allBus }]);
    setSelectedBusOptionsString(["All"]);
  };
  return (
    <section className={`all-bus-locations-container ${appConfig.language.direction}`}>
      <div className="map-contianer">
        <Map
          onMarkerClick={(id, index) => onMarkerClick(id, index)}
          inBoundPoints={inBoundPoints}
          outBoundPoints={outBoundPoints}
          inBoundBusStopPoints={inBoundBusStopPoints}
          outBoundBusStopPoints={outBoundBusStopPoints}
          markers={getMarkers()}
          center={mapCenter}
          zoom={mapZoom}
          language={appConfig.language.language}
        />
      </div>
      <div ref={actionMenuRef} className="action-menu">
        <div ref={actionMenuHeaderRef} className="action-menu-header">
          <div className="filter-container">
            <Select
              isLoading={lineOptions.length === 0}
              // defaultValue="adsda"
              closeMenuOnSelect={true}
              withAll={true}
              ref={searchBoxRef}
              value={selectedLineOptions}
              placeholder={language.select.placeholder}
              isRtl={true}
              className="bus-select-input"
              isMulti={false}
              options={lineOptions}
              isRtl={true}
              onChange={(selectedLine) => {
                var tempArr = [];

                setselectedLineOptions(selectedLine);

                setselectedLineOptionsString(tempArr);
              }}
            />
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
          <Select
            withAll={true}
            ref={searchBoxRef}
            value={selectedBusOptions}
            placeholder={language.select.placeholder}
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
                      <td>{language.allBusCount} : {markers.length}</td>
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
                    {language.busCode}: {bus.busCode}
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

export default AllBusLineLocations;
