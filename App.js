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
  SectionList, Dimensions, Animated, Button, UIManager, YellowBox, Image} from 'react-native';
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
import Basket from './src/page/mayday/lotteryBasket'
import Axios from './src/tool/axios'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

Component.prototype.$react = PubSub;

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

class App extends Component {
  state = {
      avatarSource: ''
  }
  
  componentWillMount() {
       this._animatedValue = new Animated.ValueXY(0,0);
       this._animatedValue.addListener((value) => console.log(value));
  }

  componentDidMount() {
      const appName = DeviceInfo.getDeviceName();
      console.log('appName');
       //this.handlePress()
      fetch('http://192.168.93.227:3000/customer/customers')
      .then(response => response.json())
      .then(data => {
        console.log(data) // Prints result from `response.json()` in getRequest
      })
      .catch(error => console.error(error))
       //this.handlePress()
      //Axios.ajax({url:'/customers'})
      //fetch('https://192.168.93.227:3000/customer/customers').then(res => console.log(res.json()));
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

  render() {
    const animatedStyle = {
      transform: this._animatedValue.getTranslateTransform()
    }
    return (
      <View style={styles.container}>
            <View style={styles.topRow}  onStartShouldSetResponder={() => alert('You click by View')}>
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
            <Image source={this.state.avatarSource} style={{width:100, height:100}} />

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

            <Animated.View style={[styles.circle, animatedStyle]}></Animated.View>  
            <Button onPress={this.handlePress.bind(this)} title={'press'}/> 
            <Button onPress={this.handlePress1.bind(this)} title={'press1'}/> 
            <Button onPress={this.handlePress2.bind(this)} title={'movies'}/> 
            <Button onPress={this.handlePress3.bind(this)} title={'interact'}/> 
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
    alignItems: 'center',
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


