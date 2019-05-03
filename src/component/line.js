import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';

const {width, height} = Dimensions.get('window');

class Line extends Component {
  static defaultProps = {
      gap:20
  }  

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  axisData = [12, 25 , 40, 27, 35 ,30]

  getStyle(index) {
      return {
          position:'absolute',
          left: 0,
          width: width - 40,
          height: 2,
          bottom: index*(2 + this.props.gap)
      }
  }

  componentDidMount() {

  }

  generateLine(begin, end) {
      const distance = (end.x - begin.x)*(end.x - begin.x) + (end.y - begin.y)*(end.y - begin.y);
      const lineWidth = Math.sqrt(distance);
      const degree = 180 / Math.PI * Math.atan((end.y - begin.y) / (end.x - begin.x));
      const dx = (lineWidth - (end.x - begin.x))/2;
      const dy = (end.y - begin.y)/2;
      return {
          position: 'absolute',
          left: begin.x - dx,
          bottom: begin.y + dy, 
          width: lineWidth,
          height: 2,
          backgroundColor: 'purple',
          transform:[{rotate: -degree + 'deg'}]
      }    
  }

  createDotView(data) {
    const dotStyles = data.map((v,i) => {
        return {
            width:4,
            height:4,
            backgroundColor:'yellowgreen',
            position: 'absolute',
            left: v.x - 2,
            bottom: v.y - 2
        }
    })

    const views = dotStyles.map((v,i) => (
        <View style={v}></View>
    ))

    return views;
  }


  render() {
    const {total, position} = this.props;
    const length = total/10 + 1;
    const number = Array.from({length}, (v,i) => i);
    const container = {
          width: width - 40,
          left: 20,
          height: (length - 1)*this.props.gap + length*2,
          position: 'absolute',
          top: .5*(height-350) - ((length - 1)*this.props.gap + length*2)*.5,
          backgroundColor:'grey'
    }

    const dataSet = [{x: 40, y: 1}, {x:80, y: 22}, {x:120, y: 52}, {x:160, y: 32}, {x:200, y: 42},{x:240, y: 62}, {x:280, y: 88}]
    const lineArr = Array.from({length: dataSet.length - 1}, (v,i) => i);
    return (
      <View style={container}>
           {
              number.map((v,i) => (
                  <View style={this.getStyle(i)}>
                        <View style={styles.line}></View>
                  </View>
              ))
           } 
           {
              lineArr.map((v,i) => (
                  <View style={this.generateLine(dataSet[i], dataSet[i+1])}></View>
              ))
           }
           {this.createDotView(dataSet)}
           <View style={styles.lineStyle} />
      </View>
    );
  }
}

export default Line;

const styles = StyleSheet.create({
     line: {
         position: 'absolute',
         left: 20,
         width: width - 60,
         height: 2,
         top:0,
         backgroundColor: '#f5d300'
     },
     lineStyle:{
        width:250,
        height:0,
        borderWidth:.8,
        borderColor:'red',
        borderStyle:'dashed',
        borderRadius:0.5,     
     }
})
