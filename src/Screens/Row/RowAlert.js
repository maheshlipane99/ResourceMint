import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';

export default class RowAlert extends Component {
    render() {
        return (
            <View style={styles.itemContainer}>
                <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 10, borderColor: this.props.item.isRead ? '#E9E6E5' : '#0A8BCC', borderWidth: 1 }}>
                    <TouchableOpacity onPress={() => this.props.onPress('rootView')} style={{ flexDirection: 'column', flex: 1, padding: 0 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../../Assets/Alert/alert.png')} style={styles.backImage} />
                            <Text style={styles.textHeader} >{this.props.item.alertTitle}</Text>
                            {!this.props.item.isRead ? <Text style={styles.textIsNew} >New</Text> : null}
                        </View>
                        <Text style={styles.textDate} >{new Date(this.props.item.updatedOn).toDateString()}</Text>
                    </TouchableOpacity>
                </View>
            </View >
        );
    }
}


const styles = StyleSheet.create({
    itemContainer: {
        width: '95%',
        margin: 10
    },
    textHeader: {
        flex: 1,
        color: '#707070',
        fontFamily: 'Barlow-Medium',
        fontSize: 16,
        padding: 0,
        alignSelf: 'flex-start'

    },
    textDate: {
        flex: 1,
        width: '100%',
        color: '#707070',
        fontFamily: 'Barlow-Light',
        fontSize: 12,
        padding: 0,
        textAlign: 'right',
        alignSelf: 'flex-start'

    },
    textIsNew: {
        color: '#0A8BCC',
        fontFamily: 'Barlow-Light',
        fontSize: 12,

    },
    backImage: {
        width: 24,
        height: 24,
        marginRight: 10,
        marginLeft: 5,
        resizeMode: "center",
        alignSelf: 'center'
    },
})