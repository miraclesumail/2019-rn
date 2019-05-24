import React, { Component } from 'react'
import { Text, View, Dimensions, Animated, Easing } from 'react-native'

const {width} = Dimensions.get('window');

export default class ScrollElement extends Component {
    constructor(props){
        super(props);
        this.translateY = new Animated.Value(0);
    }

    componentDidMount() {
        const {number, index} = this.props;
        console.log(number);
        const dis = -(20 + number)*26;
        Animated.timing(this.translateY, {
            toValue: dis,
            duration:2000,
            delay: index*100, 
            easing: Easing.bezier(.43, .09, .96, .8)
        }).start()
    }
    
    render() {
        const transformStyle = {
              transform: [
                  {translateY: this.translateY}
              ]
        }
        const {number} = this.props;
        return (
            <View style={{width: .05*width, height:26, position:'relative', overflow:'hidden', backgroundColor:'#F5A53A'}}>
                  <Animated.View style={{position:'absolute', height:780, top:0, left:0, ...transformStyle}}>
                        {
                            Array.from({length:30}, (v,i) => i%10).map(item => (
                                <View style={{width:.05*width, height:26, justifyContent:'center', alignItems:'center'}}><Text>{number}</Text></View>
                            ))
                        }
                  </Animated.View>
            </View>
        )
    }
}