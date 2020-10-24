import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

import ArrowButton from '../../Components/Button/ArrowButton'

class RowIntro extends Component {

    render() {

        var btnSkip = <View style={{ margin: 20 }}></View>;
        if (this.props.data.id != 5) {
            btnSkip = (
                <TouchableOpacity style={[{ marginTop: 10, alignSelf: 'center' }]} onPress={() => this.props.onPress('skip')} >
                    <Text style={[styles.textSkip, { marginTop: 10, alignSelf: 'center' }]}>Skip</Text>
                </TouchableOpacity>
            )
        }

        return (
            <View style={{ flex: 1, width: '100%' }}>
                <View style={styles.container}>
                    <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
                        <View style={{ width: '100%', height: '40%', }}>
                            <Image
                                style={
                                    { width: '100%', height: '100%', alignSelf: 'center', marginBottom: 20, }
                                }
                                resizeMode='center'
                                source={this.props.data.imageUrl}
                            />
                        </View>

                        <Text style={styles.sHeader}>{this.props.data.title}</Text>
                        <Text style={[styles.textMessage, { marginTop: 20, marginBottom: 20 }]}>{this.props.data.message}</Text>
                        
                    </View>

                    <View style={{ justifyContent: 'flex-end', alignContent: 'flex-end' }}>
                        <ArrowButton style={{ alignContent: 'flex-end' }} onPress={() => this.props.onPress('next')} >{this.props.data.btnText}</ArrowButton>
                        {btnSkip}
                    </View>

                </View>
            </View>
        );
    }
}

export default RowIntro

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignContent: 'center',
    },
    sHeader: {
        color: '#1F2352',
        fontSize: 20,
        fontFamily: 'Montserrat-SemiBold',
        alignSelf: 'center'
    },
    textMessage: {
        textAlign: 'center',
        color: '#707070',
        fontSize: 14,
        fontFamily: "Montserrat-Regular",
    },
    btnText: {
        color: '#333',
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 12,
        textAlign: 'center'
    },
    btnImg: {
        width: "100%",
        height: "80%",
        marginBottom: 5,
        alignSelf: 'center'
    },
    textSkip: {
        fontSize: 16,
        color: '#CFCFCF',
        fontFamily: "Montserrat-Medium",
    },

})