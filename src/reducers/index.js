import { combineReducers, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import lottery from './lottery'

const app = combineReducers({
    lottery
})

export default function configureStore() {
  let store = createStore(app, applyMiddleware(thunk))
  return store
}