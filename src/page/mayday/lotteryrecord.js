import React, { Component, useState, useEffect, useRef, Fragment } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, Easing, TouchableWithoutFeedback } from 'react-native';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import DatePicker from 'react-native-datepicker'
import {lotteryRecords} from './gameList'
import Menu, {
  MenuProvider,
  MenuTrigger,
  MenuOptions,
  MenuOption,
  renderers,
} from 'react-native-popup-menu';

const { SlideInMenu } = renderers;


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
         isAdvance: false,
         gameLottety:'',
         gamesList: ['重庆时时彩', '山东时时彩', '天津时时彩', '江西11选5', '腾讯分分彩'],
         type:'',
         types: ['全部', '待开奖', '已中奖', '未中奖'],
         beginDate:'',
         endDate:'',
         datas: lotteryRecords.slice()
    };
  }

  _keyExtractor = (item, index) => index + 'qq'


  handleChoose = () => {
      const {gameLottety, beginDate, endDate, type, types} = this.state;
      const tempdata = lotteryRecords.slice().filter(item => {
            let flag1 = true, flag2 = true, flag3 = true;
            console.log(beginDate, '----', endDate);
            if(gameLottety)
                  flag1 = gameLottety == item.game
                  
            if(beginDate && endDate) {
                  flag2 = new Date(item.date).getTime() <= new Date(endDate).getTime() && new Date(item.date).getTime() >= new Date(beginDate).getTime()
            }   
            
            if(beginDate && !endDate)
                  flag2 = new Date(item.date).getTime() >= new Date(beginDate).getTime()

            if(!beginDate && endDate)
                  flag2 = new Date(item.date).getTime() <= new Date(endDate).getTime()  
                  
            if(type)      
                  flag3 = types[item.status] == type

            return flag1 && flag2 && flag3      
      })
      console.log(tempdata);
      this.setState({datas: tempdata})
  }

  renderAdvanceChoose = () => {
      const {gamesList, gameLottety, types, type} = this.state;
      let data1 = [{game: '重庆时时彩', wanfa: '直选 五星1', date:'2019-5-29', gameId: 113, content: '05 07|08|03 09|07 08 06', beishu:3, zushu: 1, total: 6},
      {game: '山东时时彩', wanfa: '直选 五星2', date:'2019-5-29', gameId: 113, content: '05 07|08 08 08|03 09|07 08 06', beishu:3, zushu: 2, total: 12},
      {game: '天津时时彩', wanfa: '直选 五星3', date:'2019-5-28', gameId: 113, content: '05 07|08 09|03 09|07 08 06', beishu:6, zushu: 1, total: 12},
      {game: '天津时时彩', wanfa: '直选 五星3', date:'2019-5-28', gameId: 113, content: '05 07|08 09|03 09|07 08 06', beishu:6, zushu: 1, total: 12},
      {game: '天津时时彩', wanfa: '直选 五星3', date:'2019-5-28', gameId: 113, content: '05 07|08 09|03 09|07 08 06', beishu:6, zushu: 1, total: 12},
      {game: '天津时时彩', wanfa: '直选 五星3', date:'2019-5-28', gameId: 113, content: '05 07|08 09|03 09|07 08 06', beishu:6, zushu: 1, total: 12}
      ]
      return (
        <MenuProvider style={styles.container}>
        <Menu name="numbers" style={{width:.25*width, height:.1*width}} renderer={SlideInMenu} onSelect={value => {if(value == gameLottety) return; console.log(value);this.setState({gameLottety:value}, () => this.handleChoose())}}>
            <MenuTrigger style={{width:.25*width, height:.1*width, backgroundColor:'pink', justifyContent:'center', alignItems:'center'}}>
                <Text style={[styles.text, styles.triggerText]}>选择彩种</Text>
            </MenuTrigger>
            
            <MenuOptions customStyles={{ optionText: [styles.text, styles.slideInOption] ,optionsContainer: {backgroundColor:'chocolate', borderColor:'yellow', borderBottomWidth:1},
                }}>

                {
                    gamesList.map(item => 
                        item == gameLottety ?
                        <MenuOption value={item} text={item} customStyles={{optionWrapper:{backgroundColor:'yellow'}, optionText:{color:'#0FA7F7'}}}/> : 
                        <MenuOption value={item} text={item} />  
                    )
                }                 
            </MenuOptions>
        </Menu>
        <View style={{width: .5*width, height:.1*width, backgroundColor:'grey', flexDirection:'row'}}>
                <DatePicker
                    style={{width: .25*width, height:.1*width}}
                    date={this.state.beginDate}
                    mode="date"
                    placeholder="选择开始时间"
                    format="YYYY-MM-DD"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    showIcon={false}
                    customStyles={{
                        dateInput: {
                            borderColor:'#FFA500'
                        }
                    }}
                    onDateChange={(beginDate) => {this.setState({beginDate})}}
                />
                
                <DatePicker
                    style={{width: .25*width, height:.1*width}}
                    date={this.state.endDate}
                    mode="date"
                    placeholder="选择结束时间"
                    format="YYYY-MM-DD"
                    minDate={this.state.beginDate}
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    showIcon={false}
                    customStyles={{
                        dateInput: {
                            borderColor:'#FFA500'
                        }
                    }}
                    onDateChange={(date) => {this.setState({endDate: date}, () => this.handleChoose());}}
                />
        </View>

        <Menu name="types" style={{width:.25*width, height:.1*width}} renderer={SlideInMenu} onSelect={value => {if(value == type) return; this.setState({type:value}, () => this.handleChoose())}}>
            <MenuTrigger style={{width:.25*width, height:.1*width, backgroundColor:'pink', justifyContent:'center', alignItems:'center'}}>
                <Text style={[styles.text, styles.triggerText]}>全部</Text>
            </MenuTrigger>

            <MenuOptions customStyles={{ optionText: [styles.text, styles.slideInOption] ,optionsContainer: {backgroundColor:'chocolate', borderColor:'yellow', borderBottomWidth:1},
                }}>

                {
                    types.map(item => 
                    item == type ?
                        <MenuOption value={item} text={item} customStyles={{optionWrapper:{backgroundColor:'yellow'}, optionText:{color:'#0FA7F7'}}}/> : 
                        <MenuOption value={item} text={item} />  
                    )
                }                 
            </MenuOptions>
        </Menu>
       
        <View style={{position:'absolute', top:.1*width, width, height: height - .1*width, alignItems:'center'}}>
                <FlatList
                    data={this.state.datas}
                    extraData={this.state}
                    renderItem={({item, index}) => 
                            <LotteryInfo item={{...item, index}} />}
                    keyExtractor={this._keyExtractor} 
                />

                 <TouchableWithoutFeedback onPress={() => this.setState({isAdvance: false})}>
                        <View style={{position:'absolute', width: .2*width, height:.08*width, backgroundColor:'#F7630F', borderRadius: .04*width, bottom:40, right:10, justifyContent:'center', alignItems:'center'}}>
                            <Text>
                                普通筛选
                            </Text>
                        </View>  
                    </TouchableWithoutFeedback>       
        </View>

        </MenuProvider> 
      )
  }

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
    
    const {gamesList, gameLottety, types, type} = this.state;
    
    return (
           <Fragment>
            {
                  this.state.isAdvance ? this.renderAdvanceChoose() : 
                  <View style={{  flex: 1, backgroundColor: "#252E32"}}>
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
                
                <TouchableWithoutFeedback onPress={() => this.setState({isAdvance: true})}>
                        <View style={{position:'absolute', width: .2*width, height:.08*width, backgroundColor:'#F7630F', borderRadius: .04*width, bottom:20, right:10, justifyContent:'center', alignItems:'center'}}>
                            <Text>
                                高级筛选
                            </Text>
                        </View>  
                    </TouchableWithoutFeedback>       
                  </View>        
              }  
              </Fragment>
    )            
    
}}


            
                     
             
               
    
  


export default LotteryRecord;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#252E32",
    flexDirection: 'row'
  },
  topTab: {
   // width:50
  },
  slideInOption: {
    padding: 5,
  },
  text: {
    fontSize: 15
  }
});
