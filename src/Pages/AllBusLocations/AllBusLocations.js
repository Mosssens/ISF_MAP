import React, { useState, useEffect } from 'react'
import Map from '../../Components/Map/Map'
import './AllBusLocations.scss'
import Ripples from 'react-ripples'

const AllBusLocations = () => {
    const ws = new WebSocket('ws://77.237.74.40:4546/tms/websocket/getAllBusLocations')
    const [markers, setMarkers] = useState([])
    const [mapCenter, setMapCenter] = useState([35.7077191, 51.209391])
    const [mapZoom, setMapZoom] = useState(10)

    useEffect(() => {
        ws.onopen = () => {
            // on connecting, do nothing but log it to the console
            console.log('connected')
        }
        ws.onmessage = evt => {
            // listen to data sent from the websocket server
            const message = JSON.parse(evt.data)
            // this.setState({dataFromServer: message})
            console.log(message)
            setMarkers(message.payload)

        }
    }, [ws.onmessage, ws.onopen]);
    useEffect(() => {
        return () => {
          ws.close()
        };
      }, []);
    const onBusDetailClick = (bus) => {
        setMapZoom(14)
        setMapCenter([bus.latitude, bus.longitude])
    }
    return (
        <section className="all-bus-locations-container">
            <div className="map-contianer">
                <Map onMarkerClick={(id) => console.log(id)} markers={markers} center={mapCenter} zoom={mapZoom} />
            </div>
            <div className="action-menu" >
                <div className="bus-detail-container">
                    {markers.map(bus => {
                        return (
                            <Ripples key={bus.busCode} onClick={() => { onBusDetailClick(bus) }}>
                                <div className="card">
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
                                </div>
                            </Ripples>
                        )
                    })}

                </div>
            </div>
        </section>
    )
}

export default AllBusLocations
