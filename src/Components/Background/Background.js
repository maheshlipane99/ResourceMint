import React from "react";
import { ImageBackground, StyleSheet,Platform } from 'react-native';
import { rgba } from 'polished'
const Background = props => {
    return (
        <ImageBackground source={require('../../Assets/Background/bg.png')} tintColor="#0A8BCC" style={styles.backImage}  >
             {props.children}
        </ImageBackground>
    );
}

export default Background

const styles = StyleSheet.create({
    backImage: {
        position:'absolute',
        backgroundColor: rgba('#C5C7D4', 0.3),
        width: '100%',
        height: '100%',
        resizeMode: "cover",
        marginTop: Platform.OS === 'ios' ? 0 : 0,
    },

})