import React, { useState, useEffect, useRef } from 'react'
import Map from '../../Components/Map/Map'
import './AllBusLocations.scss'
import Ripples from 'react-ripples'
import Select from 'react-select'
import { IoMdPin } from "react-icons/io";
import moment from 'jalali-moment'
const AllBusLocations = () => {
    // const ws = new WebSocket('ws://193.176.241.150:8080/tms/websocket/getAllBusLocations')
    const [markers, setMarkers] = useState([])
    const [mapCenter, setMapCenter] = useState([32.634349845364056, 51.55693869732796])
    const [mapZoom, setMapZoom] = useState(11)
    const [busOptions, setBusOptions] = useState([])
    const [selectedBusOptions, setSelectedBusOptions] = useState([])
    const [selectedBusOptionsString, setSelectedBusOptionsString] = useState([])
    const [pinnedMarkers, setPinnedMarkers] = useState([])
    const [selectedMarker, setSelectedMarker] = useState([])
    const [isPaused, setPause] = useState(false);
    const [ws, setWs] = useState(null);

    const actionMenuRef = useRef()
    const searchBoxRef = useRef()
    const overviewBoxRef = useRef()
    const actionMenuHeaderRef = useRef()
    useEffect(() => {
        const wsClient = new WebSocket('ws://193.176.241.150:8080/tms/websocket/getAllBusLocations');
        wsClient.onopen = () => {
            console.log('ws opened');
            setWs(wsClient);
        };
        wsClient.onclose = () => console.log('ws closed');

        return () => {
            wsClient.close();
        }
    }, []);

    useEffect(() => {
        if (!ws) return;
        var isFirstMessageReceived = false;
        ws.onmessage = e => {
            if (isPaused) return;
            const message = JSON.parse(e.data);
            console.log('e', message);
            // listen to data sent from the websocket server
            // this.setState({dataFromServer: message})
            setMarkers(message.payload)
            console.log(message.payload)
            const busTempOptions = message.payload.map((item, index) => {
                return {
                    value: item.busCode,
                    label: item.busCode
                }
            })

            setBusOptions(busTempOptions)
            console.log('pinnd', pinnedMarkers)
            if (isFirstMessageReceived === false) {
                setSelectedBusOptions(busTempOptions)
                var tempArr = []
                busTempOptions.map(item => {
                    tempArr.push(item.value)
                })
                setSelectedBusOptionsString(tempArr)
                isFirstMessageReceived = true
            }

        };
    }, [isPaused, ws]);

    // useEffect(() => {
    //     ws.onopen = () => {
    //         // on connecting, do nothing but log it to the console
    //         console.log('connected')
    //     }
    //     var isFirstMessageReceived = false;
    //     ws.onmessage = evt => {
    //         // listen to data sent from the websocket server
    //         const message = JSON.parse(evt.data)
    //         // this.setState({dataFromServer: message})
    //         setMarkers(message.payload)
    //         console.log(message.payload)
    //         const busTempOptions = message.payload.map((item, index) => {
    //             return {
    //                 value: item.busCode,
    //                 label: item.busCode
    //             }
    //         })

    //         setBusOptions(busTempOptions)
    //         console.log('pinnd',pinnedMarkers)
    //         if (isFirstMessageReceived === false) {

    //             setSelectedBusOptions(busTempOptions)
    //             var tempArr = []
    //             busTempOptions.map(item => {
    //                 tempArr.push(item.value)
    //             })
    //             setSelectedBusOptionsString(tempArr)
    //             isFirstMessageReceived = true
    //         }
    //     }
    // }, [ws.onmessage, ws.onopen]);
    // useEffect(() => {

    //     return () => {
    //         ws.close()
    //     };
    // }, []);

    const onBusDetailClick = (bus) => {
        setMapZoom(14)
        setMapCenter([bus.latitude, bus.longitude])
    }
    const onPinButtonClick = (id) => {
        if (pinnedMarkers.includes(id)) {
            setPinnedMarkers(pinnedMarkers.filter(item => item !== id))
        } else {
            setPinnedMarkers([...pinnedMarkers, id])
        }
    }
    const getMarkers = () => {
        const filteredMarkers = markers.filter(item => selectedBusOptionsString.includes(item.busCode));
        const markersWithIsPinned = filteredMarkers.map(marker => {
            return {
                ...marker,
                isPinned: pinnedMarkers.includes(marker.busCode)
            }
        })
        console.log('markersWithIsPinned', markersWithIsPinned)
        return markersWithIsPinned
    }
    const onMarkerClick = (id,index) => {
        setSelectedMarker(id)
        console.log('sss', actionMenuHeaderRef.current.offsetHeight)
        actionMenuRef.current.scrollTo(0, actionMenuHeaderRef.current.offsetHeight * index -100,{behavior: 'smooth'})
    }
    return (
        <section className="all-bus-locations-container">
            <div className="map-contianer">
                <Map onMarkerClick={(id,index) => onMarkerClick(id,index)} markers={getMarkers()} center={mapCenter} zoom={mapZoom} />
            </div>
            <div ref={actionMenuRef} className="action-menu" >
                <div ref={actionMenuHeaderRef}>
                <Select ref={searchBoxRef} value={selectedBusOptions} onChange={(selectedBuses) => {
                    setSelectedBusOptions(selectedBuses);
                    var tempArr = []
                    if (selectedBuses !== null) {
                        selectedBuses.map(item => {
                            tempArr.push(item.value)
                        })
                    }
                    console.log(tempArr)
                    setSelectedBusOptionsString(tempArr)
                }}
                    className="bus-select-input" closeMenuOnSelect={false} isMulti={true} options={busOptions} isRtl={true} />
             
                {(markers.length > 0) ?
                    <div ref={overviewBoxRef} className="overview-container">
                        <table>
                            <tbody>
                                <tr>
                                    <td >
                                        تعداد کل اتوبوس ها:
                                        </td>
                                    <td >
                                        {markers.length + 1}
                                    </td>
                                </tr>
                                <tr >
                                    <td >
                                        <td >
                                            اتوبوس های فعال:
                                        </td>
                                        <td >
                                            {markers.filter(item => item.active === true).length + 1}
                                        </td>
                                    </td>
                                    <td>
                                        <td >
                                            اتوبوس های غیر فعال:
                                        </td>
                                        <td >
                                            {markers.filter(item => item.active === false).length + 1}
                                        </td>
                                    </td>
                                </tr>
                                <tr >
                                    <td >
                                        <td>
                                            اتوبوس های شاغل :
                                        </td>
                                        <td>
                                            {markers.filter(item => item.busy === true).length + 1}
                                        </td>
                                    </td>
                                    <td>
                                        <td>
                                            اتوبوس های غیر شاغل :
                                        </td>
                                        <td >
                                            {markers.filter(item => item.busy === false).length + 1}
                                        </td>
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                    :
                    ''}
</div>
                <div className="bus-detail-container">

                    {markers.map(bus => {
                        return (
                            (selectedBusOptionsString.includes(bus.busCode)) ?
                                <Ripples key={bus.busCode} onClick={() => { onBusDetailClick(bus); }}>
                                    <table className={(selectedMarker === (bus.busCode) ? "selected" : "")}>
                                        <tbody>
                                            <tr>
                                                <td >
                                                    <td >
                                                        کد اتوبوس :
                                            </td>
                                                    <td >
                                                        {bus.busCode}
                                                    </td>
                                                </td>
                                                <td>
                                                    <td>
                                                        سرعت لحظه ای :
                                            </td>
                                                    <td>
                                                        {`${bus.groundSpeed}km`}
                                                        <div className={`pin-btn ${(pinnedMarkers.includes(bus.busCode)) ? 'active' : ''}`} onClick={() => onPinButtonClick(bus.busCode)}><IoMdPin /></div>
                                                    </td>
                                                </td>
                                            </tr>
                                            <tr >
                                                <td >
                                                    <td >
                                                        شاغل/غیر شاغل:
                                            </td>
                                                    <td >
                                                        {(bus.busy) ? "شاغل" : "غیر شاغل"}
                                                    </td>
                                                </td>
                                                <td>
                                                    <td >
                                                        فعال/غیر فعال :
                                            </td>
                                                    <td >
                                                        {(bus.busy) ? "فعال" : "غیر فعال"}

                                                    </td>
                                                </td>
                                            </tr>
                                            <tr >
                                                <td >
                                                    <td>
                                                        نوع سوخت:
                                            </td>
                                                    <td>
                                                        {bus.fuelType}
                                                    </td>
                                                </td>
                                                <td>
                                                    <td>
                                                        وضعیت اتوبوس :
                                            </td>
                                                    <td >
                                                        {bus.busStatus}
                                                    </td>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <td >
                                                        کد خط :
                                            </td>
                                                    <td >
                                                        {bus.tripCode}
                                                    </td>
                                                </td>
                                                <td>
                                                    <td >
                                                        تعداد تراکنش ها :
                                            </td>
                                                    <td>
                                                        {bus.dcTransactionCount}
                                                    </td>
                                                </td>
                                            </tr>
                                            <tr >
                                                <td >
                                                    <td>
                                                        تراکنش های در جلو :
                                            </td>
                                                    <td >
                                                        {bus.frontDoorTransactionCount}
                                                    </td>
                                                </td>
                                                <td className="col">
                                                    <td >
                                                        تراکنش های در عقب :
                                            </td>
                                                    <td>
                                                        {bus.backDoorTransactionCount}
                                                    </td>
                                                </td>
                                            </tr>

                                            <tr >

                                                <td>
                                                    تاریخ :
                                            </td>
                                                <td style={{ direction: 'ltr', textAlign: 'right' }}>
                                                    {
                                                        moment.unix(parseInt(bus.clientDate).toString().substring(0, 10)).format('jYYYY/jM/jD HH:mm:ss')
                                                    }
                                                </td>

                                            </tr>
                                        </tbody>
                                    </table>
                                    {/* <div className="card">
                                    <div className="row">
                                        <div className="col">
                                            <div className="col">
                                                <div className="col">
                                                    کد اتوبوس :
                                            </div>
                                                <div className="col value">
                                                    {bus.busCode}
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="col">
                                                    سرعت لحظه ای :
                                            </div>
                                                <div className="col value">
                                                    {`${bus.groundSpeed}km`}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="col">
                                                <div className="col">
                                                    شاغل/غیر شاغل:
                                            </div>
                                                <div className="col value">
                                                    {(bus.busy) ? "شاغل" : "غیر شاغل"}
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="col">
                                                    فعال/غیر فعال :
                                            </div>
                                                <div className="col value">
                                                    {(bus.busy) ? "فعال" : "غیر فعال"}

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="col">
                                                <div className="col" style={{ flexBasis: "45%" }}>
                                                    نوع سوخت:
                                            </div>
                                                <div className="col value">
                                                    {bus.fuelType}
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="col">
                                                    وضعیت اتوبوس :
                                            </div>
                                                <div className="col value">
                                                    {bus.busStatus}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="col">
                                                <div className="col" style={{ flexBasis: "80%" }}>
                                                    کد خط :
                                            </div>
                                                <div className="col value">
                                                    {bus.tripCode}
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="col" style={{ flexBasis: "80%" }}>
                                                    تعداد تراکنش ها :
                                            </div>
                                                <div className="col value">
                                                    {bus.dcTransactionCount}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="col">
                                                <div className="col" style={{ flexBasis: "90%" }}>
                                                    تراکنش های در جلو :
                                            </div>
                                                <div className="col value">
                                                    {bus.frontDoorTransactionCount}
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="col" style={{ flexBasis: "90%" }}>
                                                    تراکنش های در عقب :
                                            </div>
                                                <div className="col value">
                                                    {bus.backDoorTransactionCount}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                </Ripples>
                                :
                                ''
                        )
                    })}

                </div>
            </div>
        </section>
    )
}

export default AllBusLocations
