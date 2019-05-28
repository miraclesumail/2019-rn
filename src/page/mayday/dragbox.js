import React, { Component } from 'react';
import { View, Animated, PanResponder, Easing } from 'react-native';

function inRange(cmp, des){
    const flagX = cmp.x >= des.leftTop.x && cmp.x <= des.rightBot.x;
    const flagY = cmp.y >= des.leftTop.y && cmp.y <= des.rightBot.y;

    return flagX && flagY;
}

class DragBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
         initLayouts:{},
         originIndex: props.originIndex,
         changedIndex: -1,
         zIndex:1
    };

    this.animatedValue = new Animated.ValueXY;
    this._value = {x:0, y:0}
    this.animatedValue.addListener((value) => {
        //console.log('aixbabbabababa');
        this._value = value;
        //console.log(value, this.state.originIndex);
    })

    this.hasFound = false;
    this.changedPos = null;
    this.firstLayout = true;

    // 是否刚刚着陆
    this.justLand = false;
    this.landXY = null;
    // 是否移动过
    this.hasTransfered = false;


    this._panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => !this.hasFound,
        onMoveShouldSetPanResponder: (evt, gestureState) => !this.hasFound,
        onPanResponderGrant: (evt, gestureState) => {
             this.setState({zIndex:10});
             console.log(evt.nativeEvent.pageX, evt.nativeEvent.pageY);
             if(this.hasFound) return;
             console.log(this.state.originIndex);
             console.log(this.props.layoutArr);
             this.animatedValue.setValue({
                x: 0,
                y: 0
             })            
        },
       
        onPanResponderMove: (evt, gestureState) => {

            if(this.hasFound) return;
            if(this.justLand) {
                 this.landXY = {x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY};
                 this.justLand = false;
            }

            if(this.state.zIndex == 1)  this.setState({zIndex:10});
            const {initLayouts:{x,y,width,height}, originIndex, changedIndex} = this.state;
            const {layoutArr} = this.props;

            // const posXY = changedIndex ? this.changedPos : {x,y};
            // 每次移动需要判断4个角 与其他矩形的交集
            // 需要判断是初始移动 还是已经移动过了的
            let topLeft, topRight, botLeft, botRight;

            if(changedIndex != -1) {
                console.log(this._value, 'console.log(this._valueconsole.log(this._valueconsole.log(this._valueconsole.log(this._value');
                const [x, y] = [layoutArr[changedIndex].leftTop.x, layoutArr[changedIndex].leftTop.y];
                topLeft = {x: x + this._value.x, y: y + this._value.y};
                topRight = {x: x + this._value.x + width, y: y + this._value.y}
                botLeft = {x: x + this._value.x, y: y + this._value.y + height}
                botRight = {x: x + this._value.x + width, y: y + this._value.y + height}
            }else{
                topLeft = {x: x + this._value.x, y: y + this._value.y};
                topRight = {x: x + this._value.x + width, y: y + this._value.y}
                botLeft = {x: x + this._value.x, y: y + this._value.y + height}
                botRight = {x: x + this._value.x + width, y: y + this._value.y + height}
            }

            for(let i = 0; i <layoutArr.length; i++) {
                    if((changedIndex == -1 && originIndex == i) || changedIndex == i) continue;

                    const tempLayout = layoutArr[i];
                    // 循环比较每一个layoutArr的元素

                    //this.checkPosIntersection([topLeft, topRight, botLeft, botRight], i, tempLayout);
                    if(inRange(topLeft, tempLayout)) {
                        const deltaX = tempLayout.rightBot.x - topLeft.x;
                        const deltaY = tempLayout.rightBot.y - topLeft.y;
                        const square = deltaX*deltaY;
                        if(!this.props.chooseIndex.includes(i)) this.props.addChooseIndex(i);
                        console.log(square);
                        if(square > 80*80) {
                            console.log(square);
                            console.log('于第' + i + 'okkk');           
                            // 将2个矩形区域 调换位置
                            this.movingBlock(i);
                            return 
                        }
                        continue
                    }
                    
                    if(inRange(topRight, tempLayout)) {
                            const deltaX = topRight.x - tempLayout.leftTop.x;
                            const deltaY = tempLayout.rightBot.y - topRight.y;
                            const square = deltaX*deltaY;
                            console.log(square);
                            if(!this.props.chooseIndex.includes(i)) this.props.addChooseIndex(i);
                            if(square > 80*80) {
                                console.log('在右上角' + changedIndex + 'dddd格尔和人格ddddddd');
                                this.movingBlock(i);  
                                return                           
                            }
                            continue
                    }

                    if(inRange(botLeft, tempLayout)) {
                            console.log(tempLayout);
                            const deltaX = tempLayout.rightBot.x - botLeft.x;
                            const deltaY = botLeft.y - tempLayout.leftTop.y;
                            const square = deltaX*deltaY;
                            if(!this.props.chooseIndex.includes(i)) this.props.addChooseIndex(i);
                            if(square > 80*80) {
                                console.log('于第' + i + 'okkk123');
                                this.movingBlock(i);
                                return; 
                            }
                            continue
                    }

                    if(inRange(botRight, tempLayout)) {
                        const deltaX = botRight.x - tempLayout.leftTop.x;
                        const deltaY = botRight.y - tempLayout.leftTop.y;
                        const square = deltaX*deltaY;
                        if(!this.props.chooseIndex.includes(i)) this.props.addChooseIndex(i);
                        if(square > 80*80) {
                            console.log(square);
                            console.log('于第' + i + 'okkk456');
                            this.movingBlock(i);
                            return; 
                        }
                        continue
                    }
            }

            // 手势连续拖动 如何解决
            if(this.hasTransfered){
                this.animatedValue.setValue({x: evt.nativeEvent.pageX - this.landXY.x, y: evt.nativeEvent.pageY - this.landXY.y});
            } else {
                // block在自我运动的时候 不监听
                if(!this.hasFound)
                    Animated.event([
                        null, { dx: this.animatedValue.x, dy: this.animatedValue.y}
                    ])(evt, gestureState);
            }    
        },
        onPanResponderRelease: (evt, gestureState) => {
            console.log('release');
            this.hasTransfered = false;
            if(!this.hasFound) {
                Animated.timing(this.animatedValue, {
                    toValue: {x:0, y:0},
                    duration: 300,
                    easing: Easing.linear
                }).start(() => {
                    this.setState({zIndex:1});
                    this.props.addChooseIndex(-1);
                })
            }     
        }
     })

    this.$react.subscribe('changePlace', (msg, data) => {
         
         const {originIndex, changedIndex} = this.state;
         this.setState({zIndex:5});
         const {layoutArr} = this.props;
         const hasChanged = changedIndex != -1;
         if(hasChanged && changedIndex != data.moveIndex) return;
         const flag = changedIndex == data.moveIndex || originIndex == data.moveIndex;
         if(!flag) return;
         console.log('打开看看扩扩扩扩扩扩扩扩扩扩扩扩扩'+ originIndex);
         
         const tempIndex = hasChanged ? changedIndex : originIndex;
       
         const destination = layoutArr[data.toIndex];
         const xy = {x:destination.leftTop.x - layoutArr[tempIndex].leftTop.x, y: destination.leftTop.y - layoutArr[tempIndex].leftTop.y}
         this.hasFound = true;
         Animated.timing(this.animatedValue, {
            toValue: xy,
            duration: 300,
            easing: Easing.linear
         }).start(() => {
            this.hasFound = false;
            const {style} = this.props;
            this.changedPos = !this.changedPos ? {
                 left: style.left + xy.x,
                 top: style.top + xy.y
            } : {
                 left: this.changedPos.left + xy.x,
                 top: this.changedPos.top + xy.y 
            }
            this.animatedValue.setOffset({x:0, y:0});
            this.animatedValue.setValue({x:0, y:0});
            this.setState({changedIndex: data.toIndex, zIndex:1});
         })          
    });
  }

  checkPosIntersection = (disArrs, index, tempLayout) => {
        for(let i = 0; i < disArrs.length; i++){
            let key = null;
            if(inRange(disArrs[i], tempLayout)) key = i;
            let deltaX, deltaY, square;
            if(key == 0){
                deltaX = tempLayout.rightBot.x - topLeft.x;
                deltaY = tempLayout.rightBot.y - topLeft.y;
            }
            if(key == 1){
                deltaX = topRight.x - tempLayout.leftTop.x;
                deltaY = tempLayout.rightBot.y - topRight.y;
            }
            if(key == 2){
                deltaX = tempLayout.rightBot.x - botLeft.x;
                deltaY = botLeft.y - tempLayout.leftTop.y;
            }
            if(key == 3){
                deltaX = botRight.x - tempLayout.leftTop.x;
                deltaY = botRight.y - tempLayout.leftTop.y;
            }
            square = deltaX*deltaY;

            if(!this.props.chooseIndex.includes(index)) this.props.addChooseIndex(index);
            
            if(square > 80*80) {
                console.log('在右上角' + changedIndex + 'dddd格尔和人格ddddddd');
                this.movingBlock(index);
                return                           
            }    
            if(key) break;    
        }    
  }

  movingBlock = (i) => {
        const {changedIndex , originIndex} = this.state;
        const {layoutArr} = this.props;
        this.hasFound = true;
        const tempIndex = changedIndex != -1 ? changedIndex : originIndex;
        const xy = {x: layoutArr[i].leftTop.x - layoutArr[tempIndex].leftTop.x, y: layoutArr[i].leftTop.y - layoutArr[tempIndex].leftTop.y};
        this.animatedValue.setOffset({x:0, y:0});
        Animated.timing(this.animatedValue, {
            toValue: xy,
            duration: 300,
            easing: Easing.linear
        }).start(() => {
           
            const {style} = this.props;
            this.changedPos = !this.changedPos ? {
                left: style.left + xy.x,
                top: style.top + xy.y
            } : {
                left: this.changedPos.left + xy.x,
                top: this.changedPos.top + xy.y 
            }
          
            this.animatedValue.setOffset({x:0, y:0});
            this.animatedValue.setValue({x:0, y:0});
            this.setState({changedIndex: i});
            this.hasFound = false; 
            
            if(!this.hasTransfered) 
                this.hasTransfered = true;

            this.justLand = true;
            this.setState({zIndex:1});
            this.props.addChooseIndex(-1);
        });
        this.$react.publish('changePlace', {moveIndex: i, toIndex: tempIndex});
  }
  
  layOut = ({nativeEvent: {layout: {x, y, width, height}}}) => {
        if(!this.firstLayout) return;
        console.log('哎哟 我我我欧豆豆');
        this.setState({initLayouts: {x, y, width, height}});
        this.firstLayout = false;
        this.props.addToLayout({leftTop:{x,y}, rightBot:{x: x + width, y: y + height}});
  }

  render() {
    const {children, style, chooseIndex} = this.props; 
    const {originIndex, changedIndex} = this.state;
    const addition = (changedIndex != -1 && chooseIndex.includes(changedIndex)) || (changedIndex == -1 && chooseIndex.includes(originIndex)) ? {borderWidth:1.5, borderColor:'red'} : {};
    const transformStyle = this.changedPos ? {
        ...style,
        zIndex: this.state.zIndex,
        left: this.changedPos.left , top: this.changedPos.top,
        transform: this.animatedValue.getTranslateTransform(),
        ...addition     
    } : {
        ...style,
        zIndex: this.state.zIndex,
        transform: this.animatedValue.getTranslateTransform(),
        ...addition      
    };
    
    // if(this.hasFound && this.state.originIndex == 6) console.log(this._value, '妈妈妈妈妈妈们什么什么面对面的面对面的');
    
    return (
      <Animated.View style={{...transformStyle, }} {...this._panResponder.panHandlers} onLayout={this.layOut}>
           {children}
      </Animated.View>
    )
  }
}

export default DragBox;
