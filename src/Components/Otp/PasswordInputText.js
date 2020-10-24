import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from "prop-types";
import { TextInput,  } from 'react-native-paper';
import { rgba } from 'polished'

class PasswordInputText extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            icEye: 'visibility-off',
            isPassword: true
        }
    }

    getRef = (ref) => {
        if (this.props.getRef)
            this.props.getRef(ref)
    }

    changePwdType = () => {
        const { isPassword } = this.state;
        // set new state value
        this.setState({
            icEye: isPassword ? "visibility" : "visibility-off",
            isPassword: !isPassword,
        });

    };

    render() {
        const { iconSize, iconColor, label, style } = this.props;
        const { icEye, isPassword } = this.state;

        return (
            <View style={style}>
                <TextInput
                    {...this.props}
                    ref={this.getRef}
                    style={[styles.input]}
                    underlineColor='#707070'
                    secureTextEntry={isPassword}
                    label={label} />
                <Icon style={styles.icon}
                    name={icEye}
                    size={iconSize}
                    color={iconColor}
                    onPress={this.changePwdType}
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    icon: {
        position: 'absolute',
        top: 22,
        right: 10,
    },
    input: {
        backgroundColor: rgba('#FFFFFF', 0),
        fontFamily: 'Barlow-Regular'
    },
});

PasswordInputText.defaultProps = {
    iconSize: 25,
    label: 'Password',
    iconColor: "#222222"
}

PasswordInputText.propTypes = {
    iconSize: PropTypes.number,
    label: PropTypes.string,
    iconColor: PropTypes.string
};

export default PasswordInputText;