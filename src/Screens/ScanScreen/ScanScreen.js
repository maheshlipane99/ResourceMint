import React, { Component } from 'react';
import {
    StyleSheet,
    View, TouchableOpacity, Platform, Dimensions,
} from 'react-native';
import { Button, TextInput, Text, Snackbar, Divider } from 'react-native-paper';
import { rgba } from 'polished'
import NavigationService from '../../Service/Navigation'
import QRCodeScanner from 'react-native-qrcode-scanner';
import Icon from "react-native-vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";
import AssetModel from '../../Model/AssetModel';
import RecentAssetModel from '../../Model/RecentAssetModel';
import BackgroundService from '../../Service/BackgroundService'
import LocalStore from '../../Store/LocalStore'

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

class ScanScreen extends Component {
    constructor(props) {
        super(props)

    }

    state = {
        message: '',
        assetCode: '',
        password: '',
        deviceId: '',
        isConnected: false,
        snackVisible: false,
        isFetching: false,
    }
    inputs = {};



    onTextChangeHandler(id, text) {
        switch (id) {
            case 'assetCode': {
                console.log("mobile : " + text);
                this.setState({ assetCode: text })
                break;
            }
        }
    }

    componentDidMount = () => {
        LocalStore.getToken().then(value => {
            this.setState({ mToken: value }, () => {
            });
        });
    }

    showMessage(message) {
        this.setState({
            message: message,
            snackVisible: true,
        })
    }


    checkAssetOffline = () => {
        this.setState({
            isFetching: true
        })
        AssetModel.getItemByAssetCode(this.state.assetCode + "").then(result => {
            let mData = result.data
            if (mData) {
                console.log(mData);
                this.goNext(mData);
                RecentAssetModel.addItem(mData)
            } else {
                this.showMessage("Invalid Asset Code")
                console.log(result.message);

            }
            this._hideProgressBar();
        })
    }

    goNext = (data) => {
        if (data != null) {
            console.log(JSON.stringify(data));
            NavigationService.navigate('AssetDetail', { assetId: data.assetId });
        }
    }

    _hideProgressBar = () => {
        this.setState({
            animating: false,
            isFetching: false
        })
    }


    onClickHandler(id) {
        switch (id) {
            case 'login': {
                if (this.state.assetCode) {
                    this.checkAssetOffline();
                } else {
                    this.showMessage('Enter Asset Code');
                }
                break;
            }
            case 'search': {
                console.log(id);
                NavigationService.navigate('SearchAsset', { returnData: this.returnData.bind(this) });
                break;
            }
        }
    }

    returnData = (data) => {
        console.log(data);
        if (data.assetId) {
            if(this.state.mToken){
                BackgroundService.getAssetDetail(this.state.mToken, data.assetCode)
            }
            NavigationService.navigate('AssetDetail', { assetId: data.assetId });
        }
    }

    onSuccess(e) {
        console.log(e.data);
        this.setState({ assetCode: e.data, isFetching: true }, () => {
            this.checkAssetOffline();
        })
    }


    makeSlideOutTranslation(translationType, fromValue) {
        return {
            from: {
                [translationType]: SCREEN_WIDTH * -0.18
            },
            to: {
                [translationType]: fromValue
            }
        };
    }

