import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { Card,Divider } from 'react-native-paper';

const size = (Dimensions.get('window').width / 2) - 30;

export default class RowLastAudit extends Component {
    render() {

        return (

            <View style={styles.itemContainer}>
                <Text style={styles.textHeader} >{this.props.item.title}</Text>
                <Card style={{ backgroundColor: 'white', width: size, radius: 5 }} elevation={5}>
                    <View style={styles.btnBox} >
                        <Text style={styles.textContent} numberOfLines={2}>{this.props.item.onDate}</Text>
                        <Divider style={{ borderWidth: 0.3, borderColor: '#707070' ,marginTop:10,marginBottom:10}} />
                        <Text style={styles.textContent} numberOfLines={2}>{this.props.item.installAt}</Text>
                        <Divider style={{ borderWidth: 0.3, borderColor: '#707070' ,marginTop:10,marginBottom:10}} />
                        <Text style={[styles.textContent,{marginBottom:5}]} numberOfLines={2}>Done By</Text>
                        <Text style={styles.textContent} numberOfLines={2}>{this.props.item.doneBy}</Text>
                    </View>
                </Card>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    itemContainer: {
        width: size + 5,
        margin: 10,
    },
    btnBox: {
        padding: 10,
    },
    textHeader: {
        color: '#0A8BCC',
        fontFamily: 'Barlow-Regular',
        fontSize: 16,
        marginBottom: 20,
        marginTop:10

    },
    textContent: {
        color: '#707070',
        fontFamily: 'Barlow-Regular',
        fontSize: 12,
    },
})