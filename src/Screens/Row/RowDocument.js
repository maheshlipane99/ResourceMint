import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, } from 'react-native';

export default class RowDocument extends Component {
    render() {
        return (
            <View style={styles.itemContainer}>
                <View style={{ backgroundColor: 'white', borderRadius: 10, borderColor: '#E9E6E5', borderWidth: 1 }}>
                    <TouchableOpacity onPress={() => this.props.onPress('rootView')} style={{ flexDirection: 'column', flex: 1, padding: 10 }}>
                        <View style={{ backgroundColor: 'white', flexDirection: 'row', }}>
                            <View style={{ alignSelf: 'center', alignItems: 'center', marginRight: 10, }}>
                                <Image source={require('../../Assets/AssetOption/archive.png')} style={styles.backImage} />
                                {this.props.item.documateFile ? <Text style={styles.textDocument} >{this.props.item.documateFile.split('.').pop().split(/\#|\?/)[0]} </Text> : null}
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={styles.textHeader} >{this.props.item.documateTitle}</Text>
                                <Text style={styles.textType} >{this.props.item.documentType} Document</Text>
                            </View>
                        </View>
                        <Text style={styles.textDate} >{new Date(this.props.item.updatedOn).toDateString()}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    itemContainer: {
        margin: 10
    },
    textHeader: {
        color: '#707070',
        fontFamily: 'Barlow-Medium',
        fontSize: 16,
        padding: 0,
        alignSelf: 'flex-start'

    },
    textType: {
        color: '#A59F9D',
        fontFamily: 'Barlow-Light',
        fontSize: 12,
        marginBottom: 3,
        alignSelf: 'flex-start'

    },
    textDocument: {
        color: '#A59F9D',
        fontFamily: 'Barlow-Light',
        fontSize: 12,
        marginBottom: 3,

    },
    textDate: {
        width: '100%',
        color: '#C686D8',
        fontFamily: 'Barlow-Light',
        fontSize: 12,
        padding: 0,
        textAlign: 'right',
        alignSelf: 'flex-start'

    },
    backImage: {
        width: 24,
        height: 24,
        resizeMode: "center",
    },
})