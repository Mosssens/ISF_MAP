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
const Circles = React.memo((props) => {
  console.log("sda", props.markers);
  return props.markers.map((marker, markerIndex) => {
    return (
      <Circle
        key={markerIndex}
        center={{
          lat: marker.latitude,
          lng: marker.longitude,
        }}
        fillColor={props.color}
        color={props.color}
        radius={10}
      />
    );
  });
});
export default React.memo(function Map(props) {
  // const [markers, setMarkers] = useState()
  // const { markers } = props;
  const mapRef = useRef();
  const mapGroupRef = useRef();
  const [markers, setMarkers] = useState([[], []]);
  const [center, setCenter] = useState([32.654492278497646, 51.64067001473507]);

  // const renderMarkers = () => {
  //   return markers.map(
  //     (marker,index) => {
  //       const markerId = marker.busCode;
  //       return
  //     })
  // }
  const fitBounds = () => {
    setCenter([
      markers[0][props.marker].latitude,
      markers[0][props.marker].longitude,
    ]);
  };
  useEffect(() => {
    if (props.fitMarkerIntervalBounds) {
      fitBounds(props.marker);
    }
  }, [props.marker]);
  useEffect(() => {
    setMarkers([props.firstBusPath, props.secondBusPath]);
    console.log("asdaad", [props.firstBusPath], [props.secondBusPath]);
  }, [props.firstBusPath, props.secondBusPath]);

  return (
    <LeafletMap
      ref={mapRef}
      center={center}
      zoom={props.zoom}
      minZoom={7}
      maxZoom={19}
      preferCanvas={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <FeatureGroup ref={mapGroupRef}>
        {markers[0].length !== 0 && markers[0].length > props.marker ? (
          <React.Fragment>
            <Marker
              icon={blueIcon}
              key={`${markers[0][props.marker].busCode}`}
              position={[
                markers[0][props.marker].latitude,
                markers[0][props.marker].longitude,
              ]}
            >
              <Tooltip permanent direction="bottom" offset={L.point(63, 1)}>
                {markers[0][props.marker].busCode}
              </Tooltip>
            </Marker>
            <Circles markers={markers[0]} color="blue" />
          </React.Fragment>
        ) : null}
        {markers[1].length !== 0 && markers[1].length > props.marker ? (
          <React.Fragment>
            <Marker
              icon={redIcon}
              key={`${markers[1][props.marker].busCode}`}
              position={[
                markers[1][props.marker].latitude,
                markers[1][props.marker].longitude,
              ]}
            >
              <Tooltip permanent direction="bottom" offset={L.point(63, 1)}>
                {markers[1][props.marker].busCode}
              </Tooltip>
            </Marker>
            {/* {renderCircles(markers[1], 'red')} */}
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
