import React, { Component, Fragment } from 'react'
import { Text, View, StyleSheet, Dimensions, Animated, Easing } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { SharedSnackbarConsumer } from './lottery'
const {width} = Dimensions.get('window');

const Operation = ['全', '大', '小', '奇', '偶', '清']

const { timing, Value } = Animated;

class Ball extends Component {

    _animatedVlaue = new Value(1);

    sclaes = [.5, 1, .7, 1 , .9, 1];

    index = 0;

    componentWillReceiveProps(nextProps){
        if(nextProps.chosen != this.props.chosen){
           this.index = 0;
           this.animatingBox();
        }
    }

    animatingBox = () => {
       const index = this.index;
       const {toggle, i} = this.props;

       // 小球scale完后 设置可以点击
       if(index == this.sclaes.length) {
            toggle(i, false);
            return;
       }
       
       timing(this._animatedVlaue, {
            toValue: this.sclaes[index],
            duration:100,
            easing:Easing.bezier(.59, .24, .67, .39)
       }).start(() => {
            this.index = index +1;
            this.animatingBox();
       })
    }

    render(){
        const {chosen, i} = this.props;
        const transformStyle = {
            transform: [
                {scale: this._animatedVlaue}
            ]
        }
        return (
            <Animated.View style={[styles.ball, {backgroundColor: chosen ? '#FF4040' : '#FFF8DC', ...transformStyle}]}>
                <Text style={{fontSize:18, color: chosen ? 'white': '#000000'}}>{i}</Text>
            </Animated.View>
        )
    }
}

class Balls extends Component {

    state = {
        arr: Array.from({length:10}, () => 0)
    }

    setAnimated = (index, i) => {   
        const { add } = this.props;
        const { arr } = this.state;
        if(arr[i]) return;

        if(!arr[i]) {    
            add(index, i);
            this.toggle(i, true);
        } 
    }

    // 判断小球是否结束
    toggle = (i, flag) => {
        const { arr } = this.state;
        const temp = arr.slice();
        temp[i] = flag ? 1 : 0;
        this.setState({arr:temp});
    }

    render() {
        const { index, gameArr } = this.props;
        const balls = this.state.arr.map((v,i) => (
            <TouchableWithoutFeedback onPress={() => {this.setAnimated(index, i)}}>
                 <Ball chosen={gameArr[index][i]} i={i} toggle={(i, flag) => this.toggle(i, flag)}/>
            </TouchableWithoutFeedback>     
        ))
        return (
            <Fragment>
                {balls}
            </Fragment>       
        )
    }
}

function Operations({operation, index, handleOperation}){
    const operations = operation.map((item, i) => (
        <TouchableWithoutFeedback onPress={() => handleOperation(index, i)}>
              <View style={{width: .1*width, height: .1*width, borderColor: 'yellowgreen', borderWidth:1, justifyContent:'center', alignItems: 'center'}} key={index}>
                 <Text style={{fontSize:20, color:'white'}}>{item}</Text>
              </View>
        </TouchableWithoutFeedback>
    ))
    return (
        <Fragment>
             {operations}
        </Fragment>  
    )
}

class ChooseBlock extends Component {
      
     render() {
        const { backgroundColor, title, index } = this.props;
     
        return (
            <SharedSnackbarConsumer>
                {({add, gameArr, handleOperation}) => (
                  <View style={[styles.block, {backgroundColor}]}>
                        <View style={{width:width*.2, height:.5.width, justifyContent:'center', alignItems: 'center'}}>
                                <Text style={{fontSize:20, color:'yellow'}}>{title}</Text>
                        </View>

                        <View style={{flex:1, height:.5.width}}>
                            <View style={{width: .67*width, flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between'}}>
                                   <Balls add={(i,j) => add(i,j)} index={index} gameArr={gameArr}/>
                            </View>

                            <View style={{width: .67*width, flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between', marginTop:.02*width}}>
                                    <Operations operation={Operation} index={index} handleOperation={(i,j) => handleOperation(i,j)}/>
                            </View>
                        </View>
                  </View>
                )}
            </SharedSnackbarConsumer>
            
        )
     }
}

export class Wuxing extends Component {
  constructor(props){
    super(props);
    this.state = {
        //nameSequences:['万位', '千位', '百位', '十位', '个位']
    }
  }  
  
 
  render() {
    const {sequences} = this.props;  
    const renderPanel = sequences.map((v,i) => (
         <ChooseBlock backgroundColor={'#242D2B'} title={v} index={i}/>
    ))   
    return (
      <Fragment>
          {renderPanel}
      </Fragment>
    )
  }
}

const styles = StyleSheet.create({
      block: {
          width: width*.95,
          height: .5*width,
          paddingVertical: .05*width,
          borderRadius: 10,
          flexDirection: 'row',
          paddingRight: .08*width,
          marginTop: 20
      },
      ball: {
          width:width*.12, height:width*.12, 
          borderRadius: .06*width,
          justifyContent:'center', 
          alignItems: 'center', marginBottom:.03*width
      }
})
