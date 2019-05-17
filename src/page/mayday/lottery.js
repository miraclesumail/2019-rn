import React, { Component, Fragment } from 'react'
import { Text, View, StyleSheet, TouchableWithoutFeedback, Dimensions, Animated, Easing, ScrollView, FlatList } from 'react-native'
import CountDown from './countdown'
import LotteryMenu from './lotteryMenu'
import {Wuxing, SiXing} from './wuxing'
import {gamesList} from './gameList'
const {width, height} = Dimensions.get('window');

console.log(WebSocket);

const ws = new WebSocket('http://192.168.93.227:3000');

// 圆角分模式切换
class YuanMode extends Component {
    constructor(props){
        super(props);

        this.select = new Animated.Value(0);
        this.transform = 0;
 
        this.select.addListener(({value}) => {
             this.transform = value;
        })
 
        this.y = this.select.interpolate({
            inputRange:[0, 10],
            outputRange:[0, -100],
            extrapolate:'clamp'
        })
    }  

    toggleSelect = () => {
        Animated.timing(this.select, {
            toValue: this.transform == 0 ? 10 : 0,
            duration: 500,
            easing:Easing.bezier(.4, .7, .58, .75)
        }).start();
    }

    render() {
        const transformStyle = {
            transform: [
                {translateY: this.y}
            ]
        }
        const {mode, changeMode} = this.props;

        const modeText = mode == 1 ? '元' : mode == .1 ? '角' : '分';
        return (
            <Fragment>
                <Animated.View style={[styles.tabMenu, transformStyle]}>
                        <TouchableWithoutFeedback onPress={() => {changeMode(1); this.toggleSelect()}}>
                             <View style={[styles.mode, {backgroundColor:mode == 1 ? '#f5d300' : 'yellowgreen', borderTopLeftRadius:10, borderTopRightRadius:10}]}>
                                <Text>元</Text>
                             </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => {changeMode(.1); this.toggleSelect()}}>
                             <View style={[styles.mode, {backgroundColor:mode == .1 ? '#f5d300' : 'yellowgreen'}]}>
                                  <Text>角</Text>
                             </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => {changeMode(.01); this.toggleSelect()}}>
                             <View style={[styles.mode, {backgroundColor:mode == .01 ? '#f5d300' : 'yellowgreen', borderBottomLeftRadius:10, borderBottomRightRadius:10}]}>
                                  <Text>分</Text>
                             </View>
                        </TouchableWithoutFeedback>
                </Animated.View>  
                <View style={{width:102, height:70, borderRightWidth:2, backgroundColor:'#3FD7BE', borderRightColor: '#f5d300', position:'absolute', left:0, bottom:0, zIndex:100}}>        
                    <TouchableWithoutFeedback onPress={() => this.toggleSelect()}>
                        <View style={styles.cashMode}>
                                <Text style={{color:'white'}}>{modeText}模式</Text>
                        </View>
                    </TouchableWithoutFeedback>   
                </View>     
            </Fragment>
           
        )
    }
}

// 添加购彩蓝的小球
class MovingBall extends Component {
   
    MoveX = new Animated.Value(0);

    MoveY = new Animated.Value(0);

    // y = -0.04*(Math.pow(x,2) - 100*x)

    componentDidMount() {
        this.MoveX.addListener(({value}) => {
             this.MoveY.setValue(0.005*(Math.pow(value,2) - 230*value))
        })

        setTimeout(() => {
            Animated.timing(this.MoveX, {
                toValue: 230,
                duration: 700,
                easing: Easing.bezier(.41, .64, .51, .7)
            }).start(() => {
                this.props.changeBall(false);
                this.props.addCart();
            })
        }, 0)
    }

    render() {
        const translate = {
              transform: [
                  {translateY: this.MoveY},
                  {translateX: this.MoveX}
              ]
        }
        return (
            <Animated.View style={{position:'absolute', top:-20, width:20, height:20, borderRadius:10, backgroundColor:'red', left:130, ...translate}}>
            </Animated.View>  
        )
    }
}

