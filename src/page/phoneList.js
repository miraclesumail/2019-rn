import React, { Component } from 'react';
import { View, Text, ListView,  StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import demoData from './data'

const Header = (props) => (
    <View style={styles.headcontainer}>
      <TextInput
        style={styles.input}
        placeholder="Search..."
        onChangeText={(text) => console.log('searching for ', text)}
      />
    </View>
)

const Footer = (props) => (
    <View style={styles.footcontainer}>
      <TouchableOpacity style={styles.button} onPress={() => console.log('load more')}>
        <Text style={styles.text}>Load More</Text>
      </TouchableOpacity>
    </View>
)


const Row = (props) => (
    <View style={styles.rowcontainer}>
      <Image source={{ uri: props.picture.large}} style={styles.photo} />
      <Text style={styles.rowtext}>
        {`${props.name.first} ${props.name.last}`}
      </Text>
    </View>
)

const SectionHeader = (props) => (
    <View style={styles.container}>
      <Text style={styles.text}>{props.character}</Text>
    </View>
  )

export default class Phone extends Component {
    constructor(props) {
        super(props);
    
        const getSectionData = (dataBlob, sectionId) => dataBlob[sectionId];
        const getRowData = (dataBlob, sectionId, rowId) => dataBlob[`${rowId}`];
    
        const ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2,
          sectionHeaderHasChanged : (s1, s2) => s1 !== s2,
          getSectionData,
          getRowData,
        });
    
        const { dataBlob, sectionIds, rowIds } = this.formatData(demoData);
        this.state = {
          dataSource: ds.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds),
        };
      }

  // [a,b,c,d]  [['aaa','asss','aseee'],['bbbgg']]
  formatData(data) {
    // We're sorting by alphabetically so we need the alphabet
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    // Need somewhere to store our data
    const dataBlob = {};
    const sectionIds = [];
    const rowIds = [];

    // Each section is going to represent a letter in the alphabet so we loop over the alphabet
    for (let sectionId = 0; sectionId < alphabet.length; sectionId++) {
      // Get the character we're currently looking for
      const currentChar = alphabet[sectionId];

      // Get users whose first name starts with the current letter
      const users = data.filter((user) => user.name.first.toUpperCase().indexOf(currentChar) === 0);

      // If there are any users who have a first name starting with the current letter then we'll
      // add a new section otherwise we just skip over it
      if (users.length > 0) {
        // Add a section id to our array so the listview knows that we've got a new section
        sectionIds.push(sectionId);

        // Store any data we would want to display in the section header. In our case we want to show
        // the current character
        dataBlob[sectionId] = { character: currentChar };

        // Setup a new array that we can store the row ids for this section
        rowIds.push([]);

        // Loop over the valid users for this section
        for (let i = 0; i < users.length; i++) {
          // Create a unique row id for the data blob that the listview can use for reference
          const rowId = `${sectionId}:${i}`;

          // Push the row id to the row ids array. This is what listview will reference to pull
          // data from our data blob
          rowIds[rowIds.length - 1].push(rowId);

          // Store the data we care about for this row
          dataBlob[rowId] = users[i];
        }
      }
    }
    return { dataBlob, sectionIds, rowIds };
  }

  render() {
    return (
        <View style={styles.maincontainer}>
            <ListView
                style={styles.maincontainer}
                dataSource={this.state.dataSource}
                stickySectionHeadersEnabled={true}
                renderRow={(data) => <Row {...data} />}
                renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
                renderHeader={() => <Header />}
                renderFooter={() => <Footer />}
                renderSectionHeader={(sectionData) => <SectionHeader {...sectionData} />}
            />
        </View>  
    );
  }
}


const styles = StyleSheet.create({
    maincontainer: {
        flex: 1,
      },
      separator: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#8E8E8E',
      },
    footcontainer: {
      flex: 1,
      padding: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
      borderColor: '#8E8E8E',
      borderWidth: StyleSheet.hairlineWidth,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 5,
    },
    text: {
      color: '#8E8E8E',
    },
    headcontainer: {
        flex: 1,
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'yellowgreen',
      },
    input: {
        height: 30,
        flex: 1,
        paddingHorizontal: 8,
        fontSize: 15,
        backgroundColor: '#FFFFFF',
        borderRadius: 2,
      },
      rowcontainer: {
        flex: 1,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
      },
      rowtext: {
        marginLeft: 12,
        fontSize: 16,
      },
      photo: {
        height: 40,
        width: 40,
        borderRadius: 20,
      },
      container: {
        flex: 1,
        padding: 8,
        justifyContent: 'center',
        backgroundColor: '#f5d300',
      },
      text: {
        fontSize: 13,
      }
  });