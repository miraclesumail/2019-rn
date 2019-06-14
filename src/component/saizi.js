import React, { Component, Fragment } from 'react'
import { Text, View } from 'react-native'

const styles = {
   
    rectangle: {
    //   position: 'absolute',
    //   left: 0,
    //   top: 0,
    marginTop: 100,
      width: 50,
      height: 50,
      zIndex: 10,
    //   justifyContent:'center', 
    //   alignItems:'center',
      backgroundColor: 'transparent'
    }
}

export class Saizi extends Component {
    componentDidMount() {
         this.refViewTop.setNativeProps({style: {transform: [{matrix: [0.121869, 0, -0.992546, 0.000992546, 0, 1, 0, 0, 0.992546, 0, 0.121869, -0.000121869, 5.65368, 0, -251.183, 1.25118]}]}});
         //this.refViewBot.setNativeProps({style: {transform: [{matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, -0.01, 0, 0, 0, 1]}]}});
         this.refViewLeft.setNativeProps({style: {transform: [{matrix: [1, 0, 0, 0, 0, 0.121869, 0.992546, -0.000992546, 0, -0.992546, 0.121869, -0.000121869, 0, 21.7669, -27.8604, 1.02786]}]}});
         //this.refView.setNativeProps({style: {transform: [{matrix: [0.933013, 0.0669873, 0.353553, -0.00353553, 0.0669873, 0.933013, -0.353553, 0.00353553, -0.353553, 0.353553, 0.866025, -0.00866025, 0, 0, 0, 1]}]}});
        }    

    render() {
        return (
            //ref={component4 => this.refView = component4}
            <View style={styles.rectangle} ref={component4 => this.refView = component4}>
               <View style={{width:50, height:50, backgroundColor:'rgba(90,90,90,1)', position:'absolute', left:0, top:0}} ref={component1 => this.refViewTop = component1}>
                     <Text>ddd</Text>
               </View>

               {/* <View style={{width:50, height:50, backgroundColor:'#f5d300', position:'absolute', left:0, top:0}} ref={component2 => this.refViewBot = component2}>
                     <Text>ddd</Text>
               </View> */}
             
               <View style={{width:50, height:50, backgroundColor:'pink', position:'absolute', left:0, top:0}} ref={component3 => this.refViewLeft = component3}>
                     <Text>ddd</Text>
               </View>
            </View>
        )
    }
}

export default Saizi
