// class MyItem extends React.PureComponent {
      
//     render() {
//        return (
//            <TouchableOpacity onPress={}>
//                <View>
                   
//                </View>
//            </TouchableOpacity>
//        )
//     }
// }

// class MultiList extends React.PureComponent {
//     _renderItem = (item) => {
         
//     }

//     render() {
//         return (
//            <FlatList
//               renderItem = {this._renderItem}
//            />
//         )
//     }
// }

// const Screen1 = ({navigator}) = (
//    <View>
//        Button

//    </View>
// )

// const buildSceneConfig = (children = []) => {
// const config = {};

// children.forEach(child => {
//   config[child.props.name] = { key: child.props.name, component: child.props.component };
// });

// return config;
// };

// class Navigator extends React.component {
// constructor(props) {
//   super(props);

//   const sceneConfig = buildSceneConfig(props.children);
//   const initialSceneName = props.children[0].props.name;

//   this.state = {
//     sceneConfig,
//     stack: [sceneConfig[initialSceneName]],
//   };
// }

// _animatedValue = new this._animatedValue.Value(0);

// handlePush(sceneName) {
//     this.setState((state) => (
//       {stack: [...state.stack, sceneConfig]}
//     ), () => {
//        Animated.timing(this._animatedValue, {
//             toValue: 0 ,
//             duration: 1000,
//             useNativeDriver: true
//        })
//     })
// }

// handlePop = () => {
//   Animated.timing(this._animatedValue, {
//     toValue: width,
//     duration: 250,
//     useNativeDriver: true,
//   }).start(() => {
//     this._animatedValue.setValue(0);
//     this.setState(state => {
//       const { stack } = state;
//       if (stack.length > 1) {
//         return {
//           stack: stack.slice(0, stack.length - 1),
//         };
//       }
//       return state;
//     });
//   });
// }

// _panResponer = PanResponder.create({
//     onMoveShouldSetPanResponder(evt, gestureState) {
//         const isFirstScreen = this.state.stack.length == 1;
//         const isFarLeft = evt.pageEvent.pagex;

//     },
//     onPanResponderMove(evt, gestureState) {
        
//     }
// })

// render() {
//    return (
//        <View>
//          {
//           this.state.sceneConfig.map((item,index) => {
//                 const currentScene = item.component;

//                 if(index == this.state.stack.length -1 && index > 0){
                   
//                 }

//           })
//          }
//        </View>      
//    )
// }

// }

// class ListItem extends React.component {
//     constructor(props){
//         super(props);
//         this._animatedValue = Animated.Value(1);      
//     }

//     render() {
//        return (
//            <View>
//               <SectionList></SectionList>   
//            </View> 
//        )
//     }

// }

// let headerDefaultNavigationConfig = {
//   header: props => <CustomHeader {...props}/>,
//   headerStyle: {
//     backgroundColor: 'transparent'
//   },
//   headTitleStyle: {
//     fontWeight: 'bold',
//     color
//   }
// }