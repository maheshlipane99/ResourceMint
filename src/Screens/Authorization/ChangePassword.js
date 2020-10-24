import React, { Component } from 'react';
import {
    StyleSheet,
    View, ScrollView, Image, Platform, Dimensions, ImageBackground
} from 'react-native';

import { Button, TextInput, Text, Snackbar } from 'react-native-paper';
import * as Const from '../../Utils/Const';
import LocalStore from '../../Store/LocalStore'
import BaseResponce from '../../Model/BaseResponce'
import { rgba } from 'polished'

import NavigationService from '../../Service/Navigation'
import { BASE_URL } from '../../Utils/Const'
import NetworkStatus from '../../Components/ToolBar/NetworkStatus'
import LinkSendMessage from '../../Components/DialogBox/LinkSendMessage'

const width = (Dimensions.get('window').width) - 120;
const height = width / 1.8;

class ChangePassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            inputType: props.navigation.state.params.inputType,
            inputValue: props.navigation.state.params.inputValue,
            otp: props.navigation.state.params.otp,
            message: '',
            mobileNumber: '',
            newPassword: '',
            deviceId: '',
            isConnected: false,
            snackVisible: false,
            visibleModel: false,
            isFetching: false,
        }

    }

    inputs = {};

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

    changePassword() {
        this.setState({
            isFetching: true
        })

        fetch(BASE_URL + 'authorization/saveNewPassword/', {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputType: this.state.inputType,
                inputValue: this.state.inputValue,
                otp: this.state.otp,
                newPassword: this.state.newPassword,
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {

                console.log(responseJson);
                BaseResponce.setResponce(responseJson);
                if (BaseResponce != null) {
                    if (BaseResponce.getStatus()) {
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
                if (this.state.newPassword === this.state.cPassword) {
                    this.state.isConnected && this.changePassword();
                } else {
                    this.showMessage('New password and confirm password miss-match');
                }
                break;
            }
        }
    }


    onModelItemClickHandler = (id) => {
        switch (id) {

            case 'close': {
                this.setState({ visibleModel: false });
                NavigationService.navigate('LoginScreen');
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
                    <LinkSendMessage
                        modalVisible={true}
                        onPress={(action) => this.onModelItemClickHandler(action)}
                        showMessage={(message) => this.showMessage(message)}></LinkSendMessage>
                </View>
            )
        }


        var mainLogin = <View></View>;
        if (!this.state.visibleModel) {
            mainLogin = (
                <View style={{ flex: 1, width: '100%', alignContent: 'center', alignItems: 'center' }}>

                    <View style={{ flex: 1, width: '100%', }} >
                        <Text style={styles.textMedium}>Change Password </Text>
                        <Text style={styles.textLight}>Create your new password</Text>
                        <TextInput
                            label='New Password'
                            autoCapitalize='none'
                            value={this.state.newPassword}
                            textContentType='password'
                            secureTextEntry={true}
                            style={[styles.input, { marginBottom: 20, }]}
                            underlineColor='#707070'
                            onChangeText={text => this.setState({ newPassword: text })}
                        />
                        <TextInput
                            label='Confirm Password'
                            autoCapitalize='none'
                            value={this.state.cPassword}
                            textContentType='password'
                            style={[styles.input, { marginBottom: 20, }]}
                            underlineColor='#707070'
                            onChangeText={text => this.setState({ cPassword: text })}
                        />
                        <Button
                            mode="contained"
                            color='#0A8BCC'
                            uppercase={false}
                            style={styles.btn}
                            disabled={this.state.isFetching}
                            loading={this.state.isFetching}
                            contentStyle={{ height: 50 }}
                            onPress={() => { this.onClickHandler('login') }}  >{this.state.isFetching ? 'Wait...' : 'Change Password'}</Button>

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
                            <Image source={require('../../Assets/Logo/logo.png')} style={{ width: width, height: height, marginTop: 50, marginBottom: 0, resizeMode: 'contain', alignSelf: 'center' }} />
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

export default ChangePassword;

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
    textLight: {
        fontSize: 12,
        fontFamily: 'Barlow-Light',
        color: '#707070'
    },
    textMedium: {
        fontSize: 20,
        fontFamily: 'Barlow-Medium',
        marginBottom: 20,
        color: '#2D2D2D'
    },
    btn: {
        marginBottom: 10,
        fontFamily: 'Barlow-Medium',
        marginTop: 20
    },
});