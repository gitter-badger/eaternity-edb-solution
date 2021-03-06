import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { Provider } from 'react-redux'
import { Router, hashHistory } from 'react-router'
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux'
import rootSaga from './store/sagas/sagas'
import routes from './routes'
import rootReducer from './store/reducers'
import './app.global.css'
import { injectTapEventPlugin } from 'react-tap-event-plugin'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

// Needed for onTouchTap for Material-UI
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()

const sagaMiddleware = createSagaMiddleware()

const devMiddleware = compose(
  applyMiddleware(
    sagaMiddleware,
    routerMiddleware(hashHistory)
  ),
  window.devToolsExtension ? window.devToolsExtension() : undefined
)

const prodMiddleware = compose(
  applyMiddleware(
    sagaMiddleware,
    routerMiddleware(hashHistory)
  )
)

// Remove redux dev tool Extension in production mode! I breaks the build!
const middleWare = process.env.NODE_ENV === 'development'
  ? devMiddleware
  : prodMiddleware

const store = createStore(rootReducer, {}, middleWare)
const history = syncHistoryWithStore(hashHistory, store)

// run all sagas
sagaMiddleware.run(rootSaga)

ReactDOM.render(
  <MuiThemeProvider>
    <Provider store={store}>
      <Router history={history} routes={routes} />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
)
