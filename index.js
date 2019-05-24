/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import {AppRegistry} from 'react-native';
import React, {Component} from 'react';
import App from './App';
import {Provider} from 'react-redux'
import configureStore from './src/reducers'
import {name as appName} from './app.json';

const store = configureStore();

export default class ReduxApp extends Component{
    render() {
       return (
            <Provider store={store}>
                 <App/>
            </Provider>
       )
    }
}

AppRegistry.registerComponent(appName, () => ReduxApp);
