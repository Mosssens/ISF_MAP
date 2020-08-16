// export default {
//   qomApp: {
//     mapCenter: [34.6302026, 50.8656816],
//     apiBaseAddress: "http://afc.qom.ir:9051",
//     socketBaseAddress: "ws://afc.qom.ir:9051",
//   },
//   esfApp: {
//     mapCenter: [32.654492278497646, 51.64067001473507],
//     apiBaseAddress: "http://193.176.241.150:8080",
//     socketBaseAddress: "ws://193.176.241.150:8080",
//   },
// };
const getUrl = window.location;
const baseUrl = getUrl.protocol + "//" + getUrl.host;
const baseWSURL = "ws://" + getUrl.host;
const $globalLat = window.parent.window.parent.globalLat;
const $globalLong = window.parent.globalLong;
const $contextPath = window.parent.contextPath;
const mapOnline = window.parent.mapOnline;
console.log({
  mapCenter: [$globalLat, $globalLong],
  mapURL:
    mapOnline == "0"
      ? baseUrl + "/tiles/{z}/{x}/{y}.png"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  apiBaseAddress:
    baseUrl === "http://localhost:3000"
      ? "http://193.176.241.150:8080/tms/"
      : $contextPath + "/",
  socketBaseAddress:
    baseWSURL === "ws://localhost:3000"
      ? "ws://193.176.241.150:8080/tms/"
      : baseWSURL + $contextPath + "/",
  windowVariables: {
    globalLat: window.parent.globalLat,
    globalLong: window.parent.globalLong,
    mapOnline: window.parent.mapOnline,
    contextPath: window.parent.contextPath,
  },
});
export const appConfig = {
  mapCenter: [$globalLat, $globalLong],
  mapURL:
    mapOnline == "0"
      ? baseUrl + "/tiles/{z}/{x}/{y}.png"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  apiBaseAddress:
    baseUrl === "http://localhost:3000"
      ? "http://193.176.241.150:8080/tms/"
      : $contextPath + "/",
  socketBaseAddress:
    baseWSURL === "ws://localhost:3000"
      ? "ws://193.176.241.150:8080/tms/"
      : baseWSURL + $contextPath + "/",
};
