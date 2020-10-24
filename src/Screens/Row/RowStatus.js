import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, } from 'react-native';
import { RadioButton, TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default class RowStatus extends Component {
    render() {
        return (
            <TouchableRipple
                style={styles.itemContainer}
                onPress={!this.props.item.isCompleted ? () => this.props.onPress('rootView') : null}
                rippleColor="rgba(0, 0, 0, .32)">
                <View style={{ backgroundColor: 'white', borderRadius: 10, borderColor: this.props.item.isChecked ? '#6C63FF' : '#7E71B16E', borderWidth: 1 }}>
                    <View style={{ flexDirection: 'row', padding: 10 }}>

                        <TouchableRipple style={styles.container} >
                            <Text style={[styles.text, { color: this.props.item.isChecked ? '#2D2D2D' : '#707070' }]}>{this.props.item.title}</Text>
                        </TouchableRipple>
                        <Icon
                            name={this.props.item.isChecked ? 'check-circle' : 'circle'}
                            style={{ color: this.props.item.isChecked ? '#6C63FF' : "gray", fontSize: 20, marginRight: 10 }}
                            type={'FontAwesome'}
                        />
                        {/* {this.props.item.isCompleted ?
                            <Icon
                                name='check'
                                style={{ color: '#6C63FF', fontSize: 15, marginRight: 0 }}
                                type={'FontAwesome'}
                            /> : null} */}
                    </View>
                </View>
            </TouchableRipple>
        );
    }
}


const styles = StyleSheet.create({
    itemContainer: {
        margin: 10,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
    },
    text: {
        justifyContent: 'center',
        fontSize: 16,
        fontFamily: 'Barlow-Regular',
        alignSelf: 'flex-start',
        alignContent: 'center',
        textAlign: 'center',
    },
})