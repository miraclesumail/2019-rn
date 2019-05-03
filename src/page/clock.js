import React, { Component } from 'react'
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Button } from "react-native";
import Animated, { Easing, Transitioning, Transition } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
const { cond, eq, add, call, set, Value, event, interpolate, Extrapolate, block, Clock, clockRunning, timing, startClock, stopClock } = Animated;

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

class Shuffle extends Component {
      // 我tm发现这里非要把items 放在state里面 如果是修改this.items 不会重新渲染
      state = {
            items:[
                '🍇 Grapes',
                '🍈 Melon',
                '🍉 Watermelon',
                '🍊 Tangerine',
                '🍋 Lemon',
                '🍌 Banana',
            ]
      }
    
      ref = React.createRef();

      transition = (
            <Transition.Sequence>
                <Transition.Change interpolation="easeInOut" />
            </Transition.Sequence>
      )

      press = () => {
            this.ref.current.animateNextTransition();
            const shuffled = this.state.items.slice();
            this.setState({items: shuffle(shuffled)});          
      }

      render() {
            const children = this.state.items.map(item => (
                <Text style={styles.text} key={item}>
                {item}
                </Text>
            ))

            return (
                <Transitioning.View
                ref={this.ref}
                transition={this.transition}
                style={styles.centerAll}>
                <Button
                    title="shuffle"
                    color="#FF5252"
                    onPress={this.press}
                />
                    {children}
                </Transitioning.View>
            )
      }
}


 class Clocks extends Component {
  state = {
        clock: new Clock(),
        translation: new Value(0),
  }

  onPress = () => {
    console.log('press');
    startClock(this.state.clock);
  }

  getTranslation = (clock, translation) => {
    const state = {
        finished: new Value(0),
        position: translation,
        time: new Value(0),
        frameTime: new Value(0),
    };

    const config = {
        duration: 2000,
        toValue: new Value(300),
        easing: Easing.linear,
    };

    return block([
        cond(clockRunning(clock), 0, [
            set(state.finished, 0),
            set(state.position, 0),
            set(state.time, 0),
            set(state.frameTime, 0),
            startClock(clock),
        ]),
        timing(clock, state, config),
        cond(state.finished, [
            stopClock(clock),
            set(state.finished, 0),
            set(state.position, 0),
            set(state.time, 0),
            set(state.frameTime, 0),      
            startClock(clock)    
        ]),
        state.position
    ]);
  }    

  render() {
    const translation = this.getTranslation(
        this.state.clock,
        this.state.translation
    );
    return (
      <View>
         <TouchableOpacity onPress={this.onPress}>
            <Animated.View style={[styles.circle, { transform: [
                    {
                    translateX: translation
                    }]}]}></Animated.View> 
        </TouchableOpacity>   

        <Shuffle/>    
      </View>
    )
  }
}

export default Clocks

const styles = StyleSheet.create({
    circle: {
        width: 50,
        height: 50,
        backgroundColor: '#f5d300'
    },
    centerAll: {
       
        alignItems: 'center',
        marginTop: 100,
    },
    text: {
        marginTop: 10,
    }
})

