import React, { Component, Fragment } from 'react'
import { Text, View, Dimensions, ScrollView, StyleSheet, Animated, TouchableWithoutFeedback } from 'react-native'

const {width, height} = Dimensions.get('window');

export class Schedule extends Component {
    constructor(props){
         super(props);

         this.state = {
              // 8:00 17:00
              scheduleTable: [
                  ['', '','','',{subject:'java', duration:'40',begin:10, teacher:'Sumail Lei'},'','',''],
                  [{subject:'java', duration:'40', begin:0, teacher:'Sumail Lei'}, {subject:'python', duration:'40', begin:0, teacher:'Sumail Lei'},'','',{subject:'java', duration:'40',begin:10, teacher:'Sumail Lei'},'','',''],
                  [{subject:'java', duration:'40', begin:0, teacher:'Sumail Lei'}, '','','',{subject:'java', duration:'40',begin:10, teacher:'Sumail Lei'},'','',''],
                  [{subject:'java', duration:'40', begin:0, teacher:'Sumail Lei'}, '',{subject:'java', duration:'50', begin:0, teacher:'being Ray'},'',{subject:'java', duration:'40',begin:10, teacher:'Sumail Lei'},'','',''],
                  ['', '','','',{subject:'java', duration:'40',begin:10, teacher:'Sumail Lei'},'','',''],
                  ['', '',{subject:'swift', duration:'40',begin:10, teacher:'Sumail Lei'},'','','','',''],
                  ['', '','','',{subject:'java', duration:'40',begin:10, teacher:'Sumail Lei'},'',{subject:'flutter', duration:'60',begin:0, teacher:'Sumail Lei'},''],
                
              ],
              times:['08:00','09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'],
              showModal: false,
              showInfo: null,
              chooseIndex:[]
         }

         this._animatedValue = new Animated.ValueXY;
         this.animatedLeft = new Animated.Value(0);
         this.animatedTop = new Animated.Value(0);
         
         this._animatedValue.addListener(value => {
              console.log('valuejjjjjjjjj')
              this.animatedLeft.setValue(-value.x);
              this.animatedTop.setValue(-value.y);
         })

         this.onScroll = Animated.event([
            {nativeEvent: {contentOffset: {x: this._animatedValue.x}}}
         ])

         this.onScroll1 = Animated.event([
            {nativeEvent: {contentOffset: {y: this._animatedValue.y}}}
         ])
    }
   
    showModal = (index, order) => {
         const {times} = this.state;
         const begin = times[order].split(':')[0] + ':' + ('0' + this.state.scheduleTable[index][order].begin).slice(-2)
         this.setState({showInfo: {...this.state.scheduleTable[index][order], week: '周' + (index+1), begin}}, () => {
              this.setState({showModal: true, chooseIndex:[index, order]})
         })
    }

    delete = () => {
         const scheduleTable = this.state.scheduleTable;
         const {chooseIndex} = this.state;
         scheduleTable[chooseIndex[0]][chooseIndex[1]] = '';
         this.setState({scheduleTable}, () => {
              this.setState({showModal: false})
         })
    }
    // onScroll = (e) => {
    //     console.log(e.nativeEvent.contentOffset.x);
    // }

