/* eslint-disable */
import React, { Component } from 'react'
import {
    Modal, View, Text,
    TouchableOpacity, StyleSheet, DeviceInfo
} from 'react-native'
import TimeSpan from '../model/TimeSpan'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
export const TimeSpans=[new TimeSpan('今 天','since=daily'),new TimeSpan('本 周','since=weekly'),new TimeSpan('本 月','since=monthly')]
const styles=StyleSheet.create({
    container:{
        paddingTop: DeviceInfo.isIPhoneX_deprecated?30:0,
        backgroundColor:'rgba(0,0,0,0.6)',
        flex:1,
        alignItems: 'center',
    },
    arrow:{
       marginTop: 40,
       color:'white',
       padding: 0,
       margin: -15,
    },
    content:{
        backgroundColor: 'white',
        borderRadius:3,
        paddingTop: 3,
        paddingBottom: 3,
        marginRight: 3,
    },
    textContainer:{
        // flexDirection: 'row',
        alignItems: 'center',
    },
    text:{
        fontSize:16,
        color:'black',
        fontWeight: '400',
        padding: 8,
        paddingLeft: 26,
        paddingRight: 26,
    },
    line:{
        height:1,
        backgroundColor:'darkgray',
    }
})

export default class TrendingDialog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
  }

  show() {
    this.setState({
      visible: true,
    })
  }

  dismiss() {
    this.setState({
      visible: false,
    })
  }

  render() {
    const { onClose, onSelect } = this.props
    return (
      <Modal
        transparent={true}//透明
        visible={this.state.visible}
        onRequestClose={()=>{
            onClose
        }}
      >
          <TouchableOpacity
              style={styles.container}
              onPress={()=>this.dismiss()}
          >
             <MaterialIcons
                 name={'arrow-drop-up'}
                 size={36}
                 style={styles.arrow}
             />
              <View style={styles.content}>
                  {TimeSpans.map((result,index)=>{
                      return <TouchableOpacity
                           key={index}
                               underlayColor='transparent'
                               onPress={()=>{
                                 onSelect(result)
                               }}
                              >
                          <View style={styles.textContainer}>
                              <Text
                                style={styles.text}
                              >{result.showText}</Text>
                          </View>
                          {
                              index !== TimeSpans.length - 1 &&
                              <View style={styles.line}/>
                          }
                              </TouchableOpacity>
                  })}
              </View>
          </TouchableOpacity>
      </Modal>
    )
  }
}