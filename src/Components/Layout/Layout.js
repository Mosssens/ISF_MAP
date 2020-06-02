import React from 'react'
import './Layout.scss'
import Ripples from 'react-ripples'
import { FaBus, FaPagelines, FaServicestack, FaAddressCard, FaSleigh } from 'react-icons/fa';

const Layout = (props) => {
    return (
        <section className="main-container">
            <section className="side-menu-right disable-select">
                <ul>
                    <Ripples>
                        <li className="active">
                            <div className="icon"><FaBus /></div>
                            <div className="title">آخرین وضعیت همه اتوبوس ها</div>
                        </li>
                    </Ripples>
                    <Ripples>
                        <li>
                            <div className="icon"><FaPagelines /></div>
                            <div className="title">وضعیت آنلاین اتوبوس های خط</div>
                        </li>
                    </Ripples>
                    <Ripples>
                        <li>
                            <div className="icon"><FaServicestack /></div>
                            <div className="title"> رهگیری اتوبوس</div>
                        </li>
                    </Ripples>
                    <Ripples>
                        <li>
                            <div className="icon"><FaAddressCard /></div>
                            <div className="title"> رهگیری اتوبوس های یک خط</div>
                        </li>
                    </Ripples>
                    <Ripples>
                        <li>
                            <div className="icon"><FaSleigh /></div>
                            <div className="title">  وضعیت شماتیک خط</div>
                        </li>
                    </Ripples>

                </ul>
            </section>
            <section className="child-container">
                {props.children}
            </section>
        </section>
    )
}

export default Layout
