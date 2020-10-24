import React, { Component } from 'react';
import {
    StyleSheet,
    View, Platform, Dimensions,
} from 'react-native';
import { Snackbar, Button } from 'react-native-paper';
import { rgba } from 'polished'
import NavigationService from '../../Service/Navigation'
import QRCodeScanner from 'react-native-qrcode-scanner';
import Icon from "react-native-vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

class GetCode extends Component {
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

    componentDidMount = () => {

    }

    showMessage(message) {
        this.setState({
            message: message,
            snackVisible: true,
        })
    }

    onSuccess(e) {
        console.log(e.data);
        let assetCode = e.data
        this.props.navigation.state.params.returnData({ assetCode: assetCode });
        this.props.navigation.goBack();
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
                <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                    <Button
                        mode="contained"
                        color='#0A8BCC'
                        uppercase={false}
                        loading={this.state.isLoading}
                        disabled={this.state.isLoading}
                        style={styles.capture}
                        icon='chevron-left'
                        contentStyle={{}}
                        onPress={() => this.props.navigation.goBack(null)} > {this.state.isLoading ? ' Wait... ' : 'Back'}</Button>
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

export default GetCode;

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
    capture: {
      alignSelf: 'center',
      margin: 10,
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