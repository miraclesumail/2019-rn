import React, { Component } from 'react'
import { Text, View } from 'react-native'
import Line from '../component/line'

export class Chart extends Component {
  render() {
    return (
      <View style={{flex:1, position: 'relative'}}>
           <Line total={60}/>
      </View>     
    )
  }
}

export default Chart
