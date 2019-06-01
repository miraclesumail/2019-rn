/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, FlatList, PanResponder, Easing,
  SectionList, Dimensions, Animated, Button, UIManager, YellowBox, Image, LayoutAnimation} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import PubSub from 'pubsub-js'
import ImagePicker from 'react-native-image-picker'
import {createStackNavigator, createAppContainer, createNavigator} from 'react-navigation'
import NavigationService from './src/navigationService'
import Detail from './src/page/detail'
import HighOrder from './src/page/another'
import Web from './src/page/webview'
import Ges from './src/page/gesture'
import Layout from './src/page/layout'
import Phone from './src/page/phoneList'
import Test from './src/page/test'
import Accordion from './src/page/accordion'
import TapForward from './src/page/tapForward'
import Chart from './src/page/chart'
import Reanimated from './src/page/reanimated'
import Movies from './src/page/movies'
import PullRefresh from './src/page/pullRefresh'
import Clock from './src/page/clock'
import Twitter from './src/page/twitter'
import Tinder from './src/page/tinder'
import GoScreen from './src/component/goScreen'
// import Act from './src/page/mayday/interact'
import Slider from './src/page/mayday/slider'
import Lottery from './src/page/mayday/lottery'
import LotteryRecord from './src/page/mayday/lotteryrecord'
import Basket from './src/page/mayday/lotteryBasket'
import Axios from './src/tool/axios'
import DragBox from './src/page/mayday/dragbox'
import KuaiSan from './src/page/mayday/kuaisan'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const { ValueXY } = Animated;

Component.prototype.$react = PubSub;

