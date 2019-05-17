import React, { Component } from 'react'
import { Text, View, PanResponder, Animated, StyleSheet, Dimensions } from 'react-native'

const {width, height} = Dimensions.get('window');

class Slider extends Component {
  constructor(props){
        super(props);

        this.state = {
             _value: 0
        }
        this.animatedValue = new Animated.Value;
        this.animatedValuey = new Animated.Value;

        this._animatedValue = new Animated.Value(0);
        this.animatedValue.addListener((value) => {
             if(value.x > 0 ){
                 value.x = 0
             }

             value = value*.7;
             this.setState({_value:value})
             console.log(value);  
        })

        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => {
                return true;
            },
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                return true;
            },
            onPanResponderGrant: (evt, gestureState) => {
                 this.animatedValue.setOffset(this.state._value);
                 this.animatedValue.setValue(0)            
            },
            onPanResponderMove: (evt, gestureState) => {
                if(this.state._value >= 0 && gestureState.vx > 0) return;

                Animated.event([null, {dx: this.animatedValue, dy: this.animatedValuey}])(evt, gestureState);
            },
            onPanResponderRelease: (evt, gestureState) => {
                console.log('release')
                //this.animatedValue.flattenOffset();    
                if(this.state._value.x > -150) {
                       console.log('spring')
                       Animated.spring(this.animatedValue, {
                           toValue: 0,
                           tension: 41,
                           friction: 7.2
                       })
                }
            }
        })
  }

  componentDidMount(){
        setTimeout(() => {

            Animated.spring(this._animatedValue, {
                toValue: 150,
                tension: 50,
                friction: 7.2
            }).start();
        }, 2000)
      
  }

  render() {
    const {_value} = this.state;
    return (
        //  <View><Text>DDDD</Text></View>
       <View>
            <Animated.View style={[styles.row]} {...this._panResponder.panHandlers} >
            
            </Animated.View>

            <Animated.View style={[styles.box, {transform: [{translateX: this._animatedValue}]}]}>

            </Animated.View>
       </View> 
     
    )
  }
}

export default Slider

const styles = StyleSheet.create({
      row: {
          width: width + 150,
          height:100,
          backgroundColor: 'pink',
          flexDirection: 'row',
          left:0
      },
      box: {
        width:100,
        height:100,
        backgroundColor: 'green',
        left:0
      }
})
