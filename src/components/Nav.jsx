import { Link } from 'react-router-dom'
import './Nav.css'

function Nav() {
    return (
        <nav className="navbar navbar-expand-lg bg-success text-dark">

            <Link className="navbar-brand text-dark" style={{fontFamily : "Lobster" , fontSize:"30px"}} to='/home'>EchoGive</Link>
            <button
                className="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse " id="navbarSupportedContent">
                <ul className="navbar-nav ms-auto navbar-nav-spacing">
                    <li  className="nav-item" >
                        <Link  className='nav-item' to='/'>Home</Link>
                    </li>
                    <li className="nav-item">
                    <Link className='nav-item' to="/form">Donate Items</Link>
                    </li>
                    <li className="nav-item">
                    <Link  className='nav-item '>My Doantions</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Nav;