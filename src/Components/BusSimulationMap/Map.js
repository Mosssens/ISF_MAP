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
export default function Map(props) {
  // const [markers, setMarkers] = useState()
  // const { markers } = props;
  const mapRef = useRef();
  const mapGroupRef = useRef();
  const [markers,setMarkers]=useState([])

  // const renderMarkers = () => {
  //   return markers.map(
  //     (marker,index) => {
  //       const markerId = marker.busCode;
  //       return
  //     })
  // }
  const fitBounds = () => {
    if (mapGroupRef.current !== undefined) {
      //get native Map instance
      const map = mapRef.current.leafletElement;
      const group = mapGroupRef.current.leafletElement; //get native featureGroup instance
      // map.fitBounds(group.getBounds());
      if (group.getBounds()._northEast !== undefined) {
        map.fitBounds(group.getBounds());
      }
    }
  };
  useEffect(() => {
    if (props.fitMarkerIntervalBounds) {
      fitBounds();
    }
  }, [props.marker]);
  useEffect(() => {
    setMarkers(props.circles)
  }, [props.circles]);
  const renderCircles = (markers) => {
    return markers.map((marker, markerIndex) => {
      return (
        <Circle
          key={markerIndex}
          center={{
            lat: marker.latitude,
            lng: marker.longitude,
          }}
          fillColor="blue"
          radius={10}
        />
      );
    });
  };
  return (
    <LeafletMap
      ref={mapRef}
      center={props.center}
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
        {markers.length!==0 ? (
          <React.Fragment>
            <Marker
              icon={blueIcon}
              key={`${markers[props.marker].busCode}`}
              position={[markers[props.marker].latitude, markers[props.marker].longitude]}
            >
              <Tooltip permanent direction="bottom" offset={L.point(63, 1)}>
                {markers[props.marker].busCode}
              </Tooltip>
            </Marker>
            {renderCircles(markers)}
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
}
