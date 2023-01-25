import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { store } from './app/store'
import { Provider } from 'react-redux'
import { extendUsersApiSlice} from './features/users/usersSlice'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { extendedApiSlice } from './features/posts/postsSlice'

store.dispatch(extendedApiSlice.endpoints.getPosts.initiate());
store.dispatch(extendUsersApiSlice.endpoints.getUsers.initiate());

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path='/*' element={<App />}/>
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>,
)
