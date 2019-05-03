import React, { Component } from 'react'
import { Text, View, ART, Dimensions, Animated, TouchableWithoutFeedback, requireNativeComponent, StyleSheet } from 'react-native'

const { Surface, Group, Shape, Path } = ART;
const { width, height } = Dimensions.get('window');
const HEART_SVG = "M130.4-0.8c25.4 0 46 20.6 46 46.1 0 13.1-5.5 24.9-14.2 33.3L88 153.6 12.5 77.3c-7.9-8.3-12.8-19.6-12.8-31.9 0-25.5 20.6-46.1 46-46.2 19.1 0 35.5 11.7 42.4 28.4C94.9 11 111.3-0.8 130.4-0.8"
var HEART_COLOR = 'rgb(226,38,77,1)';
var GRAY_HEART_COLOR = "rgb(204,204,204,1)";

const R = width*.5 - 8;

const Bulb = requireNativeComponent("Bulb")

// 176 154
const AnimatedShape = Animated.createAnimatedComponent(Shape);

function getXYParticle(total, i, radius) {
    var angle = ( (2*Math.PI) / total ) * i;
  
    var x = Math.round((radius*2) * Math.cos(angle - (Math.PI/2)));
    var y = Math.round((radius*2) * Math.sin(angle - (Math.PI/2)));
    return {
      x: x,
      y: y
    }
  }
  
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  
  function shuffleArray(array) {
      for (var i = array.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
  }

  class Circle extends Component {
    render () {

        let radius = this.props.radius;
        let circle = Path().moveTo(0,-radius)
            .arc(0,2 * radius, radius)
            .arc(0,-2 * radius, radius)
            .close();

        return (
            <AnimatedShape d={circle} {...this.props} />
        )
    }
}

export class Twitter extends Component {

    state = {
        animation: new Animated.Value(0),
        isOn: false
    }

    scale = this.state.animation.interpolate({
        inputRange:  [0, .01, 6, 10, 12, 18],
        outputRange: [1, 0, .1, 1, 1.2, 1],
        extrapolate: 'clamp'
    })

    fill = this.state.animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(243,243,243)', 'rgba(235,65,61)'],
        extrapolate: 'clamp'
    })

    left = this.state.animation.interpolate({
        inputRange:  [0, .01, 6, 10, 12, 18],
        outputRange: [.5*width - 88, .5*width, .5*width - 8.8, .5*width - 88, .5*width - 53, .5*width - 88 ],
        extrapolate: 'clamp'
    })

    top = this.state.animation.interpolate({
        inputRange:  [0, .01, 6, 10, 12, 18],
        outputRange: [.5*height - 77, .5*height, .5*height - 7.7, .5*height - 77, .5*height - 46, .5*height - 77 ],
        extrapolate: 'clamp'
    })

    componentDidMount() {
        //this.animate();
    }
    
    _onStatusChange = e => {
        this.setState({ isOn: e.nativeEvent.isOn});
    }

    animate = () => {
        Animated.timing(this.state.animation, {
            toValue: 28,  // 可以假设是做了一个28帧的gif
            duration: 2000
        }).start();
    }

    render() {
        const x = .5*width + Math.cos(Math.PI/3)*R;
        const y = .5*height - Math.sin(Math.PI/3)*R;
        return (
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={styles.bottom} >
            <Text>This state of Bulb come from Native Code to JavaScript</Text>
            <Text>{this.state.isOn ? "Bulb is On" : "Bulb is Off"}</Text>
        </View>
            {/* <TouchableWithoutFeedback onPress={this.animate}>
                   <View>
                        <Surface height={height} width={width}>
                                <AnimatedShape 
                                d={HEART_SVG}
                                x={this.left}
                                y={this.top}
                                scale={this.scale}
                                fill={this.fill}
                                />

                                  <Circle
                                    x={x}
                                    y={y}
                                    fill='yellow'
                                    stroke='blue'
                                    radius={3}
                                />
                        </Surface>

                      
                   </View> 
            </TouchableWithoutFeedback>    */}
            <Bulb style={ styles.bottom } isOn={this.state.isOn}  onStatusChange={this._onStatusChange}/>
        </View>
        )
    }
}

export default Twitter

const styles = StyleSheet.create({
    bottom: {
        marginTop:60,
        width:320,
        height:120
    }
})    

