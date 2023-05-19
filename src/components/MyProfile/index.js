import Header from '../Header'
import Profile from '../Profile'

const MyProfile = () => {
  const apiUrl = 'https://apis.ccbp.in/insta-share/my-profile'
  return (
    <>
      <Header />
      <Profile isUser="false" profileUrl={apiUrl} />
    </>
  )
}

export default MyProfile
