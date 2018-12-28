/* eslint-disable */
import React, { Component } from 'react'
import {
  Image, StyleSheet,
  Text, TouchableOpacity,
  View, Dimensions,
} from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
// import HTMLView from 'react-native-htmlview'
const {width}=Dimensions.get('window')
export default class BaseItem extends Component {
   static propTypes={
     projectModel:PropTypes.object,
     onSelect:PropTypes.func,
     onFavorite:PropTypes.func,
   }

   constructor(props){
     super(props)
     this.state={
       isFavorite:this.props.projectModel.isFavorite
     }
   }

  /**
   * 牢记：componentWillReceiveProps在新版已经不支持了
   * @param nextProps
   * @param preState
   */
   static getDerivedStateFromProps(nextProps,preState){
      const isFavorite=nextProps.projectModel.isFavorite
    if(preState.isFavorite!==isFavorite){
      return{
        isFavorite
      }
    }
    return null
   }

  setFavoriteState(isFavorite){
      this.props.projectModel.isFavorite=isFavorite
      this.setState({
        isFavorite
      })
  }

  onItemClick(){
       this.props.onSelect(isFavorite=>{
          this.setFavoriteState(isFavorite)
      })
  }

  onPressFavorite(){
    this.setFavoriteState(!this.state.isFavorite)
    this.props.onFavorite(this.props.projectModel.item,!this.state.isFavorite)
  }

   _favoriteIcon() {
     return (
         <TouchableOpacity
           style={{padding: 6}}
           underlayColor='transparent'
           onPress={()=>{
             this.onPressFavorite()
           }}
         >
          <FontAwesome
            name={this.state.isFavorite?'star':'star-o'}
            size={26}
            style={{color:'#678'}}
          />
         </TouchableOpacity>
     )
   }
}