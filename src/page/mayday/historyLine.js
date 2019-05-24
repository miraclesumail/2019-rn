import React, { Component, Fragment } from 'react'
import { Text, View, Dimensions, StyleSheet } from 'react-native'
import ScrollElement from './scrollElement'

const {width} = Dimensions.get('window');

class ScrollingNumber extends Component {
    constructor(props){
         super(props);
         this.state = {
             scrollingNum: props.nums.split('')
         }
    }

    render() {
        return (
           <View style={{width:.39*width, height:30, flexDirection:'row', justifyContent:'space-around', alignItems:'center'}}>
              {
                  this.state.scrollingNum.map((item,index) => (
                       <ScrollElement number={+item} index={index}/>
                  ))
              }
           </View>    
        )       
    }
}

export default class HistoryLine extends Component {
    state = {
        isRefreshing: false
    }

    componentWillReceiveProps(nextProps){
        console.log('nexsewghetjejttjtrjrjrj');

          if(!this.props.item.balls && nextProps.item.balls){
                
                this.setState({isRefreshing: true})
                setTimeout(() => {
                     this.setState({isRefreshing: false})
                }, 4000)   
          }
    }
    
    render() {
          const {item} = this.props;
          const index = item.index % 2;
          const {isRefreshing} = this.state;
          return (
              item.balls ? 
              <View style={[styles.historyLine, {backgroundColor: index ? 'grey' : '#f0f0f0'}]}>
                  {
                    isRefreshing ? 
                    <Fragment>
                              <View style={{width:.25*width, height:30, justifyContent:'center', alignItems:'center', borderRightColor:'pink', borderRightWidth:1}}><Text>{item.number}</Text></View>
                              <View style={{width:.36*width, height:30,justifyContent:'center', alignItems:'center', borderRightColor:'pink', borderRightWidth:1}}><Text>开奖中</Text></View>
                              <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><ScrollingNumber nums={item.balls}/></View>
                    </Fragment> : 
                    
                    <Fragment>
                      <View style={{width:.25*width, height:30, justifyContent:'center', alignItems:'center', borderRightColor:'pink', borderRightWidth:1}}><Text>{item.number}</Text></View>
                      <View style={{width:.12*width, height:30,justifyContent:'center', alignItems:'center', borderRightColor:'pink', borderRightWidth:1}}><Text>{item.daxiao}</Text></View>
                      <View style={{width:.12*width, height:30,justifyContent:'center', alignItems:'center', borderRightColor:'pink', borderRightWidth:1}}><Text>{item.jiou}</Text></View>
                      <View style={{width:.12*width, height:30,justifyContent:'center', alignItems:'center', borderRightColor:'pink', borderRightWidth:1}}><Text>{item.hezhi}</Text></View>
                      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>{item.balls}</Text></View>
                    </Fragment>
                  }    
              </View> :
              <View style={{width, height:30, backgroundColor: index ? 'grey' : '#f0f0f0', flexDirection:'row', }}>
                  <View style={{width:.25*width, height:30, justifyContent:'center', alignItems:'center', borderRightColor:'pink', borderRightWidth:1}}><Text>{item.number}</Text></View>
                  <View style={{width:.75*width, height:30, justifyContent:'center', alignItems:'center'}}><Text>等待开奖</Text></View>
              </View>
          )
    }
}

const styles = StyleSheet.create({
    historyLine: {
        width, height:30, borderBottomColor:'yellowgreen', borderBottomWidth:1,
        flexDirection:'row'
      }
})