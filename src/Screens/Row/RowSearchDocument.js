import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Divider, Button } from 'react-native-paper';

export default class RowSearchDocument extends Component {
    render() {
        return (
            <View style={styles.itemContainer}>
                <View style={{ backgroundColor: 'white', padding: 0, }}>
                    <TouchableOpacity onPress={() => this.props.onPress('rootView')} style={{ flexDirection: 'column', flex: 1, padding: 0 }}>
                        <Text style={styles.textHeader} >{this.props.item.documateTitle}</Text>
                        <Divider />
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
        marginBottom: 10,
        alignSelf: 'flex-start'

    },
})