const SharedSnackbarContext = React.createContext();

const initArr = gamesList[0].children[0].children[0].balls.map(item => item.values);
const initSequences = gamesList[0].children[0].children[0].balls.map(item => item.key)

function handleOperation({index, operate, gameArr}) {
        if(operate == 0)
            return gameArr.map((item, idx) => {          
                const tempItem = item.map((v, i) => {
                    if(index == idx)
                        return 1;
                    else
                        return v;     
                })
                return tempItem
            })

        if(operate == 1)
            return gameArr.map((item, idx) => {          
                const tempItem = item.map((v, i) => {
                    if(index == idx)
                        if(i > 4)
                           return 1;
                        else
                           return 0;   
                    else
                        return v;     
                })
                return tempItem
            })
            
        if(operate == 2)
            return gameArr.map((item, idx) => {          
                const tempItem = item.map((v, i) => {
                    if(index == idx)
                        if(i <= 4)
                            return 1;
                        else
                            return 0;   
                    else
                        return v;     
                })
                return tempItem
            })  
            
        if(operate == 3)
            return gameArr.map((item, idx) => {          
                const tempItem = item.map((v, i) => {
                    if(index == idx)
                        if(i % 2)
                            return 1;
                        else
                            return 0;  
                    else
                        return v;     
                })
                return tempItem
            }) 
           
        if(operate == 4)
            return gameArr.map((item, idx) => {          
                const tempItem = item.map((v, i) => {
                    if(index == idx )
                        if(!(i % 2))
                            return 1;
                        else
                            return 0;  
                    else
                        return v;     
                })
                return tempItem
            })        
}

function HistoryLine({item}) {
    const index = item.index % 2;
    return (
        <View style={{width, height:30, backgroundColor: index ? 'grey' : '#f0f0f0', flexDirection:'row', }}>
            <View style={{width:.25*width, height:30, justifyContent:'center', alignItems:'center', borderRightColor:'pink', borderRightWidth:1}}><Text>{item.number}</Text></View>
            <View style={{width:.12*width, height:30,justifyContent:'center', alignItems:'center', borderRightColor:'pink', borderRightWidth:1}}><Text>{item.daxiao}</Text></View>
            <View style={{width:.12*width, height:30,justifyContent:'center', alignItems:'center', borderRightColor:'pink', borderRightWidth:1}}><Text>{item.jiou}</Text></View>
            <View style={{width:.12*width, height:30,justifyContent:'center', alignItems:'center', borderRightColor:'pink', borderRightWidth:1}}><Text>{item.hezhi}</Text></View>
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>{item.balls}</Text></View>
        </View>
    )
}

// 彩票主组件
export class Lottery extends Component {
  constructor(props){
       super(props);
       this.state = {
          show: false,
          gameName: '',
          chooseIndex: 0,
          childIndex: [0, 0],
          components: [<Wuxing/>, <SiXing/>],
          gameArr: initArr,
          validBet: 0,
          mode: 1,
          timeArr: [],
          showBall: false,
          addedToCart: 0,
          sequences: initSequences,
          history: [
              {number:11122, daxiao:'大', jiou:'偶', hezhi:15, balls:'53232', index:0},
              {number:11122, daxiao:'大', jiou:'偶', hezhi:15, balls:'53232', index:1},
              {number:11122, daxiao:'大', jiou:'偶', hezhi:15, balls:'53232', index:2}
          ]
       }
  
       this.opacity = new Animated.Value(0);
  }  

