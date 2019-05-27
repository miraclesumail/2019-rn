import React, { Component } from 'react';
import { View, Animated, PanResponder, Easing } from 'react-native';
import SharedSnackbarConsumer from '../../../App'

function inRange(cmp, des){
    const flagX = cmp.x >= des.leftTop.x && cmp.x <= des.rightBot.x;
    const flagY = cmp.y >= des.leftTop.y && cmp.x <= des.rightBot.y;

    return flagX && flagY;
}

class DragBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
         initLayouts:{},
         originIndex: props.originIndex,
         changedIndex: -1
    };

    this.animatedValue = new Animated.ValueXY;
    this._value = {x:0, y:0}
    this.animatedValue.addListener((value) => {
        console.log('aixbabbabababa');
        this._value = value;
    })

    this.hasFound = false;

    this._panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onPanResponderGrant: (evt, gestureState) => {
             console.log(this.props.layoutArr);
             this.animatedValue.setOffset({
                 x: this._value.x,
                 y: this._value.y
             })
             this.animatedValue.setValue({
                x: 0,
                y: 0
             })            
        },
       
        onPanResponderMove: (evt, gestureState) => {
            if(this.hasFound) return;
            const {initLayouts:{x,y,width,height}, originIndex} = this.state;
            const {layoutArr} = this.props;
            // 每次移动需要判断4个角 与其他矩形的交集
            const topLeft = {x: x + this._value.x, y: y + this._value.y};
            const topRight = {x: x + this._value.x + width, y: y + this._value.y}
            const botLeft = {x: x + this._value.x, y: y + this._value.y + height}
            const botRight = {x: x + this._value.x + width, y: y + this._value.y + height}

            for(let i = 0; i <layoutArr.length; i++) {
                    if(originIndex == i) continue;
                    const tempLayout = layoutArr[i];
                    // 循环比较每一个layoutArr的元素
                    if(inRange(topLeft, tempLayout)) {
                        const deltaX = tempLayout.rightBot.x - topLeft.x;
                        const deltaY = tempLayout.rightBot.y - topLeft.y;
                        const square = deltaX*deltaY;

                        if(square > 80*80) {
                            console.log(square);
                            console.log('于第' + i + 'okkk');
                            
                            // 将2个矩形区域 调换位置
                           // const xy = {x: tempLayout.leftTop.x - x, y: tempLayout.leftTop.y - y};
                            this.hasFound = true;
                            const xy = {x: layoutArr[i].leftTop.x - layoutArr[originIndex].leftTop.x, y: layoutArr[i].leftTop.y - layoutArr[originIndex].leftTop.y};
                            Animated.timing(this.animatedValue, {
                                toValue: new Animated.ValueXY({x:300,y:300}),
                                duration: 1000,
                                easing: Easing.linear
                            }).start(() => {
                                console.log('ffifofo');
                                this.setState({changedIndex: i})
                            });
                            this.$react.publish('changePlace', {moveIndex: i, toIndex: originIndex});
                            // 需要通知 对应的矩形调换位置 通过index
                            break; 
                        }
                        continue
                    }

                    if(inRange(topRight, tempLayout)) {
                            const deltaX = topRight.x - tempLayout.leftTop.x;
                            const deltaY = tempLayout.rightBot.y - topRight.y;
                            const square = deltaX*deltaY;
    
                            if(square > 80*80) {
                                console.log(square);
                                console.log('于第' + i + 'okkk');
                                this.hasFound = true;
                                break; 
                            }
                            continue
                    }

                    if(inRange(botLeft, tempLayout)) {
                            const deltaX = tempLayout.rightBot.x - botLeft.x;
                            const deltaY = botLeft.y - tempLayout.leftTop.y;
                            const square = deltaX*deltaY;
    
                            if(square > 80*80) {
                                console.log(square);
                                console.log('于第' + i + 'okkk');
                                this.hasFound = true;
                                break; 
                            }
                            continue
                    }

                    if(inRange(botRight, tempLayout)) {
                        const deltaX = botRight.x - tempLayout.leftTop.x;
                        const deltaY = botRight.y - tempLayout.leftTop.y;
                        const square = deltaX*deltaY;

                        if(square > 80*80) {
                            console.log(square);
                            console.log('于第' + i + 'okkk');
                            this.hasFound = true;
                            break; 
                        }
                        continue
                    }
            }
            Animated.event([
                null, { dx: this.animatedValue.x, dy: this.animatedValue.y}
            ])(evt, gestureState);
        },
            
             

        //     Animated.event([
        //         null, { dx: this.animatedValue.x, dy: this.animatedValue.y}
        //     ]);
        // },
        onPanResponderRelease: (evt, gestureState) => {
            console.log('release')
            this.animatedValue.flattenOffset()
        }
    })

    this.$react.subscribe('changePlace', (msg, data) => {
         const {originIndex, changedIndex} = this.state;
         //if()
    });
  }

  layOut = ({nativeEvent: {layout: {x, y, width, height}}}) => {
        this.setState({initLayouts: {x, y, width, height}});
        this.props.addToLayout({leftTop:{x,y}, rightBot:{x: x + width, y: y + height}});
  }

  render() {
    const {children} = this.props;
    const transformStyle = {
        transform: this.animatedValue.getTranslateTransform()
    }
    return (
      <Animated.View style={{...transformStyle}} {...this._panResponder.panHandlers} onLayout={this.layOut}>
           {children}
      </Animated.View>
    )
  }
}

export default DragBox;
