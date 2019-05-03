import React, { Component } from 'react'
import { Text, View } from 'react-native'
import Forward from '../component/doubleForward'

export class tapForward extends Component {
  render() {
    
    return (
      <View style={{flex:1, position: 'relative'}}> 
          <View style={{backgroundColor:'pink', flex:1}}>
              
          </View>  
          <Forward/>
      </View>
    )
  }
}

export default tapForward
