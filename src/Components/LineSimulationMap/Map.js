import React, { useState, useRef, useEffect } from "react";
import L, { marker, icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Map as LeafletMap,
  TileLayer,
  Popup,
  Marker,
  Polyline,
  FeatureGroup,
  Tooltip,
  Circle,
} from "react-leaflet";
import Control from "react-leaflet-control";
import { FaArrowsAlt } from "react-icons/fa";
import "./Map.scss";
import { appConfig } from "../../Constants/config";

delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
//   iconUrl: require("leaflet/dist/images/marker-icon.png"),
//   shadowUrl: require("leaflet/dist/images/marker-shadow.png")
// });

var defaultIcon = L.icon({
  iconUrl: require("./img/marker-icon-black.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  iconSize: [25, 41], // size of the icon
  // shadowSize:   [50, 64], // size of the shadow
  iconAnchor: [13, 35], // point of the icon which will correspond to marker's location
  // shadowAnchor: [4, 62],  // the same for the shadow
  // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
var greenIcon = L.icon({
  iconUrl: require("./img/marker-icon-green.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  iconSize: [25, 41], // size of the icon
  // shadowSize:   [50, 64], // size of the shadow
  iconAnchor: [13, 35], // point of the icon which will correspond to marker's location
  // shadowAnchor: [4, 62],  // the same for the shadow
  // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
var redIcon = L.icon({
  iconUrl: require("./img/marker-icon-red.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  iconSize: [25, 41], // size of the icon
  // shadowSize:   [50, 64], // size of the shadow
  iconAnchor: [13, 35], // point of the icon which will correspond to marker's location
  // shadowAnchor: [4, 62],  // the same for the shadow
  // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
var blueIcon = L.icon({
  iconUrl: require("./img/marker-icon-blue.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  iconSize: [25, 41], // size of the icon
  // shadowSize:   [50, 64], // size of the shadow
  iconAnchor: [13, 35], // point of the icon which will correspond to marker's location
  // shadowAnchor: [4, 62],  // the same for the shadow
  // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
var inboundStartIcon = L.icon({
  iconUrl: require("./img/bluestopmarkerfirst.png"),
  iconAnchor: [13, 65],
});
var inboundEndIcon = L.icon({
  iconUrl: require("./img/bluestopmarkerend.png"),
  iconAnchor: [13, 65],
});
var outboundStartIcon = L.icon({
  iconUrl: require("./img/redstopmarkerfirst.png"),
  iconAnchor: [13, 65],
});
var outboundEndIcon = L.icon({
  iconUrl: require("./img/redstopmarkerend.png"),
  iconAnchor: [13, 65],
});
const Circles = React.memo((props) => {
  return props.buses.map((bus, busIndex) => {
    return props.markers
      .filter((marker) => marker.busCode === bus.busCode)
      .map((marker, markerIndex) => {
        return (
          <Circle
            key={markerIndex}
            center={{
              lat: marker.latitude,
              lng: marker.longitude,
            }}
            fillColor={bus.color}
            color={bus.color}
            radius={10}
          />
        );
      });
  });
});

const Polylines = React.memo((props) => {
  var positions = [];
  props.inBoundPoints.map((inBoundPoint) => {
    positions.push([inBoundPoint.latitude, inBoundPoint.longitude]);
  });
  return <Polyline positions={positions} color={props.color} />;
});
const BusStops = React.memo((props) => {
  return props.inBoundPoints.map((inBoundPoint, inBoundPointIndex) => {
    return (
      <Circle
        center={{ lat: inBoundPoint.latitude, lng: inBoundPoint.longitude }}
        fillColor={props.color}
        color={props.color}
        radius={100}
        key={inBoundPointIndex}
        offset={L.point(63, 1)}
      >
        {props.color === "red" && inBoundPointIndex === 0 ? (
          <Marker
            position={[inBoundPoint.latitude, inBoundPoint.longitude]}
            icon={props.language === "persian" ? outboundStartIcon : greenIcon}
          />
        ) : null}
        {props.color === "red" &&
        inBoundPointIndex === props.inBoundPoints.length - 1 ? (
          <Marker
            position={[inBoundPoint.latitude, inBoundPoint.longitude]}
            icon={props.language === "persian" ? outboundEndIcon : greenIcon}
          />
        ) : null}
        {props.color === "blue" && inBoundPointIndex === 0 ? (
          <Marker
            position={[inBoundPoint.latitude, inBoundPoint.longitude]}
            icon={props.language === "persian" ? inboundStartIcon : redIcon}
          />
        ) : null}
        {props.color === "blue" &&
        inBoundPointIndex === props.inBoundPoints.length - 1 ? (
          <Marker
            position={[inBoundPoint.latitude, inBoundPoint.longitude]}
            icon={props.language === "persian" ? inboundEndIcon : redIcon}
          />
        ) : null}
        <Tooltip
          className="black-tooltip"
          offset={L.point(130, 0)}
          direction="bottom"
        >
          <div>{`${inBoundPoint.stopCode}: ${inBoundPoint.stopName}`}</div>
        </Tooltip>
      </Circle>
    );
  });
});

const Markers = (props) => {
  return props.buses.map((bus, busIndex) => {
    // var color = switchColors(busIndex);
    const myCustomColour = bus.color;

    const markerHtmlStyles = `
  background-color: ${myCustomColour};
  width: 3rem;
  height: 3rem;
  display: block;
  left: -1.5rem;
  top: -1.5rem;
  position: relative;
  border-radius: 3rem 3rem 0;
  transform: rotate(45deg);
  border: 1px solid #FFFFFF;
  display: flex;
  justify-content: center;
  align-items: center;
  `;

    const icon = L.divIcon({
      className: "my-custom-pin",
      iconSize: [25, 41], // size of the icon
      // shadowSize:   [50, 64], // size of the shadow
      iconAnchor: [-23, 35], // point of the icon which will correspond to marker's location
      html: `<span style="${markerHtmlStyles}" ><span style="transform: rotate(-45deg);color: white;font-size: 1.5em">${bus.busCode}</span></span>`,
    });
    return (
      <Marker
        icon={icon}
        key={`${bus.busCode}`}
        position={bus.busPosition}
        onclick={() => props.onMapMarkerCkick(busIndex)}
      >
        <Tooltip key={4} permanent direction="bottom" offset={L.point(63, 1)}>
          <div>{bus.time}</div>
          {bus.isTooltipActive ? <div>active</div> : null}
        </Tooltip>
      </Marker>
    );
  });
};
const Map = (props) => {
  // const [markers, setMarkers] = useState()
  // const { markers } = props;
  const mapRef = useRef();
  const mapGroupRef = useRef();
  const [markers, setMarkers] = useState([[], []]);

  // const renderMarkers = () => {
  //   return markers.map(
  //     (marker,index) => {
  //       const markerId = marker.busCode;
  //       return
  //     })
  // }
  const fitBounds = () => {
    // setCenter([
    //   markers[props.marker].latitude,
    //   markers[props.marker].longitude,
    // ]);
  };
  useEffect(() => {
    if (props.fitMarkerIntervalBounds) {
      const map = mapRef.current.leafletElement; //get native Map instance
      const group = mapGroupRef.current.leafletElement; //get native featureGroup instance
      map.fitBounds(group.getBounds());
    }
  }, [props.marker, props.buses]);
  useEffect(() => {
    setMarkers(props.firstBusPath);
  }, [props.firstBusPath, props.secondBusPath]);

  return (
    <LeafletMap
      ref={mapRef}
      center={props.center}
      zoom={props.zoom}
      minZoom={7}
      maxZoom={18}
    >
      <TileLayer
        url={appConfig.mapURL}
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <FeatureGroup ref={mapGroupRef}>
        {markers.length !== 0 && markers.length > props.marker ? (
          <React.Fragment>
            <Markers
              onMapMarkerCkick={(busIndex) => props.onMapMarkerCkick(busIndex)}
              buses={props.buses}
            />
            <BusStops color="blue" inBoundPoints={props.inBoundBusStopPoints} />
            <BusStops color="red" inBoundPoints={props.outBoundBusStopPoints} />

            <Polylines color="blue" inBoundPoints={props.inBoundPoints} />
            <Polylines color="red" inBoundPoints={props.outBoundPoints} />
          </React.Fragment>
        ) : null}
      </FeatureGroup>
      {/* <Control position="topright">
        <button className="fit-bounds-btn" onClick={() => fitBounds()}>
          <FaArrowsAlt />
        </button>
      </Control> */}
    </LeafletMap>
  );
};
export default Map;
