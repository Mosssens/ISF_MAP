import React, { useState, useRef, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import {
  Map as LeafletMap,
  TileLayer,
  Popup,
  Marker,
  FeatureGroup,
  Tooltip,
  Polygon,
} from "react-leaflet";
import Control from "react-leaflet-control";
import { FaArrowsAlt } from "react-icons/fa";
import { appConfig } from "../../Constants/config";
import { EditControl } from "react-leaflet-draw";

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
  const { markers } = props;
  const mapRef = useRef();
  const mapGroupRef = useRef();

  const renderMarkers = () => {
    return markers.map((marker, index) => {
      const markerId = marker.busCode;
      return (
        <Marker
          icon={
            marker.isPinned ? blueIcon : marker.active ? greenIcon : redIcon
          }
          onclick={() => props.onMarkerClick(markerId, index)}
          key={`${marker.busCode}`}
          position={[marker.latitude, marker.longitude]}
        >
          <Tooltip
            className={marker.busy ? "busy-bus-tooltip" : ""}
            permanent
            direction="bottom"
            offset={L.point(63, 1)}
          >
            {markerId}
          </Tooltip>
        </Marker>
      );
    });
  };
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
  const updatePlot = (data) => {
    console.log(data);
  };
  useEffect(() => {
    fitBounds();
  }, [mapGroupRef.current]);
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
      <FeatureGroup>
        <EditControl
          position="topright"
          //this is the necessary function. It goes through each layer
          //and runs my save function on the layer, converted to GeoJSON
          //which is an organic function of leaflet layers.
          edit={{ edit: false, remove: false }}
          onEdited={(e) => {
            props.onPolygenDraw(e);
          }}
          onCreated={(e) => props.onPolygenDraw(e.layer._latlngs[0])}
          draw={{
            marker: false,
            circle: false,
            circlemarker: false,
            rectangle: false,
            polygon: true,
            polyline: false,
          }}
        />
        {/* <Polygon positions={[positions(this.props)]} />; */}
      </FeatureGroup>
      <FeatureGroup ref={mapGroupRef}>{renderMarkers()}</FeatureGroup>
      <Control position="bottomleft">
        <button className="fit-bounds-btn" onClick={() => fitBounds()}>
          <FaArrowsAlt />
        </button>
      </Control>
    </LeafletMap>
  );
}
