import React, { Component, PropTypes, Fragment } from 'react';
import {
  Dimensions,
  PanResponder,
  View, Text, Animated, Easing, TouchableWithoutFeedback
} from 'react-native';
import { transformOrigin, rotateXY, rotateXZ } from './utils';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const styles = {
  container: {
    position: 'absolute',
    left: WIDTH / 2 - 25,
    top: HEIGHT / 2 - 25,
    width: 50,
    height: 50,
    backgroundColor: "transparent"
  },
  rectangle: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 50,
    height: 50,
    zIndex: 10,
    justifyContent:'center', 
    alignItems:'center'
  },
  box: {
    position: 'absolute',
    left: 0,
    top: 0, 
    width: 50,
    height: 50
  },
  sumArea: {
    width: .2*WIDTH,
    height: .15*WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  }
};

export default class Cube extends Component {
  state = {
      isFinish: false,
      sumArr: Array.from({length: 16}, (v,i) => i + 3),
      sumAxis:[],
      diceAxis: {},
      diceResult: [],
      isNowAnimating: false,
      finalResult: 0
  }

  startAnimating = () => {
      if(this.state.isNowAnimating) return;
      const diceResult = [1 + (Math.random()*5 | 0), 1 + (Math.random()*5 | 0), 1 + (Math.random()*5 | 0)];
      console.log(diceResult);
      this.setState({finalResult: 0});
      this.setState({diceResult}, () => this.setState({isNowAnimating: true}))    
  }
  
  // 计算每个和值的坐标
  onLayout = ({nativeEvent: {layout: {x, y}}}) => {
         let sumAxis = [];
         this.state.sumArr.forEach((item, index) => {
              // 横竖计算
              let h = index % 4, v = (index / 4) | 0;
              sumAxis.push({x: x + .25*WIDTH*h, y: y + .25*WIDTH*v});
         })
         this.setState({sumAxis})
  }

  render() {
    const {diceResult, isNowAnimating, finalResult, sumAxis} = this.state;
    const result = diceResult.length ? diceResult.reduce((prev, next) => prev + next) : 0;
    return (
         <View style={{width: WIDTH, height: HEIGHT, alignItems:'center', backgroundColor:'#191C24'}}>
             <View style={{width: .95*WIDTH, height: .9*WIDTH, flexDirection:'row', flexWrap:'wrap', marginTop:20}} onLayout={this.onLayout}>
                   {
                    this.state.sumArr.map((item, index) => (
                        <View style={[styles.sumArea, {marginRight: (index+1) % 4 ? .05*WIDTH : 0, marginBottom: index >= 12 ? 0 : .1*WIDTH, backgroundColor: result == item && finalResult ? '#FF7F24' : '#FFC0CB'}]} >
                            <Text>{item}</Text>
                        </View>
                    ))     
                   }
             </View>

             {
                isNowAnimating ? 
               <GameBox diceResult={diceResult} sumAxis={sumAxis} setFinalResult={(num) => this.setState({finalResult: num})} animatedEnd={() => this.setState({isNowAnimating: false})}/>: null
             }

             <TouchableWithoutFeedback onPress={() => this.startAnimating()}>
                    <View style={{position:"absolute", bottom:80, left: .5*WIDTH - 50, width:100, height:40, borderRadius:20, backgroundColor:'#5DB8E8',  justifyContent: 'center',
    alignItems: 'center'}}>
                        <Text>Lets go go </Text>
                    </View>
             </TouchableWithoutFeedback>  
         </View>
    );
  }
}

class GameBox extends Component {
    state = {
        diceAxis: {}
    }

    componentWillMount() {
        this.count = 1;
        this.position1 = new Animated.ValueXY();
        this.position2 = new Animated.ValueXY();
        this.position3 = new Animated.ValueXY();
    
        this.opacity1 = new Animated.Value(1);
        this.opacity2 = new Animated.Value(1);
        this.opacity3 = new Animated.Value(1);
      }
    
      componentDidMount() {
            this.moveEveryFrame();
            this.timer =  setInterval(() => {
                 this.moveEveryFrame();
                 if(this.count == 73) {
                     clearInterval(this.timer);
                     this.dice1.finishRotate();
                     this.dice2.finishRotate();
                     this.dice3.finishRotate();
    
                     this.position1.setValue({x: 25, y: 125});
                     this.position2.setValue({x: 125, y: 125});
                     this.position3.setValue({x: 75, y: 25});
    
                     setTimeout(() => {
                         this.MoveToDes();
                     }, 1000)
                 }
             }, 1000/60)
      }

      onLayoutBox = ({nativeEvent: {layout: {x, y}}}) => {
        this.setState({diceAxis:{x, y}}) 
      }

