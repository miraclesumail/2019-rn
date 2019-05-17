import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import Animated, {Easing} from 'react-native-reanimated'
import { PanGestureHandler, State } from 'react-native-gesture-handler';
 
const {event, sub, set, cond, startClock, stopClock, Value, block, spring, add, Clock, clockRunning, debug, eq, and, timing} = Animated;

function runSpring(clock, value, dest){
    const state = {
        finished: new Value(0),
        velocity: new Value(0),
        position: new Value(0),
        time: new Value(0)
    }

    const config = {
        toValue: new Value(0),
        damping: 5, // friction to stop
        mass: 20, // times for movement
        stiffness: 101.6,
        overshootClamping: false,
        restSpeedThreshold: 0.001,
        restDisplacementThreshold: 0.001,
    };

    return block([
        cond(clockRunning(clock), 0 , [
            set(state.finished, 0),
            set(state.time, 0),
            set(state.position, value),
            set(state.velocity, 0),
            set(config.toValue, dest),
            startClock(clock)
        ]),
        spring(clock, state, config),
        cond(state.finished, debug('stop clock', stopClock(clock))),
        state.position,
    ])
}

const getAnimation = (min, max) => {
    const clock = new Clock();
    const state = {
      finished: new Value(1),
      position: new Value(min),
      time: new Value(0),
      frameTime: new Value(0),
    };
  
    const config = {
      duration: 500,
      toValue: new Value(0),
      easing: Easing.inOut(Easing.ease),
    };
  
    const reset = [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.frameTime, 0),
    ];
  
    // 控制来回滚动  只要clock没有被 stop
    return block([
      cond(and(state.finished, eq(state.position, min)), [
        ...reset,
        set(config.toValue, max),
      ]),
      cond(and(state.finished, eq(state.position, max)), [
        ...reset,
        set(config.toValue, min),
      ]),
      cond(clockRunning(clock), 0, startClock(clock)),
      timing(clock, state, config),
      state.position,
    ]);
  };
  
class Box extends React.Component {
    render() {
      const { style, ...props } = this.props;
      return <Animated.View style={[styles.box, style]} {...props} />;
    }
}

class Tinder extends Component {
    constructor(props) {
        super(props);
        const clock = new Clock();

        const dragX = new Value(0);
        const state = new Value(-1);
        const transX = new Value(0);
        const prevDragX = new Value(0);

        this._trans = runSpring(clock, 10, 150);

        this.max = getAnimation(100, 50);

        this._onGestureEvent = event([
            { nativeEvent: { translationX: dragX, state: state } },
        ])

        this._transX = cond(eq(state, State.ACTIVE), [
            set(transX, add(transX, sub(dragX, prevDragX))),
            set(prevDragX, dragX),
            transX
        ], [set(prevDragX, 0), transX])
      }


      componentDidMount() {}

      render() {
        return (
          <Animated.View
            style={[styles.container]}>  
            <Animated.View style={[styles.box, { top: this._trans }]} />

            <Animated.View
            style={[styles.line, { transform: [{ translateX: this.max }] }]}
          />

            <PanGestureHandler onGestureEvent={this._onGestureEvent} onHandlerStateChange={this._onGestureEvent} maxPointers={1}>
                 <Box style={{ transform: [{ translateX: this._transX }] }} />
            </PanGestureHandler>   
          </Animated.View>
        );
      }
}

export default Tinder

const BOX_SIZE = 100;

const styles = StyleSheet.create({
  text: {
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#fb628c',
    backgroundColor: '#2e13ff',
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderColor: '#f900ff',
    alignSelf: 'center',
    backgroundColor: '#19ff75',
    margin: BOX_SIZE / 2,
  },
  line: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: 'red',
    height: 64,
    width: 5
  }
});
