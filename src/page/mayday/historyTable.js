import React, { Component, Fragment } from 'react'
import { Text, View, StyleSheet, Dimensions, Animated, Easing, FlatList, PanResponder } from 'react-native'
import HistoryLine from './historyLine'
const {width} = Dimensions.get('window');

const initialHistory = [
    {number:11123, daxiao:'大', jiou:'偶', hezhi:15, balls:'53232', index:0},
    {number:11122, daxiao:'大', jiou:'偶', hezhi:15, balls:'53232', index:1},
    {number:11121, daxiao:'大', jiou:'偶', hezhi:15, balls:'53232', index:2},
    {number:11120, daxiao:'大', jiou:'偶', hezhi:15, balls:'53232', index:3},
    {number:11119, daxiao:'大', jiou:'偶', hezhi:15, balls:'53232', index:4},
    {number:11118, daxiao:'大', jiou:'偶', hezhi:15, balls:'53232', index:5}
]

function judgeArr(arr) {
    const sum = arr.reduce((prev, next) => prev + next);
    return {jiou: sum % 2 ? '奇' : '偶', daxiao: sum >= 25 ? '大' : '小', hezhi: sum};
}

class HistoryTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
        history: initialHistory,
        showNum: 1,
        historyArr: initialHistory.slice(0, 3)
    };

    this.animatedY = new Animated.Value(0);
    this.y = 0;
    this.hasChange = false;

    this.animatedY.addListener(({value}) => {
         this.y = value;
    })

    this.animatedHeight = new Animated.Value(120);

    this._panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => {
            return true;
        },
        onMoveShouldSetPanResponder: (evt, gestureState) => {
            return true;
        },
        onPanResponderGrant: (evt, gestureState) => {
            console.log('begin');
        },
        onPanResponderMove: (evt, gestureState) => {
            if(this.hasChange) return;
            
            if(this.y >= 30) {
               this.slideDown();
            }

            if(this.y <= -30) {
               this.slideUp();
            }
            Animated.event([null, {dy: this.animatedY}])(evt, gestureState);
        },
        onPanResponderRelease: (evt, gestureState) => {
            if(!this.hasChange && gestureState.vy > 20 ){
                this.setState({showNum: this.state.showNum + 1});
            }
                
            if(!this.hasChange && gestureState.vy <- 20 ){
                this.setState({showNum: this.state.showNum - 1});
            }
                
            this.hasChange = false;    
        } 
    })
  }

  componentDidMount() {
    this.$react.subscribe('updateTempHistory', () => {
        this.updateTempHistory();
    })

    this.props.ws.onmessage = (msg) => {         
        let data = JSON.parse(msg.data);
        if(data.type == 'newDate') {
             const nums = data.nums;
             console.log('publish');
             this.$react.publish('receiveLottery', data);
             const { daxiao, jiou, hezhi } = judgeArr(nums);
             let history = this.state.history.slice();
             const firstOne = { daxiao, jiou, hezhi, ...history[0], balls:nums.join('') };
             history[0] = firstOne;
             console.log(history);
             this.setState({history, historyArr: history.slice(0, this.state.showNum*3)});
        }
    }
  }

  slideDown = () => {
        const {showNum, history} = this.state;
        this.animatedY.setValue(0);
        if(showNum >= Math.ceil(history.length/3)) return;
        this.hasChange = true;
        this.setState({showNum: this.state.showNum + 1}, () => {
            const historyArr = this.state.history.slice(0, 3*this.state.showNum);
            this.setState({historyArr});
            const length = historyArr.length + 1;

            Animated.timing(this.animatedHeight, {
                toValue: length*30,
                duration:500,
                easing: Easing.bounce
            }).start();
        }); 
        return;
  }


  slideUp = () => {
        const {showNum, history} = this.state;
        this.animatedY.setValue(0);
        if(showNum <= 1) return;
        
        this.hasChange = true;
        const historyArr = this.state.history.slice(0, 3*(this.state.showNum - 1));
        const length = historyArr.length + 1;

        Animated.timing(this.animatedHeight, {
            toValue: length*30,
            duration:500,
            easing: Easing.bounce
        }).start(() => {
            this.setState({showNum: this.state.showNum - 1}, () => {
                const historyArr = this.state.history.slice(0, 3*this.state.showNum);
                this.setState({historyArr});
            }); 
        });        
        return;
  }

  // 更新最新一期为等待开奖  这里需要注意的是  当我滑到了总共7条的时候  要开奖了  需要保持原先显示的长度
  updateTempHistory = () => {
    let {history} = this.state;
    const prevLength = history.length;
    history = history.map(item => ({index: ++item.index, ...item}));
    history = [{number: history[0].number + 1, balls:null, index:0}, ...history];
    this.setState({history, historyArr: history.slice(0, prevLength)});
  }

  _keyExtractor = (item, index) => index + 'qq'

  render() {
    return (
        <Animated.View style={{width, height: this.animatedHeight, marginBottom:20, overflow:'hidden'}} {...this._panResponder.panHandlers}>
            <View style={{width, height:30, flexDirection:'row', backgroundColor:'pink' }}>
                <View style={{width:.25*width, height:30, justifyContent:'center', alignItems:'center', borderRightColor:'pink', borderRightWidth:1}}><Text>期数</Text></View>
                <View style={{width:.12*width, height:30,justifyContent:'center', alignItems:'center', borderRightColor:'pink', borderRightWidth:1}}><Text>大小</Text></View>
                <View style={{width:.12*width, height:30,justifyContent:'center', alignItems:'center', borderRightColor:'pink', borderRightWidth:1}}><Text>奇偶</Text></View>
                <View style={{width:.12*width, height:30,justifyContent:'center', alignItems:'center', borderRightColor:'pink', borderRightWidth:1}}><Text>和值</Text></View>
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>号码</Text></View>
            </View>

            <FlatList
                data={this.state.historyArr}
                renderItem={({item}) => <HistoryLine item={item} />}
                keyExtractor={this._keyExtractor} 
            />
        </Animated.View>
    );
  }
}

export default HistoryTable;


 