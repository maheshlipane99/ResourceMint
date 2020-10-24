import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default class RowHistory extends Component {
    render() {
        return (
            <View style={styles.itemContainer}>
                <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 10, borderColor: '#E9E6E5', borderWidth: 1 }}>
                    <TouchableOpacity onPress={() => this.props.onPress('rootView')} style={{ flexDirection: 'column', flex: 1, padding: 0 }}>
                        <Text style={styles.textHeader} >{this.props.item.title}</Text>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <Text style={styles.textDoneBy} >{this.props.item.doneBy}</Text>
                            <Text style={styles.textDate} >{this.props.item.doneOn}</Text>
                            <Icon
                                name={this.props.item.isSubmitted ? 'check-circle' : 'clock'}
                                style={{ color: this.props.item.isSubmitted ? 'green' : 'red', fontSize: 15, marginLeft: 10 }}
                                type={'FontAwesome'}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
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
    textStatus: {
        color: '#707070',
        fontFamily: 'Barlow-Bold',
        fontSize: 14,
        padding: 0,
        textAlign: 'left',
        alignSelf: 'flex-start'

    },
    textDoneBy: {
        color: '#707070',
        fontFamily: 'Barlow-Light',
        fontSize: 12,
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
})