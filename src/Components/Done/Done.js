import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';
import { Button, } from 'react-native-paper';

const Done = (props) => {
    return (
        <View style={styles.container}>
            <Icon
                active
                name={props.icon ? props.icon : 'check-circle'}
                style={{ color: "#0A8BCC", fontSize: props.iconSize ? props.iconSize : 100 }}
            />
            <Text style={[styles.textTitle, { marginTop: 15 }]}>{props.title}</Text>
            <Text style={[styles.textMessage, { marginTop: 15 }]}>{props.message}</Text>
            <Button
                mode="contained"
                color='#707070'
                uppercase={false}
                style={styles.btn}
                contentStyle={{ height: 30, alignSelf: 'flex-end' }}
                onPress={() => { props.onPress('done') }}  >{props.btnText ? props.btnText : 'Back'}  </Button>
        </View>
    )
}
export default Done

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textTitle: {
        color: '#646464',
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Barlow-Medium',
    },
    textMessage: {
        color: '#707070',
        fontSize: 12,
        textAlign: 'center',
        fontFamily: 'Barlow-Light',
    },
    btn: {
        marginBottom: 10,
        marginTop: 20,
        fontFamily: 'Barlow-Medium'
    },
})