import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { Card, } from 'react-native-paper';

const size = (Dimensions.get('window').width / 3) - 20;

export default class RowAssetOption extends Component {
    render() {
        return (
            <View style={styles.itemContainer}>
                <Card style={{ backgroundColor: 'white', radius: 10, width: size, height: size }} elevation={5}>
                    <TouchableOpacity onPress={()=>this.props.onPress(this.props.item.id)} style={{ flexDirection: 'column', flex: 1, justifyContent:'center', alignContent: 'center',borderColor:'#0A8BCC',borderRadius:5,borderWidth:0.5 }}>
                        <Image source={this.props.item.icon} style={styles.backImage} />
                        <Text style={styles.btnText} numberOfLines={2}>{this.props.item.title}</Text>
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
    textHeader: {
        flex: 1,
        color: '#0A8BCC',
        fontFamily: 'Barlow-Medium',
        fontSize: 18,
        textAlign: 'center',
        padding: 0,
        alignSelf: 'flex-start'

    },
    btnText: {
        color: '#0A8BCC',
        fontFamily: 'Barlow-Regular',
        fontSize: 12,
        padding: 0,
        textAlign: 'center',

    },
    backImage: {
        width: 30,
        height: 30,
        resizeMode: "center",
        alignSelf:'center',
        marginBottom:10
    },
})