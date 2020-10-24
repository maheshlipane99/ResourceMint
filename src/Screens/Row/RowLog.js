import React, { Component } from 'react';
import { View, Text,StyleSheet,  } from 'react-native';
import { Divider } from 'react-native-paper';

export default class RowLog extends Component {
    render() {
        return (
            <View style={styles.itemContainer}>
                <View style={{ backgroundColor: 'white',}}>
                        <Text style={styles.textHeader} >{this.props.item.log}</Text>
                        <Text style={styles.textDate} >{this.props.item.createdOn+''}</Text>
                        <Divider/>
                </View>
            </View >
        );
    }
}


const styles = StyleSheet.create({
    itemContainer: {
        width: '95%',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10
    },
    textHeader: {
        flex: 1,
        color: '#707070',
        fontFamily: 'Barlow-Regular',
        fontSize: 12,
        padding: 0,
        alignSelf: 'flex-start'

    },
    textDate: {
        flex: 1,
        width: '100%',
        color: '#707070',
        fontFamily: 'Barlow-Light',
        fontSize: 10,
        marginBottom:5,
        alignSelf: 'flex-start'

    },
})