import React, { Component } from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ImageLoader = (props) => {
    state = { animating: props.animating }
    componentDidMount = () => this.closeActivityIndicator()
    const animating = this.state.animating
    return (
        <View style={styles.container}>
            <ActivityIndicator
                animating={animating}
                color={props.color ? props.color : '#bc2b78'}
                size={props.size ? props.size : "small"}
                style={styles.activityIndicator} />
            {props.message ? <Text style={[styles.label, { marginTop: 5 }]}>{props.message} </Text> : null}
        </View>
    )
}
export default ImageLoader

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