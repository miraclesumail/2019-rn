import React, { Component, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, Easing } from 'react-native';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import { AnimatedCircularProgress } from 'react-native-circular-progress';




function LotteryInfo({item}) {
    const [time, setTime] = useState((Math.random()*10 + 10) | 0);
    const [count, setCount] = useState(0);
    const [change, setChange] = useState(0);
    const progressRef = useRef();
    let timeout;

        useEffect(() => {
              if(item.index) return ;
             
              if(!change)
                 progressRef.current.animate(100, time*1000, Easing.linear);
                
              timeout = setTimeout(() => {
                    setCount(count + 1);
              },1000)

              // timer = setInterval(() => {
              //         if(count == time) {
              //            clearInterval(timer);    
              //            setCount(0);
              //            setChange(change + 1);
              //            setTime((Math.random()*10 + 1) | 0);
              //            return;
              //         }
              //         setCount(count + 1);
              // }, 1000)
              return () => {
                  console.log('rerender');
                  if(count == time) {
                      setCount(0);
                      setChange(change + 1);
                      const times = (Math.random()*10 + 10) | 0
                      setTime(times);  
                      progressRef.current.reAnimate(0, 100, times*1000, Easing.linear);   
                  }
                  clearTimeout(timeout);
              }
        })

     //  onAnimationComplete={() => {console.log('onAnimationComplete'); this.circularProgress.reAnimate(0, 100, 5000)}}
    return <View style={{width:.95*width, height: 0.4*width, backgroundColor:'#99D0F1', borderRadius:10, marginTop:15, paddingHorizontal:.03*width, paddingVertical:0.02*width}}>
           <View style={{flexDirection:'row'}}>
               <View style={{marginRight:.08*width}}><Text style={{lineHeight: .06*width, color: '#E52005',fontSize: 16}}>彩种: {item.game}</Text></View>
               <View><Text style={{lineHeight: .06*width, color: '#E52005',fontSize: 16}}>玩法: {item.wanfa}</Text></View>
                
               <View style={{position:'absolute', top:0, right:0, width:70, height:70}}>
               
               {
                 item.index == 0 ?
                 <AnimatedCircularProgress 
                      ref={progressRef}
                      size={65}
                      width={10}
                      fill={100}
                      rotation={0}
                      tintColor="#00e0ff"                           
                      backgroundColor="#3d5875">
                 </AnimatedCircularProgress> : null    
               }
               </View> 
               
           </View>

           <View style={{flexDirection:'row', marginTop:.02*width}}>
                <View style={{marginRight:.04*width}}>
                     <Text style={{lineHeight: .06*width, color: '#FF0000',fontSize: 17}}>选球</Text>
                </View>
                <View>
                     <Text style={{lineHeight: .06*width, color: '#BE05D6',fontSize: 17}}>{item.content}</Text>
                </View>              
           </View>   

           <View style={{width:.89*width, justifyContent:'space-between', marginVertical:.02*width, flexDirection: 'row'}}>
               <View>
                  <Text style={{lineHeight: .06*width, color: '#054FD6',fontSize: 16}}>购买注数: {item.zushu}</Text>
               </View>
               <View>
                  <Text style={{lineHeight: .06*width, color: '#054FD6',fontSize: 16}}>下注倍数: {item.beishu}</Text>
               </View>
               <View>
                  <Text style={{lineHeight: .06*width, color: '#054FD6',fontSize: 16}}>购买金额: {item.total}￥</Text>
               </View>
           </View> 

           {/* <View style={{width:.89*width, justifyContent:'space-between', marginTop:.02*width}}> */}
               <View>
                  <Text style={{lineHeight: .06*width, color: '#518E8D',fontSize: 16}}>199期开奖:  04 05 06 07 08</Text>
               </View>
               <View>
                  <Text style={{lineHeight: .06*width, color: '#518E8D',fontSize: 16}}>198期开奖:  03 02 07 09 06</Text>
               </View>
               {
                   item.index == 0 ? 
                   <View style={{position:'absolute', backgroundColor:'yellow', right:.02*width, bottom:.06*width}}>
                      <Text>距下一期开奖: {time - count}</Text>
                   </View> : null
               }
              
           {/* </View> */}
    </View>
}

