import Header from '../Header'
import Profile from '../Profile'
import './index.css'

const UserProfile = props => {
  const {match} = props
  const {params} = match
  const {id} = params
  const apiUrl = `https://apis.ccbp.in/insta-share/users/${id}`
  return (
    <>
      <Header />
      <Profile isUser="true" profileUrl={apiUrl} />
    </>
  )
}

export default UserProfile
