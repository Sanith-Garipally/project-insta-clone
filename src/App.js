import {Switch, Route} from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import UserProfile from './components/UserProfile'
import MyProfile from './components/MyProfile'
import './App.css'

const App = () => (
  <div className="responsive-container">
    <Switch>
      <Route exact path="/login" component={Login} />
      <Route exact path="/" component={Home} />
      <Route exact path="/users/:id" component={UserProfile} />
      <Route exact path="/my-profile" component={MyProfile} />
    </Switch>
  </div>
)

export default App
