import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableWithoutFeedback, Dimensions, Animated, Easing } from 'react-native'

import {gamesList} from './gameList'
const {width} = Dimensions.get('window');

export default class LotteryMenu extends Component {
    constructor(props) {
        super(props);
  
        this.state = {
            gamesList,
            headGameNames: gamesList.map(item => item.name),
            chooseIndex: 0,
            height: 0,
            firstLoad: true,
            childIndex: [0, 0]
        }
  
        this._animatedValue = new Animated.Value(0);
    }  
  
    componentDidMount() {
        const {childIndex} = this.state;
        this.setName(childIndex[0], childIndex[1]);
    }
  
    // 利用父组件的属性的改变  来animate this._animatedValue
    componentWillReceiveProps(nextProps){
       if(!this.props.show && nextProps.show) {
           console.log('ssssssssssssssssssssss')
           Animated.timing(this._animatedValue, {
               toValue: 30,
               duration:300,
               easing: Easing.linear
           }).start()
       }
  
       if(this.props.show && !nextProps.show) {
          console.log('upeppepepe');
          Animated.timing(this._animatedValue, {
              toValue: -this.state.height,
              duration:300,
              easing: Easing.linear
          }).start()
       }
    }
  
    onLayout = ({nativeEvent:{layout:{height}}}) => {
        this.setState({height});
        this._animatedValue.setValue(-height);
        this.setState({firstLoad: false})
    }
  
    handleMenuClick = (i, idx, gameId) => {
        return () => {
               this.setName(i, idx);
               this.props.closeModal();
               this.props.setGameId(gameId);
               this.props.setChildIndex(i, idx);
        }
    }
  
    setName = (secondIndex, thirdIndex) => {
        const {gamesList, chooseIndex} = this.state;
        const firstName = gamesList[chooseIndex].name;
        const secondName = gamesList[chooseIndex].children[secondIndex].name;
        const thirdName = gamesList[chooseIndex].children[secondIndex].children[thirdIndex].name;
        this.setState({childIndex: [secondIndex, thirdIndex]});
        this.props.setName(firstName + ' ' + secondName + ' ' + thirdName, chooseIndex);
    }
  
    render() {
        const { headGameNames, gamesList, chooseIndex, firstLoad, childIndex, height } = this.state;
        const head = Array.from({length:Math.ceil(headGameNames.length /3)}).map((item, ii) => {
              const part = headGameNames.slice(ii*3, ii*3 + 3).map((item, index) => (
                  <TouchableWithoutFeedback key={index+'d'} onPress={() => this.setState({chooseIndex: ii*3 + index})}>
                      <View key={index} style={[styles.headName, {opacity: firstLoad ? 0 : 1, backgroundColor: chooseIndex == ii*3 + index ? '#00B6FF': '#00FFCD'}]}><Text>{item}</Text></View>
                  </TouchableWithoutFeedback>     
              ))
  
              return (
                  <View style={{width, height:50, flexDirection:'row', backgroundColor:'pink', opacity: firstLoad ? 0 : 1,}}>
                        {part}
                  </View>
              )
        }) 
    
        const children = gamesList[chooseIndex].children.map((v,i) => {
              const smallGame = v.children.map((val, idx) => (
                    <TouchableWithoutFeedback onPress={this.handleMenuClick(i, idx, val.id)}>
                        <View key={idx} style={[styles.middleName, {opacity: firstLoad ? 0 : 1, backgroundColor: (childIndex[0] == i && idx == childIndex[1]) ? '#7AC790' : '#FFD700'}]}>
                           <Text>{val.name}</Text>
                        </View>
                    </TouchableWithoutFeedback>       
              )) 
  
              return (
                  <View key={i} style={[styles.smallMenu, {opacity: firstLoad ? 0 : 1,}]}>
                     <View style={{flex:1, height:30,  justifyContent:'center', alignItems: 'center'}}><Text>{v.name}</Text></View>
                     {smallGame}
                  </View>    
              )
        })
  
        const transformStyle = {      
              transform: [
                  {translateY: this._animatedValue}
              ]
        }
               
        return (
            <Animated.View style={{position:'absolute', top:0, ...transformStyle}}>
               <View style={{flexDirection:'row', flexWrap:'wrap'}} onLayout={this.onLayout}>
                   {head}
                   {children}
               </View>  
            </Animated.View>    
        )
    }
  }

  const styles = StyleSheet.create({
    headName: {
        width: .333*width,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    smallMenu: {
        width,
        flexDirection:'row',
        height:30,
        backgroundColor: '#FFD700'
    },
    middleName: {
        backgroundColor: 'chocolate',
        height: 30,
        flex: 1,
        justifyContent:'center',
        alignItems: 'center'
    },
  })