    render() {
        var marker = <View></View>;
        if (true) {
            marker = (
                <View style={styles.rectangleContainer}>
                    <View style={{ flexDirection: "row", alignItems: 'center', }}>
                        <View style={styles.rectangle}>
                            <Icon
                                name=" "
                                size={SCREEN_WIDTH * 0.73}
                                color={iconScanColor}
                            />
                            <Animatable.View
                                style={styles.scanBar}
                                direction="alternate-reverse"
                                iterationCount="infinite"
                                duration={1700}
                                easing="linear"
                                animation={this.makeSlideOutTranslation(
                                    "translateY",
                                    SCREEN_WIDTH * -0.54
                                )}
                            />
                        </View>
                    </View>

                </View>
            )
        }

        return (

            <View style={styles.container}>

                <QRCodeScanner
                    markerStyle={{ borderColor: '#00B8E8' }}
                    cameraStyle={{ alignSelf: 'center' }}
                    showMarker={true}
                    reactivate={true}
                    customMarker={marker}
                    onRead={this.onSuccess.bind(this)}
                />
                <View style={{ padding: 20, backgroundColor: 'white' }}>
                    <TouchableOpacity onPress={() => this.onClickHandler('search')}>
                        <TextInput
                            label='Enter Code'
                            autoCapitalize='none'
                            value={this.state.assetCode}
                            underlineColor='#707070'
                            style={[styles.input, {}]}
                            disabled={true}
                            onChangeText={text => this.setState({ assetCode: text })}
                        />
                        <Divider></Divider>

                    </TouchableOpacity>


                    <Text style={styles.textLight}> Scan qrcode to get assets details and takes care of their regular audits  </Text>
                    {/* <Button
                        mode="contained"
                        color='#0A8BCC'
                        uppercase={false}
                        style={styles.btn}
                        disabled={this.state.isFetching}
                        loading={this.state.isFetching}
                        contentStyle={{ height: 50 }}
                        onPress={() => { this.onClickHandler('login') }}  >{this.state.isFetching ? 'Wait...' : 'Get Details'}</Button> */}
                </View>
                <View style={{ position: 'relative' }}>
                    <Snackbar
                        duration={Snackbar.DURATION_SHORT}
                        visible={this.state.snackVisible}
                        onDismiss={() => this.setState({ snackVisible: false, message: '' })}
                    >{this.state.message} </Snackbar>
                </View>
            </View>

        );
    }
}

export default ScanScreen;

const overlayColor = "transparent"; // this gives us a black color with a 50% transparency

const rectDimensions = SCREEN_WIDTH * 0.65; // this is equivalent to 255 from a 393 device width
const rectBorderWidth = SCREEN_WIDTH * 0.005; // this is equivalent to 2 from a 393 device width
const rectBorderColor = "#00B8E8";

const scanBarWidth = SCREEN_WIDTH * 0.46; // this is equivalent to 180 from a 393 device width
const scanBarHeight = SCREEN_WIDTH * 0.0025; //this is equivalent to 1 from a 393 device width
const scanBarColor = "#00B8E8";

const iconScanColor = "transparent";


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: rgba('#FFFFFF', 0),
        paddingTop: Platform.OS === 'ios' ? 24 : 0,
    },
    input: {
        backgroundColor: rgba('#FFFFFF', 0),
        fontFamily: 'Barlow-Regular'
    },
    textLight: {
        fontSize: 12,
        marginTop: 10,
        fontFamily: 'Barlow-Light',
        color: '#707070'
    },
    btn: {
        marginBottom: 10,
        marginTop: 15,
        fontFamily: 'Barlow-Medium',

    },
    rectangleContainer: {
        alignSelf: 'center',
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent"
    },

    rectangle: {
        height: rectDimensions,
        width: rectDimensions,
        borderWidth: rectBorderWidth,
        borderColor: rectBorderColor,
        alignSelf: 'center',
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
    },

    topOverlay: {
        flex: 1,
        height: SCREEN_WIDTH,
        width: SCREEN_WIDTH,
        backgroundColor: overlayColor,
        justifyContent: "center",
        alignItems: "center"
    },

    bottomOverlay: {
        flex: 1,
        height: SCREEN_WIDTH,
        width: SCREEN_WIDTH,
        backgroundColor: overlayColor,
        paddingBottom: SCREEN_WIDTH * 0.25
    },

    leftAndRightOverlay: {
        height: SCREEN_WIDTH * 0.65,
        width: SCREEN_WIDTH,
        backgroundColor: overlayColor
    },

    scanBar: {
        width: scanBarWidth,
        height: scanBarHeight,
        backgroundColor: scanBarColor
    }
});