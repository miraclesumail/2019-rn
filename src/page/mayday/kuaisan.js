import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Cube from '../../component/cube'

class KuaiSan extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View>
         <Cube/>
      </View>
    );
  }
}

export default KuaiSan;
