/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View} from 'react-native';
import actions from "../action";
import {connect} from "react-redux";


type Props = {};
class FavoritePage extends Component<Props> {
  render() {
    const {navigation}=this.props
    return (
      <View style={styles.container}>
         <Text style={styles.welcome}>FavoritePage</Text>
        <Button
            title={'改变主题颜色'}
            onPress={()=>{
              // navigation.setParams({
              //   theme:{
              //     activeTintColor:'green',
              //     // inactiveTintColor:'grey',
              //     updateTime:new Date().getTime()
              //   }
              // })
                this.props.onThemeChange('red')
            }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
const mapStateToProps=state=>({

})
const mapDispatchToProps=dispatch=>({
    onThemeChange: theme=>dispatch(actions.onThemeChange(theme))
})
export default connect(mapStateToProps,mapDispatchToProps)(FavoritePage)