    render() {
        const transformStyle = {
              transform: [
                  {translateX: this.animatedLeft}
              ]
        }
        const transformStyle1 = {
            transform: [
                {translateY: this.animatedTop}
            ]
      }
        return (
            <View style={{width, height}}>
                <View style={{width, height:.03*height, backgroundColor:'pink', justifyContent:'center', alignItems:'center'}}>
                    <Text>J01课程安排</Text>
                </View>
                
                <View style={{width, height:40, flexDirection:'row'}}>
                        <View style={{width:.15*width, height:40, justifyContent:'center', alignItems:'center', backgroundColor:'#5DB4E8'}}>
                                <Text>时间</Text>
                        </View>
                      
                        <View style={{width:.85*width, height:40, overflow:'hidden'}}>
                                <Animated.View style={{width:1.75*width, height:40, flexDirection: 'row', ...transformStyle}}>
                                    <View style={styles.week}><Text>星期一</Text></View><View style={styles.week}><Text>星期二</Text></View>
                                    <View style={styles.week}><Text>星期三</Text></View><View style={styles.week}><Text>星期四</Text></View>
                                    <View style={styles.week}><Text>星期五</Text></View><View style={styles.week}><Text>星期六</Text></View>
                                    <View style={styles.week}><Text>星期天</Text></View>
                                </Animated.View>
                        </View>
                </View>
               
                <View style={{width, height:300, backgroundColor:'yellowgreen', flexDirection:'row'}}>
                      <View style={{width:.15*width, height:360, backgroundColor:'yellow', overflow:'hidden'}}>
                          <Animated.View style={{width:.15*width, height:480, ...transformStyle1}}>
                                <View style={styles.time}><Text>08:00</Text></View><View style={styles.time}><Text>09:00</Text></View>
                                <View style={styles.time}><Text>10:00</Text></View><View style={styles.time}><Text>11:00</Text></View>
                                <View style={styles.time}><Text>13:00</Text></View><View style={styles.time}><Text>14:00</Text></View>
                                <View style={styles.time}><Text>15:00</Text></View><View style={styles.time}><Text>16:00</Text></View>
                          </Animated.View>
                      </View>
                      <ScrollView style={{width:.85*width, height:360}} onScroll={this.onScroll1}>
                           <View style={{width:.85*width, height:480}}>
                               <ScrollView horizontal={true} onScroll={this.onScroll}>
                                    {
                                        this.state.scheduleTable.map((item,index) => {
                                            return <View style={{width:.25*width, height:480}}>
                                                      {
                                                          item.map((ele, order) => (
                                                              ele ? <View style={[styles.course, {backgroundColor:'green'}]}>
                                                                   <TouchableWithoutFeedback onPress={() => this.showModal(index,order)}>
                                                                        <View style={{position:'absolute', height: +ele.duration, top: +ele.begin, width:.25*width, left:0, backgroundColor:'#5DE8B4', alignItems:'center'}}>
                                                                                <Text>课程:{ele.subject}</Text>
                                                                                <Text>任教:{ele.teacher}</Text>
                                                                        </View> 
                                                                   </TouchableWithoutFeedback>                                                                  
                                                              </View> : 
                                                               <View style={[styles.course, {backgroundColor:'grey'}]}></View>
                                                          ))
                                                      }
                                                   </View>
                                        })
                                    }
                                </ScrollView> 
                           </View>                         
                      </ScrollView>
                </View>
           
                {
                      this.state.showModal ?
                      <Fragment>
                      <TouchableWithoutFeedback onPress={() => this.setState({showModal: false})}>
                           <View style={styles.modal}>
                              
                            </View>
                      </TouchableWithoutFeedback> 
                                <View style={{position:'absolute', left:.1*width, top:.2*height, width:.8*width, height: .5*height, paddingTop:.02*height, backgroundColor:'chocolate', borderRadius:10, alignItems:'center'}}>
                                    <View style={{width:.6*width, height:.22*height, backgroundColor:'pink', justifyContent:'center', alignItems:'center', marginBottom:.02*height}}>
                                            <Text>{this.state.showInfo.subject}</Text>
                                    </View>

                                    <View style={styles.info}>
                                        <Text>授课老师:{this.state.showInfo.teacher}</Text>
                                    </View>
                                    <View style={styles.info}>
                                        <Text>授课时长:{this.state.showInfo.duration}分钟</Text>
                                    </View>
                                    <View style={styles.info}>
                                        <Text>授课星期:{this.state.showInfo.week}</Text>
                                    </View>
                                    <View style={styles.info}>
                                        <Text>授课时间:{this.state.showInfo.begin}</Text>
                                    </View>

                                    <View style={{width:.5*width, height:.08*height, marginTop: .01*height, flexDirection:'row', justifyContent:'space-between'}}>
                                          <View style={styles.btn}><Text>编辑</Text></View>
                                          <TouchableWithoutFeedback onPress={() => this.delete()}><View style={styles.btn}><Text>删除</Text></View></TouchableWithoutFeedback> 
                                    </View>
                                </View>
                        </Fragment>
                       : null
                }         
            </View>
        )
    }
}

const styles = StyleSheet.create({
    contentContainer: {
        width: 1.75*width,
        height:40,
        flexDirection:'row'
    },
    week: {
        width:.25*width,
        height: 40,
        backgroundColor:'chocolate',
        borderRightWidth: 1,
        borderRightColor: '#f5d300',
        justifyContent: 'center',
        alignItems: 'center'
    },
    time: {
        width: .15*width,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
    course: {
        width:.25*width, height:60,
        borderWidth:1,
        borderRightColor:'yellow',
        borderBottomColor: 'yellow'
    },
    modal: {
        position:'absolute',
        width, 
        height,
        backgroundColor: 'rgba(32,36,34,.6)',
        justifyContent:'center',
        alignItems:'center'
    },
    info: {
        marginBottom: .01*height,
        width: .6*width,
        justifyContent:'center',
        alignItems:'center'
    },
    btn: {
        width:.2*width,
        height:.05*height,
        backgroundColor:'yellowgreen',
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center'
    }
})

export default Schedule
