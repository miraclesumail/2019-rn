import React, { Component, Fragment, useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableWithoutFeedback, Animated, Easing } from 'react-native';
import {connect} from 'react-redux'
import { utils } from './gameList'
import { setTimeout } from 'core-js';
import YuanMode from './yuanMode'
import RollingBall from './rollingBall'
const {width, height} = Dimensions.get('window');

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

function BasketItem({item, index, deleteFromBasket}) {
     const [show, setShow] = useState(true);
     const prevLotteryNum = usePrevious(item.lotteryNum);

     useEffect(() => {
           let timer;
           console.log('hookksks');
           if((!prevLotteryNum && item.lotteryNum) || prevLotteryNum != item.lotteryNum) {
                setShow(true);
                timer = setTimeout(() => setShow(false), 2000)
           }
             
           return () => {
                timer && clearTimeout(timer);
           }   
     }, [item.lotteryNum])

     // {gameName: '直选 五星1', numbers:'05 07|08|03 09|07 08 06', beishu:1, zushu:2, total:100},
     return (
        <Fragment>
            <View style={[styles.playMethod, { marginTop: index ? 15:0}]}>
                <Text style={{color: '#234BE9', fontSize: 16}}>玩法: {item.gameName}</Text>
                {
                    show && item.lotteryNum ? <View style={{position:'absolute', top:10, right:90}}><Text>新开奖 {item.lotteryNum}</Text></View> : null
                }
                <TouchableWithoutFeedback onPress={() => deleteFromBasket(index)}>
                        <View style={styles.deleteItem}>
                            <Text style={{fontSize:17}}>×</Text>
                        </View>
                </TouchableWithoutFeedback>   
            </View>
            <View style={{width:.95*width, flexDirection:'row', alignItems:'center', backgroundColor:'#F5A53A',paddingHorizontal:.03*width}}>
                <Text style={{lineHeight: .06*width, color: '#F73F5B',fontSize: 16}}>选球: {item.numbers}</Text>
            </View>

            <View style={styles.bottomShow}>
                <View style={{flexDirection:'row', alignItems:'center', width:.3*width}}><Text style={{color: '#2E8B57', fontSize:16}}>倍数:{item.beishu}</Text></View>
                <View style={{flexDirection:'row', alignItems:'center', width:.3*width}}><Text style={{color: '#2E8B57', fontSize:16}}>注数:{item.zushu}</Text></View>
                <View style={{flexDirection:'row', alignItems:'center', width:.3*width}}><Text style={{color: '#F73F5B', fontSize: 16}}>金额:{item.total}</Text></View>
            </View>
        </Fragment>
      )
     
}

 /* {
                              [1,1,1,1,1].map((v,i) => (
                                  i == count ? 
                                  <RollingBall text={i+1} count={i} setCount = {() => this.addCount()}/> : null
                              ))
                          } */
                  

class LotteryBasket extends Component {
  constructor(props) {
    super(props);
    this.state = {
         chooseIndex: -1,
         lotteryNum:null,
         gameName: props.navigation.state.params.gameName,
         gameId: props.navigation.state.params.gameId,
         gameArr: props.navigation.state.params.gArr,
         count: 0,
         mode: 1,
         beishu:1,
         maxBei: props.navigation.state.params.maxBei,
         showLottering: false
    }; 

    this.translateY = new Animated.Value(80);

    this.transform = 0;
 
    this.translateY.addListener(({value}) => {
         this.transform = value;
    })
  }

  componentDidMount() {
     this.$react.subscribe('receiveLottery', (msg, data) => {
           console.log(data, '----');
           console.log(this.props.basketDatas);
           const chooseIndex = this.props.basketDatas.findIndex(item => item.gameId == data.id);
           console.log(chooseIndex);
           this.setState({chooseIndex, lotteryNum: data.nums.join(' ')});
           this.setState({showLottering: true})
     });

    // fetch('http://192.168.93.227:3000/customer/createLottery', {
    //     method: 'POST', // *GET, POST, PUT, DELETE, etc.
    //     mode: 'cors', // no-cors, cors, *same-origin
    //     cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //     headers: {
    //         'Content-Type': 'application/json',
    //         // 'Content-Type': 'application/x-www-form-urlencoded',
    //     },
    //     body: JSON.stringify({game:'qqq', wanfa:'dddddddd', date:'2019-02-11', numbers:[1,2,3,4,5], content:'fwtwtwtetet'}), // body data type must match
    // })
    // .then(response => console.log(response.json()));
  }

