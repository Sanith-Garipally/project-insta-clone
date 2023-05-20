import './index.css'

const Posts = props => {
  const {isUser, item} = props
  const {image} = item

  return (
    <li className="post-img-item">
      <img
        className="post-img"
        alt={isUser === 'true' ? 'user post' : 'my post'}
        src={image}
      />
    </li>
  )
}

export default Posts
