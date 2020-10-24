import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Card, } from 'react-native-paper';

const size = (Dimensions.get('window').width / 5) - 30;

export default class RowQuestionMark extends Component {
    render() {
        return (
            <View style={styles.itemContainer}>
                <Card style={{ backgroundColor: this.props.item.isAttempt ? 'green' : 'white', radius: 10, width: size, height: size }} elevation={5}>
                    <TouchableOpacity onPress={() => this.props.onPress('rootView')} style={{ flexDirection: 'column', flex: 1, justifyContent: 'center', alignContent: 'center', borderColor: this.props.item.isAttempt ? 'green' : '#0A8BCC', borderRadius: 5, borderWidth: 0.5 }}>
                        <Text style={[styles.btnText, { color: this.props.item.isAttempt ? 'white' : '#0A8BCC' }]} numberOfLines={2}>{this.props.item.item}</Text>
                    </TouchableOpacity>
                </Card>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    itemContainer: {
        width: size + 5,
        margin: 5,
    },
    btnBox: {
        width: '100%',
        height: '100%',
        position: 'relative',
        padding: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#f0f0f0',
    },
    btnText: {
        color: '#0A8BCC',
        fontFamily: 'Barlow-SemiBold',
        fontSize: 12,
        padding: 0,
        textAlign: 'center',

    },
})