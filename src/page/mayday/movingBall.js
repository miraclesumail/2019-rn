import React, { Component, Fragment } from 'react'
import { Animated, Easing } from 'react-native'

// 添加购彩蓝的小球
export default class MovingBall extends Component {
   
    MoveX = new Animated.Value(0);

    MoveY = new Animated.Value(0);

    // y = -0.04*(Math.pow(x,2) - 100*x)

    componentDidMount() {
        this.MoveX.addListener(({value}) => {
             this.MoveY.setValue(0.005*(Math.pow(value,2) - 230*value))
        })

        setTimeout(() => {
            Animated.timing(this.MoveX, {
                toValue: 230,
                duration: 700,
                easing: Easing.bezier(.41, .64, .51, .7)
            }).start(() => {
                this.props.changeBall(false);
                this.props.addCart();
            })
        }, 0)
    }

    render() {
        const translate = {
              transform: [
                  {translateY: this.MoveY},
                  {translateX: this.MoveX}
              ]
        }
        return (
            <Animated.View style={{position:'absolute', top:-20, width:20, height:20, borderRadius:10, backgroundColor:'red', left:130, ...translate}}>
            </Animated.View>  
        )
    }
}
