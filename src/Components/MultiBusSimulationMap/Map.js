import React, { useState, useRef, useEffect } from "react";
import L, { marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Map as LeafletMap,
  TileLayer,
  Popup,
  Marker,
  FeatureGroup,
  Tooltip,
  Circle,
} from "react-leaflet";
import Control from "react-leaflet-control";
import { FaArrowsAlt } from "react-icons/fa";
import "./Map.scss";
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
// const Circles = React.memo((props) => {
//   return props.markers.map((marker, markerIndex) => {
//     return (
//       <Circle
//         key={markerIndex}
//         center={{
//           lat: marker.latitude,
//           lng: marker.longitude,
//         }}
//         fillColor={props.color}
//         color={props.color}
//         radius={10}
//       />
//     );
//   });
// });

const Circles = React.memo((props) => {
  console.log("Circles is render these buses", props.buses);
  return props.buses.map((bus, busIndex) => {
    var color = switchColors(busIndex);
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
            fillColor={color.color}
            color={color.color}
            radius={10}
          />
        );
      });
  });
});
const switchColors = (index) => {
  switch (index) {
    case 0:
      return { icon: blueIcon, color: "rgba(0,0,200,0.3)" };
    case 1:
      return { icon: redIcon, color: "rgba(200,0,0,0.3)" };
    case 2:
      return { icon: greenIcon, color: "rgba(0,200,0,0.3)" };
  }
};
const Markers = (props) => {
  return props.buses.map((bus, busIndex) => {
    var color = switchColors(busIndex);
    return (
      <Marker
        icon={color.icon}
        key={`${bus.busCode}`}
        position={bus.busPosition}
      >
        <Tooltip permanent direction="bottom" offset={L.point(63, 1)}>
          <div>{bus.busCode}</div>
          <div>{bus.time}</div>
        </Tooltip>
      </Marker>
    );
  });
};
export default (function Map(props) {
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
      fitBounds(props.marker);
    }
  }, [props.marker]);
  useEffect(() => {
    setMarkers(props.firstBusPath);
  }, [props.firstBusPath, props.secondBusPath]);

  return (
    <LeafletMap
      ref={mapRef}
      center={props.center}
      zoom={props.zoom}
      minZoom={7}
      maxZoom={19}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <FeatureGroup ref={mapGroupRef}>
        {markers.length !== 0 && markers.length > props.marker ? (
          <React.Fragment>
            <Markers buses={props.buses} />

            <Circles markers={markers} buses={props.buses} />
          </React.Fragment>
        ) : null}
      </FeatureGroup>
      <Control position="topright">
        <button className="fit-bounds-btn" onClick={() => fitBounds()}>
          <FaArrowsAlt />
        </button>
      </Control>
    </LeafletMap>
  );
});
