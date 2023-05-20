/* eslint-disable react/no-unknown-property */
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {HiMenu} from 'react-icons/hi'
import {FaSearch} from 'react-icons/fa'
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

  onLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  handleInputSearch = e => {
    const {handleSearchValue} = this.props
    handleSearchValue(e.target.value)
  }

  startSearch = () => {
    const {getSearchResults} = this.props
    getSearchResults()
  }

  render() {
    const {location} = this.props
    const {pathname} = location
    const {showNavItemsSm} = this.state
    const {searchText} = this.props
    return (
      <div className="navbar">
        <div className="navbar-content-container">
          <>
            <div className="header-website-logo-container">
              <Link className="link-header" to="/">
                <img
                  className="header-website-logo"
                  alt="website logo"
                  src="https://res.cloudinary.com/dqjlpg7ra/image/upload/v1684464779/mini-project-insta/insta-logo_eqys0l.svg"
                />
              </Link>
              <h1 className="header-website-name">Insta Share</h1>
            </div>
            <button
              onClick={this.showSmNavItems}
              type="button"
              className="hamburger-menu-btn"
            >
              <HiMenu className="hamburger-menu" />
            </button>
          </>
          <ul className="nav-items-list-container-lg">
            <li className="list-item-input">
              <input
                className="search-input-lg"
                type="search"
                placeholder="Search Caption"
                value={searchText}
                onChange={this.handleInputSearch}
              />
              <button
                onClick={this.startSearch}
                className="search-btn"
                type="button"
                testid="searchIcon"
              >
                <FaSearch className="search-icon" />
              </button>
            </li>
            <Link className="link-header" to="/">
              <li
                className={`list-item-sm ${pathname === '/' && 'active-tab'}`}
              >
                Home
              </li>
            </Link>
            <Link className="link-header" to="/my-profile">
              <li
                className={`list-item-sm ${
                  pathname === '/my-profile' && 'active-tab'
                }`}
              >
                Profile
              </li>
            </Link>
            <li className="list-item-sm">
              <button
                onClick={this.onLogout}
                className="sm-login-btn"
                type="button"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
        {showNavItemsSm && (
          <ul className="nav-items-list-container-sm">
            <Link className="link-header" to="/">
              <li
                className={`list-item-sm ${pathname === '/' && 'active-tab'}`}
              >
                Home
              </li>
            </Link>
            <Link className="link-header" to="/search">
              <li
                className={`list-item-sm ${
                  pathname === '/search' && 'active-tab'
                }`}
              >
                Search
              </li>
            </Link>
            <Link className="link-header" to="/my-profile">
              <li
                className={`list-item-sm ${
                  pathname === '/my-profile' && 'active-tab'
                }`}
              >
                Profile
              </li>
            </Link>
            <li className="list-item-sm">
              <button
                onClick={this.onLogout}
                className="sm-login-btn"
                type="button"
              >
                Logout
              </button>
            </li>
            <li className="list-item-sm">
              <button
                onClick={this.closeSmNavItems}
                type="button"
                className="hamburger-menu-btn"
                testid="menu"
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

export default withRouter(Header)
