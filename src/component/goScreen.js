import React, { Component } from 'react'

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { NavigationActions, StackActions } from 'react-navigation'

// 调用 dispatch
export const myAction = () => {
    const nav = NavigationActions.navigate({
      //Let's navigate to Main first
      routeName: 'Main',
      params: {},
      // and then go to BookList 子路由
      action: NavigationActions.navigate({ routeName: 'BookList' })
    });
    return nav;
  };


const backgroundColors = ['#2980b9', '#d35400', '#16a085', '#2c3e50', '#7f8c8d']
const headerColors = ['#f39c12', '#8e44ad', '#2980b9', '#16a085', '#c0392b']

class GoScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    const screenNumber = navigation.state.params ? navigation.state.params.screenNumber : 0
    const headerColor = headerColors[screenNumber % headerColors.length]
    return {
      title: `I am screen ${screenNumber}`,
      headerStyle: {
        backgroundColor: headerColor,
        height: 85,
      },
      headerTitleStyle: {
        color: 'white'
      },
    }

  }

  goForward = () => {
    const screenNumber = this.props.navigation.state.params ? this.props.navigation.state.params.screenNumber : 0
    const params = { screenNumber: screenNumber + 1 }
    // if (Math.random() > .75) params.plain = true
  
    this.props.navigation.push('Go', params)
   
  }

  reset = () => {
    const screenNumber = this.props.navigation.state.params ? this.props.navigation.state.params.screenNumber : 0
    const popAction = StackActions.pop({
        n: screenNumber
    });

    // const resetAction = StackActions.reset({
    //      index: 0,
    //      actions: [
    //        NavigationActions.navigate({ routeName: 'Go'})
    //      ],
    //    })
    this.props.navigation.dispatch(popAction)
  }

  render() {
    const { navigation } = this.props
    const screenNumber = navigation.state.params ? navigation.state.params.screenNumber : 0
    const backgroundColor = backgroundColors[screenNumber % backgroundColors.length]
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={[styles.jumbo, {textShadowColor: 'yellow', textShadowRadius: 50}]}>{screenNumber}</Text>
        <TouchableOpacity onPress={this.goForward}><Text style={styles.textButton}>GO FORWARD!</Text></TouchableOpacity>
          <TouchableOpacity onPress={this.reset}><Text style={styles.textButton}>RESET!</Text></TouchableOpacity>
      </View>
    )
  }
}

export default GoScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    alignItems: 'center',
    backgroundColor: '#2980b9'
  },
  textButton: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    padding: 15
  },
  jumbo: {
    fontSize: 60,
    color: 'white',
    fontWeight: 'bold',
    padding: 15,
  }
})

