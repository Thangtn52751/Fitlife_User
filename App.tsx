import React from 'react'
import MainNav from './src/nav/MainNav';
import store from './src/redux/store';
import { Provider } from 'react-redux';
const App = () => {
  return (
    <Provider store={store}>
      <MainNav />
    </Provider>
  )
}

export default App
