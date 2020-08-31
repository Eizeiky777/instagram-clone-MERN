import React, { useReducer, useEffect, useContext,  createContext  } from 'react';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';

// Screens
import Home from './components/screens/Home';
import Login from './components/screens/Login';
import Profile from './components/screens/Profile';
import Signup from './components/screens/Signup';
import CreatePost from './components/screens/CreatePost';
import UserProfile from './components/screens/UserProfile';
import SubscribesUser from './components/screens/SubscribesUser';
import Reset from './components/screens/ResetPass';

// Reducer
import { reducer, initialState } from './reducers/userReducer';

export const UserContext = createContext()

const Routing = () => {
  const history = useHistory()
  const {dispatch} = useContext(UserContext)
  
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER", payload:user})
      
    }else{
      if(!history.location.pathname.startsWith('/reset')){
        history.push('/login')
      }
    }
  },[dispatch, history])
  return(
    <>
      <Switch>
        <Route exact path="/">
            <Home />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route 
            path="/signup" 
            component={Signup} 
          />
          <Route path="/reset">
            <Reset />
          </Route>
          <Route exact path="/profile">
            <Profile />
          </Route>
          <Route path="/profile/:userid">
            <UserProfile />
          </Route>
          <Route path="/createpost">
            <CreatePost />
          </Route>
          <Route path="/myfollowingpost">
            <SubscribesUser />
          </Route>
      </Switch>
    </>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer,initialState)
  return (
    <>
      <UserContext.Provider value={{state, dispatch}}>
        <BrowserRouter>
          <Navbar />
          <Routing />
        </BrowserRouter>
      </UserContext.Provider>
    </>
  );
}

export default App;
