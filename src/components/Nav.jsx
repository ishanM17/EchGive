import { Link } from 'react-router-dom'
import './Nav.css'
import main from '../img.png'

function Nav() {
    return (

        <div class="colored-section" id="title">
            <div class="container-fluid">
                <nav className="navbar navbar-expand-lg text-light">

                    <Link className="navbar-brand text-light" to='/home'>EchoGive</Link>
                    <button
                        className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse " id="navbarSupportedContent">

                    </div>
                </nav>
                <div class="row">
                    <div class="col-lg-6">
                        <h1 class="big-heading">Meet new and interesting dogs nearby.</h1>
                       
                    </div>
                    <div class="col-lg-6 title-img-container">
                        <img src={main}alt="" />
                    </div>
                </div>
            </div>

        </div>

    );
}

export default Nav;