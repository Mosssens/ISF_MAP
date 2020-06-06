import React, { useState, useEffect } from 'react'
import './Layout.scss'
import Ripples from 'react-ripples'
import { FaBus, FaPagelines, FaServicestack, FaAddressCard, FaSleigh, FaAngleRight, FaAngleLeft } from 'react-icons/fa';
import {
    Link
} from "react-router-dom";
import 'leaflet/dist/leaflet.css'
const Layout = (props) => {

    const [lastUrlPath, setLastUrlPath] = useState(window.location.pathname.split("/").pop())
    const onItemClicked = () => {
        setLastUrlPath(window.location.pathname.split("/").pop())
    }
    const [isMenuCollapsed, setIsMenuCollapsed] = useState(true);
    return (
        <section className="main-container">
            <section className={`side-menu-right disable-select ${(isMenuCollapsed) ? "collapse" : ""}`}>

                <div className="menu-header">
                    <img src="/logo.png" />
                    <h4>سامانه یکپارچه مدیریت</h4>
                    <h5>پرداخت الکترونیک و مدیریت ناوگان</h5>
                </div>
                <ul>
                    <Ripples onClick={onItemClicked} >
                        <Link to="AllBusLocations">
                            <li className={(lastUrlPath === "AllBusLocations") ? "active" : ""}>
                                <div className="icon"><FaBus /></div>
                                <div className="title">آخرین وضعیت همه اتوبوس ها</div>
                            </li>
                        </Link>
                    </Ripples>
                    <Ripples onClick={onItemClicked} >
                        <li className={(lastUrlPath === "2") ? "active" : ""}>
                            <div className="icon"><FaPagelines /></div>
                            <div className="title">وضعیت آنلاین اتوبوس های خط</div>
                        </li>
                    </Ripples>
                    <Ripples onClick={onItemClicked} >
                        <li className={(lastUrlPath === "3") ? "active" : ""}>
                            <div className="icon"><FaServicestack /></div>
                            <div className="title"> رهگیری اتوبوس</div>
                        </li>
                    </Ripples>
                    <Ripples onClick={onItemClicked} >
                        <Link to="/about">
                            <li className={(lastUrlPath === "about") ? "active" : ""}>
                                <div className="icon"><FaAddressCard /></div>
                                <div className="title"> رهگیری اتوبوس های یک خط</div>
                            </li>
                        </Link>
                    </Ripples>

                    <Ripples onClick={onItemClicked} >
                        <Link to="/SchematicTripState">
                            <li className={(lastUrlPath === "SchematicTripState") ? "active" : ""}>
                                <div className="icon"><FaSleigh /></div>
                                <div className="title">  وضعیت شماتیک خط</div>
                            </li>
                        </Link>
                    </Ripples>

                </ul>
                <div className="gap"></div>
                <div className="collapse-btn" onClick={()=>setIsMenuCollapsed(!isMenuCollapsed)}>
                    {(isMenuCollapsed) ? <FaAngleLeft /> : <FaAngleRight />}
                </div>
            </section>
            <section className="child-container">
                {props.children}
            </section>
        </section>
    )
}

export default Layout
