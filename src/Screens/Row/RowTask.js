import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default class RowTask extends Component {
    render() {
        return (
            <View style={styles.itemContainer}>
                <View style={{ backgroundColor: 'white', borderRadius: 10, borderColor: '#E9E6E5', borderWidth: 1 }}>
                    <TouchableOpacity onPress={() => this.props.onPress('rootView')} style={{ flexDirection: 'column', flex: 1, padding: 10 }}>
                        <View style={{ backgroundColor: 'white', flexDirection: 'row', }}>
                            <Image source={require('../../Assets/AssetOption/archive.png')} style={styles.backImage} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.textHeader} >{this.props.item.title}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.textRaiseBy} >RaisedBy : {this.props.item.raisedBy}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.textDate} >{this.props.item.raisedOn}</Text>
                                    <Text style={styles.textStatus} >Status : {this.props.item.complaintStatus}</Text>
                                </View>
                            </View>
                        </View>


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
    textRaiseBy: {
        flex: 1,
        color: '#A59F9D',
        fontFamily: 'Barlow-Light',
        fontSize: 12,
        marginBottom: 3,
        alignSelf: 'flex-start'

    },
    textAssetCode: {
        flex: 1,
        alignSelf: 'flex-end',
        color: '#A59F9D',
        fontFamily: 'Barlow-Light',
        fontSize: 12,
        marginBottom: 3,
        alignSelf: 'flex-start'

    },
    textDate: {
        flex: 1,
        color: '#C686D8',
        fontFamily: 'Barlow-Light',
        fontSize: 12,
        padding: 0,
        alignSelf: 'flex-start'

    },
    textStatus: {
        color: '#C686D8',
        fontFamily: 'Barlow-Light',
        fontSize: 12,
        padding: 0,
        alignSelf: 'flex-end'

    },
    backImage: {
        width: 24,
        height: 24,
        marginRight: 10,
        resizeMode: "center",
        alignSelf: 'center'
    },
})