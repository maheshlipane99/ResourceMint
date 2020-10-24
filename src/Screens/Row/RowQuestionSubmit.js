import React, { Component } from 'react';
import { View, StyleSheet, } from 'react-native';

import { Button, Text, } from 'react-native-paper';
import { rgba } from 'polished'

const RowQuestionSubmit = props => {

    return (
        <View style={{ flex: 1, width: '100%' }}>
            <View style={styles.container}>
                <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
                    <Text style={styles.sHeader}>{props.title}</Text>
                    <Button
                        mode="contained"
                        color='#0A8BCC'
                        uppercase={false}
                        loading={props.isLoading}
                        disabled={props.isLoading}
                        style={styles.btn}
                        contentStyle={{ height: 50 }}
                        onPress={() => { props.onClickHandler('submit') }}  > {props.isLoading ? ' Wait... ' : ' Yes, Submit Now '}</Button>

                    <Button
                        mode="outlined"
                        color='#707070'
                        uppercase={false}
                        style={styles.btn}
                        contentStyle={{ height: 50 }}
                        onPress={() => { props.onClickHandler('cancel') }} > Cancel </Button>
                </View>

            </View>
        </View>
    );
}

export default RowQuestionSubmit

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignContent: 'center',
    },
    sHeader: {
        color: '#1F2352',
        fontSize: 20,
        fontFamily: 'Barlow-SemiBold',
        alignSelf: 'center'
    },
    textMessage: {
        textAlign: 'center',
        color: '#707070',
        fontSize: 14,
        fontFamily: "Barlow-Regular",
    },
    btnText: {
        color: '#333',
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 12,
        textAlign: 'center'
    },
    fab: {
        margin: 10,
    },
    textSkip: {
        fontSize: 16,
        color: '#CFCFCF',
        fontFamily: "Montserrat-Medium",
    },
    btn: {
        marginBottom: 10,
        marginTop: 20,
        fontFamily: 'Barlow-Medium'
    },
    input: {
        backgroundColor: rgba('#FFFFFF', 0),
        fontFamily: 'Barlow-Regular'
    },

})