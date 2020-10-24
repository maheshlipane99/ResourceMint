import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { Card, } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';


export default class HomeCard extends Component {
    render() {
        return (

            <View style={styles.itemContainer}>
                <Card style={{ backgroundColor: 'white', radius: 10 }} elevation={5}>
                    <TouchableOpacity onPress={this.props.onPress} style={{ flexDirection: 'row', flex: 1, padding: 0 }}>
                        <View style={{ backgroundColor: 'white', padding: 5, margin: 5 }}>
                            <Image source={this.props.item.icon} style={styles.backImage} />
                        </View>
                        <View style={{ width: 0.5, height: '80%', backgroundColor: '#C1C0C0', margin: 10, alignSelf: 'center' }}></View>
                        <View style={{ flexDirection: 'column', flex: 1, padding: 10, backgroundColor: 'white' }}>
                            <Text style={styles.textHeader} >{this.props.item.count}</Text>
                            <Text style={styles.btnText} numberOfLines={2}>{this.props.item.title}</Text>
                        </View>
                        <View style={{ width: 60, alignItems: 'center', alignContent: 'center', justifyContent: 'center', backgroundColor: '#A958BF', borderTopRightRadius: 5, borderBottomRightRadius: 5 }}>
                            <Image
                                resizeMode='contain'
                                source={require('../../Assets/AssetOption/right-arrow.png')}
                                style={[styles.fab, { width: 24, height: 24, tintColor: 'white' }]} />
                        </View>
                    </TouchableOpacity>

                </Card>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    itemContainer: {
        width: '95%',
        margin: 10
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
    textHeader: {
        flex: 1,
        color: '#2D2D2D',
        fontFamily: 'Barlow-Medium',
        fontSize: 20,
        textAlign: 'center',
        padding: 0,
        alignSelf: 'flex-start'

    },
    btnText: {
        color: '#A59F9D',
        fontFamily: 'Barlow-Light',
        fontSize: 16,
        padding: 0,
        textAlign: 'center',
        alignSelf: 'flex-end'

    },
    backImage: {
        width: 50,
        height: 50,
        resizeMode: "center",
    },
})