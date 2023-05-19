import {Link} from 'react-router-dom'
import {HiMenu} from 'react-icons/hi'
import {AiFillCloseCircle} from 'react-icons/ai'
import {Component} from 'react'
import './index.css'

class Header extends Component {
  state = {
    showNavItemsSm: false,
  }

  showSmNavItems = () => {
    this.setState({
      showNavItemsSm: true,
    })
  }

  closeSmNavItems = () => {
    this.setState({
      showNavItemsSm: false,
    })
  }

  render() {
    const {showNavItemsSm} = this.state
    return (
      <div className="navbar">
        <div className="navbar-content-container">
          <div className="header-website-logo-container">
            <img
              className="header-website-logo"
              alt="header-website logo"
              src="https://res.cloudinary.com/dqjlpg7ra/image/upload/v1684464779/mini-project-insta/insta-logo_eqys0l.svg"
            />
            <h1 className="header-website-name">Insta Share</h1>
          </div>
          <button
            onClick={this.showSmNavItems}
            type="button"
            className="hamburger-menu-btn"
          >
            <HiMenu className="hamburger-menu" />
          </button>
        </div>
        {showNavItemsSm && (
          <ul className="nav-items-list-container-sm">
            <Link className="link-header" to="/">
              <li className="list-item-sm">Home</li>
            </Link>
            <li className="list-item-sm">Search</li>
            <Link className="link-header" to="/my-profile">
              <li className="list-item-sm">Profile</li>
            </Link>
            <li className="list-item-sm">
              <button className="sm-login-btn" type="button">
                Login
              </button>
            </li>
            <li className="list-item-sm">
              <button
                onClick={this.closeSmNavItems}
                type="button"
                className="hamburger-menu-btn"
              >
                <AiFillCloseCircle className="close-icon-sm" />
              </button>
            </li>
          </ul>
        )}
      </div>
    )
  }
}

export default Header
