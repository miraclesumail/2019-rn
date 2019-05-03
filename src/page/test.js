import React, { Component } from 'react';
import { View, Text, FlatList, Dimensions, StyleSheet, NativeModules, requireNativeComponent } from 'react-native';
var RNFS = require('react-native-fs');

const width = Dimensions.get('window').width;

/**
 *  FlatList 继承ScrollView 所以有scrollview的props
 * 
 */

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
        list:[
            'qqqqqqq',
            'wwwwwww',
            'eeeeeee',
            'fffffff',
            'ggggggg',
            'hhhhhhh',
            'iiiiiii',
            'jjjjjjj',
            'jjjjjjj',
            'jjjjjjj11',
            'jjjjjjj22',
        ]
    };
  }

  componentDidMount() {
    setTimeout(() => {
       console.log(NativeModules.ToastExample.WTF);
       NativeModules.ToastExample.show('Awesome', NativeModules.ToastExample.SHORT);

       NativeModules.ToastExample.add(10, 15,  (msg) => {
        console.log(msg);
      },  (total) => {
        console.log(total);
      },)
    }, 2000)
    console.log(RNFS.ExternalStorageDirectoryPath);
    console.log('----RNFS.DocumentDirectoryPath----');
    RNFS.readDir(RNFS.DocumentDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
        .then((result) => {
        console.log('GOT RESULT', result);

        return Promise.all([RNFS.stat(result[0].path), result[0].path]);
    })
    .then((statResult) => {
    if (statResult[0].isFile()) {
        // if we have a file, read it
        console.log('is ---- file');
        return RNFS.readFile(statResult[1], 'utf8');
    }
    console.log(statResult);
    return 'no file';
    })
    .then((contents) => {
    // log the file contents
    console.log(contents);
    })
    .catch((err) => {
    console.log(err.message, err.code);
    });

    var path = RNFS.DocumentDirectoryPath + '/wtftest.txt';

// write the file
RNFS.writeFile(path, 'Lorem ipsum dolor sit amet', 'utf8')
  .then((success) => {
    console.log('FILE WRITTEN!');
  })
  .catch((err) => {
    console.log(err.message);
  });
   
    //   setInterval(() => {
    //        const list = [...this.state.list, 'moooooo']
    //        this.setState({list})
    //   }, 1000)
  }

  scroll() {
      //console.log('scroll')
  }

  onContentSizeChange(contentWidth, contentHeight) {
      console.log(contentHeight)
  }

  onViewableItemsChanged(info){
      console.log(info)
  }

  render() {
    return (
      <View>
           <FlatList data={this.state.list} extraData={this.state} onScroll={this.scroll.bind(this)} onContentSizeChange={this.onContentSizeChange.bind(this)} 
              contentContainerStyle={{paddingTop:10}} renderItem={({item}) => (<View style={styles.item}><Text>{item}</Text></View>)} keyExtractor={(item,index) => {return index+'qq'}}/>   
      </View>
    );
  }
}

const styles = StyleSheet.create({
    item: {
        width,
        height: 90,
        backgroundColor: '#f5d300'
    }
})

export default Test;