  toggleShow = () => {
    Animated.timing(this.translateY, {
        toValue: this.transform == 0 ? 80 : 0,
        duration: 500,
        easing:Easing.bezier(.4, .7, .58, .75)
    }).start();
  }

  randomChoose = (number) => {
        const {gameId, gameArr, gameName, mode, beishu, maxBei} = this.state;
      //  const lottery = { gameName: name,  gameId, numbers: utils.getBasketInfo(gameArr), beishu:1, zushu: validBet, total: validBet*mode*2};
        let needPush = [];
        for(let i = 0; i < number; i++) {
                const tempArr = utils.randomChoose[gameId](gameArr.slice());
                const numbers = utils.getBasketInfo(tempArr);
                const name = gameName.split(' ')[1] + gameName.split(' ')[2];
                const lotteryInfo = {gameName: name, gameId, numbers, beishu, zushu:1, total:2*mode*beishu};
                needPush.push(lotteryInfo);
        }
        this.props.addToBasket({lottery: needPush});
  }

  addbei = (num) => {
        const {beishu, maxBei} = this.state;
        if((num == -1 && beishu == 1) || (num == 1 && beishu == maxBei)) return;
        this.setState({beishu: beishu + num})
  }

  _keyExtractor = (item, index) => index + 'qq'

  _keyExtractor1 = (item, index) => index + 'ww'
 
  render() {
    console.log('重新渲染');
    //const {gameName} = this.props.navigation.state.params; 
    const {chooseIndex, lotteryNum, gameName, showLottering, mode, beishu, maxBei} = this.state; 
    console.log(lotteryNum);
    const {basketDatas, deleteFromBasket} = this.props;

    const transformStyle = {
          transform: [
              {translateY: this.translateY}
          ]
    }

    const dataArr = Array.from({length: Math.ceil(maxBei/4)}, (v,i) => (i+1)*4 <= maxBei ? (i+1)*4 : maxBei);
    console.log(dataArr)
    return (
        
            <View style={{flex:1, alignItems:'center', backgroundColor:'#242424'}}>
                    <View style={styles.gameName}>
                            <Text>购彩蓝 {gameName.split(' ')[0]} </Text>
                    </View>  
                    <View style={styles.randomChoose}>
                          <TouchableWithoutFeedback onPress={() => this.randomChoose(1)}>
                              <View style={styles.randomButton}><Text>机选一注</Text></View>
                          </TouchableWithoutFeedback>
                          <TouchableWithoutFeedback onPress={() => this.randomChoose(5)}>
                              <View style={styles.randomButton}><Text>机选五注</Text></View>
                          </TouchableWithoutFeedback>
                    </View>

                    <View style={{width: .95*width, height: 0.85*height - 30 - .1*width, marginTop:10}}>
                        <FlatList
                            data={basketDatas}
                            extraData={this.state}
                            renderItem={({item, index}) => 
                                index == chooseIndex ? 
                                    <BasketItem item={{lotteryNum, ...item}} index={index} deleteFromBasket={(index) => deleteFromBasket(index)}/> : 
                                    <BasketItem item={{...item}} index={index} deleteFromBasket={(index) => deleteFromBasket(index)}/>
                                    }
                            keyExtractor={this._keyExtractor} 
                        />
                    </View>

                    {
                        showLottering ? 
                            <View style={{position:'absolute', width:.9*width, height:.5*width, left: .05*width, top: .5*height - .25*width, backgroundColor:'#FF8C69', borderRadius:10}}>
                                    <RollingBall balls={this.state.lotteryNum.split(' ')} noshow={() => this.setState({showLottering: false})}/>
                            </View> : null
                    }   

                    <YuanMode mode={mode} changeMode={(mode) => {this.setState({mode})}} style={{transform: [{translateY: 30}]}}/> 

                    <Animated.View style={{position:'absolute', bottom:40, height:80, width:0.16*width, left:.07*width + 102, zIndex:100, ...transformStyle}}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={dataArr}
                                extraData={this.state}
                                renderItem={({item}) =>  
                                        <TouchableWithoutFeedback onPress={() => {this.setState({beishu: item}); this.toggleShow()}}>
                                                <View style={{width:0.16*width, borderBottomColor:'grey', borderBottomWidth:1, height:20, backgroundColor: item == beishu ? '#A4D3EE' : '#FF82AB', justifyContent:'center', alignItems:'center'}}><Text>{item}</Text></View>
                                        
                                       </TouchableWithoutFeedback> }                                          
                                keyExtractor={this._keyExtractor1} />
                    </Animated.View>      
                    <View style={styles.operateWrap}>
                         <TouchableWithoutFeedback onPress={() => this.addbei(-1)}>
                              <View style={styles.operateNum1}><Text style={{fontSize:18}}>-</Text></View> 
                         </TouchableWithoutFeedback>
                         <TouchableWithoutFeedback onPress={() => this.toggleShow()}>
                               <View style={{width:0.16*width, backgroundColor:'#EEC900', alignItems:'center', justifyContent:'center', height:40}}>
                                   <Text>{beishu}</Text>
                               </View> 
                         </TouchableWithoutFeedback>
                         <TouchableWithoutFeedback onPress={() => this.addbei(1)}>
                               <View style={styles.operateNum2}><Text style={{fontSize:18}}>+</Text></View> 
                         </TouchableWithoutFeedback>
                    </View>             
            </View>
    )
  }
}


