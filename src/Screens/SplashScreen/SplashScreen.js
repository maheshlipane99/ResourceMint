import React, { Component } from 'react';
import {
    StyleSheet,
    View, Image, ImageBackground, ActivityIndicator, Platform, Animated, Easing
} from 'react-native';

import { rgba } from 'polished'

class SplashScreen extends Component {

    constructor(props) {
        super(props)
    }

    state = {
        spinValue: new Animated.Value(0),
    }
    componentDidMount() {
        // First set up animation 
        Animated.timing(
            this.state.spinValue,
            {
                toValue: 2,
                duration: 4000,
                easing: Easing.linear,
                useNativeDriver: true
            }
        ).start()
    }

    render() {

        // Second interpolate beginning and end values (in this case 0 and 1)
        const spin = this.state.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        })

        return (
            <View style={styles.backImage}  >
                <View style={styles.container}>
                    <ImageBackground source={require('../../Assets/BgImage/BgImage.png')} style={styles.backImage}  >
                        <View style={styles.loginContainer}>
                            <Image source={require('../../Assets/Logo/logo.png')} style={{ width: 200, height: 90, marginTop: 0, marginBottom: 0, resizeMode: 'contain',}} />
                        </View>

                    </ImageBackground>
                </View>
            </View>
        );
    }
}

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: rgba('white', 0.3),
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginContainer: {
        flex: 1,
        flexDirection: 'row',
        width: "100%",
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    backImage: {
        position: "absolute",
        width: '100%',
        height: '100%',
        resizeMode: "contain",
        backgroundColor: 'white'
    },
});