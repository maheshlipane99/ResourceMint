import React, { Component } from 'react';
import {
    StyleSheet,
    View, ScrollView, Image, Platform, Dimensions, ImageBackground, Switch
} from 'react-native';

import { Button, TextInput, Text, Snackbar } from 'react-native-paper';
import * as Const from '../../Utils/Const';
import LocalStore from '../../Store/LocalStore'
import BaseResponce from '../../Model/BaseResponce'
import { rgba } from 'polished'

import NavigationService from '../../Service/Navigation'
import { BASE_URL } from '../../Utils/Const'
import NetworkStatus from '../../Components/ToolBar/NetworkStatus'
import OTPDialog from '../../Components/DialogBox/OTPDialog'

const width = (Dimensions.get('window').width) - 120;
const height = width / 1.8;

class ForgetPassword extends Component {
    constructor(props) {
        super(props)

    }

    state = {
        message: '',
        mobileNumber: '',
        otp: '',
        deviceId: '',
        isConnected: false,
        snackVisible: false,
        isFetching: false,
        visibleModel: false,
        isSwitchOn: true,
        inputType: '',
    }
    inputs = {};



    onTextChangeHandler(id, text) {
        switch (id) {
            case 'mobile': {
                console.log("mobile : " + text);
                this.setState({ mobileNumber: text })
                break;
            }
            case 'password': {
                console.log("password : " + text);
                this.setState({ password: text })
                break;
            }
        }
    }

    componentDidMount = () => {

    }
    _onNetworkChangeHandler = (status) => {
        this.setState({ isConnected: status })
    }

    showMessage(message) {
        this.setState({
            message: message,
            snackVisible: true,
        })
    }

