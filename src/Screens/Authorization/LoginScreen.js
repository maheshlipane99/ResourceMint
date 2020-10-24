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
import PasswordInputText from '../../Components/Otp/PasswordInputText';
import SystemLogModel from '../../Model/SystemLogModel';
import { realm } from '../../Database/DbConfig'

const width = (Dimensions.get('window').width) - 120;
const height = width / 1.8;

class LoginScreen extends Component {
    constructor(props) {
        super(props)

    }

    state = {
        message: '',
        mobileNumber: '',
        password: '',
        deviceId: '',
        isConnected: false,
        snackVisible: false,
        isFetching: false,
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
        LocalStore.getFirebaseToken().then(value => {
            this.setState({ deviceId: value }, () => {

            });
        });
    }

    componentWillUnmount() {
        clearInterval(this.interval);
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

    login() {
        this.setState({
            isFetching: true
        })
        fetch(BASE_URL + 'authorization/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                deviceId: this.state.deviceId
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {

                console.log(responseJson);
                BaseResponce.setResponce(responseJson);
                if (BaseResponce != null) {
                    if (BaseResponce.getStatus()) {
                        if (BaseResponce.getData() != null) {
                            var user = BaseResponce.getData();
                            this.goHome(user);
                        }
                        //  this.showMessage(BaseResponce.getMessage());
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



    goHome = (user) => {
        if (user != null) {
            LocalStore.getUserId().then(value => {
               if (value != user.userId){
                this.cleanLocalData()
                }
            })
            LocalStore.setUserId(user.userId);
            LocalStore.setUser(user);
            LocalStore.setToken(user.token);
            console.log(JSON.stringify(user));

            SystemLogModel.addItem(user.firstName + ' loged in system')
            NavigationService.navigate('HomeScreen');

            // LocalStore.getLastScreen().then(value => {
            //     console.log(value)
            //     if (value != 'none') {
            //         NavigationService.navigate(value);
            //     } else {
            //         NavigationService.navigate('HomeScreen');
            //     }

            // });

        }
    }

    cleanLocalData = () => {
        realm.write(() => {
            realm.deleteAll();
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
                if (this.state.email && this.state.password) {
                    this.state.isConnected && this.login();
                } else {
                    this.showMessage('Enter Email Id & Password');

                }
                break;
            }
            case 'forgetPassword': {
                console.log('Hello');

                NavigationService.navigate('ForgetPassword');
                break;
            }
        }
    }

    returnData() {
        this.setState({ mainLogin: true });
    }


    render() {



        var mainLogin = <View></View>;
        if (true) {
            mainLogin = (
                <View style={{ flex: 1, width: '100%', alignContent: 'center', alignItems: 'center' }}>

                    <View style={{ flex: 1, width: '100%', }} >
                        <Text style={styles.textMedium}>Log In  </Text>
                        <Text style={styles.textRegular}>Intelligent Asset Management Tool </Text>
                        <Text style={styles.textLight}>Brigs Nucleus takes care of your assets and their regular maintenance, task and audit.</Text>
                        <TextInput
                            label='Email Address'
                            autoCapitalize='none'
                            value={this.state.email}
                            keyboardType='email-address'
                            underlineColor='#707070'
                            style={[styles.input, { marginBottom: 0, }]}
                            onChangeText={text => this.setState({ email: text })}
                        />
                        <PasswordInputText
                            getRef={input => this.input = input}
                            value={this.state.password}
                            onChangeText={(password) => this.setState({ password })}
                        />
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 20 }}>
                            <Button
                                mode="text"
                                color='#707070'
                                uppercase={false}
                                style={styles.btn}
                                contentStyle={{ height: 30, alignSelf: 'flex-end' }}
                                onPress={() => { this.onClickHandler('forgetPassword') }}  >Forgot Password?</Button>
                        </View>
                        <Button
                            mode="contained"
                            color='#0A8BCC'
                            uppercase={false}
                            style={styles.btn}
                            disabled={this.state.isFetching}
                            loading={this.state.isFetching}
                            contentStyle={{ height: 50 }}
                            onPress={() => { this.onClickHandler('login') }}  >{this.state.isFetching ? 'Wait...' : 'Sign In'}</Button>

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
                            <Image source={require('../../Assets/Logo/logo.png')} style={{ width: width, height: height, marginTop: 50, marginBottom: 0, resizeMode: 'contain', alignSelf:'center'}} />
                            {mainLogin}

                        </View>
                    </ScrollView>
                    <NetworkStatus onStatusChange={(status) => { this._onNetworkChangeHandler(status) }} />
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

export default LoginScreen;

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
        fontFamily: 'Barlow-Medium'
    },
});