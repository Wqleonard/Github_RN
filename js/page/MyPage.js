/* eslint-disable */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react'
import {
    ScrollView, StyleSheet, Text, View, TouchableOpacity, DeviceInfo
} from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import NavigationBar from '../common/NavigationBar'
// import NavigationUtil from '../navigator/NavigationUtil'
import {MORE_MENU} from "../common/MORE_MENU";
import GlobalStyles from "../res/styles/GlobalStyles";
import ViewUtil from "../util/ViewUtil";
import NavigationUtil from "../navigator/NavigationUtil";
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";

const THEME_COLOR = '#678'
type Props = {};
export default class MyPage extends Component<Props> {
    constructor(props){
        super(props)
    }

    componentDidMount() {
       // onWillBlur：页面将要失去焦点
      //  onDidBlur：页面已经失去焦点
      //  onWillFocus：页面将要获得焦点
      //  onDidFocus：页面已经获得焦点  可以在获取焦点时自动调用方法刷新页面
        // 通过addListener开启监听，可以使用上面的四个属性
        this._didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                console.debug('didFocus', payload);
            }
        );
    }

    componentWillUnmount() {
        // 在页面消失的时候，取消监听
        this._didFocusSubscription && this._didFocusSubscription.remove();
    }


    getRightButton(){
      return(
          <View style={{flexDirection: 'row'}}>
              <TouchableOpacity style={{padding: 5,marginRight: 8}}>
                  <View>
                      <Feather
                        name={'search'}
                        size={24}
                        style={{color:'white'}}
                      />
                  </View>
              </TouchableOpacity>
          </View>
      )
  }
       getLeftButton(callback){
              return (
                  <TouchableOpacity
                   style={{padding: 8,paddingLeft: 12}}
                   onPress={callback}
                  >
                      <Ionicons
                        name={'ios-arrow-back'}
                        size={26}
                        style={{color: 'white'}}
                      />
                  </TouchableOpacity>
              )

       }

       onClick(menu){
          let RouteName,params={}
          switch (menu) {
              case MORE_MENU.Tutorial:
                  RouteName='WebViewPage'
                  params.title='教程'
                  params.url='https://coding.m.imooc.com/classindex.html?cid=89'
                  break
              case MORE_MENU.About:
                  RouteName='AboutPage'
                  break
              case MORE_MENU.About_Author:
                  RouteName='AboutMePage'
                  break
              case MORE_MENU.Custom_Language:
              case MORE_MENU.Custom_Key:
              case MORE_MENU.Remove_Key:
                  RouteName='CustomKeyPage'
                  params.isRemoveKey=menu===MORE_MENU.Remove_Key
                  params.flag=(menu !== MORE_MENU.Custom_Language)?FLAG_LANGUAGE.flag_key:FLAG_LANGUAGE.flag_language
                  break
          }
          if(RouteName){
              NavigationUtil.goPage(params,RouteName)
          }
       }

       getItem(menu){
        return ViewUtil.getMenuItem(()=>
             this.onClick(menu)
         ,menu,THEME_COLOR)
       }

       render(){
            let statusBar={
                backgroundColor: THEME_COLOR,
                barStyle:'light-content',
            }
            let navigationBar=
                <NavigationBar
                  title={'我的'}
                  statusBar={statusBar}
                  style={{backgroundColor:THEME_COLOR,paddingTop: DeviceInfo.isIPhoneX_deprecated?30:0}}
                  rightButton={this.getRightButton()}
                  leftButton={this.getLeftButton(()=>{
                      this.props.navigation.goBack()
                  })}
                />
           return(
               <View style={GlobalStyles.root_container}>
                   {navigationBar}
                   <ScrollView>
                     <TouchableOpacity
                         style={styles.item}
                         onPress={()=>{
                             this.onClick(MORE_MENU.About)
                         }}
                     >
                         <View style={styles.about_left}>
                             <Ionicons
                                 name={MORE_MENU.About.icon}
                                 size={40}
                                 style={{
                                     marginRight: 10,
                                     color:THEME_COLOR,
                                 }}
                             />
                             <Text>GitHub Popular</Text>
                         </View>
                         <Ionicons
                             name={'ios-arrow-forward'}
                             size={16}
                             style={{
                                 marginRight: 10,
                                 alignSelf:'center',
                                 color:THEME_COLOR,
                             }}
                         />
                     </TouchableOpacity>
                       <View style={GlobalStyles.line}/>
                       {/*教程*/}
                       {this.getItem(MORE_MENU.Tutorial)}
                       {/*趋势管理*/}
                       <Text style={styles.groupTitle}>趋势管理</Text>
                       {/*自定义语言*/}
                       {this.getItem(MORE_MENU.Custom_Language)}
                       {/*语言排序*/}
                       <View style={GlobalStyles.line}/>
                       {this.getItem(MORE_MENU.Sort_Language)}

                       {/*最热管理*/}
                       <Text style={styles.groupTitle}>最热管理</Text>
                       {/*自定义标签*/}
                       {this.getItem(MORE_MENU.Custom_Key)}
                       {/*标签排序*/}
                       <View style={GlobalStyles.line}/>
                       {this.getItem(MORE_MENU.Sort_Key)}
                       {/*标签移除*/}
                       <View style={GlobalStyles.line}/>
                       {this.getItem(MORE_MENU.Remove_Key)}

                       {/*设置*/}
                       <Text style={styles.groupTitle}>设置</Text>
                       {/*自定义主题*/}
                       {this.getItem(MORE_MENU.Custom_Theme)}
                       {/*关于作者*/}
                       <View style={GlobalStyles.line}/>
                       {this.getItem(MORE_MENU.About_Author)}
                       {/*反馈*/}
                       <View style={GlobalStyles.line}/>
                       {this.getItem(MORE_MENU.Feedback)}
                   </ScrollView>
               </View>
           )
       }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
    about_left:{
      alignItems: 'center',
      flexDirection: 'row',
    },
    item:{
        backgroundColor:'white',
        justifyContent: 'space-between',
        padding:10,
        alignItems: 'center',
        flexDirection:'row',
        height: 90
    },
    groupTitle:{
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 5,
        fontSize: 12,
        color:'gray'
    }
})
