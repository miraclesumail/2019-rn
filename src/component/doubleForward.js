import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableWithoutFeedback, StyleSheet, Animated, Easing } from 'react-native';

const {width, height} = Dimensions.get('window');

class TapForward extends Component {
 
  static defaultProps = {
    onDoubleTap: () => null,
  }

  lastTap = null;
  delay =  400;
  last = 800;
  pressTime = null;
  timer = null;
  _animatedValue = new Animated.Value(0);
  animation = null;
  eachStep = 0;
  _value = 0;

  constructor(props) {
    super(props);
    this.state = {
         forward: 0,
         back: 0,
         showForward: false,
         showBack: false,
    };

    this._animatedValue.addListener(({value}) => {
        this._value = value;
    })
  }


  componentDidMount() {
      this.eachStep = (width - 10)/60;
      this.animation = Animated.timing(this._animatedValue, {
           toValue: width - 10,
           duration: 60*1000,
           easing: Easing.linear 
      })
      this.animation.start();
  }
 
  handlePress = (number) => {
      const now =  Date.now();
      if(this.pressTime && (now - this.pressTime) < this.last) {
          clearTimeout(this.timer);
          this.timer = null;
          this.processForward(now, number);
      }
      else if(this.lastTap && (now - this.lastTap) < this.delay) {
          this.animation.stop();
          this.lastTap = null;
          this.setState(number > 0 ? {showForward: true} : {showBack: true});
          this.processForward(now, number);
      } else {
          this.lastTap = now;
      }
  }

  processForward = (now, number) => {
      if(number > 0)
          this.setState({forward: ++this.state.forward});
      else
          this.setState({back: ++this.state.back});   
      this.pressTime = now;  
      this.timer = setTimeout(() => {
          const {forward, back} = this.state;
          console.log('都看看大口大口');
          this._animatedValue.setValue(number > 0 ? (this._value + forward*this.eachStep) : (this._value - back*this.eachStep));
          this.setState(number > 0 ? {showForward: false} : {showBack: false});
          this.setState(number > 0 ? {forward: 0} : {back:0});
          this.pressTime = null;

          this.animation = Animated.timing(this._animatedValue, {
            toValue: width - 10,
            duration: 60*1000*(1 - this._value/(width - 10)),
            easing: Easing.linear 
          })
          this.animation.start();
      }, this.last)
  }

  render() {
    const {showForward, showBack} = this.state;
    const opacityFor = showForward ? {opacity:1} : {opacity:0}
    const opacityBack = showBack ? {opacity:1} : {opacity:0}
    return (
      <View style={styles.container}>
          <View style={{position:'absolute', width, top:100, left:0, height:10, backgroundColor: 'yellowgreen'}}>
              <Animated.View style={[styles.circle, {left: this._animatedValue}]}></Animated.View>
          </View>

          <TouchableWithoutFeedback onPress={() => this.handlePress(-1)}>
             <View style={[styles.item, opacityBack]}>
                 <Text>后退</Text>
                 <Text>后退 {this.state.back} s</Text>
             </View>
          </TouchableWithoutFeedback> 
         
          <TouchableWithoutFeedback onPress={() => this.handlePress(1)}>
             <View style={[styles.item, opacityFor]}>
                 <Text>前进</Text>
                 <View>
                    <Text>前进 {this.state.forward} s</Text>
                 </View> 
             </View>
          </TouchableWithoutFeedback>
      </View>
    );
  }
}

export default TapForward;

const styles = StyleSheet.create({
      container: {
           position: 'absolute',
           width,
           height,
           top: 0,
           left: 0,
           flexDirection: 'row'
      },
      item: {
           width: .5*width,
           height,
           justifyContent:'center',
           alignItems: 'center'
      },
      circle: {
          width:10,
          height:10,
          borderRadius: 10,
          backgroundColor: '#f5d300'
      }
})