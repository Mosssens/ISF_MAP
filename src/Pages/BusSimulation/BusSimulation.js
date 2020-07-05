import React, { useState, useEffect, useRef } from "react";
import Map from "../../Components/BusSimulationMap/Map";
import "./BusSimulation.scss";
import Ripples from "react-ripples";
import Select from "react-select";
import { IoMdPin } from "react-icons/io";
import moment from "jalali-moment";
import Loader from "../../Components/Loader/Loader";
import { DatePicker } from "jalali-react-datepicker";

const BusSimulation = () => {
  // const ws = new WebSocket('ws://193.176.241.150:8080/tms/websocket/getBusSimulation')
  const [markers, setMarkers] = useState([]);
  const [mapCenter, setMapCenter] = useState([34.6188466, 50.8469083]);
  const [mapZoom, setMapZoom] = useState(12);
  const [busOptions, setBusOptions] = useState([]);
  const [selectedBusOptions, setSelectedBusOptions] = useState([]);
  const [selectedBusOptionsString, setSelectedBusOptionsString] = useState([]);
  const [pinnedMarkers, setPinnedMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //   const [busOptions,setBusOptions]=useState(false)
  const actionMenuRef = useRef();   
  const searchBoxRef = useRef();
  const overviewBoxRef = useRef();
  const actionMenuHeaderRef = useRef();
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [isBusDataIsLoading, setIsBusDataIsLoading] = useState(false);
  useEffect(() => {
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
      `http://192.168.1.155:4546/tms/api/reactService/bus/all`
    );
    console.log(response);
    let data = await response.json();
    return data;
  }
  async function getSelectedBusesData(inputJson) {
    let response = await fetch(
      `http://192.168.1.155:4546/tms/api/reactService/bus/track`,
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
    setIsBusDataIsLoading(true)
    console.log(selectedBusOptions[0], selectedBusOptions[1]);
    const bus1 =
      selectedBusOptions[0] !== undefined ? selectedBusOptions[0].value : "0";
    const bus2 =
      selectedBusOptions[1] !== undefined ? selectedBusOptions[1].value : "0";
   
    getSelectedBusesData({
      busCode1: bus1,
      busCode2: bus2,
      tripCode: 0,
      fromDate: fromDate,
      toDate: toDate,
    }).then((data) => {
      console.log(data, "sdsds");
      setMarkers(data.busData[0])
      setIsBusDataIsLoading(false)
    });
  };
  return (
    <section className="bus-simulation-container">
      <div className="map-contianer">
        {isLoading ? <Loader /> : <Map center={mapCenter} zoom={mapZoom} />}
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
                    moment(momentObjFrom.value._d).format("YYYYMMDDhhmmss")
                  );
                }}
              />
            </div>
            <div className="date-input-container">
              <label>تا تاریخ :</label>
              <DatePicker
                onClickSubmitButton={(momentObjTo) => {
                  setToDate(
                    moment(momentObjTo.value._d).format("YYYYMMDDhhmmss")
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
        <div className="bus-detail-container">
          {markers.map((bus) => {
            return selectedBusOptionsString.includes(bus.busCode) ||
              selectedBusOptionsString.includes("All") ? (
              <Ripples
                key={bus.busCode}
                onClick={() => {
                  //   onBusDetailClick(bus);
                }}
              >
                <table
                  className={selectedMarker === bus.busCode ? "selected" : ""}
                >
                  <div className="bus-code">
                    کد اتوبوس : {bus.busCode}
                    <div
                      className={`pin-btn ${
                        pinnedMarkers.includes(bus.busCode) ? "active" : ""
                      }`}
                      //   onClick={() => onPinButtonClick(bus.busCode)}
                    >
                      <IoMdPin />
                    </div>
                  </div>
                  <tbody>
                    <tr>
                      <td>
                        <td>سرعت لحظه ای :</td>
                        <td className="value">{`${bus.groundSpeed}km`}</td>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>
                        <td>شاغل/غیر شاغل:</td>
                        <td className="value">
                          {bus.busy ? "شاغل" : "غیر شاغل"}
                        </td>
                      </td>
                      <td>
                        <td>فعال/غیر فعال :</td>
                        <td className="value">
                          {bus.active ? "فعال" : "غیر فعال"}
                        </td>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <td>نوع سوخت:</td>
                        <td className="value">{bus.fuelType}</td>
                      </td>
                      <td>
                        <td>وضعیت اتوبوس :</td>
                        <td className="value">{bus.busStatus}</td>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <td>کد خط :</td>
                        <td className="value">{bus.tripCode}</td>
                      </td>
                      <td>
                        <td>تعداد تراکنش ها :</td>
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

export default BusSimulation;