    sendOtp(reSend) {
        this.setState({
            isFetching: true
        })
        let url = BASE_URL + (this.state.isSwitchOn ? 'authorization/sendOtpViaText/' : 'authorization/sendOtpViaMail/');
        console.log(url);

        fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mobileNumber: this.state.mobileNumber,
                resendFlag: reSend,
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
                        this.showMessage(BaseResponce.getMessage());
                        this.setState({ visibleModel: true });
                    } else {
                        this.showMessage(BaseResponce.getMessage());
                    }
                } else {

                    console.log("message " + BaseResponce.getMessage());
                }

                this._hideProgressBar();
            })

            .catch((error) => {
                console.error(error);
            });
    }


    _hideProgressBar = () => {
        this.setState({
            animating: false,
            isFetching: false
        })
    }


    returnData(otp) {
        console.log("Return Data " + otp)
        if (otp != null) {
            this.login();
        } else {
            this.showMessage('Cancel by user');
        }
    }


    onModelItemClickHandler = (id) => {
        switch (id) {
            case 'verified': {
                this.setState({ visibleModel: false });
                let inputType = this.state.isSwitchOn ? 'mobile' : 'email'
                let inputValue = this.state.isSwitchOn ? this.state.mobileNumber : this.state.email

                NavigationService.navigate('ChangePassword', { inputType: inputType, inputValue: inputValue, otp: this.state.otp });
                break;
            }
            case 'resend': {
                this.setState({ visibleModel: false });
                this.sendOtp(1)
                break;
            }

            case 'close': {
                this.setState({ visibleModel: false });
                break;
            }
        }
    }

    onSwitchHandler = (status) => {

        if (status) {
            this.setState({ isSwitchOn: status, email: '', inputType: 'mobile' })
        } else {
            this.setState({ isSwitchOn: status, mobileNumber: '', inputType: 'email' })
        }

    }

    onClickHandler(id) {

        if (this.state.isConnected == false) {
            this.setState({
                message: 'No Internet Connection',
                snackVisible: true,
            })
            return;
        }
        switch (id) {
            case 'login': {
                if (this.state.isSwitchOn ? this.state.mobileNumber : this.state.email) {
                    this.sendOtp(0)
                } else {
                    this.showMessage(this.state.isSwitchOn ? 'Enter valid Mobile Number' : 'Enter valid Email Id');
                }

                break;
            }
        }
    }

    returnData() {
        this.setState({ mainLogin: true });
    }


    render() {


        var updateModel = <View></View>;
        if (this.state.visibleModel) {
            updateModel = (
                <View>
                    <OTPDialog
                        modalVisible={true}
                        email={this.state.email}
                        mobileNumber={this.state.mobileNumber}
                        onOTP={(otp) => this.setState({ otp: otp })}
                        onPress={(action) => this.onModelItemClickHandler(action)}
                        showMessage={(message) => this.showMessage(message)}></OTPDialog>
                </View>
            )
        }

        var mainLogin = <View></View>;
        if (!this.state.visibleModel) {
            mainLogin = (
                <View style={{ flex: 1, width: '100%', alignContent: 'center', alignItems: 'center' }}>

                    <View style={{ flex: 1, width: '100%', }} >
                        <Text style={styles.textMedium}>Forgot Password </Text>
                        <Text style={styles.textLightMessage}>To recover password, please enter registered email id.</Text>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10, alignContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#0A8BCC', borderRadius: 10 }}>
                            <Text style={[styles.textLight,]}>By Email id</Text>
                            <Switch
                                onValueChange={isSwitchOn => this.onSwitchHandler(isSwitchOn)}
                                value={this.state.isSwitchOn}
                            />
                            <Text style={styles.textLight}>By Mobile No.</Text>
                        </View>

                        {this.state.isSwitchOn ?
                            <TextInput
                                label='Mobile Number'
                                autoCapitalize='none'
                                value={this.state.mobileNumber}
                                maxLength={10}
                                keyboardType='phone-pad'
                                underlineColor='#707070'
                                style={[styles.input, { marginBottom: 50, }]}
                                onChangeText={text => this.setState({ mobileNumber: text })}
                            /> :
                            <TextInput
                                label='Email Address'
                                autoCapitalize='none'
                                value={this.state.email}
                                keyboardType='email-address'
                                underlineColor='#707070'
                                style={[styles.input, { marginBottom: 50, }]}
                                onChangeText={text => this.setState({ email: text })}
                            />
                        }

                        <Button
                            mode="contained"
                            color='#0A8BCC'
                            uppercase={false}
                            style={styles.btn}
                            disabled={this.state.isFetching}
                            loading={this.state.isFetching}
                            contentStyle={{ height: 50 }}
                            onPress={() => { this.onClickHandler('login') }}  >{this.state.isFetching ? 'Wait...' : 'Send'}</Button>

                    </View>
                </View>
            )
        }

        return (

            <View style={styles.container}>
                <ImageBackground source={require('../../Assets/Background/bg.png')} style={styles.backImage}  >
                    <ScrollView style={styles.container}
                        getTextInputRefs={() => { return [this._textInputRef]; }}
                        keyboardShouldPersistTaps="always"
                        showsVerticalScrollIndicator={false}>
                        <View style={styles.loginContainer}>
                            <Image source={require('../../Assets/Logo/logo.png')} style={{ width: width, height: height, marginTop: 50, marginBottom: 0, resizeMode: 'contain', alignSelf:'center' }} />
                            {mainLogin}

                        </View>
                    </ScrollView>
                    <NetworkStatus onStatusChange={(status) => { this._onNetworkChangeHandler(status) }} />
                    {updateModel}
                    <View style={{ position: 'relative' }}>
                        <Snackbar
                            duration={Snackbar.DURATION_SHORT}
                            visible={this.state.snackVisible}
                            onDismiss={() => this.setState({ snackVisible: false, message: '' })}
                        >{this.state.message} </Snackbar>
                    </View>
                </ImageBackground>
            </View>

        );
    }
}

export default ForgetPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: rgba('#FFFFFF', 0),
        paddingTop: Platform.OS === 'ios' ? 24 : 0,
    },
    loginContainer: {
        flex: 1,
        width: "100%",
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',

    },
    backImage: {
        position: "absolute",
        width: '100%',
        height: '100%',
        resizeMode: "cover",
        marginTop: Platform.OS === 'ios' ? 0 : 0,
    },
    input: {
        backgroundColor: rgba('#FFFFFF', 0),
        fontFamily: 'Barlow-Regular'
    },
    textRegular: {
        fontSize: 16,
        fontFamily: 'Barlow-Regular'
    },
    textLightMessage: {
        fontSize: 12,
        fontFamily: 'Barlow-Light',
        color: '#707070',
        marginBottom: 10
    },
    textLight: {
        fontSize: 12,
        fontFamily: 'Barlow-Light',
        color: '#707070',
        alignSelf: 'center'
    },
    textMedium: {
        fontSize: 20,
        fontFamily: 'Barlow-Medium',
        marginBottom: 20,
        color: '#2D2D2D'
    },
    btn: {
        marginBottom: 10,
        fontFamily: 'Barlow-Medium'
    },
});