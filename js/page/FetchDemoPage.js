/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View,TextInput} from 'react-native';


type Props = {};
export default class FetchDemoPage extends Component<Props> {
    constructor(props){
        super(props)
        this.state={
            showText:'',
        }
    }
    loadData(){
        //https://api.github.com/serach/respositories?q=java
        let url=`https://api.github.com/search/repositories?q=${this.searchKey}`
        fetch(url)
            .then(response=>response.text())
            .then(responseText=>{
                this.setState({
                    showText:responseText
                })
            })
    }
    loadData2(){
        //https://api.github.com/serach/respositories?q=java
        let url=`https://api.github.com/search/repositories?q=${this.searchKey}`
        fetch(url)
            .then(response=>{
                if(response.ok){
                    return response.text()
                }
                throw new Error('Network response was not ok.')
            })
            .then(responseText=>{
                this.setState({
                    showText:responseText
                })
            })
            .catch(error=>{
                this.setState({
                    showText:error.toString()
                })
            })
    }
    render() {
        const {navigation} =this.props
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>Fetch 使用</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        onChangeText={text=>{
                            this.searchKey=text
                        }}
                        style={styles.input}/>
                    <Button
                        title={'获取'}
                        onPress={()=>{
                            this.loadData2()
                        }}
                    />
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
