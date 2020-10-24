import React, { Component } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Card } from 'react-native-paper';
import { rgba } from 'polished'

const searchInput = props => {
    const content = (
        <View style={styles.itemContainer}>
            <Card style={{ backgroundColor: 'white', radius: 0, padding: 1, borderColor: '#E9E6E5', height: 45 }} elevation={5}>
                <View style={{ backgroundColor: 'white', flexDirection: 'row', }}>
                    <TextInput
                        placeholder='Search'
                        autoCapitalize='none'
                        value={props.value}
                        keyboardType='email-address'
                        underlineColor="transparent"
                        style={[styles.input]}
                        onChangeText={text => props.onChangeText(text)}
                    />
                    <TouchableOpacity onPress={props.onPress} style={{ backgroundColor: 'white',justifyContent:'center'}}>
                        <Image
                            source={require('../../Assets/Search/magnifier.png')}
                            style={{ width: 20, height: 20, alignSelf: 'center', marginRight: 10 }} />
                    </TouchableOpacity>
                </View>
            </Card>
        </View>
    )
    return content
}

const styles = StyleSheet.create({

    itemContainer: {
        margin: 15
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#2D2D2D',
        marginLeft: 10,
        backgroundColor: rgba('#FFFFFF', 0),
        fontFamily: 'Barlow-Regular'
    },
})

export default searchInput;