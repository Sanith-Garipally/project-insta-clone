import {Component} from 'react'
import {AiOutlineTable} from 'react-icons/ai'
import {httpOptions} from '../../utils/getHttpOptions'
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

    const response = await fetch(profileUrl, httpOptions())

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

  render() {
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
              <p className="ud-username">{username}</p>
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
              <Stories isUser={isUser} key={object.id} item={object} />
            ))}
          </ul>
        </div>
        <div className="profile-hr-container">
          <hr className="profile-hr" />
        </div>
        <div className="user-posts-container">
          <div className="up-heading-container">
            <div className="wrapper-up-header">
              <AiOutlineTable className="posts-icon" />
              <h1 className="posts-heading">Posts</h1>
            </div>
          </div>
          <ul className="up-list-container">
            {userPosts.map(object => (
              <Posts key={object.id} isUser={isUser} item={object} />
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

export default Profile
