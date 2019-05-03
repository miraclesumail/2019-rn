// import React, { Component } from 'react';
// import { View, Text } from 'react-native';
// import { Accordion } from 'native-base';

// const dataArray = [
//     { title: "First Element", content: "Lorem ipsum dolor sit amet" },
//     { title: "Second Element", content: "Lorem ipsum dolor sit amet" },
//     { title: "Third Element", content: "Lorem ipsum dolor sit amet" }
//   ];

// class Accordions extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//     };
//   }

//   render() {
//     return (
//       <View>
//          <Accordion dataArray={dataArray} expanded={0} headerStyle={{ backgroundColor: "#b7daf8", borderBottomColor:'yellow', borderBottomWidth:2}}/>
//       </View>
//     );
//   }
// }

// export default Accordions;

import React, { Component } from 'react';
import { View } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Segment, Content, Text} from 'native-base';
export default class SegmentOutsideHeaderExample extends Component {
    state = {
        activePage:1,
    }
    
    selectComponent = (activePage) => () => this.setState({activePage})

    _renderComponent = () => {
        if(this.state.activePage === 0)
          return <View><Text>qqqqqqqqqq </Text></View>
        else if(this.state.activePage === 1)
          return <View><Text>wwwwwww</Text></View>
        else
          return <View><Text>eeeeeee</Text></View> 
      }


  render() {
    return (
      <Container>
        <Segment>
          <Button onPress={this.selectComponent(0)} active={this.state.activePage === 0}> 
            <Text>Puppes</Text>
          </Button>
          <Button onPress={this.selectComponent(1)} active={this.state.activePage === 1}>
            <Text>Kittens</Text>
          </Button>
          <Button onPress={this.selectComponent(2)} active={this.state.activePage === 2}>
            <Text>Cubs</Text>
          </Button>
        </Segment>
        <Content padder>
          {this._renderComponent()}
        </Content>
      </Container>
    );
  }
}
