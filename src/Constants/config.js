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
var getUrl = window.location;
var baseUrl = getUrl.protocol + "//" + getUrl.host;
var baseWSURL = "ws://" + getUrl.host;
export const esfApp = {
  mapCenter: [32.654492278497646, 51.64067001473507],
  apiBaseAddress:
    baseUrl === "http://localhost:3000"
      ? "http://193.176.241.150:8080/tms/"
      : baseUrl,
  socketBaseAddress:
    baseWSURL === "ws://localhost:3000"
      ? "ws://193.176.241.150:8080/tms/"
      : baseWSURL,
};
export const qomApp = {
  mapCenter: [34.6302026, 50.8656816],
  apiBaseAddress:
    baseUrl === "http://localhost:3000"
      ? "http://afc.qom.ir:9051"
      : baseUrl,
  socketBaseAddress:
    baseWSURL === "ws://localhost:3000"
      ? "ws://afc.qom.ir:9051"
      : baseWSURL,
};
export const baseURL = () => {};
