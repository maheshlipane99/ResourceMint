import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Image,
  Platform,
  ImageBackground
} from "react-native";

const iconSize = 20;

const HomeHeader = props => {



  var notificationCount = <View></View>;
  if (props.notificationCount > 0) {
    notificationCount = (
      <View style={styles.circle}>
        <Text style={styles.countText}>{props.notificationCount}</Text>
      </View>
    )
  }


  const notification = (
    <TouchableOpacity onPress={() => props.onPress('notification')} >
      <View style={{ height: '100%', width: 40, justifyContent: 'center', alignItems: 'center', paddingLeft: 20, paddingRight: 10, }}>

        <View style={{ position: 'relative', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', }}>
          <Image
            source={require('../../Assets/Bell/bell.png')}
            style={{ width: iconSize, height: iconSize, tintColor: 'white', margin: 2 }} />
        </View>
        {notificationCount}
      </View>
    </TouchableOpacity>
  )

  const content = (
    <View style={{ width: "100%" }}>
      <View style={styles.linearGradient}>
        <TouchableOpacity onPress={() => props.onPress('openDrawer')} style={{ paddingLeft: 5, paddingRight: 10, height: '100%', alignContent: 'center', justifyContent: 'center' }}>
          <Image
            source={require('../../Assets/Menu/justify.png')}
            style={{ width: iconSize, height: iconSize, tintColor: 'white', margin: 2 }} />
        </TouchableOpacity>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Image
            source={require('../../Assets/Header/app_logo.png')}
            style={{ width: 153, height: 26, tintColor: 'white', margin: 0 }} />
        </View>
        {notification}
      </View>
    </View>
  );

  return (
    <View
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <View style={{ marginTop: Platform.OS === 'ios' ? 40 : 0, }}>
        <ImageBackground source={require('../../Assets/Header/header_bg.png')} tintColor="#0A8BCC" style={styles.backImage}  >
          {content}
        </ImageBackground>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({

  disabled: {
    backgroundColor: "#eee",
    borderColor: "#aaa"
  },
  countText: {
    padding: 2,
    fontSize: 10,
    fontFamily: 'Barlow-Regular',
    color: "white"
  },
  disabledText: {
    color: "#aaa"
  },
  linearGradient: {
    width: "100%",
    height: 50,
    paddingLeft: 10,
    paddingRight: 15,
    borderRadius: 0,
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    alignItems: 'center',
    fontSize: 16,
    marginLeft: 10,
    fontFamily: 'Barlow-SemiBold',
    textAlign: 'left',
    color: 'white',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  circle: {
    width: 15,
    height: 15,
    borderRadius: 15 / 2,
    backgroundColor: '#f00',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    marginTop: 5,
    right: 1,
    top: 1
  },
  backImage: {
    width: '110%',
    height: 50,
    paddingLeft: 10,
    paddingRight: 10,
    resizeMode: "cover",
    alignSelf: 'center',
    marginTop: Platform.OS === 'ios' ? 0 : 0,
  },

});

export default HomeHeader;
