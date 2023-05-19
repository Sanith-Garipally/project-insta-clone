import {Switch, Route} from 'react-router-dom'
import Login from './components/Login'
import './App.css'

const App = () => (
  <div className="responsive-container">
    <Switch>
      <Route exact path="/login" component={Login} />
    </Switch>
  </div>
)

export default App