      MoveToDes = () => {
        const {diceAxis} = this.state;
        const {setFinalResult, sumAxis, animatedEnd, diceResult} = this.props;
        const result = diceResult.reduce((prev, next) => prev + next);
        //const result = diceResult.reduce((prev, next) => prev + next) - 3;
        for(let i = 0; i < diceResult.length; i++) { 
              let deltaX = sumAxis[result-3].x + .1*WIDTH - (diceAxis.x + 25);
              let deltaY = sumAxis[result-3].y + .075*WIDTH - (diceAxis.y + 25);
              Animated.timing(i == 0 ? this.position1 : i == 1 ? this.position2 : this.position3, {
                  toValue: {x: deltaX, y:deltaY},
                  duration: 1000,
                  easing: Easing.bezier(.31,.44,.76,.86)
              }).start()

              Animated.timing(i == 0 ? this.opacity1 : i == 1 ? this.opacity2 : this.opacity3, {
                  toValue: 0,
                  duration: 800,
                  easing: Easing.linear
              }).start(() => {
                  setFinalResult(result);
                  animatedEnd();
              })
        }
      } 

        /**
     *  200*200
     *  1: {0-25, 75-100}     [{5, 90}, { 25-50, 75-100}, ]
     *  2: {75-100, 75-100}   [{88, 90}, { 75-100, 75-100}, ]
     *  3:                    [{25-75, 0-25}, {}]
     *  (12)3 (123)  (13)2 (123)  1(23) (123)    (12)3 
     **/
    moveEveryFrame = () => {
        let pos1, pos2, pos3;
        let mod = this.count % 6;
        // 第一回合  12相撞
        if(mod % 6 == 1) {
            const x1 = 25 + Math.random()*50
            pos1 = {x: x1, y: 120 + Math.random()*30}
            pos2 = {x: x1 + 50, y: 120 + Math.random()*30}
            pos3 = {x: 50 + Math.random()*50, y: Math.random()*30}
        }

        // 第 2 4 6 回合 1 2 3各自在自己区域活动
        if([2,4,0].includes(mod)) {
            pos1 = {x: Math.random()*50, y: 120 + Math.random()*30},
            pos2 = {x: 100 + Math.random()*50, y: 120 + Math.random()*30},
            pos3 = {x: 50 + Math.random()*50, y: Math.random()*30}
        }

        // 第三回合  13碰撞
        if(mod % 6 == 3) {
            const x1 = 20 + Math.random()*30;
            const y1 = 75 + Math.random()*50;
            pos1 = {x: x1, y: y1};
            pos3 = {x: x1 + Math.random()*50, y: y1 - 50};
            pos2 = {x: 100 + Math.random()*50, y: 120 + Math.random()*30};
        }

        // 第五回合  23碰撞
        if(mod % 6 == 5) {
        const x2 = 100 + Math.random()*30;
        const y2 = 75 + Math.random()*50;
        pos2 = {x: x2, y: y2};
        pos3 = {x: x2 - Math.random()*50, y: y2 - 50};
        pos1 = {x: Math.random()*50, y: 120 + Math.random()*30};
        }   

        this.position1.setValue(pos1);
        this.position2.setValue(pos2);
        this.position3.setValue(pos3);
        this.count = this.count + 1;
    } 
    
    render() {
        return (
            <View style={{width:200, height:200, position:'absolute', left:.5*WIDTH - 100, top:.5*HEIGHT - 100}} onLayout={this.onLayoutBox}>
                <Animated.View style={[styles.box, { backgroundColor: 'transparent', transform: this.position1.getTranslateTransform(), opacity: this.opacity1}]}>
                    <Dice dice={this.props.diceResult[0]}  ref={component => this.dice1 = component}/>
                </Animated.View>
                <Animated.View style={[styles.box, { backgroundColor: 'transparent', transform: this.position2.getTranslateTransform(), opacity: this.opacity2}]}>
                    <Dice dice={this.props.diceResult[1]}  ref={component => this.dice2 = component}/>
                </Animated.View>
                <Animated.View style={[styles.box, { backgroundColor: 'transparent', transform: this.position3.getTranslateTransform(), opacity: this.opacity3}]}>
                    <Dice dice={this.props.diceResult[2]}  ref={component => this.dice3 = component}/>
                </Animated.View>
            </View>
        ) 
    }
}

class Dice extends Component {
    constructor(props){
        super(props);
        this.state = {
             isFinish: false
        }
        this.diceArr = [[260, 10], [80, 10], [-10, -10], [170, 10], [-10, 80]];
    }

    componentDidMount() {
           this.timer = setInterval(() => {   
               this.rotateEveryFrame();
           }, 1000/60)
    }