Date.prototype.Format = function(fmt)   
{    
  var o = {   
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}

YellowBox.ignoreWarnings(['Warning: ']);

const transitionConfig = () => {
  return {
    transitionSpec: {
      duration: 750,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: sceneProps => {
        const { position, layout, scene, index, scenes } = sceneProps
        const toIndex = index
        const thisSceneIndex = scene.index
        const height = layout.initHeight
        const width = layout.initWidth
  
        const translateX = position.interpolate({
          inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
          outputRange: [width, 0, 0]
        })


        const translateFromBottom = position.interpolate({
          inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
          outputRange: [height, 0, 0]
        })
        // Since we want the card to take the same amount of time
        // to animate downwards no matter if it's 3rd on the stack
        // or 53rd, we interpolate over the entire range from 0 - thisSceneIndex
        const translateY = position.interpolate({
          inputRange: [0, thisSceneIndex],
          outputRange: [height, 0]
        })
  
        const slideFromRight = { transform: [{ translateX }] }
        const slideFromBottom = { transform: [{ translateY }] }
  
        const lastSceneIndex = scenes[scenes.length - 1].index
  
        // Test whether we're skipping back more than one screen
        if (lastSceneIndex - toIndex > 1) {
          // Do not transoform the screen being navigated to
          if (scene.index === toIndex) return
          // Hide all screens in between
          // Slide top screen down
          return slideFromBottom
        }
  
        if(toIndex % 3 == 0)
           return slideFromRight
        else
           return { transform: [{ translateY: translateFromBottom }] } 
      }
  }}

const widths = Dimensions.get('window').width;

var CustomLayoutAnimation = {
  duration: 500,
  create: {
    type: LayoutAnimation.Types.linear,
    property: LayoutAnimation.Properties.scaleXY,
  },
  update: {
    type: LayoutAnimation.Types.linear,
  }
}

Component.prototype.router = NavigationService

const overrideRenderItem = ({ item, index, section: { title, data } }) => <Text key={index}>Override{item}</Text>

const options = {
  title: 'Select Avatar',
  customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }, { name: 'qqq', title: 'Choose Photo from qqqk' }],
  chooseFromLibraryButtonTitle: '从相册中选择',
  takePhotoButtonTitle: '拍照片',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

// shuttle one array
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

class App extends Component {
  state = {
      avatarSource: '',
      imgs: [
        require('./src/page/assets/img1.jpg'),
        require('./src/page/assets/img2.jpg'),
        require('./src/page/assets/img3.jpg'),
        require('./src/page/assets/img4.jpg'),
        require('./src/page/assets/img5.jpg'),
        require('./src/page/assets/img6.jpg'),
        require('./src/page/assets/img7.jpg'),
        require('./src/page/assets/img8.jpg'),
        require('./src/page/assets/img9.jpg')
     ],
     initLayouts:[],
     changedLayouts:[],
     transformStyles:[new ValueXY({x:0, y:0}), new ValueXY({x:0, y:0}), new ValueXY({x:0, y:0}),new ValueXY({x:0, y:0}),new ValueXY({x:0, y:0}),new ValueXY({x:0, y:0}),
                      new ValueXY({x:0, y:0}), new ValueXY({x:0, y:0}), new ValueXY({x:0, y:0})],
     layoutArr:[],
     chooseIndex:[]               
  }
  
  componentWillMount() {
       this._animatedValue = new Animated.ValueXY(0,0);
       this._animatedValue.addListener((value) => console.log(value));
  }

  componentDidMount() {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
      const appName = DeviceInfo.getDeviceName();
      console.log('appName');
       //this.handlePress()
      fetch('http://192.168.84.115:3000/customer/customers')
      .then(response => response.json())
      .then(data => {
        console.log(data) // Prints result from `response.json()` in getRequest
      })
      .catch(error => console.error(error))
       //this.handlePress()
      //Axios.ajax({url:'/customers'})
      //fetch('https://192.168.93.227:3000/customer/customers').then(res => console.log(res.json()));

      setTimeout(() => {
           console.log(this.state.initLayouts);
      }, 5000)
  }

  handlePress() {
      //this.router.navigate('HighOrder')
      //this.router.navigate('Gesture')
      //this.router.navigate('Layout');
      this.router.navigate('Chart');
      //  Animated.decay(this._animatedValue, {
      //       deceleration: 0.97,
      //       velocity: { x: 8, y: 10 },
      //       useNativeDriver: true
      //  }).start()
  }

  handlePress1() {
    this.router.navigate('Reanimated');
  }

  handlePress2() {
    this.router.navigate('Go');
  }

  handlePress3() {
    this.router.navigate('Lottery');
  }

  handlePress5() {
    this.router.navigate('Record');
  }

  handlePress6() {
    this.router.navigate('KuaiSan');
  }

  // shuttle imgs arr 尝试了 transformStyle在 layoutAnimation中不生效
  handlePress4() {
     LayoutAnimation.configureNext(CustomLayoutAnimation);
     let initLayouts = this.state.initLayouts.slice();
     let changedLayouts = this.state.changedLayouts.slice();
     changedLayouts = shuffle(changedLayouts.length ? changedLayouts : initLayouts);
  
     const transformStyles = Array.from({length:9}).map((v,i) => {
           console.log(changedLayouts[i].x);
           console.log(initLayouts.x);
           const xy = {x: changedLayouts[i].x - initLayouts[i].x, y: changedLayouts[i].y - initLayouts[i].y};
           console.log(xy);
           console.log('xyjytkluuuuuuuuj,liu;ul,hj,lyu');
           return new ValueXY(xy);
       }
          
     )  
     this.setState({changedLayouts, transformStyles});
  }

  showImage() {
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
    
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        console.log(source);
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
    
        this.setState({
          avatarSource: source,
        });
      }
    });
  }

  addToLayout = (layout) => {
       let layoutArr = this.state.layoutArr;
       layoutArr = [...layoutArr, layout];
       this.setState({layoutArr})
  }

  addChooseIndex = (i) => {
      if(i == -1) {
        this.setState({chooseIndex: []})
        return;
      }
      const {chooseIndex} = this.state;
      this.setState({chooseIndex:[...chooseIndex, i]});
  }

  decChooseIndex = (i) => {
      let tempIndex = this.state.chooseIndex.slice();
      tempIndex.splice(tempIndex.indexOf(i), 1);
      this.setState({chooseIndex: tempIndex});
  }

  render() {
    const animatedStyle = {
      transform: this._animatedValue.getTranslateTransform()
    }

    const {chooseIndex} = this.state;
    return (
     
            <View style={styles.container}>
            {/* <Animated.View style={[styles.circle, animatedStyle]}></Animated.View>   */}
            {/* <Button onPress={this.handlePress.bind(this)} title={'press'}/> 
            <Button onPress={this.handlePress1.bind(this)} title={'press1'}/> 
            <Button onPress={this.handlePress2.bind(this)} title={'movies'}/>  */}

             {/* <DragBox addToLayout={(layout) => this.addToLayout(layout)} layoutArr={this.state.layoutArr} originIndex={i}>
                                  <Animated.View style={{width:.3*widths, height:120, marginRight: (i==0 || (i+1)%3) ? .03*widths : 0, marginBottom:15, ...transformStyle}}>
                                      <Image source={this.state.imgs[i]} style={{width:.3*widths, height:100}}/>
                                      <View style={{width:.3*widths, height:20, justifyContent:'center', alignItems:'center', backgroundColor:'yellowgreen'}}><Text>第{i+1}个</Text></View>
                                  </Animated.View>
                             </DragBox> */}
            <Button onPress={this.handlePress3.bind(this)} title={'interact'}/> 
            <Button onPress={this.handlePress5.bind(this)} title={'投注详情'}/> 
            <Button onPress={this.handlePress6.bind(this)} title={'快三'}/> 
            
            {/* <View style={{width:widths, flexDirection:'row', flexWrap:'wrap', paddingHorizontal:.02*widths, marginTop:20}}></View> */}
            <View style={{width:widths, paddingHorizontal:.02*widths, marginTop:20}}>
                 {
                      [1,1,1,1,1,1,1,1,1].map((v,i) => {
                           //const transformStyle = {transform: transformStyles[i].getTranslateTransform()};
                           const position = {
                                 position:'absolute',
                                 left: i%3*.33*widths + .02*widths,
                                 top: Math.floor(i/3)*135
                           }
                           return (
                             <DragBox chooseIndex={chooseIndex} decChooseIndex={(i) => this.decChooseIndex(i)} addToLayout={(layout) => this.addToLayout(layout)} addChooseIndex={(i) => this.addChooseIndex(i)} layoutArr={this.state.layoutArr} originIndex={i} style={{width:.3*widths, alignItems:'center', height:120, marginBottom:15, ...position}}>
                                  {/* <Animated.View style={{width:.3*widths, height:120, marginRight: (i==0 || (i+1)%3) ? .03*widths : 0, marginBottom:15}}> */}
                                  {/* <View style={{width:.3*widths, height:120, marginBottom:15, ...position}}> */}
                                      <Image source={this.state.imgs[i]} style={{width:.28*widths, height:98}}/>
                                      <View style={{width:.28*widths, height:18, justifyContent:'center', alignItems:'center', backgroundColor:'yellowgreen'}}><Text>第{i+1}个</Text></View>
                                  {/* </View> */}
                             </DragBox>
                           )
                      })
                 } 
            </View>
         </View>
    );
  }
}


