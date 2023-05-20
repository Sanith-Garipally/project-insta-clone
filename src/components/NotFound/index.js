import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <img
      className="not-found-img"
      alt="page not found"
      src="https://res.cloudinary.com/dqjlpg7ra/image/upload/v1684578048/mini-project-insta/not-found_cptzuu.svg"
    />
    <h1 className="not-found-head">Page Not Found</h1>
    <p className="not-found-para">
      we are sorry, the page you requested could not be found.
    </p>
    <p className="not-found-para">Please go back to the homepage.</p>
    <Link to="/" className="not-found-link">
      <button type="button" className="not-found-btn">
        Home Page
      </button>
    </Link>
  </div>
)

export default NotFound
