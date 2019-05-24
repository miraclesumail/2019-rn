import React, { Component, Fragment } from 'react'
import { Text, View, StyleSheet, TouchableWithoutFeedback, Dimensions, Animated, Easing, ScrollView, FlatList, PanResponder } from 'react-native'

// 圆角分模式切换
export default class YuanMode extends Component {
    constructor(props){
        super(props);

        this.select = new Animated.Value(0);
        this.transform = 0;
 
        this.select.addListener(({value}) => {
             this.transform = value;
        })
 
        this.y = this.select.interpolate({
            inputRange:[0, 10],
            outputRange:[props.style ? 30:0, props.style ? -70 : -100],
            extrapolate:'clamp'
        })
    }  

    toggleSelect = () => {
        Animated.timing(this.select, {
            toValue: this.transform == 0 ? 10 : 0,
            duration: 500,
            easing:Easing.bezier(.4, .7, .58, .75)
        }).start();
    }

    render() {
        const {mode, changeMode, style} = this.props;

        const transformStyle = {
            transform: [
                {translateY: this.y}
            ]
        }

        const modeText = mode == 1 ? '元' : mode == .1 ? '角' : '分';
        return (
            <Fragment>
                <Animated.View style={[styles.tabMenu, transformStyle]}>
                        <TouchableWithoutFeedback onPress={() => {changeMode(1); this.toggleSelect()}}>
                             <View style={[styles.mode, {backgroundColor:mode == 1 ? '#f5d300' : 'yellowgreen', borderTopLeftRadius:10, borderTopRightRadius:10}]}>
                                <Text>元</Text>
                             </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => {changeMode(.1); this.toggleSelect()}}>
                             <View style={[styles.mode, {backgroundColor:mode == .1 ? '#f5d300' : 'yellowgreen'}]}>
                                  <Text>角</Text>
                             </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => {changeMode(.01); this.toggleSelect()}}>
                             <View style={[styles.mode, {backgroundColor:mode == .01 ? '#f5d300' : 'yellowgreen', borderBottomLeftRadius:10, borderBottomRightRadius:10}]}>
                                  <Text>分</Text>
                             </View>
                        </TouchableWithoutFeedback>
                </Animated.View>  
                
                <TouchableWithoutFeedback onPress={() => this.toggleSelect()}>
                    <View style={[styles.chooseMode, style ? style : {}]}>                           
                            <Text style={{color:'white'}}>{modeText}模式</Text>                       
                    </View>  
                </TouchableWithoutFeedback>      
            </Fragment>
           
        )
    }
}

const styles = StyleSheet.create({
        mode: {
            width:90,
            height:33,
            justifyContent:'center',
            alignItems:'center',
        },
        tabMenu: {
            position:'absolute', width:90, 
            height: 70, borderRadius:10, 
            backgroundColor:'yellowgreen', left:5,
            bottom:0
        },
        chooseMode: {
            width:102, height:70, 
            borderRightWidth:2,
            backgroundColor:'#3FD7BE', 
            borderRightColor: '#f5d300',
            position:'absolute', left:0, 
            bottom:0, zIndex:100,
            justifyContent:'center',
            alignItems:'center',
            paddingBottom:23
        },
        cashMode: {
            position:'absolute', width:100, height:70, bottom:0,
            flexDirection:'row',
            backgroundColor:'#3FD7BE',
            justifyContent:'center',
            alignItems:'center',
           
       }
})