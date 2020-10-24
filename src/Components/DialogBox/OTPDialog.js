import React, { Component } from 'react';
import { Modal, TouchableOpacity, View, StyleSheet, Image, ImageBackground } from 'react-native';
import CardView from 'react-native-cardview';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { rgba } from 'polished'
import { Button, Text, } from 'react-native-paper';
import OTPTextView from '../Otp/OTPTextView';
import { BASE_URL } from '../../Utils/Const'
import BaseResponce from '../../Model/BaseResponce'

class OTPDialog extends Component {
    state = {
        mToken: '',
        modalVisible: false,
        timer: 60,
        isFeatching: false,
        mOTP: '',
        mobileNumber: '',
        email: '',
    };

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }



    componentDidMount = () => {
        this.setModalVisible(this.props.modalVisible);
        this.setState({ mobileNumber: this.props.mobileNumber, email: this.props.email });
        this.interval = setInterval(
            () => this.setState((prevState) => ({ timer: prevState.timer - 1 })),
            1000
        );
    }

    componentDidUpdate() {
        if (this.state.timer === 1) {
            clearInterval(this.interval);
            this.props.onPress('resend');
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    _onNetworkChangeHandler = (status) => {
        this.setState({ isConnected: status })
        if (status == true && this.state.animating) {

        }
    }

    showMessage(message) {
        this.props.showMessage(message);
    }

    onClickHandler(id) {
        switch (id) {
            case 'submit': {
                if (this.state.mOTP) {
                    this.verifyOtp()
                } else {
                    this.showMessage('Enter valid OTP');
                }

                break;
            }
        }
    }

    onOTPHandler = (otpText) => {
        this.props.onOTP(otpText);
        this.setState({ mOTP: otpText })
    }


    verifyOtp() {
        this.setState({
            isFetching: true
        })
        let url = BASE_URL + (this.state.mobileNumber ? 'authorization/verifyOtp/' : 'authorization/verifyOtpEmail/');
        console.log(url);

        fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mobileNumber: this.state.mobileNumber,
                otp: this.state.mOTP,
                email: this.state.email,
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                BaseResponce.setResponce(responseJson);
                if (BaseResponce != null) {
                    if (BaseResponce.getStatus()) {
                        //Done
                        this.props.onPress('verified');
                    } else {
                        this.showMessage(BaseResponce.getMessage());
                    }
                } else {

                    console.log("message " + BaseResponce.getMessage());
                }
            })

            .catch((error) => {
                console.error(error);
            });
    }

    render() {

        return (
            <View >
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        // this.props.onPress('close');
                    }}>
                    <TouchableOpacity
                        style={styles.mainContainer}
                        activeOpacity={1}
                        onPressOut={() => {
                            // this.props.onPress('close') 
                        }}>
                        <View style={{ width: '80%', justifyContent: 'center', alignItems: 'center', }}>
                            <CardView
                                style={{ marginRight: 10, marginTop: 5, marginLeft: 10, marginBottom: 5, height: '80%', width: '100%', backgroundColor: 'white' }}
                                cardElevation={6}
                                cornerRadius={10}>
                                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                                    <Text style={styles.textMedium}> OTP </Text>
                                    <Text style={styles.textLight}>We have sent a OTP on entered email/mobile number. Kindly check.</Text>

                                    <OTPTextView
                                        containerStyle={styles.textInputContainer}
                                        handleTextChange={text => this.onOTPHandler(text)}
                                        inputCount={4}
                                        keyboardType="numeric"
                                    />
                                    <Text style={styles.textLight}> Resend OTP in 00:{this.state.timer} seconds </Text>
                                    <View style={{ width: '100%', flex: 1, justifyContent: 'flex-end' }}>
                                        <Button
                                            mode="contained"
                                            color='#0A8BCC'
                                            uppercase={false}
                                            loading={this.state.isFeatching}
                                            disabled={this.state.isFeatching}
                                            style={[styles.btn, { marginBottom: 10, marginTop: 10, bottom: 0 }]}
                                            contentStyle={{ height: 50 }}
                                            onPress={() => { this.onClickHandler('submit') }}  > {false ? ' Wait... ' : ' Submit '}</Button>
                                    </View>
                                    <View style={{ position: 'absolute', top: 15, right: 15 }}>
                                        <Button
                                            mode="outlined"
                                            color='#707070'
                                            uppercase={false}
                                            style={styles.btn}
                                            contentStyle={{ height: 30 }}
                                            onPress={() => { this.props.onPress('close') }} >close</Button>
                                    </View>
                                </View>
                            </CardView>

                        </View>
                    </TouchableOpacity>

                </Modal >
            </View >
        );
    }
}
export default OTPDialog

const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: rgba('#000000', 0.3),
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInputContainer: {
        marginBottom: 20,
    },
    text: {
        fontSize: 14,
        padding: 5,
        color: '#707070',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        fontFamily: 'Montserrat-Medium',
    },
    activityIndicator: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 30
    },
    textRegular: {
        fontSize: 16,
        fontFamily: 'Barlow-Regular'
    },
    textLight: {
        fontSize: 14,
        fontFamily: 'Barlow-Light',
        color: '#707070',
        marginBottom: 10
    },
    textMedium: {
        fontSize: 20,
        fontFamily: 'Barlow-Medium',
        marginBottom: 20,
        marginTop: 20,
        color: '#2D2D2D'
    },
    textBack: {
        fontSize: 16,
        color: '#1F2352',
        fontFamily: "Montserrat-SemiBold",
    },
    dividerThink: {
        width: '100%',
        borderBottomWidth: 0.5,
        borderColor: '#CCC'
    },
    backImage: {
        position: "absolute",
        width: '100%',
        height: 135,
        resizeMode: "cover",
    },
})