import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Card, Button } from 'react-native-paper';

export default class RowChecklist extends Component {
    render() {
        return (
            <View style={styles.itemContainer}>
                <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 10, borderColor: '#E9E6E5', borderWidth: 1 }}>
                    <TouchableOpacity onPress={()=>this.props.onPress('rootView')} style={{ flexDirection:'column', flex: 1, padding: 0 }}>
                        <Text style={styles.textHeader} >{this.props.item.title}</Text>
                        <Text style={styles.textDate} >Updated On : {new Date(this.props.item.updatedOn).toDateString()}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    itemContainer: {
        width: '95%',
        margin: 10
    },
    textHeader: {
        flex: 1,
        color: '#707070',
        fontFamily: 'Barlow-Medium',
        fontSize: 16,
        padding: 0,
        alignSelf: 'flex-start'

    },
    textDate: {
        flex: 1,
        width:'100%',
        color: '#707070',
        fontFamily: 'Barlow-Light',
        fontSize: 12,
        padding: 0,
        textAlign:'right',
        alignSelf: 'flex-start'

    },
})