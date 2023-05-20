import Loader from 'react-loader-spinner'
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
    searchResults: [],
    searchText: '',
    apiStatus: apiStatusConstants.initial,
    searchApiStatus: apiStatusConstants.initial,
    isSearchActive: false,
  }

  componentDidMount() {
    this.getPosts()
  }

  // below function will trigger from Header
  getSearchResults = async () => {
    const {searchText} = this.state
    this.setState({
      searchApiStatus: apiStatusConstants.inProgress,
      isSearchActive: searchText.length > 0,
    })
    const apiUrl = `https://apis.ccbp.in/insta-share/posts?search=${searchText}`

    const response = await fetch(apiUrl, httpOptions())

    if (response.ok) {
      const data = await response.json()
      this.onSearchApiSuccess(data.posts)
    } else {
      this.onSearchApiFailure()
    }
  }

  handleSearchValue = value => {
    this.setState({
      searchText: value,
    })
  }

  getPosts = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
      isSearchActive: false,
    })
    const apiUrl = 'https://apis.ccbp.in/insta-share/posts'

    const response = await fetch(apiUrl, httpOptions())

    if (response.ok) {
      const data = await response.json()
      this.onPostsApiSuccess(data.posts)
    } else {
      this.onPostsApiFailure()
    }
  }

  getFormattedData = postsData => {
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

    return formattedData
  }

  onPostsApiSuccess = data => {
    const updatedData = this.getFormattedData(data)
    this.setState({
      posts: updatedData,
      apiStatus: apiStatusConstants.success,
    })
  }

  onPostsApiFailure = () => {
    this.setState({
      apiStatus: apiStatusConstants.failure,
    })
  }

  onSearchApiSuccess = data => {
    const updatedData = this.getFormattedData(data)
    this.setState({
      searchResults: updatedData,
      searchApiStatus: apiStatusConstants.success,
    })
  }

  onSearchApiFailure = () => {
    this.setState({
      searchApiStatus: apiStatusConstants.failure,
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

  handleLikePostForSearch = async id => {
    const body = {
      like_status: true,
    }
    const apiResponse = await this.handleLikeUnlikeApi(id, JSON.stringify(body))
    console.log(apiResponse)
    const {searchResults} = this.state
    const updatedPosts = searchResults.map(object => {
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
      searchResults: updatedPosts,
    })
  }

  handleUnLikePostForSearch = async id => {
    const body = {
      like_status: false,
    }
    const apiResponse = await this.handleLikeUnlikeApi(id, JSON.stringify(body))
    console.log(apiResponse)
    const {searchResults} = this.state
    const updatedPosts = searchResults.map(object => {
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
      searchResults: updatedPosts,
    })
  }

  renderHomeLoader = () => (
    // eslint-disable-next-line react/no-unknown-property
    <div className="home-loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderSearchLoader = () => (
    // eslint-disable-next-line react/no-unknown-property
    <div className="search-loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderPostsSuccess = () => {
    const {posts} = this.state
    return (
      <div className="home-content-container">
        <div className="home-content-wrapper">
          {posts.map(object => (
            <PostItem
              handleLikePost={this.handleLikePost}
              handleUnLikePost={this.handleUnLikePost}
              key={object.postId}
              item={object}
            />
          ))}
        </div>
      </div>
    )
  }

  renderNoSearchResults = () => (
    <div className="no-sr-container">
      <img
        className="no-sr-img"
        alt="search not found"
        src="https://res.cloudinary.com/dqjlpg7ra/image/upload/v1684555672/mini-project-insta/search-failure_f1edbf.svg"
      />
      <h1 className="no-sr-head">Search Not Found</h1>
      <p className="no-sr-para">Try different keyword or search again</p>
    </div>
  )

  renderSearchResults = () => {
    const {searchResults} = this.state

    return (
      <div className="home-content-container">
        <div className="search-head-container">
          <h1 className="search-head">Search Results</h1>
        </div>
        <div className="search-container">
          {searchResults.map(object => (
            <PostItem
              handleLikePost={this.handleLikePostForSearch}
              handleUnLikePost={this.handleUnLikePostForSearch}
              key={object.postId}
              item={object}
            />
          ))}
        </div>
      </div>
    )
  }

  renderSearchSuccess = () => {
    const {searchResults} = this.state
    if (searchResults.length === 0) {
      return this.renderNoSearchResults()
    }
    if (searchResults !== 0) {
      return this.renderSearchResults()
    }
    return null
  }

  renderPostsFailure = () => (
    <div className="pf-container">
      <img
        className="posts-failure-img"
        alt="failure view"
        src="https://res.cloudinary.com/dqjlpg7ra/image/upload/v1684553181/mini-project-insta/failure-api_upzdpn.svg"
      />
      <p className="pf-head">Something went wrong. Please try again.</p>
      <button onClick={this.getPosts} className="pf-btn" type="button">
        Try again
      </button>
    </div>
  )

  renderSearchFailure = () => (
    <div className="sf-container">
      <img
        className="sf-image"
        alt="failure view"
        src="https://res.cloudinary.com/dqjlpg7ra/image/upload/v1684553181/mini-project-insta/failure-api_upzdpn.svg"
      />
      <p className="pf-head">Something went wrong. Please try again.</p>
      <button onClick={this.getSearchResults} className="pf-btn" type="button">
        Try again
      </button>
    </div>
  )

  render() {
    const {apiStatus, isSearchActive, searchApiStatus, searchText} = this.state
    return (
      <>
        <Header
          getSearchResults={this.getSearchResults}
          searchText={searchText}
          handleSearchValue={this.handleSearchValue}
        />
        {isSearchActive ? (
          <div className="home-container">
            {(() => {
              switch (searchApiStatus) {
                case apiStatusConstants.inProgress:
                  return this.renderSearchLoader()

                case apiStatusConstants.success:
                  return this.renderSearchSuccess()

                case apiStatusConstants.failure:
                  return this.renderSearchFailure()
                default:
                  return null
              }
            })()}
          </div>
        ) : (
          <>
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
        )}
      </>
    )
  }
}

export default Home
