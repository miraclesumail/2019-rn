import React, { Component, Fragment, useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Easing } from 'react-native';

import { setTimeout } from 'core-js';

const {width, height} = Dimensions.get('window');

export default class RollingBall extends Component {
    static defaultProps = {
         
    }

    constructor(props){
        super(props);

        this.state = {
             animatedArr: Array.from({length:10}, () => new Animated.ValueXY({x:0, y:0})),
             hasShown: false,
             balls: props.balls,
             count: 0,
             showKaijiang: false
        }

        this.show = false;
        this._roate = new Animated.Value(0);

        this._scale = new Animated.Value(1);

        // 中奖号码的scale
        this._chooseScale = new Animated.Value(0);

        // 当前开出的球如何移动
        this._chooseTranslateX = new Animated.Value(0);

        this._angle = this._roate.interpolate({
             inputRange: Array.from({length:5401}, (v,i) => i),
             outputRange: Array.from({length:5401}, (v,i) => i+'deg'),
             extrapolate:'clamp'
        })
    }

    componentDidMount(){
        console.log(this.props.balls);
        this.beginAnimation();
    }

    beginAnimation = () => {
        // 旋转角度
        Animated.timing(this._roate, {
            toValue:3600,
            duration: 1500,
            easing: Easing.bezier(.42,0,.58,1),
            useNativeDriver: true
        }).start(() => {
            const length = this.state.animatedArr.length;
            Animated.timing(this._scale, {
                toValue: 0,
                duration:800,
                easing: Easing.bezier(.42,0,.58,1),
                useNativeDriver: true
            }).start(() => {
                this.setState({hasShown:true})
                Animated.timing(this._chooseScale, {
                    toValue: 1,
                    duration: 800,
                    easing: Easing.bounce,
                    useNativeDriver: true
                }).start(() => {
                    // 当开出的号码移动至目的地  还原animated初始值
                    Animated.timing(this._chooseTranslateX, {
                        toValue:250 - .12*width*this.state.count, 
                        duration:1500 - 250*this.state.count,
                        easing: Easing.bounce,
                        useNativeDriver: true
                    }).start(() => {
                        const {count, balls} = this.state;
                        if(count == balls.length - 1) {
                            this.setState({showKaijiang: true})
                            setTimeout(() => {
                                this.props.noshow();
                             }, 3000)
                            return
                        }    
   
                        this.setState({hasShown: false});
                        this.resetAnimatedValue();
                        this.setState({count: count + 1});
                        this.beginAnimation();
                    })
                })     
            })

            // 小球移动到中心点
            for(let i = 0; i < length; i++) {
                const angle = Math.PI*2/10*i;
                const x = -Math.sin(angle)*.17*width;
                const y = Math.cos(angle)*.17*width;
                Animated.timing(this.state.animatedArr[i], {
                     toValue: {x, y},
                     duration:1000,
                     easing: Easing.bezier(.42,0,.58,1),
                     useNativeDriver: true
                }).start()
            }
        })
    }

    resetAnimatedValue = () => {
        const {animatedArr} = this.state;
        const final = animatedArr.map(v => new Animated.ValueXY({x:0, y:0}));
        this.setState({animatedArr: final});
        this._roate.setValue(0);
        this._scale.setValue(1);
        this._chooseScale.setValue(0);
        this._chooseTranslateX.setValue(0);
    }

    getPosition = (i) => {
        const angle = Math.PI*2/10*i;
        const x = .2 + Math.sin(angle)*.17;
        const y = .2 - Math.cos(angle)*.17;
        return {left: (x - .03)*width, top: (y - .03)*width }
    }

    renderBalls = () => {
        if(this.state.hasShown) return null;
        const arr = Array.from({length:10});
        console.log('renderBallsrenderBallsrenderBalls')

        return arr.map((v,i) => {
             const { left,top } = this.getPosition(i);
             const transformStyle = {
                 transform: [...this.state.animatedArr[i].getTranslateTransform(), {scale: this._scale}]
             }
                     
             return (
                <Animated.View style={{position: 'absolute', width:.06*width, height:.06*width, backgroundColor:'orange', borderRadius:.05*width, left, top, justifyContent:'center', alignItems:'center', ...transformStyle}}>
                       <Text>{i}</Text>
                </Animated.View>
             )
        })   
    }

    renderMovingBalls = () => {
        const {count} = this.state;
        const transformStyle = {
            transform: [
                {scale: this._chooseScale},
                {translateX: this._chooseTranslateX}
            ],
            opacity: this._chooseScale,
        }
        console.log('renderMovingBalls');
        //250 - .12*width*this.state.count

        // return  (<Animated.View style={[styles.chosenBall]}>
        //     <Text>item</Text>
        // </Animated.View>)   
        return this.state.balls.map((item, index) => {
            const transformStyle1 = {
                  transform: [
                      {translateX: 250 - .12*width*(4-index)}
                  ]
            }

        
            if(index == 4 - count) {
                return <Animated.View style={[styles.chosenBall, transformStyle]}>
                            <Text>{item}</Text>
                       </Animated.View>
            }
                          
            if(index < 4 - count) {
                return <Animated.View style={[styles.chosenBall, {opacity:0, transform:[{scale:0}]}]}>
                            <Text>{item}</Text>
                       </Animated.View>  
            }
                 
                 
            if(index > 4 - count) {
                return <Animated.View style={[styles.chosenBall, transformStyle1]}>
                    <Text>{item}</Text>
                </Animated.View> 
            }             
        })   
    }
   
    // 0.25
    render() {
        const transformStyle = {
            transform: [
                {rotate: this._angle}
            ]
        }
   
        //const {index, count} = this.props;
        return (
            <Fragment>
                
                   <Animated.View style={{width:.4*width, height:.4*width, position:'absolute', top: .05*width, left: .02*width, justifyContent:'center', ...transformStyle}}>
                    {this.renderBalls()}

                   {this.state.showKaijiang ? <View style={{justifyContent:'center', alignItems:'center' }}><Text>开奖号码</Text></View> : null} 
                    </Animated.View> 
       
                    {this.renderMovingBalls()}                
            </Fragment>    
        )    
    }    
}

const styles = StyleSheet.create({
    chosenBall: {
        width:.1*width, 
        height:.1*width, 
        borderRadius:.05*width, backgroundColor:'#B23AEE',        
        position:'absolute', left:.17*width, 
        top:.2*width, justifyContent:'center', 
        alignItems:'center', zIndex:100
    },
})