function mapStateToProps (state) {
    return {
       basketDatas: state.lottery.basketDatas
    }
  }
  
function mapDispatchToProps (dispatch) {
    return {
      addToBasket: ({lottery}) => dispatch({type: 'addLotteryToBasket', lottery}),
      deleteFromBasket: (index) => dispatch({type: 'deleteLottery', index})
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(LotteryBasket);

const styles = StyleSheet.create({
    gameName: {
        width,
        height: 30,
        backgroundColor:'yellowgreen',
        alignItems: 'center',
        justifyContent: 'center'
    },
    playMethod: {
        width:.95*width,flexDirection:'row',
        alignItems:'center',
        height: .1*width,backgroundColor:'#F5A53A',
        borderTopLeftRadius:10, borderTopRightRadius:10, 
        paddingHorizontal:.03*width
    },
    randomChoose: {
        width:.95*width,flexDirection:'row',
        alignItems:'center',
        height: .1*width,
        paddingHorizontal:.03*width,
        justifyContent:'space-between'
    },
    randomButton: {
        width:.42*width, 
        height:.08*width, 
        backgroundColor: '#289CE3', justifyContent:'center',
        alignItems:'center', 
        borderRadius:.02*width
    },
    bottomShow: {
        width:.95*width, 
        flexDirection:'row', 
        backgroundColor:'#F5A53A', justifyContent:'space-around', 
        alignItems:'center', 
        height:.1*width,
        borderBottomLeftRadius:10,
        borderBottomRightRadius:10,
        paddingHorizontal:.03*width
    },
    deleteItem: {
        position:'absolute', right: .03*width, 
        top: .02*width, width:.06*width, 
        height:.06*width, borderRadius: .04*width, 
        backgroundColor: '#EE0000', 
        justifyContent:'center', alignItems:'center'
    },
    operateNum1: {
        width:0.07*width, backgroundColor:'pink', 
        alignItems:'center', justifyContent:'center', 
        height:40,
        borderBottomLeftRadius:20,
        borderTopLeftRadius:20
    },
    operateNum2: {
        width:0.07*width, backgroundColor:'pink', 
        alignItems:'center', justifyContent:'center', 
        height:40,
        borderBottomRightRadius:20,
        borderTopRightRadius:20
    },
    operateWrap: {
        position:'absolute', 
        left:102, bottom:0, 
        borderRadius:20, height:40,
         width:.3*width, 
         backgroundColor:'grey', 
         flexDirection:'row',
         alignItems:'center',zIndex:100
    }
})