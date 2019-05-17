import React, { Component } from 'react'
import { Text, Dimensions, Animated, Easing, ScrollView } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';

function handleColor(number, colors){
    const color1 = number % 2 ? colors[0] : colors[1]; 
    const color2 = number > 4 ? colors[2] : colors[3]; 
    return [color1, color2]
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default class LotteryBall extends Component {
      constructor(props){
          super(props);

          this.state = {
              previousNum:'-',
              number: props.number
          }

          this._animatedValue = new Animated.Value(0);

          this.rotate = this._animatedValue.interpolate({
               inputRange:[0 , 10],
               outputRange:['0deg', '-180deg'],
               extrapolate:'clamp'
          })
      }

      // 控制小球翻转完后 在显示新数字 
      componentWillReceiveProps(nextProps){
          if(this.props.number != '-' && this.props.number !== nextProps.number){
                this.setState({previousNum: this.props.number, number: nextProps.number});
                this.animateBall();
          }else{
                this.setState({number: nextProps.number, previousNum: nextProps.number})
          }       
      }

      animateBall = () => {
          const {delay} = this.props;
          setTimeout(() => {
            Animated.timing(this._animatedValue, {
                toValue: 10,
                duration: 800,
                easing: Easing.bezier(.4, .66, .5, .73)
            }).start(() => {
                this._animatedValue.setValue(0);
                this.setState({previousNum:'-'});
            })
          }, delay*180)    
      }

      render() {
          const {previousNum, number} = this.state;
          const {colors} = this.props;
          const num = previousNum != '-' ? previousNum : number;
          const colorss = handleColor(num, colors);
          const transformStyle = {
                transform:[
                    {rotateX: this.rotate}
                ]                 
          }
          return (
             <AnimatedLinearGradient colors={colorss}  locations={[0,0.8]} start={{x: 0, y: 0}} end={{x: 0, y: 1}} style={{width:30,height:30, borderRadius:15, justifyContent:'center', alignItems:'center', ...transformStyle}}>
                <Text style={{color:'black', fontSize:16}}>{num}</Text>
             </AnimatedLinearGradient>
          )
      }
}