  componentDidMount(){
        fetch('http://192.168.93.227:3000/customer/times')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            console.log('reddd'); 
           this.setState({timeArr: data})  
        })
        .catch(error => console.error(error))
  }
 
  toggleArr = (i,j) => {
      const {gameArr} = this.state;
      const tempArr = gameArr.map((v,index) => {

           const element = v.map((ele, idx) => {
                 if(i == index && idx == j)
                      return ele ? 0 : 1
                 else
                      return ele     
                    
           })

           return element
      })

      // 这里setstate完了后 会不断促发countdown组件  componentwillreiveprops
      this.setState({gameArr: tempArr}, () => {
           this.setState({validBet: this.calculateNumber()})
      });
  }

  setChildIndex = (i, j) => {
      const {chooseIndex, childIndex} = this.state;
      if(childIndex[0] == i && childIndex[1] == j) return;
      this.setState({childIndex:[i ,j]});
      this.setState({gameArr: gamesList[chooseIndex].children[i].children[j].balls.map(item => item.values)}, () => {
           this.setState({validBet: this.calculateNumber()})
      });
      this.setState({sequences: gamesList[chooseIndex].children[i].children[j].balls.map(item => item.key)})
  }

  calculateNumber = () => {
      const {gameArr} = this.state;
      const numbers = gameArr.map(item => item.filter(v => v == 1).length);
      return numbers.reduce((prev, next) => prev*next)
  }

  toggleMask = (flag) => {
      if(flag)
         Animated.timing(this.opacity, {
             toValue: .7,
             duration: 500,
             easing: Easing.linear
         }).start()
      else
         Animated.timing(this.opacity, {
            toValue: 0,
            duration: 500,
            easing: Easing.linear
         }).start()    
  }

  addToCart = () => {
         const { validBet, gameArr } = this.state;
         if(!validBet) return;
         this.setState({showBall: true});

         const tempArr = gameArr.map((item,index) => {
               const ii = item.map((v) => {return 0});
               return ii;
         })

         this.setState({gameArr: tempArr}, () => {
               this.setState({validBet: this.calculateNumber()})
         })
  }

  randomChoose = () => {
         const { gameArr } = this.state;
         const tempArr = gameArr.map((item, index) => {
               const idx = Math.random()*10|0 ;
               const tempItem = item.map((v, i) => {
                     if(i == idx)
                          return 1;
                     else
                          return 0;     
               })

               return tempItem
         })

         this.setState({gameArr: tempArr}, () => {
               this.setState({validBet: this.calculateNumber()})
         });
  }

  addCartByone = () => {
        const {addedToCart} = this.state;
        const added = addedToCart + 1;
        this.setState({addedToCart: added});
  }

  dealPromise = (data, key, fn) => {
        this.setState({[key]:data}, () => {
             fn();
        })
  }

  handleOperation = (index, operate) => {
      const { gameArr } = this.state;
      this.dealPromise(handleOperation({index, operate, gameArr}), 'gameArr', this.calculateNumber);  
  }

  _keyExtractor = (item, index) => index + 'qq'

  render() {
    const {show, gameName, history, gameArr, mode, validBet, showBall, addedToCart, sequences, timeArr} = this.state;
    const mask = show ? (<TouchableWithoutFeedback onPress={() => {this.setState({show:false});this.toggleMask(false)}}> 
        <Animated.View style={{position:'absolute', top:30, height: height - 30, width, backgroundColor: '#1B262A', opacity:this.opacity}}>
        </Animated.View>
    </TouchableWithoutFeedback>) : null; 

    const betAmount = validBet*mode*2; 

    return (
      <SharedSnackbarContext.Provider value={{
           add: (i,j) => {this.toggleArr(i,j)},
           gameArr,
           handleOperation: this.handleOperation
      }}>  
        <View style={{width, height, alignItems:'center'}}>
            <TouchableWithoutFeedback onPress={() => {this.setState({show:true}); this.toggleMask(true)}}>
                    <View style={styles.gameName}>
                        <Text>{gameName}</Text>
                    </View>
            </TouchableWithoutFeedback> 


            <CountDown timeArr={timeArr}/>

            <View style={{width, height:120}}>
                 <View style={{width, height:30, flexDirection:'row', backgroundColor:'pink' }}>
                       <View style={{width:.25*width, height:30, justifyContent:'center', alignItems:'center', borderRightColor:'pink', borderRightWidth:1}}><Text>期数</Text></View>
                       <View style={{width:.12*width, height:30,justifyContent:'center', alignItems:'center', borderRightColor:'pink', borderRightWidth:1}}><Text>大小</Text></View>
                       <View style={{width:.12*width, height:30,justifyContent:'center', alignItems:'center', borderRightColor:'pink', borderRightWidth:1}}><Text>奇偶</Text></View>
                       <View style={{width:.12*width, height:30,justifyContent:'center', alignItems:'center', borderRightColor:'pink', borderRightWidth:1}}><Text>和值</Text></View>
                       <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>号码</Text></View>
                 </View>

                <FlatList
                    data={history}
                    renderItem={({item}) => <HistoryLine item={item} />}
                    keyExtractor={this._keyExtractor} 
                />
            </View>    
          
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:80}}> 
                 <Wuxing sequences={sequences}/>
            </ScrollView>

            <View style={styles.bottomFixed}> 
                <TouchableWithoutFeedback onPress={() => this.addToCart()}>
                    <View style={[styles.choooseAmount, {backgroundColor: validBet > 0 ? '#FF8C00' : '#8A8186'}]}>
                        <Text>已选择{this.state.validBet}注</Text>
                    </View>  
                </TouchableWithoutFeedback>  
               
                <View style={[styles.choooseAmount, {backgroundColor: '#853FD7'}]}>
                    <Text style={{color:'white'}}>总共{betAmount}元</Text>
                </View> 

                <TouchableWithoutFeedback onPress={() => this.randomChoose()}>
                    <View style={[styles.choooseAmount, {backgroundColor: '#853FD7'}]}>
                        <Text style={{color:'white'}}>机选一注</Text>
                    </View> 
                </TouchableWithoutFeedback>

                <View style={styles.shoppigCart}>
                      <View style={{position:'absolute', width:18, height:18, borderRadius:9, backgroundColor:'pink', justifyContent:'center', alignItems: 'center',top:3,right:3}}>
                            <Text>{addedToCart}</Text>
                      </View>
                      <Text>购物车</Text>
                </View>
               
                {showBall ? <MovingBall changeBall={(showBall) => this.setState({showBall})} addCart={() => this.addCartByone()}/> : null}      
            </View> 
            <YuanMode mode={mode} changeMode={(mode) => {this.setState({mode})}}/>
   
            {mask} 
            <LotteryMenu show={show} setName={(gameName, chooseIndex) => this.setState({gameName, chooseIndex})} closeModal = {() => {this.setState({show:false});this.toggleMask(false)}}
              setChildIndex={(i,j) => this.setChildIndex(i,j)}/>       
        </View>
      </SharedSnackbarContext.Provider>  
    )
  }
}

