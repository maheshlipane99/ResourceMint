import React, { Component } from 'react';
import { View, StyleSheet, } from 'react-native';
import { Checkbox, Text, TouchableRipple } from 'react-native-paper';

class CheckButton extends Component {
    constructor(props) {
        super(props)
        this.state = { checked: false, }
    }


    onCheckHandler = () => {
        this.props.onPress();
        this.setState({ checked: !this.state.checked })
    }

    render() {
        return (
            <View style={{ flexDirection: 'row', }}>

                <Checkbox
                    status={this.state.checked ? 'checked' : 'unchecked'}
                    onPress={() => { this.onCheckHandler() }}
                />
                <TouchableRipple
                    style={styles.container}
                    onPress={() => { this.onCheckHandler() }}
                    rippleColor="rgba(0, 0, 0, .32)"
                >
                    <Text style={styles.text}>{this.props.text}</Text>
                </TouchableRipple>


            </View>
        );
    }
}

export default CheckButton

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