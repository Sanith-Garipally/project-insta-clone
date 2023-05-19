import Loader from 'react-loader-spinner'
import {TiWarningOutline} from 'react-icons/ti'
import {Component} from 'react'
import Header from '../Header'
import StorySlider from '../StorySlider'
import {httpOptions} from '../../utils/getHttpOptions'
import PostItem from '../PostItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    posts: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getPosts()
  }

  getPosts = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiUrl = 'https://apis.ccbp.in/insta-share/posts'

    const response = await fetch(apiUrl, httpOptions())

    if (response.ok) {
      const data = await response.json()
      this.onPostsApiSuccess(data.posts)
    } else {
      this.onPostsApiFailure()
    }
  }

  onPostsApiSuccess = postsData => {
    const formattedData = postsData.map(post => {
      const formattedPostDetails = {
        imageUrl: post.post_details.image_url,
        caption: post.post_details.caption,
      }

      const formattedComments = post.comments.map(object => ({
        userId: object.user_id,
        username: object.user_name,
        comment: object.comment,
      }))

      return {
        postId: post.post_id,
        userId: post.user_id,
        username: post.user_name,
        profilePic: post.profile_pic,
        postDetails: formattedPostDetails,
        likesCount: post.likes_count,
        comments: formattedComments,
        createdAt: post.created_at,
        isLiked: false,
      }
    })
    this.setState({
      posts: formattedData,
      apiStatus: apiStatusConstants.success,
    })
  }

  onPostsApiFailure = () => {
    this.setState({
      apiStatus: apiStatusConstants.failure,
    })
  }

  handleLikeUnlikeApi = async (id, body) => {
    const authHeader = httpOptions('POST')
    const headers = {
      ...authHeader,
      body,
    }
    const likeApi = `https://apis.ccbp.in/insta-share/posts/${id}/like`
    const response = await fetch(likeApi, headers)
    const data = await response.json()
    return data.message
  }

  handleLikePost = async id => {
    const body = {
      like_status: true,
    }
    const apiResponse = await this.handleLikeUnlikeApi(id, JSON.stringify(body))
    console.log(apiResponse)
    const {posts} = this.state
    const updatedPosts = posts.map(object => {
      if (object.postId === id) {
        return {
          ...object,
          isLiked: true,
          likesCount: object.likesCount + 1,
        }
      }
      return object
    })

    this.setState({
      posts: updatedPosts,
    })
  }

  handleUnLikePost = async id => {
    const body = {
      like_status: false,
    }
    const apiResponse = await this.handleLikeUnlikeApi(id, JSON.stringify(body))
    console.log(apiResponse)
    const {posts} = this.state
    const updatedPosts = posts.map(object => {
      if (object.postId === id) {
        return {
          ...object,
          isLiked: false,
          likesCount: object.likesCount - 1,
        }
      }
      return object
    })
    this.setState({
      posts: updatedPosts,
    })
  }

  renderHomeLoader = () => (
    // eslint-disable-next-line react/no-unknown-property
    <div className="home-loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderPostsSuccess = () => {
    const {posts} = this.state
    return (
      <div className="home-content-container">
        {posts.map(object => (
          <PostItem
            handleLikePost={this.handleLikePost}
            handleUnLikePost={this.handleUnLikePost}
            key={object.postId}
            item={object}
          />
        ))}
      </div>
    )
  }

  renderPostsFailure = () => (
    <div className="pf-container">
      <TiWarningOutline className="pf-icon" />
      <h1 className="pf-head">Something went wrong. Please try again.</h1>
      <button onClick={this.getPosts} className="pf-btn" type="button">
        Try again
      </button>
    </div>
  )

  render() {
    const {apiStatus} = this.state
    return (
      <>
        <Header />
        <StorySlider />
        <div className="home-container">
          {(() => {
            switch (apiStatus) {
              case apiStatusConstants.inProgress:
                return this.renderHomeLoader()

              case apiStatusConstants.success:
                return this.renderPostsSuccess()

              case apiStatusConstants.failure:
                return this.renderPostsFailure()
              default:
                return null
            }
          })()}
        </div>
      </>
    )
  }
}

export default Home