export default Lottery

export const SharedSnackbarConsumer = SharedSnackbarContext.Consumer;

const styles = StyleSheet.create({
      gameName: {
          width,
          height: 30,
          backgroundColor:'yellowgreen',
          alignItems: 'center',
          justifyContent: 'center'
      },
      cashMode: {
           position:'absolute', width:100, height:70, bottom:0,
           flexDirection:'row',
           backgroundColor:'#3FD7BE',
           justifyContent:'center',
           alignItems:'center',
           paddingBottom:23
      },
      mode: {
          width:90,
          height:33,
          justifyContent:'center',
          alignItems:'center',
      },
      tabMenu: {
          position:'absolute', width:90, 
          height: 99, borderRadius:10, 
          backgroundColor:'yellowgreen', left:5,
        bottom:-29
      },
      choooseAmount: {
          width:80, height:70,
          justifyContent:'center', 
          alignItems:'center', paddingBottom:20,
          borderRightColor:'pink',
          borderRightWidth:1  
      },
      bottomFixed: {
          position:'absolute', width,
          height: 70, backgroundColor:'#3FD7BE', 
          zIndex:10, 
          bottom:0, left:0, 
          flexDirection:'row', paddingLeft:100
      },
      shoppigCart: {
          flex:1, backgroundColor:'orange',
          justifyContent:'center', 
          alignItems:'center',
          paddingBottom:20
      }
})
