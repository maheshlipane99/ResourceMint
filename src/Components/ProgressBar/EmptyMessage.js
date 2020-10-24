import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const EmptyMessage = (props) => {
    return (
        <View style={styles.container}>
            <Icon
                name='frown'
                type='font-awesome'
                color='#9D9E9E'
                size={35}
                style={styles.activityIndicator}
            />
            <Text style={[styles.label, { marginTop: 5 }]}> {props.children}</Text>
        </View>
    )
}
export default EmptyMessage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activityIndicator: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        color: '#707070',
        fontSize: 16,
        fontFamily: 'Barlow-Medium',
    },
})