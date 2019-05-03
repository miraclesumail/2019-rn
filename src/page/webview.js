import React, { Component } from 'react';
import { View, Text, WebView, StyleSheet, BackHandler, TouchableHighlight, TouchableOpacity, Image } from 'react-native';

const styles = StyleSheet.create({
      indicator: {
          backgroundColor: 'green',
          width: 80,
          height: 80,
          borderRadius: 40,
          left:100
      }
})

class MyButton extends React.Component {
    setNativeProps = (nativeProps) => {
        this._root.setNativeProps(nativeProps);
    }

    render() {
      return (
        <View ref={component => this._root = component} {...this.props}>
          <Text>{this.props.label}</Text>
        </View>
      )
    }
  }
  
export default class Wb extends Component {
  constructor(props) {
    super(props);
    this.state = {
        backButtonEnabled:null
    };
    /**
     *  return true 会拦截后退
     */
    BackHandler.addEventListener('hardwareBackPress', this.backAndroid)
  }

  componentDidMount() {
     // this.sendPostMessage();
  }

  backAndroid = () => {
        if (this.state.backButtonEnabled) {
            this.web.goBack();
            return true;
        } else {
            return false;
        }
  }

  onNavigationStateChange = (navState) => {
        console.log(navState);
        this.setState({
            backButtonEnabled: navState.canGoBack,
        });    
  }

  sendPostMessage = () => {
      console.log('send');
      setTimeout(() => {
         this.web.postMessage("Post message from react native")
      }, 1000)
  }

  onMessage(event) {
    console.log( "On Message", event.nativeEvent.data );
  }

  render() {
    let jsCode = ` 
        document.querySelector('#main').style.backgroundColor = 'red';   
    `;
    //source={{uri: 'https://www.whatismybrowser.com/detect/is-javascript-enabled'}}

    return (
        <View style={{flex:1}}>
            <TouchableOpacity>
                    <MyButton label="Press me!" />
           </TouchableOpacity>   
            <TouchableHighlight style={{padding: 10, backgroundColor: 'blue', marginTop: 20}} onPress={() => this.sendPostMessage()}>
                <Text style={{color: 'white'}}>Send post message from react native</Text>
            </TouchableHighlight>

            <WebView  ref={web => this.web = web}
                source={{uri: 'file:///android_asset/pages/demo.html'}}
                javaScriptEnabled={true} startInLoadingState={true}
                renderLoading={() => (<View style={styles.indicator}></View>)}
                onLoadStart={() => {console.log('loadStart')}} onLoad={() => {console.log('loadFinish')}}
                onNavigationStateChange = {this.onNavigationStateChange} onMessage={this.onMessage}
            />

            <Image
                source={{
                    uri: 'https://facebook.github.io/react/logo-og.png',
                    cache: 'only-if-cached'
                }}
                style={{width: 400, height: 400}}
            ></Image>
        </View>   
    )
  }
}
