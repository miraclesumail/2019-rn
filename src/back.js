import React, { Component } from 'react';
import { withNavigation } from 'react-navigation';
import { BackHandler } from 'react-native';

class HandleBack extends Component {
    constructor(props) {
        super(props);   
      }
    
      componentDidMount() {
        // this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        //   alert('ddddddddddddd')
        //   this.onBack(); // works best when the goBack is async
        //   return true;
        // });
      }
    
    //   onBack = () => {
    //     console.log('d f f f')
    //     return this.props.onBack();
    //   }

    //   componentWillUnmount() {
    //     this.backHandler.remove();
    //   }

      render() {
        return this.props.children;
      }
}

export default withNavigation(HandleBack);