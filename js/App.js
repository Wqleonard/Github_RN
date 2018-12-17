

import React, {Component} from 'react';
// import {Platform, StyleSheet, Text, View} from 'react-native';
import {Provider} from 'react-redux'
import AppNavigator from './navigator/AppNavigators'
import store from './store'

type Props = {};
export default class App extends Component<Props> {
  render() {
    //将store
    return (
        <Provider store={store}>
           <AppNavigator/>
        </Provider>
    );
  }
}


