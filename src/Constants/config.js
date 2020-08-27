const languages = [
  {
    language: "persian",
    direction: "rtl",
    loader: "در حال دریافت اطلاعات",
    AllBusLocations: {
      allBusCount: "تعداد همه اتوبوس ها",
      activeBuses: "اتوبوس های فعال",
      deactiveBuses: "اتوبوس های غیر فعال",
      busyBuses: "اتوبوس های شاغل",
      unbusyBuses: "اتوبوس های غیر شاغل",
      busCode: "کد اتوبوس",
      speed: "سرعت لحظه ای",
      busyStatus: "شاغل/غیرشاغل",
      busy: "شاغل",
      unbusy: "غیر شاغل",
      activeStatus: "فعال/غیرفعال",
      active: "فعال",
      deactive: "غیر فعال",
      gasStatus: "نوع سوخت",
      gasStatuses: {
        unknown: "نامشخص",
        GAS_OIL: "دوگانه سوز",
        GAS: "بنزین",
        ELECTRIC: "برق",
      },
      busStatus: "وضعیت اتوبوس",
      busStatuses: {
        PA: "در پارکینگ",
        LI: "در خط",
        OF: "خارج از خط",
        RS: "در محل سوختگیری",
        GA: "در تعمیرگاه",
        UN: "نامشخص",
      },
      lineCode: "کد خط",
      transactionCount: "تعداد تراکنش ها",
      date: "تاریخ",
      select: {
        allBus: "همه اتوبوس ها",
        placeholder: "انتخاب کنید",
      },
    },
    BusSimulation: {
      select: {
        allBus: "همه اتوبوس ها",
        placeholder: "انتخاب کنید",
      },
      date: "تاریخ",
      fromDate: "از ساعت",
      toDate: "تا ساعت",
      submitTitle: "نمایش اطلاعات",
      speed: "سرعت لحظه ای",
      previousStep: "موقعیت قبلی",
      nextStep: "موقعیت بعدی",
      stop: "بازگشت از ابتدا",
      play: "اجرا/توقف",
      focus: "فوکوس روی موقعیت اتوبوس",
      jump: "پرش از موقعیت با سرعت < 4",
      mediaSpeed: "تعیین سرعت حرکت",
      messages: {
        fillRequiredField: "ابتدا تمامی فیلدهای ورودی را پر کنید!",
        gettingData: "در حال دریافت اطلاعات... لطفا منتظر بمانید.",
        selectBus: "اتوبوس را انتخاب کنید.",
        selectFromToDate: "تاریخ شروع و پایان را وارد کنید!",
        inCorrectFromToDate: "تاریخ پایان قبل تر از تاریخ شروع است!",
        noRecordForBus: (busId) => {
          return `هیج رکوردی در این تاریخ برای اتوبوس ${busId} ثبت نشده است .`;
        },
        noRecordForBuses: (busId1, busId2) => {
          return `هیج رکوردی در این تاریخ برای اتوبوس ${busId1} و ${busId2} ثبت نشده است .`;
        },
        maxBusCount: "حداکثر 2 اتوبوس میتوانید انتخاب کنید.",
      },
    },
    LineSimulation: {
      select: {
        allBus: "همه اتوبوس ها",
        placeholder: "انتخاب کنید",
      },
      date: "تاریخ",
      fromDate: "از ساعت",
      toDate: "تا ساعت",
      submitTitle: "نمایش اطلاعات",
      speed: "سرعت لحظه ای",
      previousStep: "موقعیت قبلی",
      nextStep: "موقعیت بعدی",
      stop: "بازگشت از ابتدا",
      play: "اجرا/توقف",
      focus: "فوکوس روی موقعیت اتوبوس",
      jump: "پرش از موقعیت با سرعت < 4",
      mediaSpeed: "تعیین سرعت حرکت",
      messages: {
        fillRequiredField: "ابتدا تمامی فیلدهای ورودی را پر کنید!",
        gettingData: "در حال دریافت اطلاعات... لطفا منتظر بمانید.",
        selectBus: "اتوبوس را انتخاب کنید.",
        selectFromToDate: "تاریخ شروع و پایان را وارد کنید!",
        inCorrectFromToDate: "تاریخ پایان قبل تر از تاریخ شروع است!",
        selectLine: "خطی را انتخاب کنید !",
        noRecordForLine: (lineId) => {
          return `در این تاریخ هیچ رکوردی از خط "${lineId}" ثبت نشده .`;
        },
      },
    },
    SchematicTripState: {
      select: {
        placeholder: "انتخاب کنید",
      },
      line: "خط",
      submitTitle: "نمایش",
      inbound: "مسیر رفت",
      outbound: "مسیر برگشت",
      activeBusCount: "تعداد اتوبوس های فعال خط",
      inboundBusStops: "تعداد ایستگاه های مسیر رفت",
      outboundBusStops: "تعداد ایستگاه های مسیر برگشت",
      activeBusCount: "تعداد اتوبوس های فعال خط",
      legalSpeed: "سرعت مجاز",
      busCountInbound: "تعداد اتوبوس های مسیر رفت",
      busCountOutbound: "تعداد اتوبوس های مسیر برگشت",
      inboundDistance: "مسافت مسیر رفت",
      outboundDistance: "مسافت مسیر برگشت",
      inboundTripDuration: "زمان مسیر رفت",
      outboundTripDuration: "زمان مسیر برگشت",
      messages: {
        selectLine: "خطی را انتخاب کنید !",
      },
      minute: "دقیقه",
    },
    AllBusLineLocations: {
      allBusCount: "تعداد همه اتوبوس ها",
      activeBuses: "اتوبوس های فعال",
      deactiveBuses: "اتوبوس های غیر فعال",
      busyBuses: "اتوبوس های شاغل",
      unbusyBuses: "اتوبوس های غیر شاغل",
      busCode: "کد اتوبوس",
      speed: "سرعت لحظه ای",
      busyStatus: "شاغل/غیرشاغل",
      busy: "شاغل",
      unbusy: "غیر شاغل",
      activeStatus: "فعال/غیرفعال",
      active: "فعال",
      deactive: "غیر فعال",
      gasStatus: "نوع سوخت",
      gasStatuses: {
        unknown: "نامشخص",
        GAS_OIL: "دوگانه سوز",
        GAS: "بنزین",
        ELECTRIC: "برق",
      },
      busStatus: "وضعیت اتوبوس",
      busStatuses: {
        PA: "در پارکینگ",
        LI: "در خط",
        OF: "خارج از خط",
        RS: "در محل سوختگیری",
        GA: "در تعمیرگاه",
        UN: "نامشخص",
      },
      lineCode: "کد خط",
      transactionCount: "تعداد تراکنش ها",
      date: "تاریخ",
      select: {
        allBus: "همه اتوبوس ها",
        placeholder: "انتخاب کنید",
      },
      submitTitle: "نمایش اطلاعات",
      messages: {
        fillRequiredField: "ابتدا تمامی فیلدهای ورودی را پر کنید!",
        gettingData: "در حال دریافت اطلاعات... لطفا منتظر بمانید.",
        selectBus: "اتوبوس را انتخاب کنید.",
        selectFromToDate: "تاریخ شروع و پایان را وارد کنید!",
        inCorrectFromToDate: "تاریخ پایان قبل تر از تاریخ شروع است!",
      },
    },
  },
  {
    language: "english",
    direction: "ltr",
    loader: "Loading",
    AllBusLocations: {
      allBusCount: "All Buses count",
      activeBuses: "Active Buses",
      deactiveBuses: " Idle Buses",
      busyBuses: "In-route Buses",
      unbusyBuses: "Out-route Buses",
      busCode: "Bus ID",
      speed: "Instantaneous speed",
      busyStatus: "Busy/Unbusy",
      busy: "Busy",
      unbusy: "Unbusy",
      activeStatus: "Active/Deactive",
      active: "Active",
      deactive: "Deactive",
      gasStatus: "Gas Status",
      gasStatuses: {
        unknown: "Unknown",
        GAS_OIL: "Gas oil",
        GAS: "Gas",
        ELECTRIC: "Electric",
      },
      busStatus: "Bus Status",
      busStatuses: {
        PA: "In parking",
        LI: "In line",
        OF: "Out of line",
        RS: "In gas station",
        GA: "In garage",
        UN: "Unknown",
      },
      lineCode: "line Code",
      transactionCount: " Transaction Count",
      date: "Date",
      select: {
        allBus: "All Buses",
        placeholder: "Choose",
      },
    },
    BusSimulation: {
      select: {
        allBus: "All Buses",
        placeholder: "Choose",
      },
      date: "Date",
      fromDate: "From",
      toDate: "To",
      submitTitle: "Confirm",
      speed: "Instantaneous speed",
      previousStep: "Previous position",
      nextStep: "Next position",
      stop: "Return from origin",
      play: "Play/Stop",
      focus: "Focus on position",
      jump: "Jump from position with speed < 4",
      mediaSpeed: "Define movement speed",
      messages: {
        fillRequiredField: "First fill all the input fields !",
        gettingData: "Loading , Please wait !",
        selectBus: "Choose the bus.",
        selectFromToDate: "Input the start and end date !",
        inCorrectFromToDate: "End date is before the start date !",
        noRecordForBus: (busId) => {
          return `No record found for the bus${busId}  .`;
        },
        noRecordForBuses: (busId1, busId2) => {
          return `No record found in this date for bus${busId1} and ${busId2}  .`;
        },
        maxBusCount: "You can choose 2 buses at most",
      },
    },
    LineSimulation: {
      select: {
        allBus: "All buses",
        placeholder: "Choose",
      },
      date: "Date",
      fromDate: "From",
      toDate: "To",
      submitTitle: "Confirm",
      speed: "Instantaneous speed",
      previousStep: "Previous position",
      nextStep: "Next position",
      stop: "Return from origin",
      play: "Play/Stop",
      focus: "Focus on position",
      jump: "Jump from position with speed < 4",
      mediaSpeed: "Define movement speed",
      messages: {
        fillRequiredField: "First fill all the input fields !",
        gettingData: "Loading , Please wait !",
        selectBus: "Choose the bus.",
        selectFromToDate: "Input the start and end date !",
        inCorrectFromToDate: "End date is before the start date !",
        selectLine: "Select a line",
        noRecordForLine: (lineId) => {
          return `No record found for the line${lineId} on this date .`;
        },
      },
    },
    SchematicTripState: {
      line: "Line",
      submitTitle: "Show",
      inbound: "Go",
      outbound: "Back",
      activeBusCount: "Number of Active Buses",
      inboundBusStops: "Number of stations in Go Direction",
      outboundBusStops: "Number of stations in Back Direction",
      legalSpeed: "Speed Limit",
      busCountInbound: "Number of buses in Go Direction",
      busCountOutbound: "Number of buses in Back Direction",
      inboundDistance: " Go Direction Distance",
      outboundDistance: " Back Direction Distance",
      inboundTripDuration: "Go Direction Timing",
      outboundTripDuration: "Back Direction Timing",
      minute: "minute",
      select: {
        allBus: "All buses",
        placeholder: "Choose",
      },
    },
    AllBusLineLocations: {
      allBusCount: "All Buses count",
      activeBuses: "Active Buses",
      deactiveBuses: "Idle Buses",
      busyBuses: "In-route Buses",
      unbusyBuses: "Out-route Buses",
      busCode: "Bus ID",
      speed: "Instantaneous speed",
      busyStatus: "Busy/Unbusy",
      busy: "Busy",
      unbusy: "Unbusy",
      activeStatus: "Active/Deactive",
      active: "Active",
      deactive: "Deactive",
      gasStatus: "Gas Status",
      gasStatuses: {
        unknown: "Unknown",
        GAS_OIL: "Gas oil",
        GAS: "Gas",
        ELECTRIC: "Electric",
      },
      busStatus: "Bus Status",
      busStatuses: {
        PA: "In parking",
        LI: "In line",
        OF: "Out of line",
        RS: "In gas station",
        GA: "In garage",
        UN: "Unknown",
      },
      lineCode: "line Code",
      transactionCount: " Transaction Count",
      date: "Date",
      select: {
        allBus: "All Buses",
        placeholder: "Choose...",
      },
      submitTitle: "Confirm",
      messages: {
        fillRequiredField: "First fill all the input fields !",
        gettingData: "Loading , Please wait !",
      },
    },
  },
];

const getUrl = window.location;
const baseUrl = getUrl.protocol + "//" + getUrl.host;
const baseWSURL = "ws://" + getUrl.host;
const $globalLat = window.parent.window.parent.globalLat;
const $globalLong = window.parent.globalLong;
const $contextPath = window.parent.contextPath;
const mapOnline = window.parent.mapOnline;
const language = window.parent.language;
const colors = [
  "#1b6ca8",
  "#c70039",
  "#FF5252",
  "#4CAF50",
  "#FFC107",
  "#7C4DFF",
  "#ff847c",
  "#009688",
  "#607D8B",
  "#5e6f64",
  "#c7b198",
  "#3F51B5",
  "#f0965a",
  "#333d54",
  "#76ad61",
  "#03a9f4",
  "#c4d1ad",
  "#566e4b",
  "#3a1018",
  "#e57373",
  "#377e6a",
  "#ab4a5a",
  "#3f403f",
  "#f3cce1",
  "#ff5722",
  "#c6ff00",
  "#7986cb",
  "#3d5afe",
];
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
  language: language,
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
  colors,
  language: language === "persian" ? languages[0] : languages[1],
};
