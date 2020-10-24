import React, { Component } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Platform,
  Image,
  ImageBackground
} from "react-native";

class Header extends Component {

  render() {
    const content = (
      <View>

        <View style={styles.linearGradient}>
          <TouchableOpacity onPress={this.props.onPress} style={{ paddingRight: 20, height: '100%', alignContent: 'center', justifyContent: 'center' }} >
            <Image
              resizeMode='contain'
              source={require('../../Assets/AssetOption/left-arrow.png')}
              style={{ width: 20, height: 20, tintColor: 'white' }} />
          </TouchableOpacity>

          <Text style={this.props.disabled ? styles.disabledText : styles.buttonText}>
            {this.props.children}
          </Text>
          <Image
            resizeMode='contain'
            source={require('../../Assets/Header/app_icon.png')}
            style={{ width: 24, height: 24, tintColor: 'white' }} />
        </View>
      </View >
    );

    return (
      <View
        style={{}}>
        <View style={{ marginTop: Platform.OS === 'ios' ? 40 : 0, }}>
          <ImageBackground source={require('../../Assets/Header/header_bg.png')} tintColor="#0A8BCC" style={styles.backImage}  >
            {content}
          </ImageBackground>
        </View>
      </View>
    )
  };
}

const styles = StyleSheet.create({

  disabled: {
    backgroundColor: "#eee",
    borderColor: "#aaa"
  },
  enableText: {
    color: "white"
  },
  disabledText: {
    color: "#aaa"
  },
  linearGradient: {
    width: "100%",
    height: 50,
    paddingLeft: 20,
    paddingRight: 15,
    borderRadius: 0,
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Barlow-Medium',
    textAlign: 'center',
    color: 'white',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginRight: 30,
  },
  backImage: {
    width: '110%',
    height: 50,
    paddingLeft:10,
    paddingRight:10,
    resizeMode: "cover",
    alignSelf: 'center',
    marginTop: Platform.OS === 'ios' ? 0 : 0,
  },

});

export default Header;
