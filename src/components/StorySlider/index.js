import Slider from 'react-slick'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {httpOptions} from '../../utils/getHttpOptions'
import './index.css'

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
}

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class StorySlider extends Component {
  state = {
    stories: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getStories()
  }

  getStories = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiUrl = 'https://apis.ccbp.in/insta-share/stories'
    const response = await fetch(apiUrl, httpOptions())

    if (response.ok) {
      const data = await response.json()
      this.onApiSuccess(data.users_stories)
    } else {
      this.onApiFailure()
    }
  }

  onApiSuccess = storyData => {
    const formattedData = storyData.map(object => ({
      userId: object.user_id,
      username: object.user_name,
      storyUrl: object.story_url,
    }))

    this.setState({
      stories: formattedData,
      apiStatus: apiStatusConstants.success,
    })
  }

  onApiFailure = () => {
    this.setState({
      apiStatus: apiStatusConstants.failure,
    })
  }

  renderSlider = storyData => (
    <Slider {...settings}>
      {storyData.map(eachStory => {
        const {userId, username, storyUrl} = eachStory
        return (
          <div className="slick-item" key={userId}>
            <img className="story-image" src={storyUrl} alt="user story" />
            <p className="story-user">{username}</p>
          </div>
        )
      })}
    </Slider>
  )

  renderStoryLoader = () => (
    // eslint-disable-next-line react/no-unknown-property
    <div className="story-loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={30} width={30} />
    </div>
  )

  renderStoryFailure = () => (
    <div className="rf-container">
      <img
        className="rf-img"
        alt="failure view"
        src="https://res.cloudinary.com/dqjlpg7ra/image/upload/v1684553181/mini-project-insta/failure-api_upzdpn.svg"
      />
      <p className="rf-head">Something went wrong. Please try again.</p>
      <button onClick={this.getStories} className="rf-btn" type="button">
        Try again
      </button>
    </div>
  )

  render() {
    const {stories, apiStatus} = this.state
    return (
      <>
        {(() => {
          switch (apiStatus) {
            case apiStatusConstants.inProgress:
              return this.renderStoryLoader()

            case apiStatusConstants.success:
              return (
                <div className="main-container">
                  <div className="slick-container">
                    {this.renderSlider(stories)}
                  </div>
                </div>
              )

            case apiStatusConstants.failure:
              return this.renderStoryFailure()
            default:
              return null
          }
        })()}

        <hr className="story-hr" />
      </>
    )
  }
}

export default StorySlider
