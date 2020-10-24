import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Card } from 'react-native-paper';

const searchView = props => {
    const content = (
        <View style={styles.itemContainer}>
            <Card style={{ backgroundColor: 'white', radius: 10, padding: 15, borderColor: '#E9E6E5' }} elevation={5}>
                <TouchableOpacity onPress={props.onPress} style={{ backgroundColor: 'white', flexDirection: 'row', }}>
                    <Text style={styles.textHeader} >{props.children}</Text>
                    <Image
                        source={require('../../Assets/Search/magnifier.png')}
                        style={{ width: 20, height: 20, }} />
                </TouchableOpacity>
            </Card>
        </View>
    )
    return content
}

const styles = StyleSheet.create({

    itemContainer: {
        margin: 15
    },
    textHeader: {
        flex: 1,
        color: '#707070',
        fontFamily: 'Barlow-Light',
        fontSize: 14,
        padding: 0,
        alignSelf: 'flex-start'

    },
})

export default searchView;