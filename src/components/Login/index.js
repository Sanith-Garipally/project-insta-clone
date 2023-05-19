import {Redirect} from 'react-router-dom'
import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    hasError: false,
    errMsg: '',
  }

  handleFormSubmit = async e => {
    e.preventDefault()
    const {username, password} = this.state
    const userDetails = {
      username,
      password,
    }

    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      this.handleApiSuccess(data.jwt_token)
    } else {
      this.handleApiFailure(data.error_msg)
    }
  }

  handleApiSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 7})
    history.replace('/')
  }

  handleApiFailure = errorMessage => {
    this.setState({
      hasError: true,
      errMsg: errorMessage,
    })
  }

  handleInputChange = e => {
    if (e.target.id === 'username') {
      this.setState({
        username: e.target.value,
      })
    } else {
      this.setState({
        password: e.target.value,
      })
    }
  }

  renderLoginPage = () => {
    const {username, password, hasError, errMsg} = this.state
    return (
      <div className="login-container">
        <div className="login-landing-container">
          <img
            className="landing-img"
            alt="website login"
            src="https://res.cloudinary.com/dqjlpg7ra/image/upload/v1684464554/mini-project-insta/login-img-lg_oy12tp.svg"
          />
        </div>
        <div className="login-content-container">
          <div className="logo-container">
            <img
              className="website-logo"
              alt="website logo"
              src="https://res.cloudinary.com/dqjlpg7ra/image/upload/v1684464779/mini-project-insta/insta-logo_eqys0l.svg"
            />
            <h1 className="website-name">Insta Share</h1>
          </div>
          <form className="login-form" onSubmit={this.handleFormSubmit}>
            <div className="form-item">
              <label htmlFor="username" className="input-label">
                USERNAME
              </label>
              <input
                className="input"
                onChange={this.handleInputChange}
                value={username}
                type="text"
                id="username"
                placeholder="Username"
              />
            </div>

            <div className="form-item">
              <label htmlFor="password" className="input-label">
                PASSWORD
              </label>
              <input
                className="input"
                onChange={this.handleInputChange}
                value={password}
                type="password"
                id="password"
                placeholder="Password"
              />
              {hasError && <p className="err-msg">{errMsg}</p>}
            </div>

            <div className="form-item">
              <button className="login-btn" type="submit">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  redirectUser = () => <Redirect to="/" />

  render() {
    const jwtToken = Cookies.get('jwt_token')

    return (
      <>
        {jwtToken !== undefined ? this.redirectUser() : this.renderLoginPage()}
      </>
    )
  }
}

export default Login
