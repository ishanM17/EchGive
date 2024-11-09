import { Link } from 'react-router-dom'
import './Nav.css'
import main from '../img.png'

function Nav() {

    const scrollToForm = () => {
        const formPosition = document.getElementById('donation-form').offsetTop;
        window.scrollTo({
            top: formPosition,
            behavior: 'smooth',
        });
    }

    return (
        <div className="colored-section" id="title">
            <div class="container-fluid row">
                <div class="col-lg-6 pt-5">
                    <h1 className="big-heading text-light" to='/home'>EcoGive</h1>
                    <h1 className="small-heading pt-2">recycling kindness, one donation at a time</h1>
                    <button type='button' className="btn btn-outline-light btn-lg nav-btn" onClick={scrollToForm}>Donate Now!</button>
                </div>
                <div class="col-lg-6 title-img-container">
                    <img src={main} alt="" />
                </div>
            </div>
        </div>

    );
}

export default Nav;