import React, { Component } from 'react';
import { View, Text, StyleSheet, } from 'react-native';
import { Button} from 'react-native-paper';

export default class RowAnswer extends Component {

    render() {
        return (
            <View style={styles.itemContainer}>
                <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 10, borderColor: '#E9E6E5', borderWidth: 1 }}>
                    <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                        <Text style={styles.sHeader}>{this.props.index + 1}) {this.props.item.questionTitle}</Text>
                        <Text style={styles.textLabel}>Answer : <Text style={this.props.item.isDanger == 0 ? styles.textContent : styles.textContentRed}>{this.props.item.answer}</Text> </Text>
                        {this.props.item.answer.includes('IMG') ?
                            <View>
                                <Button
                                    mode='outlined'
                                    color='#0A8BCC'
                                    uppercase={false}
                                    style={[styles.btn]}
                                    contentStyle={{ height: 50 }}
                                    onPress={() => this.props.onPress('viewPhoto')}   >View Photo</Button>
                            </View> : null}
                    </View>
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
    sHeader: {
        color: '#1F2352',
        fontSize: 18,
        fontFamily: 'Barlow-SemiBold',
    },
    textLabel: {
        color: '#707070',
        fontSize: 12,
        fontFamily: 'Barlow-Regular',
        marginTop: 5
    },
    textContent: {
        color: '#646464',
        fontSize: 14,
        fontFamily: 'Barlow-Medium',
        marginTop: 5
    },
    textContentRed: {
        color: 'red',
        fontSize: 14,
        fontFamily: 'Barlow-Medium',
        marginTop: 5
    },
    btn: {
        marginBottom: 10,
        marginTop: 20,
        fontFamily: 'Barlow-Medium'
    },
})