import React, { Component } from "react";
import { Image, FlatList, StyleSheet, View, Text, ImageBackground } from "react-native";
import NavigationService from '../../../Service/Navigation'
import LocalStore from '../../../Store/LocalStore';
import RowMenu from '../../../Screens/Row/RowMenu'
import SystemLogModel from '../../../Model/SystemLogModel';
import AssetModel from '../../../Model/AssetModel';
import ChecklistModel from '../../../Model/ChecklistModel';
import AlertModel from '../../../Model/AlertModel';
import FeaturesModel from '../../../Model/FeaturesModel';
import { FEATURES } from '../../../Utils/Const'
import SideBar from '../../../Utils/SideBar'

var data = [
  {
    name: "Home",
    route: "home",
    icon: "home",
  },
  {
    name: "Ready to Upload",
    route: "PendingList",
    icon: "cloud-upload-alt",
  },
  {
    name: "Alerts",
    route: "AlertsList",
    icon: "bell",
  },
  {
    name: "My Profile",
    route: "Profile",
    icon: "user",
    type: "FontAwesome5",
  },
  {
    name: "Offline Favourite",
    route: "Settings",
    icon: "cogs",
  },
  {
    name: "Add New Asset",
    route: "AddAsset",
    icon: "plus",
  },
  // {
  //   name: (isLogin === 'true') ? 'Logout' : 'Login',
  //   route: "LoginScreen",
  //   icon: "arrow-circle-right",
  //   type: "FontAwesome5",
  // }
];


class MenuLeft extends Component {

  constructor(props) {
    super(props);
    this.state = {
      shadowOffsetWidth: 1,
      shadowRadius: 4,
      displayName: '',
      userRole: '',
      data: SideBar,
      profileImage: 'https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png',
      isLogin: false,
      featureCodes: []
    };
  }
  componentDidMount = () => {

    LocalStore.getToken().then(value => {
      if (value != null) {
        this.setState({ mToken: value });
        this._getCurrentUser();
        this.initFeature();
        //  this.state.isConnected && this.getCount();
      }
    });

  }

  initFeature = () => {

    FeaturesModel.getItemById(FEATURES.Asset_Creation).then(result => {
      console.log(JSON.stringify(result));
      if (result && result.data!=null) {
        let dataN = this.state.data
        let addButton = {
          name: "Add New Asset",
          route: "AddAsset",
          icon: "plus",
        }
        var isPresent = false
        dataN.forEach(element => {
          if (element.route == "AddAsset") {
            isPresent = true
          }
        });
        if (!isPresent) {
          dataN.push(addButton)
        }
        this.setState({ data: dataN });
      }
    })
  }

  componentWillReceiveProps(nextProps) {

  }


  cleanData = () => {
    AssetModel.deleteAllItem()
    AlertModel.deleteAllItem()
    ChecklistModel.deleteAllItem()
  }

  _getCurrentUser = () => {
    LocalStore.getUser().then(value => {
      if (value) {
        console.log('user ' + JSON.stringify(value));

        let displayName = value.firstName + ' ' + value.lastName;
        this.setState({ displayName: displayName, profileImage: value.profileImage, userRole: value.userRole });
      } else {
        let profileImage = 'https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png';
        this.setState({ displayName: 'Guest', profileImage: profileImage });
      }
    });
  }

  navigateOnPage(route) {
    NavigationService.closeDrawer();

    if (route == 'LoginScreen') {
      LocalStore.setLastScreen('HomeScreen');
      LocalStore.setToken('');
      LocalStore.setUser(null);
      SystemLogModel.addItem(this.state.displayName + ' Log out system')
      this.cleanData();
      NavigationService.navigate(route, { mainLogin: false })
    } else if (route == 'HomeScreen' || route == 'AboutUs' || route == 'Terms' || route == 'PrivacyPolicy') {
      NavigationService.navigate(route)
    } else {
      NavigationService.navigate(route)
    }
  }



  render() {
    return (
      <View style={{ flexDirection: 'column', flex: 1 }}>
        <View style={{ flexDirection: 'row', padding: 20, }}>
          <Image style={[{ width: 86, height: 86, borderRadius: 86 / 2, borderWidth: 0.5, borderColor: '#646464' }]} source={{ uri: this.state.profileImage }} />
          <View style={styles.textContainer}>
            <Text style={[styles.textTitle]}>{this.state.displayName}</Text>
            <Text style={[styles.textContent]}>{this.state.userRole}</Text>
          </View>

        </View>

        <FlatList
          data={this.state.data}
          renderItem={({ item, index }) => {
            return <RowMenu item={item} index={index} onPress={() => this.navigateOnPage(item.route)} />;
          }}
          keyExtractor={(item, index) => index.toString()}
        />

        <ImageBackground source={require('../../../Assets/Header/header_bg_menu.png')} tintColor="#0A8BCC" style={styles.backImage}  >
          <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
            <Image
              source={require('../../../Assets/Header/app_logo.png')}
              style={{width: 153, height: 26, tintColor: 'white', }} />
          </View>
        </ImageBackground>

      </View>
    );
  }
}


export default MenuLeft;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 20,
    marginTop: 20
  },
  textTitle: {
    color: '#646464',
    fontSize: 16,
    fontFamily: 'Barlow-SemiBold',
    alignContent: 'center',
  },
  textContent: {
    color: '#646464',
    fontSize: 14,
    fontFamily: 'Barlow-Medium',
    alignContent: 'center',
  },
  backImage: {
    width: '100%',
    height: 50,
    resizeMode: "cover",
    alignSelf: 'center',
  },
})