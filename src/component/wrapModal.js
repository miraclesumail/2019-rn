import React, {Component} from 'react'
import {Platform, StyleSheet, Text, View, FlatList, Animated, Modal, TouchableHighlight, Button} from 'react-native'




export default function modalWrap(WrapComponent) {
       return class Detail extends Component {
              state = {
                    modalVisible: false,
                    modalText: ''
              };
        
              setModalVisible(visible) {
                this.setState({modalVisible: visible});
              }

              componentWillMount() {
                console.log('componentWillMount');
              }

              render() {
                  return (
                    <View>
                        <Modal animationType="slide" transparent={false}  visible={this.state.modalVisible}>
                            <View style={{marginTop: 22}}>
                                <View>
                                    <Text>Hello World!</Text>
                                    <TouchableHighlight
                                        onPress={() => {
                                        this.setModalVisible(!this.state.modalVisible);
                                        }}>
                                        <Text>{this.state.modalText}</Text>
                                    </TouchableHighlight>   

                                    <View style={{flexDirection:'row', justifyContent:"space-between"}}>
                                        <Button  onPress={() => {console.log('left')}}
                                            title="Learn More111"
                                            color="#841584"/>

                                        <Button  onPress={() => {console.log('left')}}
                                            title="Learn More222"
                                            color="#841584"/>    
                                    </View>               
                                </View>
                            </View>
                        </Modal>
                        <View>
                            <TouchableHighlight
                            onPress={() => {
                                this.setModalVisible(true);
                            }}>
                            <Text>Show Modal</Text>
                            </TouchableHighlight>
                            <WrapComponent changeText={(modalText) => {
                                  this.setState({modalText});
                                  this.setModalVisible(true);
                            }}/>
                        </View>
                    </View>
                  )                
              }
       } 
}