/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View,TextInput,AsyncStorage} from 'react-native';

const KEY='save_key'
type Props = {};
export default class AsyncStorageDemoPage extends Component<Props> {
    constructor(props){
        super(props)
        this.state={
            showText:'',
        }
    }

   async doSave(){
        //方法1
      AsyncStorage.setItem(KEY,this.value,error=>{
          error && console.log(error.toString())
      })
       // //方法2
       // AsyncStorage.setItem(KEY,this.value)
       //     .catch(error => {
       //         error && console.log(error.toString())
       //     })
       // //方法3
       // try{
       //     AsyncStorage.setItem(KEY,this.value)
       // }catch (error) {
       //     error && console.log(error.toString())
       // }
   }

    doRemove(){
        //方法1
        AsyncStorage.removeItem(KEY,error=>{
            error && console.log(error.toString())
        })
        // //方法2
        // AsyncStorage.removeItem(KEY)
        //     .catch(error => {
        //         error && console.log(error.toString())
        //     })
        // //方法3
        // try{
        //     AsyncStorage.removeItem(KEY)
        // }catch (error) {
        //     error && console.log(error.toString())
        // }
    }

   async getData(){
        AsyncStorage.getItem(KEY,(error,value)=>{
            this.setState({
                showText:value
            })
            console.log(value)
            error && console.log(error.toString())
        })
        //方法2
        // AsyncStorage.getItem(KEY)
        //     .then(value=>{
        //         this.setState({
        //             showText:value
        //         })
        //         console.log(value)
        //     })
        //     .catch(error => {
        //         error && console.log(error.toString())
        //     })
        // //方法3
        // try{
        //    const value=await AsyncStorage.getItem(KEY)
        //     this.setState({
        //         showText:value
        //     })
        //     console.log(value)
        // }catch (error) {
        //     error && console.log(error.toString())
        // }
    }

    render() {
        const {navigation} =this.props
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>AsyncStorage 使用</Text>
                    <TextInput
                        onChangeText={text=>{
                            this.value=text
                        }}
                        style={styles.input}/>
                <View style={styles.inputContainer}>
                    <Text onPress={()=>{
                        this.doSave()
                    }}>
                        存储
                    </Text>
                    <Text onPress={()=>{
                        this.doRemove()
                    }}>
                        删除
                    </Text>
                    <Text onPress={()=>{
                        this.getData()
                    }}>
                        获取
                    </Text>
                </View>
                <Text>
                    {this.state.showText}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    input:{
        height:30,
        width:250,
        borderColor:'blue',
        borderWidth: 1,
        marginRight: 10,
    },
    inputContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    }
});
