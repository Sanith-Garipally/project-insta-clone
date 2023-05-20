/* eslint-disable react/no-unknown-property */
import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import {FaSearch} from 'react-icons/fa'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import {httpOptions} from '../../utils/getHttpOptions'
import PostItem from '../PostItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Search extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    posts: [],
    searchText: '',
    isSmSearchActive: false,
  }

  getSearchResults = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
      isSmSearchActive: true,
    })
    const {searchText} = this.state
    const api = `https://apis.ccbp.in/insta-share/posts?search=${searchText}`

    const response = await fetch(api, httpOptions())

    if (response.ok) {
      const data = await response.json()
      console.log(data)
      this.onSearchApiSuccess(data.posts)
    } else {
      this.onSearchApiFailure()
    }
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

  handleLikePostSm = async id => {
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

  handleUnLikePostSm = async id => {
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

  onSearchApiSuccess = postsData => {
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

  onSearchApiFailure = () => {
    this.setState({
      apiStatus: apiStatusConstants.failure,
    })
  }

  handleInputSearch = e => {
    this.setState({
      searchText: e.target.value,
    })
  }

  startSearch = () => {
    this.getSearchResults()
  }

  renderSearchPageForSmScreens = () => (
    <div className="sp-sc-landing-container">
      <div className="wrapper-sp-sc-container">
        <div className="search-landing-sm-screen">
          <BsSearch className="sc-sm-search-icon" />
          <p className="sc-search-para">Search Results will be appear here</p>
        </div>
      </div>
    </div>
  )

  renderSearchLoader = () => (
    // eslint-disable-next-line react/no-unknown-property
    <div className="search-loader-container-sm" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderNoSearchResultsSm = () => (
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

  renderSearchResultsSm = () => {
    const {posts} = this.state
    return (
      <div className="search-content-container-sm">
        {posts.map(object => (
          <PostItem
            handleLikePost={this.handleLikePostSm}
            handleUnLikePost={this.handleUnLikePostSm}
            key={object.postId}
            item={object}
          />
        ))}
      </div>
    )
  }

  renderSearchSuccess = () => {
    const {posts} = this.state
    if (posts.length === 0) {
      return this.renderNoSearchResultsSm()
    }
    if (posts !== 0) {
      return this.renderSearchResultsSm()
    }
    return null
  }

  renderSearchFailure = () => (
    <div className="sf-sm-container">
      <img
        className="sf-sm-image"
        alt="failure view"
        src="https://res.cloudinary.com/dqjlpg7ra/image/upload/v1684553181/mini-project-insta/failure-api_upzdpn.svg"
      />
      <p className="sf-head">Something went wrong. Please try again.</p>
      <button onClick={this.getSearchResults} className="sf-btn" type="button">
        Try again
      </button>
    </div>
  )

  render() {
    const {apiStatus, isSmSearchActive, searchText} = this.state
    return (
      <>
        <Header />
        <div className="sc-search-container">
          <div className="wrapper-sc-search-container">
            <input
              className="search-input-sm"
              type="search"
              placeholder="Search Caption"
              value={searchText}
              onChange={this.handleInputSearch}
            />
            <button
              onClick={this.startSearch}
              className="search-btn-sm"
              type="button"
              testid="searchIcon"
            >
              <FaSearch className="search-icon" />
            </button>
          </div>
        </div>
        {isSmSearchActive ? (
          <div className="search-container-sm">
            {(() => {
              switch (apiStatus) {
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
          this.renderSearchPageForSmScreens()
        )}
      </>
    )
  }
}

export default Search
