import React, { Component, Fragment } from 'react'
import { Text, View, Dimensions, ScrollView, StyleSheet, Animated, TouchableWithoutFeedback, PanResponder } from 'react-native'

const {width, height} = Dimensions.get('window');

function getAllIndexes(arr, val) {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i+1)) != -1){
        indexes.push(i);
    }
    return indexes;
}

export class Schedule extends Component {
    constructor(props){
         super(props);

         this.state = {
              // 8:00 17:00
              scheduleTable: [
                  ['', '','','',{subject:'java', duration:'40',begin:10, teacher:'being Ray'},'','',''],
                  [{subject:'如何', duration:'40', begin:0, teacher:'Sumail Lei'}, {subject:'python', duration:'40', begin:0, teacher:'gannicus'},'','',{subject:'java', duration:'40',begin:10, teacher:'冠希哥'},'','',''],
                  [{subject:'一样', duration:'50', begin:0, teacher:'being Ray'}, '','','',{subject:'java', duration:'40',begin:10, teacher:'冠希哥'},'','',''],
                  [{subject:'java', duration:'40', begin:0, teacher:'being Ray'}, '',{subject:'java', duration:'50', begin:0, teacher:'being Ray'},'',{subject:'java', duration:'40',begin:10, teacher:'Sumail Lei'},'','',''],
                  ['', '','','',{subject:'java', duration:'40',begin:10, teacher:'冠希哥'},'','',''],
                  ['', '',{subject:'swift', duration:'40',begin:10, teacher:'tomato'},'','','','',''],
                  ['', '','','',{subject:'java', duration:'40',begin:10, teacher:'gannicus'},'',{subject:'flutter', duration:'60',begin:0, teacher:'yaphets'},''],  
              ],
              times:['08:00','09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'],
              showModal: false,
              showInfo: null,
              chooseIndex:[],
              scrollEnabled: true,
              activeIndex:[],
              teachers:[
                  {name:'Sumail Lei', occupied:'', max: 8, subjects:['java', 'javascript', 'php', 'golang', 'python']},
                  {name:'being Ray', occupied:'', max: 6, subjects:['java', 'objectivec', 'php', 'golang', 'python']},
                  {name:'冠希哥', occupied:'', max: 9, subjects:['java', 'javascript', 'swift', 'kotlin', 'python']},
                  {name:'tomato', occupied:'', max: 7, subjects:['java', 'javascript', 'php', 'golang', 'python']},
                  {name:'gannicus', occupied:'', max: 5, subjects:['java', 'c++', 'php', 'golang', 'python']},
                  {name:'yaphets', occupied:'', max: 8, subjects:['java', 'javascript', 'docker', 'golang', 'mysql']}
              ],
              isEdit: false,
              editInfo: {
                  teacher: '',
                  duration: '',
                  week: '',
                  begin: '',
                  subject: ''
              },
              subjectsToSelect: [],
              teachersToSelect: [],
              beginToSelect: [],
              weekToSelect: [],
              chooseNode: '',
              duration: [30, 40, 50, 60],
              flatListData: ''
         }

         this._animatedValue = new Animated.ValueXY;
         this.animatedLeft = new Animated.Value(0);
         this.animatedTop = new Animated.Value(0);

         this.menuTranslateY = new Animated.Value(-150); 

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

    componentDidMount() {
        // 开始需要统计老师上课信息
        const { scheduleTable } = this.state;
        let teachers = this.state.teachers.slice();

        scheduleTable.reduce((prev, next) => [...prev, ...next]).filter(item => item != '').forEach(item => {
              teachers = teachers.map(ele => 
                   ele.name == ite.teacher ? 
                   !ele.occupied ? ({...ele, occupied:1}) : ({...ele, occupied: ele.occupied + 1}) : ele
              )
        })

        this.setState({teachers})
    }

    componentWillUpdate(nextProps, nextState){
         // 每次editInfo的teacher 改变后
         if( this.state.editInfo.teacher != nextState.editInfo.teacher) {
                const { times, scheduleTable, teachers } = this.state;
                const teacher = nextState.editInfo.teacher;
                // 可以选择的科目
                const subjectsToSelect = teachers.filter(item => item.name == teacher)[0].subjects;

                // 可以选择的开始时间 
                let beginToSelect = [];
                getAllIndexes(scheduleTable[index], '').forEach(item => beginToSelect.push(times[item]));

                // 可以选择的老师 = 选课未满的老师 + 当前选中老师
                const teachersToSelect = teachers.filter(item => item.occupied < item.max).map(item => item.name).push(teacher);

                // 可以选择周几上课
                let weekToSelect = [];
                scheduleTable.forEach((item, index) => item.includes('') && weekToSelect.push(index));
                weekToSelect = weekToSelect.map(item => `周${item + 1}`)
                this.setState({subjectsToSelect, beginToSelect, teachersToSelect, weekToSelect})        
         }
    }
   
    // 打开课程信息 需要设置 editInfo
    showModal = (index, order) => {
         const { times, scheduleTable, teachers } = this.state;
         const begin = times[order].split(':')[0] + ':' + ('0' + this.state.scheduleTable[index][order].begin).slice(-2)
    
         this.setState({showInfo: {...this.state.scheduleTable[index][order], week: '周' + (index+1), begin}}, () => {
              this.setState({showModal: true, editInfo: this.state.showInfo,  chooseIndex:[index, order]})
         })
    }

    setFlatlistData = (choice) => {
         if(!this.state.editInfo.teacher) return;
         this.setState({chooseNode: choice});
         switch (choice) {
            case 'subject':
               this.setState({flatListData: subjectsToSelect});
               break;
            case 'teacher':
               this.setState({flatListData: teachersToSelect});
               break; 
            case 'begin':
               this.setState({flatListData: beginToSelect});
               break; 
            case 'duration':
               this.setState({flatListData: this.state.duration})   
            case 'week':
               this.setState({flatListData: weekToSelect});
               break; 
            default:
               break;         
         }  
         
         Animated.timing(this.menuTranslateY, {
              toValue: -150,
              duration: 600
         }).start();
    }

    submitChooseText = (text) => {
         const { chooseNode, editInfo } = this.state;
         switch (chooseNode) {
             case 'subject': 
               this.setState({editInfo: {...editInfo, subject: text}});
               break;
             case 'teacher':
               this.setState({editInfo: {...editInfo, teacher: text}});
               break;   
             case 'begin':
               this.setState({editInfo: {...editInfo, begin: text}});
               break;  
             case 'duration':
               this.setState({editInfo: {...editInfo, duration: text}});
               break; 
             case 'week':
               this.setState({editInfo: {...editInfo, week: text}});
               break;      
         }     
    }

    changeOrAddCourse = () => {
         const { chooseIndex, scheduleTable, times, editInfo: {week, begin, duration} } = this.state;
         if( chooseIndex.length ) {
             let scheduleTable = scheduleTable.slice();
             scheduleTable[chooseIndex[0]][chooseIndex[1]] = '';
             const [hIndex, vIndex] = [+week.replace('星期', '') - 1, times.indexOf(begin)];
            // scheduleTable[]
         }
    }

    delete = () => {
         const scheduleTable = this.state.scheduleTable;
         const {chooseIndex} = this.state;
         scheduleTable[chooseIndex[0]][chooseIndex[1]] = '';
         this.setState({scheduleTable}, () => {
              this.setState({showModal: false})
         })
    }

    deleteItem = (index, order) => {
        let scheduleTable = this.state.scheduleTable.slice();
        scheduleTable[index][order] = '';
        this.setState({scheduleTable, scrollEnabled:true, activeIndex: []});
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
        return <HandDrag style={style} openMouse={() => this.openMouse()} deleteItem={() => this.deleteItem(index, order)} orderedIndex={[index, order]} changeTable={(arr1, arr2) => this.changeTable(arr1, arr2)} scrollDis={this._value}>
                <View style={{position:'absolute', height: +ele.duration, top: +ele.begin, width:.25*width, left:0, backgroundColor:'#5DE8B4', alignItems:'center'}}>
                        <Text>课程:{ele.subject}</Text>
                        <Text>任教:{ele.teacher}</Text>
                </View> 
        </HandDrag>    
    }

    _keyExtractor = (item, index) => index + 'qq'
 
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

        const transformMenu = {
            transform: [
                {translateY: this.menuTranslateY}
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
                {/* <Animated.View style={{width:0, height:0,position:'absolute', top:240 + .2*height, left:.15*width, borderTopColor:'transparent', borderTopWidth:15, borderLeftWidth:30, borderLeftColor:'red', transform:[{rotate: this._angle}]}}>
                </Animated.View>
                <Animated.View style={{width:0, height:0,position:'absolute', top:255 + .2*height, left:.15*width, borderTopColor:'green', borderTopWidth:15, borderRightWidth:30, borderRightColor:'transparent', transform:[{rotate: this._angle1}]}}>
                </Animated.View> */}
           
                {
                      this.state.showModal && !this.state.isEdit?
                      <Fragment>
                      <TouchableWithoutFeedback onPress={() => this.setState({showModal: false})}>
                           <View style={styles.modal}>
                              
                            </View>
                      </TouchableWithoutFeedback> 
                                <View style={{position:'absolute', left:.1*width, top:.15*height, width:.8*width, height: .5*height, paddingTop:.02*height, backgroundColor:'chocolate', borderRadius:10, alignItems:'center'}}>
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
                                          <TouchableWithoutFeedback onPress={() => this.setState({isEdit: true})}><View style={styles.btn}><Text>编辑</Text></View></TouchableWithoutFeedback>
                                          <TouchableWithoutFeedback onPress={() => this.delete()}><View style={styles.btn}><Text>删除</Text></View></TouchableWithoutFeedback> 
                                    </View>
                                </View>
                        </Fragment>
                       : null
                }  

                {
                      this.state.showModal && this.state.isEdit?
                      <Fragment>
                                <TouchableWithoutFeedback onPress={() => this.setState({showModal: false})}>
                                    <View style={styles.modal}>
                                        
                                    </View>
                                </TouchableWithoutFeedback> 
                                <View style={{position:'absolute', left:.1*width, top:.15*height, width:.8*width, height: .5*height, paddingTop:.02*height, backgroundColor:'chocolate', borderRadius:10, alignItems:'center'}}>
                                    <TouchableWithoutFeedback onPress={() => {}}>
                                        <View style={{width:.6*width, height:.22*height, backgroundColor:'pink', justifyContent:'center', alignItems:'center', marginBottom:.02*height}}>
                                                <Text>{this.state.editInfo.subject}</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                   
                                    <TouchableWithoutFeedback onPress={() => this.setFlatlistData('teacher')}>
                                        <View style={styles.info}>
                                            <Text>授课老师:{this.state.editInfo.teacher}</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                   
                                    <TouchableWithoutFeedback onPress={() => this.setFlatlistData('duration')}>
                                        <View style={styles.info}>
                                            <Text>授课时长:{this.state.editInfo.duration}分钟</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    
                                    <TouchableWithoutFeedback onPress={() => this.setFlatlistData('week')}>
                                        <View style={styles.info}>
                                            <Text>授课星期:{this.state.editInfo.week}</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                   
                                    <View style={styles.info}>
                                        <Text>授课时间:{this.state.editInfo.begin}</Text>
                                    </View>

                                    <View style={{width:.5*width, height:.08*height, marginTop: .01*height, flexDirection:'row', justifyContent:'center'}}>
                                          <TouchableWithoutFeedback onPress={() => this.delete()}><View style={styles.btn}><Text>保存</Text></View></TouchableWithoutFeedback> 
                                    </View>
                                </View>

                                <Animated.View style={{width, height: 150, bottom:0, backgroundColor:'chocolate', ...transformMenu}}>
                                       <FlatList 
                                           data={this.state.flatListData}
                                           extraData={this.state}
                                           renderItem={({item}) => 
                                                   <TouchableWithoutFeedback onPress={() => this.submitChooseText(item)}>
                                                         <View><Text>{item}</Text></View>
                                                   </TouchableWithoutFeedback>
                                                }
                                           keyExtractor={this._keyExtractor} 
                                       />
                                </Animated.View>
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
            onStartShouldSetPanResponder: (evt, gestureState) => !(gestureState.dx === 0 && gestureState.dy === 0),
            onMoveShouldSetPanResponder: (evt, gestureState) => !(gestureState.dx === 0 && gestureState.dy === 0),
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
                console.log('release 啊啊啊啊啊啊啊啊');
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
          const {style, deleteItem} = this.props;   
          const transformStyle = {
                transform:[
                    ...this.animatedValue.getTranslateTransform(),
                    {scale: this.animatedScale}
                ]
          }
          return <Animated.View style={[styles.course, style, transformStyle]} {...this._panResponder.panHandlers}>
                 {this.props.children}
                 <TouchableWithoutFeedback onPress={() => deleteItem()}>
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
