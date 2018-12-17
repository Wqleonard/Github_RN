/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View,TextInput} from 'react-native';
import DataStore from '../expand/dao/dataStore'

type Props = {};
export default class DataStoreDemoPage extends Component<Props> {
    constructor(props){
        super(props)
        this.state={
            showText:'',
        }
        this.dataStore=new DataStore()
    }
    loadData(){
        let url=`https://api.github.com/search/repositories?q=${this.value}`
        this.dataStore.fetchData(url)
            .then(data=>{
                let showData=`初次加载时间:${new Date(data.timestamp)}\n${JSON.stringify(data.data)}`
                this.setState({
                    showText:showData
                })
            })
            .catch(error=>{
                error && console.error(error.toString())
            })
    }
    render() {
        const {navigation} =this.props
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>离线缓存框架 设计</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        onChangeText={text=>{
                            this.value=text
                        }}
                        style={styles.input}/>
                    <Text
                        onPress={()=>{
                            this.loadData()
                        }}
                    >获取</Text>
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
        flex:1,
        borderColor:'blue',
        borderWidth: 1,
        marginRight: 10,
    },
    inputContainer:{
        flexDirection: 'row',
        alignItems: 'center',
    }
});
