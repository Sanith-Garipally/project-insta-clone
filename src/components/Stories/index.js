import './index.css'

const Stories = props => {
  const {isUser, item} = props
  const {image} = item

  return (
    <li className="story-img-item">
      <img
        className="story-img"
        alt={isUser === 'true' ? 'user story' : 'my story'}
        src={image}
      />
    </li>
  )
}

export default Stories
