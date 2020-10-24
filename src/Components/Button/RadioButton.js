import React, { } from 'react';
import { View, StyleSheet, } from 'react-native';
import { RadioButton, Text, TouchableRipple } from 'react-native-paper';

const RadioButton1 = props => {
    return (
        <TouchableRipple
            onPress={() => { props.onPress() }}
            rippleColor="rgba(0, 0, 0, .32)">
            <View style={{ flexDirection: 'row', }}>
                <RadioButton
                    value={props.text}
                    checked={props.text}
                    disabled={true}
                    color="rgba(0, 0, 0, .32)"
                    onPress={() => { props.onPress() }}
                />
                <TouchableRipple style={styles.container} >
                    <Text style={styles.text}>{props.text}</Text>
                </TouchableRipple>

            </View>
        </TouchableRipple>
    );
}

export default RadioButton1

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
    },
    text: {
        justifyContent: 'center',
        fontSize: 14,
        fontFamily: 'Barlow-Regular',
        alignSelf: 'flex-start',
        alignContent: 'center',
        textAlign: 'center',
    },

})