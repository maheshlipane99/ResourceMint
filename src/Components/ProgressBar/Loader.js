import React, { Component } from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Loader = (props) => {
    state = { animating: props.animating }
    componentDidMount = () => this.closeActivityIndicator()
    const animating = this.state.animating
    return (
        <View style={styles.container}>
            <ActivityIndicator
                animating={animating}
                color='#bc2b78'
                size="small"
                style={styles.activityIndicator} />
            <Text style={[styles.label, { marginTop: 5 }]}>{props.message ? props.message : 'Please wait...'}</Text>
        </View>
    )
}
export default Loader

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
        fontSize: 10,
        fontFamily: 'Barlow-Medium',
    },
})