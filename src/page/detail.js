import React, {Component} from 'react'
import {Platform, StyleSheet, Text, View, FlatList, Animated, TouchableHighlight, Alert, TouchableOpacity, BackHandler, Dimensions, 
    TouchableWithoutFeedback, Slider, Switch, Image} from 'react-native'
var reactMixin = require('react-mixin');
import TimerMixin from 'react-timer-mixin';
import HandleBack from '../back'
import ViewOverflow from 'react-native-view-overflow';
import ProgressiveImage from '../component/ProgressiveImage'
import DoubleTap from '../component/douleTap'
//import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const widths = Dimensions.get('window').width;

/**
 * Image  
 *   resizeMode: cover, contain
 *   stretch: Scale width and height independently, This may change the aspect ratio of the src.
 * 
 */
export default class Detail extends Component {
     static navigationOptions = {
        title: 'Detail',
        headerStyle: {
          backgroundColor: '#f4511e',
          height: 30
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }

    constructor(props){
        super(props);
        this.state = {
             open: false,
             isAnimating:false,
             list:[
                 'qqqqqqq',
                 'wwwwwww',
                 'eeeeeee',
                 'fffffff'
             ],
             citys:{
                 '湖北': ['qqq','qqq','qqq','qqq','qqq'],
                 '湖南': ['qqq','qqq','qqq','qqq','qqq'],
                 '上海': ['qqq','qqq','qqq','qqq','qqq'],
                 '广东': ['qqq','qqq','qqq','qqq','qqq'],
             },
             chooseprovince:'',
             choosecity:'',
             number: 1,
             editing: false,
             value: 20,
             switch: false
        }
        this.animateValue = new Animated.Value(-150)
        this.heightValue = new Animated.Value(0)

    }

    componentDidMount() {

        // this.setInterval(() => {
        //       this.setState({number: this.state.number + 1})
        //   }, 1500);
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.onBack();       
        });
    }

    onBack = () => {
        console.log('ssssssssssssss')
        if (this.state.editing) {
          Alert.alert(
            "You're still editing!",
            "Are you sure you want to go home with your edits not saved?",
            [
              { text: "Keep Editing", onPress: () => {}, style: "cancel" },
              { text: "Go Home", onPress: () => this.props.navigation.pop() },
            ],
            { cancelable: false }
          );
          return true;
        }
       // this.props.navigation.goBack();
        return false;
      };
    
    toggleSide({nativeEvent}) {
        console.log(nativeEvent)
        /*
            locationX   distance of x to parent
            pageX   distance of x to root
        */
        if(this.state.isAnimating)
            return
        this.setState({isAnimating: true})    
        if(this.state.open) {
            // Animated.timing(this.animateValue, {
            //     toValue: -150,
            //     duration: 800,
            //     useNativeDriver: true
            // }).start(() => {
            //     this.setState({isAnimating: false, open: false})
            // })

            Animated.spring(this.animateValue, {
                toValue: -150,
                friction: 9.2,
                tension: 42,
                useNativeDriver: true
            }).start(() => {
                this.setState({isAnimating: false, open: false})
            })
        } else {
            Animated.timing(this.animateValue, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true
            }).start(() => {
                this.setState({isAnimating: false, open: true})
            })
        }   
    }

    chooseProvince(item) {
        this.setState({chooseprovince: item});
        this.toggle(false);
    }

    _renderItem({item, index}) {
        const colorStyle = this.state.chooseprovince == item ? {color:'red'}:{color:'yellow'};
        return (
            <TouchableHighlight onPress={() => {this.chooseProvince(item)}}>
                <View style={styles.provinceItem}>
                    <Text style={colorStyle}>{item}{index}</Text>
                </View>
            </TouchableHighlight>      
        )
    }

    toggle(flag) {
        Animated.timing(this.heightValue, {
             toValue: flag ? 129 : 0,
             duration: 400,
             //useNativeDriver: true
        }).start();
    }

    render() {
        const trsStyle = {
            transform: [
                {translateX: this.animateValue}
            ]
        };
        const { editing } = this.state;

        return (
              <View>
                <View>
                    <TouchableOpacity onPress={() => this.setState({ editing: !editing })}>
                        <Text>Toggle Editing {editing ? "Off" : "On"} </Text>
                    </TouchableOpacity>
                </View>
                    <Text>dddddddd {this.state.number}</Text>
                    <TouchableHighlight style={styles.btn} onPress={this.toggleSide.bind(this)} underlayColor='pink' 
                    onShowUnderlay={() => {console.log('showUnderlay')}}>
                        <Text>press me {this.state.value}</Text>   
                    </TouchableHighlight>  

                    <Animated.View style={[styles.sideMenu, trsStyle]}>
                        <FlatList data={this.state.list} extraData={this.state} renderItem={({item}) => (<View><Text>{item}</Text></View>)} 
                        keyExtractor={(item,index) => {return index+'qq'}}/>
                    </Animated.View> 

                    {/* <Icon name="facebook" size={30} color="#f5d300" />

                    <View style={{width:100, height:100}}>
                        <Icon.Button name="facebook" backgroundColor="#3b5998">
                            <Text style={{ fontFamily: 'Arial', fontSize: 15 }}>
                            Login with Facebook
                            </Text>
                        </Icon.Button>
                    </View> */}

                    <FontAwesome5 name={'comments'} size={30}/>
                    <FontAwesome5 name={'comments'} size={30} solid/>

                    <View style={styles.pickerContainer}>
                         <View style={styles.picker}>
                             <TouchableWithoutFeedback onPress={() => {this.toggle(true)}}>
                                <View style={styles.province}>
                                    <Text>{this.state.chooseprovince ? this.state.chooseprovince : 'chooose province'}</Text>
                                </View>
                             </TouchableWithoutFeedback>
                            
                             <Animated.View style={[styles.pickLine, {height: this.heightValue}]}>
                               <FlatList data={Object.keys(this.state.citys)} extraData={this.state} renderItem={this._renderItem.bind(this)} 
                                 keyExtractor={(item,index) => {return index+'qq'}} ItemSeparatorComponent={() => (<View style={styles.seperator}></View>)}/>
                             </Animated.View>       
                         </View> 
                         <DoubleTap onDoubleTap={() => {console.log('dddddddd')}}>
                            <ProgressiveImage style={{width:80, height:80}} source={{uri:`https://images.pexels.com/photos/671557/pexels-photo-671557.jpeg?width=400&buster=${Math.random()}`}}  blurRadius={1} 
                            thumbnailSource={require('../ISB_banner.jpg')}
                            />
                         </DoubleTap>  
                    </View>  
 
                    <View style={{width:200}}>
                        <Slider
                            value={this.state.value} thumbTintColor={'#f5d300'} minimumTrackTintColor={'orange'} maximumValue={100} maximumTrackTintColor={'green'}
                            step={10} onValueChange={value => this.setState({ value })}
                            />  
                    </View> 
                    <Switch value={this.state.switch} thumbColor={'pink'} onValueChange={value => this.setState({switch:value})}/>
              </View>
        )
    }
} 
reactMixin(Detail.prototype, TimerMixin)

const styles = StyleSheet.create({
      btn:{
          width:100,
          height:50,
          backgroundColor:'#f5d300',
          alignItems:'center',
          justifyContent: 'center',
          left:200
      },
      sideMenu: {
          position: 'absolute',
          left:0,
          top:0,
          width:150,
          height:300,
          backgroundColor:'yellowgreen'
      },
      pickerContainer: {
          position: 'absolute',
          width: 300,
          height: 200,
          backgroundColor: 'pink',
          left: .5*widths - 150,
          top: 200,
          flexDirection: 'row'
      },
      picker: {
          width: 150,
          height: 30,
          position: 'relative'
      },
      province: {
         width: 150,
         height: 30,
         backgroundColor: 'chocolate',
         alignItems: 'center',
         justifyContent: 'center'
      },
      provinceItem: {
        width: 150,
        height: 30,
        backgroundColor: 'yellowgreen',
        alignItems: 'center',
        justifyContent: 'center'
     },
      pickLine: {
          position: 'absolute',
          width: 150,
          //height: 129,
          top: 30
      },
      seperator: {
          width: 150,
          height: 3,
          backgroundColor: 'grey'
      }
})