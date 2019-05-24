import React, { Component, Fragment } from 'react'
import { Text, View, StyleSheet, TouchableWithoutFeedback, Dimensions, Animated, Easing, ScrollView, FlatList, PanResponder } from 'react-native'
import YuanMode from './yuanMode'
import MovingBall from './movingBall'
import CountDown from './countdown'
import LotteryMenu from './lotteryMenu'
import HistoryTable from './historyTable'
import {Wuxing, SiXing} from './wuxing'
import { gamesList, utils } from './gameList'
import {connect} from 'react-redux'
const {width, height} = Dimensions.get('window');

const ws = new WebSocket('ws://192.168.93.227:3006');

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

// 彩票主组件
export class Lottery extends Component {
  constructor(props){
       super(props);
       this.state = {
          show: false,
          gameName: '',
          chooseIndex: 0,
          childIndex: [0, 0],
          gameId: gamesList[0].children[0].children[0].id,
          components: [<Wuxing/>, <SiXing/>],
          gameArr: initArr,
          validBet: 0,
          mode: 1,
          timeArr: [],
          showBall: false,
          addedToCart: 0,
          sequences: initSequences
       }
  
       this.myRef = React.createRef();
       this.opacity = new Animated.Value(0);
       this.hasChange = false;
  }  

  componentDidMount(){
        fetch('http://192.168.93.227:3000/customer/times')
        .then(response => response.json())
        .then(data => {
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

  // 计算注单数
  calculateNumber = () => {
      const {gameId, gameArr} = this.state;
      if(utils.calculate['' + gameId]) {
          return utils.calculate['' + gameId](gameArr);
      }else{
          return this.normalCalculate();  
      }
  }

  normalCalculate = () => {
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
         const { validBet, gameArr, gameName, mode, gameId } = this.state;
         if(!validBet) return;
         this.setState({showBall: true});

         // {gameName: '直选 五星1', numbers:'05 07|08|03 09|07 08 06', beishu:1, zushu:2, total:100},
         const name = gameName.split(' ')[1] + ' ' + gameName.split(' ')[2];
         const lottery = { gameName: name,  gameId, numbers: utils.getBasketInfo(gameArr), beishu:1, zushu: validBet, total: validBet*mode*2};
         this.props.addToBasket({lottery :[lottery]});

         const tempArr = gameArr.map((item,index) => {
               const ii = item.map((v) => {return 0});
               return ii;
         })

         this.setState({gameArr: tempArr}, () => {
               this.setState({validBet: this.calculateNumber()})
         })
  }

  randomOneBet = () => {
        const {gameId, gameArr} = this.state;
        if(utils.randomChoose['' + gameId]) {
            this.setState({gameArr: utils.randomChoose['' + gameId](gameArr.slice())}, () => {
                 this.setState({validBet: this.calculateNumber()})
            });
        }else{
            this.randomChoose();  
        }
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

  goBasket() {
      const {gameName, gameId, gameArr, chooseIndex, childIndex} = this.state;
      const gArr = gameArr.slice().map(v => {
           v.map(i => 0);
           return v
      })
      const maxBei = gamesList[chooseIndex].children[childIndex[0]].children[childIndex[1]].maxBei;
      console.log(maxBei);
      console.log('maxBei--------------------');
      if(this.state.addedToCart) this.props.navigation.navigate('Basket', {gameName, gameId, gArr, maxBei});
  }

  handleOperation = (index, operate) => {
      const { gameArr } = this.state;
      this.dealPromise(handleOperation({index, operate, gameArr}), 'gameArr', this.calculateNumber);  
  }

  render() {
    const {show, gameName, gameArr, mode, validBet, showBall, addedToCart, sequences, timeArr} = this.state;
    console.log(this.props.basketDatas, '------');
    const mask = show ? (<TouchableWithoutFeedback onPress={() => {this.setState({show:false});this.toggleMask(false)}}> 
        <Animated.View style={{position:'absolute', top:30, height: height - 30, width, backgroundColor: '#1B262A', opacity:this.opacity}}>
        </Animated.View>
    </TouchableWithoutFeedback>) : null; 

    const betAmount = validBet*mode*2; 
    return (
      <SharedSnackbarContext.Provider value={{
           add: (i,j) => {this.toggleArr(i,j)},
           gameArr,
           handleOperation: this.handleOperation,
      }}>  
        <View style={{width, height, alignItems:'center'}}>
            <TouchableWithoutFeedback onPress={() => {this.setState({show:true}); this.toggleMask(true)}}>
                    <View style={styles.gameName}>
                        <Text>{gameName}</Text>
                    </View>
            </TouchableWithoutFeedback> 

            <CountDown timeArr={timeArr} ws={ws}/>
            
            <HistoryTable ws={ws}/>
           
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:80}}> 
                 <Wuxing sequences={sequences}/>
            </ScrollView>

            <View style={[styles.bottomFixed]}> 
                <TouchableWithoutFeedback onPress={() => this.addToCart()}>
                    <View style={[styles.choooseAmount, {backgroundColor: validBet > 0 ? '#FF8C00' : '#8A8186'}]}>
                        <Text>已选择{this.state.validBet}注</Text>
                    </View>  
                </TouchableWithoutFeedback>  
               
                <View style={[styles.choooseAmount, {backgroundColor: '#853FD7'}]}>
                    <Text style={{color:'white'}}>总共{betAmount}元</Text>
                </View> 

                <TouchableWithoutFeedback onPress={() => this.randomOneBet()}>
                    <View style={[styles.choooseAmount, {backgroundColor: '#853FD7'}]}>
                        <Text style={{color:'white'}}>机选一注</Text>
                    </View> 
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={this.goBasket.bind(this)}>
                    <View style={styles.shoppigCart}>
                        <View style={{position:'absolute', width:18, height:18, borderRadius:9, backgroundColor:'pink', justifyContent:'center', alignItems: 'center',top:3,right:3}}>
                                <Text>{addedToCart}</Text>
                        </View>
                        <Text>购物车</Text>
                    </View>
                </TouchableWithoutFeedback>
               
                {showBall ? <MovingBall changeBall={(showBall) => this.setState({showBall})} addCart={() => this.addCartByone()}/> : null}      
            </View> 
            <YuanMode mode={mode} changeMode={(mode) => {this.setState({mode})}}/>
   
            {mask} 
            <LotteryMenu show={show} setName={(gameName, chooseIndex) => this.setState({gameName, chooseIndex})} closeModal = {() => {this.setState({show:false});this.toggleMask(false)}}
              setChildIndex={(i,j) => this.setChildIndex(i,j)} setGameId={(gameId) => this.setState({gameId})}/>       
        </View>
      </SharedSnackbarContext.Provider>  
    )
  }
}


function mapStateToProps (state) {
    return {
       gamesList: state.lottery.gamesList,
       basketDatas: state.lottery.basketDatas
    }
  }
  
function mapDispatchToProps (dispatch) {
    return {
      toggleLike: (id) => dispatch({type: 'toggleLike', id}),
      addToBasket: ({lottery}) => dispatch({type: 'addLotteryToBasket', lottery})
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(Lottery);

export const SharedSnackbarConsumer = SharedSnackbarContext.Consumer;

const styles = StyleSheet.create({
      gameName: {
          width,
          height: 30,
          backgroundColor:'yellowgreen',
          alignItems: 'center',
          justifyContent: 'center'
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
