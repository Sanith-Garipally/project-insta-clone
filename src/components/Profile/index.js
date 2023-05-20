/* eslint-disable react/no-unknown-property */
import Loader from 'react-loader-spinner'
import {Component} from 'react'
import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'
import Cookies from 'js-cookie'
import Stories from '../Stories'
import Posts from '../Posts'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Profile extends Component {
  state = {
    userDetails: {},
    userPosts: [],
    userStories: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getUserProfile()
  }

  getUserProfile = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {profileUrl, isUser} = this.props
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(profileUrl, options)

    if (response.ok) {
      const data = await response.json()
      this.onUserProfileApiSuccess(
        isUser === 'true' ? data.user_details : data.profile,
      )
    } else {
      this.onUserProfileApiFailure()
    }
  }

  onUserProfileApiSuccess = userData => {
    const formattedUserData = {
      id: userData.id,
      userId: userData.user_id,
      username: userData.user_name,
      profilePic: userData.profile_pic,
      followersCount: userData.followers_count,
      followingCount: userData.following_count,
      userBio: userData.user_bio,
      postsCount: userData.posts_count,
    }

    this.setState({
      userDetails: formattedUserData,
      userPosts: userData.posts,
      userStories: userData.stories,
      apiStatus: apiStatusConstants.success,
    })
  }

  onUserProfileApiFailure = () => {
    this.setState({
      apiStatus: apiStatusConstants.failure,
    })
  }

  renderProfileLoader = () => (
    <div className="profile-loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderProfileFailure = () => (
    <div className="p-container">
      <img
        className="p-img"
        alt="failure view"
        src="https://res.cloudinary.com/dqjlpg7ra/image/upload/v1684553181/mini-project-insta/failure-api_upzdpn.svg"
      />
      <p className="p-head">Something went wrong. Please try again.</p>
      <button onClick={this.getUserProfile} className="p-btn" type="button">
        Try again
      </button>
    </div>
  )

  renderProfile = () => {
    //   The below property helps to render user and my profile details route
    const {isUser} = this.props
    const {userDetails, userPosts, userStories} = this.state
    const {
      userId,
      username,
      profilePic,
      followersCount,
      followingCount,
      userBio,
      postsCount,
    } = userDetails

    return (
      <div className="user-profile-container">
        <div className="profile-content-container">
          <div className="user-details-container">
            <img
              className="ud-profile-pic-lg"
              alt={isUser === 'true' ? 'user profile' : 'my profile'}
              src={profilePic}
            />
            <div className="wrapper-user-usfb-container">
              <h1 className="ud-username">{username}</h1>
              <div className="ff-container">
                <img
                  className="ud-profile-pic"
                  alt={isUser === 'true' ? 'user profile' : 'my profile'}
                  src={profilePic}
                />
                <div className="posts-ff-count-container">
                  <p className="pcff-value">{postsCount}</p>
                  <p className="pcff-label">posts</p>
                </div>
                <div className="posts-ff-count-container">
                  <p className="pcff-value">{followersCount}</p>
                  <p className="pcff-label">followers</p>
                </div>
                <div className="posts-ff-count-container">
                  <p className="pcff-value">{followingCount}</p>
                  <p className="pcff-label">following</p>
                </div>
              </div>
              <div className="bio-container">
                <p className="bio-userId">{userId}</p>
                <p className="bio-user-bio">{userBio}</p>
              </div>
            </div>
          </div>
          {/* Stories */}
        </div>
        <div className="wrapper-stories-list">
          <ul className="stories-list-container">
            {userStories.map(object => (
              <Stories key={object.id} isUser={isUser} item={object} />
            ))}
          </ul>
        </div>
        <div className="profile-hr-container">
          <hr className="profile-hr" />
        </div>
        <div className="user-posts-container">
          <div className="up-heading-container">
            <div className="wrapper-up-header">
              <BsGrid3X3 className="posts-icon" />
              <h1 className="posts-heading">Posts</h1>
            </div>
          </div>
          <ul className="up-list-container">
            {userPosts.length !== 0 ? (
              userPosts.map(object => (
                <Posts key={object.id} isUser={isUser} item={object} />
              ))
            ) : (
              <div className="no-post-container">
                <div className="camera-container">
                  <BiCamera className="camera-icon" />
                </div>
                <h1 className="no-posts-para">No Posts Yet</h1>
              </div>
            )}
          </ul>
        </div>
      </div>
    )
  }

  render() {
    const {apiStatus} = this.state
    return (
      <>
        {(() => {
          switch (apiStatus) {
            case apiStatusConstants.inProgress:
              return this.renderProfileLoader()

            case apiStatusConstants.success:
              return this.renderProfile()

            case apiStatusConstants.failure:
              return this.renderProfileFailure()
            default:
              return null
          }
        })()}
      </>
    )
  }
}

export default Profile
