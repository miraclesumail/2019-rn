// import React, { Component } from 'react';
// import { StyleSheet, View, Text, Animated, Dimensions } from 'react-native';
// import Interactable from 'react-native-interactable';

// const {height} = Dimensions.get('window');

// export default class SwipeableCard extends Component {
//   constructor(props){
//       super(props);
//       this._deltaX = new Animated.Value(0);
//       this.width = new Animated.Value(0);

//       this.state = {
//           _x:0,
//           index:0
//       }

//       this._deltaX.addListener(({value}) => {
//           this.setState({_x:value});
//           this.width.setValue(value);
//       })
//   }
 
//   onLayout = ({nativeEvent}) => {
//        console.log(nativeEvent.layout.y);
//        console.log('dddd');
//   }

//   onSnap = ({nativeEvent:{index}}) => {
//        console.log(index);
//        this.setState({index})
//   }
  
//   render() {
//     return (
//       <View style={styles.container}>

//         <Interactable.View
//           key="first"
//           horizontalOnly={true}
//           snapPoints={[
//             {x: 0,},
//             {x: 100},
//             {x: 200}
//           ]}
//           animatedValueX={this._deltaX}
//           onSnap={this.onSnap}
//         //   onDrag={(e) => {console.log(e.nativeEvent)}}
//           > 
//           <View style={styles.card}  onLayout={this.onLayout} >
//               <Text>{this.state.index}</Text>
//           </View>    
//         </Interactable.View>

//         <Animated.View style={[styles.progress, {width: this.width}]}>
               
//         </Animated.View>
//         {/* <View>
//             <Text>
//               {this.state._x}
//             </Text>
//         </View> */}
//         {/* <Interactable.View
//           key="second"
//           horizontalOnly={true}
//           snapPoints={[
//             {x: 360},
//             {x: 0},
//             {x: -360}
//           ]}>
//           <View style={styles.card} />
//         </Interactable.View>

//         <Interactable.View
//           key="third"
//           horizontalOnly={true}
//           snapPoints={[
//             {x: 360},
//             {x: 0, damping: 0.8},
//             {x: -360}
//           ]}>
//           <View style={styles.card} />
//         </Interactable.View> */}

//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop:0,
//     justifyContent: 'center',
//     // alignItems: 'center',
//     backgroundColor: 'white',
//   },
//   card : {
//     width: 50,
//     height: 50,
//     backgroundColor: '#32B76C',
//     borderRadius: 8,
//   },
//   progress: {
//       height:50,
//       backgroundColor: 'pink',
//       borderTopLeftRadius: 25,
//       borderBottomLeftRadius: 25,
//       position: 'absolute',
//       left:0,
//       top: .5*height - 65
//   }
// });