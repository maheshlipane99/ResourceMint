import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, Alert, Dimensions, NetInfo } from 'react-native';
import Navigation from '../../Service/Navigation'
import LocalStore from '../../Store/LocalStore'
import Header from '../../Components/ToolBar/Header'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Card, Divider, Snackbar } from 'react-native-paper';
import { realm } from '../../Database/DbConfig'
import BaseResponce from '../../Model/BaseResponce'
import { BASE_URL } from '../../Utils/Const'
import SystemLogModel from '../../Model/SystemLogModel';

const size = Dimensions.get('window').width - 20;

var isConnected = false;
NetInfo.isConnected.fetch().done((isConnected1) => {
    isConnected = isConnected1
    console.log(isConnected);

});

export default class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: 'Profile',
            mToken: '',
            status: false,
            animating: true,
            isFetching: true,
            visible: false,
            profileImage: "https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png",
            deviceId: "",
        }
    }

    componentDidMount = () => {

        LocalStore.getUser().then(value => {
            this.setState({ data: value });
            console.log(JSON.stringify(value));
        });
        LocalStore.getToken().then(value => {
            this.setState({ mToken: value, isFetching: false }, () => {
            });
        });

    }


    logOut = () => {
        if (isConnected) {
            this.setState({ isFetching: true });
            fetch(BASE_URL + 'authorization/logout/', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': this.state.mToken,
                },
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                    BaseResponce.setResponce(responseJson);
                    if (BaseResponce != null) {
                        if (BaseResponce.getStatus()) {
                            this.showMessage(BaseResponce.getMessage())
                            LocalStore.setToken('');
                            LocalStore.setUser(null);
                            this.cleanLocalData()
                            Navigation.navigate('LoginScreen', {})
                        } else {
                            console.log(BaseResponce.getMessage());
                            SystemLogModel.addItem(BaseResponce.getMessage())
                            this.showMessage(BaseResponce.getMessage())
                        }
                    } else {
                        console.log("message " + BaseResponce.getMessage());
                        SystemLogModel.addItem(BaseResponce.getMessage())
                        this.showMessage(BaseResponce.getMessage())
                    }
                    this.setState({ isFetching: false });
                })
                .catch((error) => {
                    console.error(error);
                    this.setState({ isFetching: false });
                });
        } else {
            this.showMessage("No Internet Connection")
        }
    }

    cleanLocalData = () => {
        realm.write(() => {
            realm.deleteAll();
        });
    }
    _showDialog = () => {
        Alert.alert(
            'Are you sure?',
            'you want to logout now ?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'Yes', onPress: () => this.logOut() },
            ],
            { cancelable: true },
        );
    }

    showMessage(message) {
        this.setState({
            messageText: message,
            snackVisible: true,
        })
    }

    render() {


        var mainData = <View></View>;
        if (this.state.data) {
            mainData = (
                <View style={{ padding: 15, marginTop: 0 }}>
                    <Text style={[styles.textLabel]}>Name</Text>
                    <Text style={[styles.textContent]}>{this.state.data.firstName} {this.state.data.lastName}</Text>
                    <Divider />
                    <Text style={[styles.textLabel]}>Mobile Number</Text>
                    <Text style={[styles.textContent]}>{this.state.data.mobileNumber}</Text>
                    <Divider />
                    <Text style={[styles.textLabel]}>Email Id</Text>
                    <Text style={[styles.textContent]}>{this.state.data.emailId}</Text>
                    <Divider />
                    <Text style={[styles.textLabel]}>Department</Text>
                    <Text style={[styles.textContent]}>{this.state.data.departmentTitle}</Text>
                    <Divider />
                    <Text style={[styles.textLabel]}>Organization</Text>
                    <Text style={[styles.textContent]}>{this.state.data.organizationName}</Text>
                    <Divider />
                </View>

            )
        }

        return (
            <View style={{ flex: 1 }}>
                <View>
                    <Header onPress={() => { this.props.navigation.goBack(null) }}>{this.state.title}</Header>
                </View>
                <View style={styles.mainContainer}>

                    <Card style={{ flex: 1, backgroundColor: 'white', radius: 10, borderColor: '#E9E6E5', margin: 10 }} elevation={5}>
                        <View style={{ flexDirection: 'column', flex: 1, padding: 0 }}>
                            {/* <View style={styles.header} /> */}
                            <ImageBackground source={require('../../Assets/Curve/curve.png')} tintColor="#0A8BCC" style={styles.backImage}  ></ImageBackground>

                            <View style={styles.imageContainer} >
                                <Image style={[{ width: 114, height: 114, borderRadius: 114 / 2, borderWidth: 0.5, borderColor: '#646464' }]} source={{ uri: this.state.data ? this.state.data.profileImage : this.state.profileImage }} />
                            </View>
                            <View style={styles.container}>
                                {mainData}
                            </View>
                            {this.state.isFetching ?
                                <View style={styles.footer} >
                                    <Text style={[styles.text, { color: 'white' }]}>Please Wait...</Text>
                                </View> :
                                <TouchableOpacity style={styles.footer} onPress={() => this._showDialog()}>
                                    <Icon
                                        active
                                        name='arrow-circle-right'
                                        style={{ color: 'white', fontSize: 24, marginRight: 10 }}
                                        type='FontAwesome5'
                                    />
                                    <Text style={[styles.text, { color: 'white' }]}>Logout</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </Card>

                </View>
                <View style={{ position: 'relative' }}>
                    <Snackbar
                        duration={Snackbar.DURATION_SHORT}
                        visible={this.state.snackVisible}
                        onDismiss={() => this.setState({ snackVisible: false, message: '' })}
                    >{this.state.messageText} </Snackbar>
                </View>

            </View>
        );
    }
}


const styles = StyleSheet.create({

    mainContainer: {
        flex: 1
    },
    textHeader: {
        flex: 1,
        color: '#707070',
        fontFamily: 'Barlow-Medium',
        fontSize: 16,
        padding: 0,
        alignSelf: 'flex-start'

    },
    textLabel: {
        color: '#C1C0C0',
        fontFamily: 'Barlow-Light',
        fontSize: 12,
        marginTop: 10
    },
    container: {
        flex: 1,
    },
    imageContainer: {
        position: 'absolute',
        marginTop: '15%',
        alignSelf: 'center',
        top: 1
    },
    header: {
        height: '20%',
        backgroundColor: '#0A8BCC',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    },
    footer: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0A8BCC',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        flexDirection: 'row'
    },
    textContent: {
        color: '#707070',
        fontFamily: 'Barlow-Regular',
        fontSize: 16,
        marginBottom: 10,
    },
    backImage: {
        position: 'relative',
        width: size,
        height: size / 2,
        resizeMode: "cover",
    },
})