// react navigation 需要注意的是 A - B - C - D 从D回到C D会unmount C不会mount 因为C被缓存 然后 从C回到B C会unmount B不会mount
const AppNavigator = createStackNavigator({
      Home:{
          screen: App
      },
      Detail:{
          screen: Detail
      },
      Web: {
          screen: Web
      },
      Go: {
          screen: GoScreen,
          // navigationOptions: {
          //   transitionConfig
          // }
      },
      // Act: {
      //     screen: Act
      // },
      Slider: {
          screen: Slider
      },

      Basket: {
          screen: Basket
      },
      // HighOrder: {
      //     screen: HighOrder
      // },
      // Gesture: {
      //     screen: Ges
      // },
      // Layout: {
      //     screen: Layout
      // },
      // Phone: {
      //   screen: Phone
      // },
      // Test: {
      //   screen: Test
      // },
      Accordion: {
        screen: Accordion
      },
      TapForward: {
        screen: TapForward
      },
      Chart: {
        screen: Twitter
      },
      Reanimated: {
        screen: Clock
      },
      Movies: {
        screen: Movies
      },
      Tinder: {
        screen: Tinder
      },
      Lottery: {
        screen: Lottery
      },
      KuaiSan: {
        screen: KuaiSan
      },
      Record: {
        screen: LotteryRecord
      }
},
{
  /* The header config from HomeScreen is now here */
  initialRouteName: 'Home',
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: '#f4511e',
      height: 0,
      overflow: 'hidden'
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold'
    }
  },
}
)

const Apps = createStackNavigator({
  Go: { screen: GoScreen },
    }, {
  initialRouteName: 'Go',
  transitionConfig
})

const AppContainer = createAppContainer(AppNavigator)

export default class Qwe extends Component {
    render() {
      return (
        <AppContainer
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
        />
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  topRow: {
    flexDirection: 'row'
  },
  top:{
    flexGrow:1,
    height:50
  },
  header: {
    backgroundColor:'#c0c0c0',
    height: 30,
    width: widths,
    justifyContent:'center'
  },
  content:{
    backgroundColor: '#f5d300',
    height:50,
    width: widths,
    justifyContent:'center'
  },
  circle: {
     borderRadius: 80,
     width:80,
     height:80,
     backgroundColor: 'pink',
     position: 'absolute',
     left:20,top:100
  }
});

 {/* <View style={styles.topRow}  onStartShouldSetResponder={() => alert('You click by View')}>
                  <View style={[styles.top, {backgroundColor:'yellow'}]}>      
                  </View>
                  <TouchableOpacity onPress={this.showImage.bind(this)}>
                    <View style={[styles.top, {backgroundColor:'green'}]}>
                       <Text>eeeeeeeeeeeee</Text>      
                    </View>
                  </TouchableOpacity> 
                  <View style={[styles.top, {backgroundColor:'pink'}]}>      
                  </View>
            </View>
            <Image source={this.state.avatarSource} style={{width:100, height:100}} /> */}  

 {/* <SectionList
              renderItem={({item, index, section}) => 
                    <View style={styles.header}>
                        <Text key={index}>{item}{index}</Text>
                    </View>  
              }
              renderSectionHeader={({section: {title}}) => (
                    <View style={styles.content}>
                        <Text>{title}</Text>
                    </View>    
              )}
              ListFooterComponent = {() => (
                    <View style={{height:50, backgroundColor:'orange', justifyContent:'center'}}>
                       <Text>this is then end of SectionList</Text>
                    </View>
              )}
              sections={[
                {title: 'Title1', data: ['item1', 'item2'], renderItem:overrideRenderItem},
                {title: 'Title2', data: ['item3', 'item4']},
                // {title: 'Title3', data: ['item5', 'item6']}
              ]}
              keyExtractor={(item, index) => item + index}
            /> */}


