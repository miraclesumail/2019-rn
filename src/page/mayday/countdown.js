import React, { Component, Fragment } from 'react'
import { Text, View, StyleSheet, TouchableWithoutFeedback, Dimensions, Animated, Easing, ScrollView } from 'react-native'
import LotteryBall from './lotteryBall'
const {width} = Dimensions.get('window');

export default class CountDown extends Component {
    constructor(props){
        super(props);

        this.state = {
            showTime:'--:--',
            timeArr:[],
            qishu:'--',
            ballColors: ['#E7281C', '#37B354', '#17DAF1', '#F1E317'],
            ballsArr:['-', '-', '-', '-', '-']
        }
    }

    beginCountDown = (timeArr) => {
        if(!timeArr.length) return;

        const {duration, number, balls} = timeArr.shift();
        this.setState({qishu: number, ballsArr: balls});
        this.showTimeText(duration, timeArr);
    }

    showTimeText = (time, timeArr) => {
        const timer = setInterval(() => {
             if(!time){
                 clearInterval(timer);
                 this.props.ws.send(JSON.stringify({type: 'newDate'}));
                 this.$react.publish('updateTempHistory');
                 this.beginCountDown(timeArr);
                 return;
             }
             const min = ('0' + Math.floor(time/60)).slice(-2);
             const sec = ('0' + time%60).slice(-2);
             time--;
             this.setState({showTime: min + ':' + sec})
        }, 1000)
    }

    // 这方法从props那里拿东西  并和之前的state作比较
    // static getDerivedStateFromProps(props, state) {
    // }

    // 这里有坑 父组件state改变不止一次触发该事件
    componentWillReceiveProps(nextProps){
        if(nextProps.timeArr.length != this.props.timeArr.length){
             console.log('receive props');
            // this.setState({timeArr: nextProps.timeArr.slice()});
             this.beginCountDown(nextProps.timeArr.slice());
        }
    }

    render() {
        const {showTime, qishu, ballColors, ballsArr} = this.state;
        return (
            <View style={{width, paddingHorizontal:.03*width, backgroundColor:'rgba(100, 45, 34 ,.7)', height:50, flexDirection:'row', alignItems:'center'}}>
                  <Text style={{color:'#f5d300', fontSize:15}}>距离{qishu}期开奖</Text> 
                  <View style={{width:.15*width, height:50, justifyContent:'center', alignItems:'center'}}>
                       <Text style={{color:'#ffffff', fontSize:18}}>{showTime}</Text>
                  </View>

                  <View style={styles.ballType}>
                        <View style={[styles.typeText, { backgroundColor:'#E7281C'}]}>
                              <Text style={{color:'#ffffff', fontSize:13}}>奇</Text>
                        </View>
                        <View style={[styles.typeText, { backgroundColor:'#37B354'}]}>
                              <Text style={{color:'#ffffff', fontSize:13}}>偶</Text>
                        </View>
                  </View>
                  <View style={styles.ballType}>
                        <View style={[styles.typeText, {backgroundColor:'#17DAF1'}]}>
                              <Text style={{color:'#ffffff', fontSize:13}}>大</Text>
                        </View>
                        <View style={[styles.typeText, {backgroundColor:'#F1E317'}]}>
                              <Text style={{color:'#ffffff', fontSize:13}}>小</Text>
                        </View>
                  </View>

                  <View style={{flex:1, height:50, flexDirection:'row', alignItems:'center', justifyContent:'space-around', paddingLeft:5 }}>
                        {
                            ballsArr.map((item, i) => (
                                <LotteryBall number={item} colors={ballColors} delay={i}/>
                            ))
                        }
                  </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    ballType:{
        width:22, height:50, paddingVertical:1,
         justifyContent:'space-around', alignItems:'center'
     },
     typeText: {
        width:18, height:18,
        alignItems:'center', 
        justifyContent:'center'
     }
})