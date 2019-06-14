import React, { Component, Fragment } from 'react'
import { Text, View, Dimensions, ScrollView, StyleSheet, Animated, TouchableWithoutFeedback, PanResponder } from 'react-native'

const {width, height} = Dimensions.get('window');

export class Schedule extends Component {
    constructor(props){
         super(props);

         this.state = {
              // 8:00 17:00
              scheduleTable: [
                  ['', '','','',{subject:'java', duration:'40',begin:10, teacher:'Sumail Lei'},'','',''],
                  [{subject:'如何', duration:'40', begin:0, teacher:'Sumail Lei'}, {subject:'python', duration:'40', begin:0, teacher:'Sumail Lei'},'','',{subject:'java', duration:'40',begin:10, teacher:'Sumail Lei'},'','',''],
                  [{subject:'一样', duration:'50', begin:0, teacher:'Sumail Lei'}, '','','',{subject:'java', duration:'40',begin:10, teacher:'Sumail Lei'},'','',''],
                  [{subject:'java', duration:'40', begin:0, teacher:'Sumail Lei'}, '',{subject:'java', duration:'50', begin:0, teacher:'being Ray'},'',{subject:'java', duration:'40',begin:10, teacher:'Sumail Lei'},'','',''],
                  ['', '','','',{subject:'java', duration:'40',begin:10, teacher:'Sumail Lei'},'','',''],
                  ['', '',{subject:'swift', duration:'40',begin:10, teacher:'Sumail Lei'},'','','','',''],
                  ['', '','','',{subject:'java', duration:'40',begin:10, teacher:'Sumail Lei'},'',{subject:'flutter', duration:'60',begin:0, teacher:'Sumail Lei'},''],  
              ],
              times:['08:00','09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'],
              showModal: false,
              showInfo: null,
              chooseIndex:[],
              scrollEnabled: true,
              activeIndex:[]
         }

         this._animatedValue = new Animated.ValueXY;
         this.animatedLeft = new Animated.Value(0);
         this.animatedTop = new Animated.Value(0);

         this.rotate = new Animated.Value(0);
         this.rotate1 = new Animated.Value(0);
         this._value = {x:0, y:0}
         
         this._animatedValue.addListener(value => {
              console.log('valuejjjjjjjjj')
              this._value = value;
              this.animatedLeft.setValue(-value.x);
              this.animatedTop.setValue(-value.y);
         })

         this.onScroll = Animated.event([
            {nativeEvent: {contentOffset: {x: this._animatedValue.x}}}
         ])

         this.onScroll1 = Animated.event([
            {nativeEvent: {contentOffset: {y: this._animatedValue.y}}}
         ])

         this._angle = this.rotate.interpolate({
            inputRange: [-90,90],
            outputRange: ['-90deg', '90deg'],
            extrapolate:'clamp'
         })

         this._angle1 = this.rotate1.interpolate({
            inputRange: [-90,90],
            outputRange: ['-90deg', '90deg'],
            extrapolate:'clamp'
         })
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

    openMouse = () => {
        Animated.timing(this.rotate, {
            toValue:-45,
            duration: 500
        }).start();

        Animated.timing(this.rotate1, {
            toValue:45,
            duration: 500
        }).start();
    }

    changeTable = (arr1, arr2) => {
        const scheduleTable = this.state.scheduleTable;
        const tempSchedule = scheduleTable[arr1[0]][arr1[1]];
        scheduleTable[arr1[0]][arr1[1]] = scheduleTable[arr2[0]][arr2[1]];
        scheduleTable[arr2[0]][arr2[1]] = tempSchedule;
        this.setState({scheduleTable, scrollEnabled:true, activeIndex: []})
    }

    renderScheduleTable = () => {
        const {activeIndex} = this.state;
        return this.state.scheduleTable.map((item,index) => {
            return <View style={{width:.25*width, height:480}}>
                      {
                          item.map((ele, order) => {
                              const flag = activeIndex.length && index == activeIndex[0] && order == activeIndex[1];
                              return  ele && !flag? <TouchableWithoutFeedback onPress={() => this.showModal(index,order)} onLongPress={() => {this.setState({scrollEnabled:false, activeIndex:[index, order]})}}>
                                    <View style={[styles.course, {backgroundColor:'green'}]}>
                                            <View style={{position:'absolute', height: +ele.duration, top: +ele.begin, width:.25*width, left:0, backgroundColor:'#5DE8B4', alignItems:'center'}}>
                                                            <Text>课程:{ele.subject}</Text>
                                                            <Text>任教:{ele.teacher}</Text>
                                            </View> 
                                    </View>
                                </TouchableWithoutFeedback> 
                                :  <View style={[styles.course, {backgroundColor:'grey'}]}></View>
                        })
                      }
                   </View>
        })
    }

    renderTransferBlock = () => {
        if(!this.state.activeIndex.length) return null;
        const style = {
              position: 'absolute',
              left: this.state.activeIndex[0]*.25*width,
              top: this.state.activeIndex[1]*60,
              borderColor: 'red',
              backgroundColor:'green'
            //   width: .25*width,
            //   height: 60,
        }
        const [index, order] = this.state.activeIndex, ele = this.state.scheduleTable[index][order];
        return <HandDrag style={style} openMouse={() => this.openMouse()} orderedIndex={[index, order]} changeTable={(arr1, arr2) => this.changeTable(arr1, arr2)} scrollDis={this._value}>
                <View style={{position:'absolute', height: +ele.duration, top: +ele.begin, width:.25*width, left:0, backgroundColor:'#5DE8B4', alignItems:'center'}}>
                        <Text>课程:{ele.subject}</Text>
                        <Text>任教:{ele.teacher}</Text>
                </View> 
        </HandDrag>    
    }
 
    render() {
        const {scrollEnabled} = this.state;
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
               
                <View style={{width, height:360, backgroundColor:'yellowgreen', flexDirection:'row'}}>
                      <View style={{width:.15*width, height:360, backgroundColor:'yellow', overflow:'hidden'}}>
                          <Animated.View style={{width:.15*width, height:480, ...transformStyle1}}>
                                <View style={styles.time}><Text>08:00</Text></View><View style={styles.time}><Text>09:00</Text></View>
                                <View style={styles.time}><Text>10:00</Text></View><View style={styles.time}><Text>11:00</Text></View>
                                <View style={styles.time}><Text>13:00</Text></View><View style={styles.time}><Text>14:00</Text></View>
                                <View style={styles.time}><Text>15:00</Text></View><View style={styles.time}><Text>16:00</Text></View>
                          </Animated.View>
                      </View>
                      <ScrollView style={{width:.85*width, height:360}} onScroll={this.onScroll1} scrollEnabled={scrollEnabled}>
                           <View style={{width:.85*width, height:480}}>
                               <ScrollView horizontal={true} onScroll={this.onScroll} scrollEnabled={scrollEnabled}>
                                  <View style={{width:1.75*width, height:480, flexDirection:'row'}}>
                                      {
                                         this.renderScheduleTable()
                                       }
                                      {
                                         this.renderTransferBlock()
                                      }
                                   </View> 
                                </ScrollView> 
                           </View>                         
                      </ScrollView>    
                </View>
                <Animated.View style={{width:0, height:0,position:'absolute', top:240 + .2*height, left:.15*width, borderTopColor:'transparent', borderTopWidth:15, borderLeftWidth:30, borderLeftColor:'red', transform:[{rotate: this._angle}]}}>
                </Animated.View>
                <Animated.View style={{width:0, height:0,position:'absolute', top:255 + .2*height, left:.15*width, borderTopColor:'green', borderTopWidth:15, borderRightWidth:30, borderRightColor:'transparent', transform:[{rotate: this._angle1}]}}>
                </Animated.View>
           
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

class HandDrag extends Component {
    constructor(props) {
        super(props);

        this.state = {
             dragMode: false,
        }

        this.animatedValue = new Animated.ValueXY;
        this.animatedScale = new Animated.Value(1);
        
        this._value = {x:0, y:0};
        
        this.animatedValue.addListener((value) => {
             this._value = value;
        })
        
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => {
                 this.animatedValue.setOffset({
                     x: this._value.x,
                     y: this._value.y
                 })
                 this.animatedValue.setValue({
                    x: 0,
                    y: 0
                 })            
            },
            onPanResponderMove: Animated.event([
                null, { dx: this.animatedValue.x, dy: this.animatedValue.y}
            ]),
            onPanResponderRelease: (evt, gestureState) => {
                console.log('release');
                console.log(gestureState.vx);
                this.animatedValue.flattenOffset();
                this.animatedValue.setOffset({x:0, y:0})
                
                const disX = this._value.x, disY = this._value.y, directionX = disX > 0 ? 1 : -1, directionY = disY > 0 ? 1 : -1;

                const horizontalStep = Math.abs(disX) <= .125*width ? 0 : Math.ceil((Math.abs(disX) - .125*width)/(.25*width))*directionX;
                const verticalStep = Math.abs(disY) <= 30 ? 0 : Math.ceil((Math.abs(disY) - 30)/60)*directionY;
                console.log(disX, disY, 'dfdd-----');
                console.log(horizontalStep, verticalStep, 'dfdd-----');
                Animated.timing(this.animatedValue, {
                     toValue: {x: horizontalStep*.25*width, y: verticalStep*60},
                     duration: 50
                }).start(() => {
                     const {orderedIndex, changeTable} = this.props;
                     const arr1 = [orderedIndex[0], orderedIndex[1]];
                     const arr2 = [orderedIndex[0] + horizontalStep, orderedIndex[1] + verticalStep];
                     changeTable(arr1, arr2);
                })
            }
        })
    }

    goTrash = () => {
        console.log('gotransh');
       
        const {scrollDis, orderedIndex, openMouse} = this.props;
        const translateX = orderedIndex[0]*.25*width - scrollDis.x;
        const translateY = (255 + .2*height) - (orderedIndex[1]*60 - scrollDis.y + 40 + .03*height + 30);
        Animated.timing(this.animatedValue, {
                toValue: {x: -translateX - .125*width, y: translateY + 30},
                duration: 500
        }).start();

        Animated.timing(this.animatedScale, {
            toValue: 0,
            duration: 500
        }).start();

        setTimeout(() => {
            openMouse()
        }, 400)
        
    }

    
      render() {
          const {style} = this.props;   
          const transformStyle = {
                transform:[
                    ...this.animatedValue.getTranslateTransform(),
                    {scale: this.animatedScale}
                ]
          }
          return <Animated.View style={[styles.course, style, transformStyle]} {...this._panResponder.panHandlers}>
                 {this.props.children}
                 <TouchableWithoutFeedback onPress={() => this.goTrash()}>
                     <View style={{position:'absolute', width:15,height:15, top:0, right:0, backgroundColor:'pink', justifyContent:'center', alignItems:'center'}}><Text>×</Text></View>
                 </TouchableWithoutFeedback>
             </Animated.View> 
               
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
        borderBottomColor: 'yellow',
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