const {width, height} = Dimensions.get('window');
class LotteryRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fill:80
    };
  }

  _keyExtractor = (item, index) => index + 'qq'

  render() {
    let data1 = [{game: '重庆时时彩', wanfa: '直选 五星1', date:'2019-5-29', gameId: 113, content: '05 07|08|03 09|07 08 06', beishu:3, zushu: 1, total: 6},
                {game: '山东时时彩', wanfa: '直选 五星2', date:'2019-5-29', gameId: 113, content: '05 07|08 08 08|03 09|07 08 06', beishu:3, zushu: 2, total: 12},
                {game: '天津时时彩', wanfa: '直选 五星3', date:'2019-5-28', gameId: 113, content: '05 07|08 09|03 09|07 08 06', beishu:6, zushu: 1, total: 12},
                {game: '天津时时彩', wanfa: '直选 五星3', date:'2019-5-28', gameId: 113, content: '05 07|08 09|03 09|07 08 06', beishu:6, zushu: 1, total: 12},
                {game: '天津时时彩', wanfa: '直选 五星3', date:'2019-5-28', gameId: 113, content: '05 07|08 09|03 09|07 08 06', beishu:6, zushu: 1, total: 12},
                {game: '天津时时彩', wanfa: '直选 五星3', date:'2019-5-28', gameId: 113, content: '05 07|08 09|03 09|07 08 06', beishu:6, zushu: 1, total: 12}
                ]

    let data2 = [{game: '江西11选5', wanfa: '直选 三星1', date:'2019-5-29', gameId: 113, content: '05 07|08|03 09|07 08 06', beishu:3, zushu: 1, total: 6},
                {game: '北京pk10', wanfa: '组选 五星2', date:'2019-5-29', gameId: 113, content: '07|08|03 09|07 08 06', beishu:3, zushu: 2, total: 12},
                {game: '腾讯分分彩', wanfa: '直选 五星3', date:'2019-5-28', gameId: 113, content: '05 07|08 09|03 09|07 08 06', beishu:6, zushu: 1, total: 12},
                {game: '腾讯分分彩', wanfa: '直选 五星3', date:'2019-5-28', gameId: 113, content: '05 07|08 09|03 09|07 08 06', beishu:6, zushu: 1, total: 12},
                {game: '腾讯分分彩', wanfa: '直选 五星3', date:'2019-5-28', gameId: 113, content: '05 07|08 09|03 09|07 08 06', beishu:6, zushu: 1, total: 12},
                {game: '腾讯分分彩', wanfa: '直选 五星3', date:'2019-5-28', gameId: 113, content: '05 07|08 09|03 09|07 08 06', beishu:6, zushu: 1, total: 12}
    ]             
    
    return (
      <View style={styles.container}>
                <ScrollableTabView
                    style={{marginTop: 0}}
                    initialPage={0}
                    tabBarActiveTextColor = {'#FF7F00'}
                    tabBarUnderlineStyle = {{height:2, backgroundColor:'orange'}}
                    tabBarBackgroundColor = {'#9F79EE'}
                    activeBackgroundColor = {'#A2CD5A'}
                    onChangeTab = {({i, ref}) => {}}
                    scrollWithoutAnimation={false}
                    renderTabBar={() => <ScrollableTabBar/>}
                >

                    <View tabLabel='全部' style={styles.topTab}>
                       <View style={{height:height - 50, width, backgroundColor:'#171615', alignItems:'center', paddingBottom:.08*width}}>
                       <FlatList
                            data={data1}
                            extraData={this.state}
                            renderItem={({item, index}) => 
                                    <LotteryInfo item={{...item, index}} />}
                            keyExtractor={this._keyExtractor} 
                        />
                       </View>
                    </View>
                    <View tabLabel='未开奖' style={styles.topTab}>
                    <View style={{height:height - 50, width, backgroundColor:'#171615', alignItems:'center', paddingBottom:.08*width}}>
                    <FlatList
                            data={data2}
                            extraData={this.state}
                            renderItem={({item, index}) => 
                                    <LotteryInfo item={{...item, index}} />}
                            keyExtractor={this._keyExtractor} 
                        />
                       </View>
                    </View>     
                    <View tabLabel='已中奖' style={styles.topTab}>
                    <View style={{height:height - 50, width, backgroundColor:'#171615', alignItems:'center'}}>
                         
                       </View>
                    </View>
                    <View tabLabel='未中奖' style={styles.topTab}>
                    <View style={{height:height - 50, width, backgroundColor:'#171615', alignItems:'center'}}>
                               <Text>pressff</Text>
                       </View>
                    </View>           
                </ScrollableTabView>
       </View>         
    );
  }
}

export default LotteryRecord;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  topTab: {
   // width:50
  }
});
