/* eslint-disable */
import React, { Component } from 'react'
import {
  Image, StyleSheet,
  Text, TouchableOpacity,
  View, Dimensions,
} from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import HTMLView from 'react-native-htmlview'
import BaseItem from './BaseItem'
const {width}=Dimensions.get('window')
export default class TrendingItem extends BaseItem {
  render() {
    const {projectModel}=this.props
    const { item } = projectModel
    if (!item) return null
    const description='<p>'+item.description+'</p>'
    return (
      <TouchableOpacity
        onPress={()=>this.onItemClick()}
      >
        <View style={styles.cellContainer}>
          <Text style={styles.title}>{item.fullName}</Text>
          <HTMLView
              value={description}
              onLinkPress={(url)=>{

              }}
              stylesheet={{
                p:styles.description,
                a:styles.description,
              }}
          />
          <Text style={styles.description}>{item.meta}</Text>
          <View style={styles.row}>
            <View style={{flexDirection: 'row',alignItems:'center'}}>
              <Text>Build by:</Text>
              {item.contributors.map((result,index)=>{
                return  <Image
                    key={index}
                    style={{ height: 22, width: 22, margin:2}}
                    source={{ uri: result }}
                />
              })}

            </View>
            {this._favoriteIcon()}
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  cellContainer: {
    width:width-10,
    backgroundColor: 'white',
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    marginVertical: 3,
    borderColor: '#dddddd',
    borderWidth: 0.5,
    borderRadius: 2,
    shadowColor: 'gray', // iOS阴影
    shadowOffset: { width: 0.5, height: 0.5 }, // iOS阴影
    shadowOpacity: 0.4, // iOS阴影
    shadowRadius: 1, // iOS阴影
    elevation: 2, // android阴影
  },

  title: {
    fontSize: 16,
    marginBottom: 2,
    color: '#212121',
  },

  description: {
    fontSize: 14,
    marginBottom: 2,
    color: '#757575',
  },

  row: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
})