    finishRotate = () => {
           const {dice} = this.props;
           clearInterval(this.timer);
           this.setState({isFinish: true})
           this.rotateEveryFrame(this.diceArr[dice-1][0], this.diceArr[dice-1][1]);
    }
    
    rotateEveryFrame = (x, y) => {
        // 80,10 => 2   -10,10 => 3  170,10 => 4   260,10 => 1  -10, 80 => 5 
        const [dx, dy] = [x || Math.random()*80*Math.pow(-1, (Math.random()*2 | 0)%2), y || Math.random()*80*Math.pow(-1, (Math.random()*2 | 0)%2)];
        const origin = { x: 0, y: 0, z: -25 };
  
        let matrix = rotateXY(dx, dy);
        transformOrigin(matrix, origin);
        this.refViewFront.setNativeProps({style: {transform: [{perspective: 1000}, {matrix: matrix}]}});
    
        matrix = rotateXY(dx + 180, dy);
        transformOrigin(matrix, origin);
        this.refViewBack.setNativeProps({style: {transform: [{perspective: 1000}, {matrix: matrix}]}});
    
        matrix = rotateXY(dx + 90, dy);
        transformOrigin(matrix, origin);
        this.refViewRight.setNativeProps({style: {transform: [{perspective: 1000}, {matrix: matrix}]}});
    
        matrix = rotateXY(dx - 90, dy);
        transformOrigin(matrix, origin);
        this.refViewLeft.setNativeProps({style: {transform: [{perspective: 1000}, {matrix: matrix}]}});
    
        matrix = rotateXZ(dx, dy - 90);
        transformOrigin(matrix, origin);
        this.refViewTop.setNativeProps({style: {transform: [{perspective: 1000}, {matrix: matrix}]}});
    
        matrix = rotateXZ(-dx, dy + 90);
        transformOrigin(matrix, origin);
        this.refViewBottom.setNativeProps({style: {transform: [{perspective: 1000}, {matrix: matrix}]}});
    }

    renderLeft(color) {
        return (
          <View
            ref={component => this.refViewRight = component}
            style={[styles.rectangle, (color) ? {backgroundColor: color} : null]}    
          >
            <Text style={[this.state.isFinish && this.props.dice == 1 ? {color:'#f5d300', fontSize:23} : {color:'#ffffff', fontSize:18}]}>1</Text>
          </View>
        )
      }
    
      renderRight(color) {
        return (
          <View
            ref={component => this.refViewLeft = component}
            style={[styles.rectangle, (color) ? {backgroundColor: color} : null]}
          
          >
          <Text style={[this.state.isFinish && this.props.dice == 2 ? {color:'#f5d300', fontSize:23} : {color:'#ffffff', fontSize:18}]}>2</Text>
          </View>
        )
      }
    
      renderFront(color) {
        return (
          <View
            ref={component => this.refViewFront = component}
            style={[styles.rectangle, (color) ? {backgroundColor: color} : null]} 
            >
            <Text style={[this.state.isFinish && this.props.dice == 3 ? {color:'#f5d300', fontSize:23} : {color:'#ffffff', fontSize:18}]}>3</Text>
            </View>
        )
      }
    
      renderBack(color) {
        return (
          <View
            ref={component => this.refViewBack = component}
            style={[styles.rectangle, (color) ? {backgroundColor: color} : null]}
            >
            <Text style={[this.state.isFinish && this.props.dice == 4 ? {color:'#f5d300', fontSize:23} : {color:'#ffffff', fontSize:18}]}>4</Text>
            </View>
        )
      }
    
      renderTop(color) {
        return (
          <View
            ref={component => this.refViewTop = component}
            style={[styles.rectangle, (color) ? {backgroundColor: color} : null]}
          
            >
            <Text style={[this.state.isFinish && this.props.dice == 5 ? {color:'#f5d300', fontSize:23} : {color:'#ffffff', fontSize:18}]}>5</Text>
            </View>
        )
      }
    
      renderBottom(color) {
        return (
          <View
            ref={component => this.refViewBottom = component}
            style={[styles.rectangle, (color) ? {backgroundColor: color} : null]}   
            >
            <Text style={[this.state.isFinish && this.props.dice == 6 ? {color:'#f5d300', fontSize:23} : {color:'#ffffff', fontSize:18}]}>6</Text>
            </View>
        )
    }
    
    render() {
        return (
            <Fragment>   
                {this.renderFront('rgba(90,90,90,.7)')}
                {this.renderBack('rgba(0,210,0,.7)')}
                {this.renderLeft('rgba(210,0,0,.7)')}
                {this.renderRight('rgba(0,0,210,.7)')}
                {this.renderTop('rgba(210,210,0,.7)')}
                {this.renderBottom('rgba(110,80,200,.7)')}
            </Fragment>  
        )
    }
}