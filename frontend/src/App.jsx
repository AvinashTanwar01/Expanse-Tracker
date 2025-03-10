import { useState } from 'react'




import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Home from "./pages/Auth/Dashboard/Home";
import Income from "./pages/Auth/Dashboard/Income";
import Expense from "./pages/Auth/Dashboard/Expense";
import UserProivder from './context/UserContext';
import {Toaster} from 'react-hot-toast'; 

function App() {


  return (
    <UserProivder>
      <div>
        <Router>
          <Routes>
            <Route path='/' element={<Root />}/>
            <Route path="/login"  exact element={<Login />} />
            <Route path="/signup"  exact element={<Signup />} />
            <Route path="/dashboard"  exact element={<Home />} />
            <Route path="/income"  exact element={<Income />} />
            <Route path="/expense"  exact element={<Expense />} />
          </Routes>
        </Router>
      </div> 
      <Toaster 
        toastOptions={{
          className:"",
          style:{
            fontSize:'13px'
          },
        }}
      />
    </UserProivder>
  )
}

export default App;

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated?(
    <Navigate to="/dashboard"/>
  ):(
    <Navigate tp="/login"/>
  )
}
