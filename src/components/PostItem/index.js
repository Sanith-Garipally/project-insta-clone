/* eslint-disable react/no-unknown-property */
import {Link} from 'react-router-dom'
import {BsHeart} from 'react-icons/bs'
import {FcLike} from 'react-icons/fc'
import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'
import './index.css'

const PostItem = props => {
  const {item, handleLikePost, handleUnLikePost} = props
  const {
    postId,
    userId,
    username,
    profilePic,
    postDetails,
    likesCount,
    comments,
    createdAt,
    isLiked,
  } = item
  const {imageUrl, caption} = postDetails
  const likePost = () => {
    handleLikePost(postId)
  }
  const unLikePost = () => {
    handleUnLikePost(postId)
  }
  return (
    <div className="post-container">
      <div className="profile-container">
        <div className="user-img-container">
          <div className="wrapper-user-img">
            <img
              className="user-img"
              alt="post author profile"
              src={profilePic}
            />
          </div>
        </div>
        <Link className="link" to={`/users/${userId}`}>
          <h1 className="user-username">{username}</h1>
        </Link>
      </div>

      <div className="post-img-container">
        <img className="post-img" alt="post" src={imageUrl} />
      </div>

      <div className="post-details-container">
        <div className="post-rxn-container">
          {isLiked ? (
            <button
              onClick={unLikePost}
              testid="unLikeIcon"
              className="rxn-btn"
              type="button"
            >
              <FcLike className="rxn-icon" />
            </button>
          ) : (
            <button
              onClick={likePost}
              testid="likeIcon"
              className="rxn-btn"
              type="button"
            >
              <BsHeart className="rxn-icon" />
            </button>
          )}

          <button className="rxn-btn" type="button">
            <FaRegComment className="rxn-icon" />
          </button>
          <button className="rxn-btn" type="button">
            <BiShareAlt className="rxn-icon" />
          </button>
        </div>
        <p className="likes-count">{likesCount} likes</p>
        <p className="caption">{caption}</p>

        <ul className="comments-container">
          {comments.map(object => (
            <li key={object.userId} className="comment-list-item">
              <p className="comment-username">
                {object.username}{' '}
                <span className="user-comment">{object.comment}</span>
              </p>
            </li>
          ))}
        </ul>
        <p className="created-at-para">{createdAt}</p>
      </div>
    </div>
  )
}

export default PostItem
