import React, { Component } from 'react'
import { Provider } from 'react-redux';
import store from '../src/Reducers/index';
import { View, StyleSheet, Platform, Linking } from 'react-native'
import { createAppContainer } from 'react-navigation';
import { getRootNavigator } from './Navigator'
import LocalStore from './Store/LocalStore'
import NavigationService from './Service/Navigation'
import SplashScreen from './Screens/SplashScreen/SplashScreen'
import firebase, { } from 'react-native-firebase';
import SystemLogModel from './Model/SystemLogModel';


export default class Root extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            loggedIn: false,
        };
    }

    componentDidMount() {

        setTimeout(() => {
            this.setTimePassed();
        }, 4000);


        this.initRouts();
        this.initFirebase();
    }

    setTimePassed() {
        LocalStore.getToken().then(value => {
            console.log('token ' + value)
            if (value == 'none') {
                this.setState({ loggedIn: false, loading: false });
            } else {
                this.setState({ loggedIn: true, loading: false, mToken: value });
            }
        });
    }

    initRouts() {
        if (Platform.OS === 'android') {
            Linking.getInitialURL().then(url => {
                this.navigate(url);
            });
        } else {
            Linking.addEventListener('url', this.handleOpenURL);
        }
    }

    handleOpenURL = (event) => { // D
        this.navigate(event.url);
    }

    navigate = (url) => { // E
        const route = url.replace(/.*?:\/\//g, '');
        // const id = route.match(/\/([^\/]+)\/?$/)[2];
        const routeName = route.split('/')[1];
        const id = route.split('/')[2];
        const label = route.split('/')[3];
        console.log('Rout ' + routeName + ' id ' + id);
        var mRout = '';
        switch (routeName) {
            case 'MCRT': {
                mRout = 'MyCart';
                break;
            }
            case 'MCAT': {
                mRout = 'ByCatProductList';
                break;
            }
            case 'RCAT': {
                mRout = 'MyCart';
                break;
            }
            case 'PRDT': {
                mRout = 'ProductDetails';
                break;
            }
            case 'ORDR': {
                mRout = 'OrderDetails';
                break;
            }
            case 'OFFR': {
                mRout = 'CouponDetails';
                break;
            }
        }

        let data = {
            route: mRout,
            masterId: id,
            label: label
        }
        LocalStore.setData(data);
    }

    initFirebase() {

        firebase.messaging().requestPermission()
            .then(() => {
                firebase.messaging().registerForNotifications()
            })
            .catch(error => {
                // User has rejected permissions  
            });

        firebase.messaging().subscribeToTopic('brigs');
        // firebase.messaging().unsubscribeFromTopic('running');
        firebase.messaging().getToken()
            .then(fcmToken => {
                if (fcmToken) {
                    console.log('Token ' + fcmToken);
                    LocalStore.setFirebaseToken(fcmToken);
                    // user has a device token
                }
            });

        this.notificationListener = firebase.notifications().onNotification(e => {
            if (e._data.bigImage) {
                const notification = new firebase.notifications.Notification()
                    .setNotificationId(e._notificationId)
                    .setTitle(e._title)
                    .setBody(e._body)
                    .setSound('default')
                    .android.setChannelId('default-channel')
                    .android.setSmallIcon('ic_launcher')
                    .android.setBigPicture(e._data.bigImage)
                    .android.setPriority(firebase.notifications.Android.Priority.High)
                    .setData(e._data);
                firebase.notifications().displayNotification(notification)
            } else {
                const notification = new firebase.notifications.Notification()
                    .setNotificationId(e._notificationId)
                    .setTitle(e._title)
                    .setBody(e._body)
                    .setSound('default')
                    .android.setChannelId('default-channel')
                    .android.setSmallIcon('ic_launcher')
                    .android.setPriority(firebase.notifications.Android.Priority.High)
                    .setData(e._data);
                firebase.notifications().displayNotification(notification)
            }
        });

        firebase.notifications().getInitialNotification().then((notificationOpen) => {
            if (notificationOpen) {
                // App was opened by a notification
                // Get the action triggered by the notification being opened
                const action = notificationOpen.action;
                // Get information about the notification that was opened
                const notification = notificationOpen.notification;
                if (notification._data) {
                    let mData = notification._data
                    mData.route = 'AlertDetails'
                    LocalStore.setData(mData);
                    SystemLogModel.addItem(JSON.stringify(notification._data))
                }
                console.log(notification);
            }
        });

        this.removeNotificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
            if (notification.data) {
                LocalStore.setData(notification.data);
            }
            console.log(notification);
        });
        this.removeNotificationListener = firebase.notifications().onNotification((notification) => {
            if (notification.data) {
                LocalStore.setData(notification.data);
            }
            console.log(notification);
        });


        this.onNotificationOpened = firebase.notifications().onNotificationOpened((action) => {
            console.log(action.notification.notificationId);
            if (action.notification.data) {
                LocalStore.setData(action.notification.data);
                this.setState({ loggedIn: true, loading: false });
            }
            firebase.notifications().removeDeliveredNotification(action.notification.notificationId)
        });

    }

    componentWillUnmount() {
        this.removeNotificationDisplayedListener();
        this.removeNotificationListener();
        this.notificationListener();
        this.onNotificationOpened();
        Linking.removeEventListener('url', this.handleOpenURL);
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.base}>
                    <SplashScreen />
                </View>
            )
        }

        const RootNavigator = createAppContainer(getRootNavigator(this.state.loggedIn));
        return (
            <Provider store={store}>
                <RootNavigator ref={(r) => { NavigationService.setTopLevelNavigator(r) }}>
                </RootNavigator>
            </Provider>
        );
    }
}

const styles = StyleSheet.create({
    base: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})