import React, { Component } from 'react'
import { View, Text, FlatList, StyleSheet, RefreshControl, ScrollView, Alert } from 'react-native'
import Loader from '../../Components/ProgressBar/Loader'
import Background from '../../Components/Background/Background'
import HomeCard from '../Row/HomeCard'
import RowNotification from '../Row/RowNotification'
import BaseResponce from '../../Model/BaseResponce'
import { FEATURES } from '../../Utils/Const'
import Navigation from '../../Service/Navigation'
import LocalStore from '../../Store/LocalStore'
import HomeHeader from '../../Components/ToolBar/HomeHeader'
import NetworkStatus from '../../Components/ToolBar/NetworkStatus'
import HomeData from '../../Utils/HomeData'
import { FAB } from 'react-native-paper';
import DashboardModel from '../../Model/DashboardModel';
import AssetModel from '../../Model/AssetModel';
import UserModel from '../../Model/UserModel';
import StatusModel from '../../Model/StatusModel';
import AlertModel from '../../Model/AlertModel';
import DoneChecklistModel from '../../Model/DoneChecklistModel';
import ComplaintModel from '../../Model/ComplaintModel';
import StoreImageModel from '../../Model/StoreImageModel';
import ChekImageModel from '../../Model/ChekImageModel';
import TaskModel from '../../Model/TaskModel';
import FeaturesModel from '../../Model/FeaturesModel';


import BackgroundService from '../../Service/BackgroundService'
import ChecklistModel from '../../Model/ChecklistModel';
import { connect } from 'react-redux';
import { dataChanged } from '../../Actions/DataChangedAction';
import Done from '../../Components/Done/Done'
import SystemLogModel from '../../Model/SystemLogModel'

const message = 'No feature assigned to you. Please contact to admin.';

class Home extends Component {

    constructor() {
        super();
        this.state = {
            title: 'Dashboard',
            mToken: '',
            status: false,
            isFetching: false,
            animating: false,
            notificationCount: 0,
            notifications: [],
            featureCodes: [],
            data: [],
            loadAlert: true,
            message: null
        }

    }


    componentDidMount = () => {
        this.initFeature()
        LocalStore.getToken().then(value => {
            this.setState({ mToken: value }, () => {
                this.getDataFromStrorage()
                this.getDashDataFromServer()
                this.checkAssets()
                this.checkChecklist()
                this.checkAlerts()
                this.checkUplods()
                this.checkImpotantData()
                this.getFeatures()
            });
        });

        this.checkLastData();

    }

    getFeatures = () => {
        BackgroundService.getFeatures(this.state.mToken).then((result) => {
            console.log(JSON.stringify(result));
            if (result) {
                this.initFeature()
            }
        })
    }

    initFeature = () => {
        FeaturesModel.getAllItems().then(result => {
            console.log(JSON.stringify(result));
            let featureCodes = []
            if (result.data) {
                result.data.forEach(element => {
                    featureCodes.push(element.featureCode);
                });
                this.setState({ featureCodes }, () => {
                    if (this.state.data.length == 0) {
                        this.getDataFromStrorage()
                    }
                });
            }
        })
    }
    checkAssets = () => {
        AssetModel.getCount().then(result => {
            console.log(JSON.stringify(result));
            if (result.data == 0) {
                this.addNotification('No asset download from server still, please download the assets', 'downloadAsset', 'sync', (mNotification) => {
                    console.log(mNotification);
                    this.downloadAsset(mNotification)
                })
            }
        })
    }

    checkImpotantData = () => {
        UserModel.getCount().then(result => {
            console.log(JSON.stringify(result));
            if (result.data == 0) {
                BackgroundService.getAllUser(this.state.mToken, 1)
            }
        })

        StatusModel.getCount().then(result => {
            console.log(JSON.stringify(result));
            if (result.data == 0) {
                BackgroundService.getAllStatus(this.state.mToken)
            }
        })
    }

    checkChecklist = () => {
        ChecklistModel.getCount().then(result => {
            console.log(JSON.stringify(result));
            if (result.data == 0) {
                this.addNotification('No checklist download from server still, please download the checklists', 'downloadChecklist', 'download', (mNotification) => {
                    console.log(mNotification);

                    this.downloadChecklist(mNotification)
                })
            }
        })
    }

    getDashDataFromServer = () => {
        BackgroundService.downloadDashboardData(this.state.mToken).then((result) => {
            console.log(result);
            SystemLogModel.addItem(result)
            if (result) {
                if (result == 'tok') {
                    this.logout()
                } else {
                    this.getDataFromStrorage()
                }
            }
        });
    }

    checkUplods = () => {
        BackgroundService.getCheckMark(this.state.mToken);
        BackgroundService.startAssetImageUploading(this.state.mToken);
        BackgroundService.startNewAssetUploading(this.state.mToken);
        ChekImageModel.getPendingCount().then(result => {
            console.log(JSON.stringify(result));
            if (result.data > 0) {
                BackgroundService.startCheckImageUploading(this.state.mToken);
            }
        })
        DoneChecklistModel.getPendingCount().then(result => {
            console.log(JSON.stringify(result));
            if (result.data > 0) {
                BackgroundService.startUploading(this.state.mToken);
            }
        })

        ComplaintModel.getPendingCount().then(result => {
            console.log(JSON.stringify(result));
            if (result.data > 0) {
                BackgroundService.startComplaintUploading(this.state.mToken);
            }
        })

        TaskModel.getPendingCount().then(result => {
            console.log(JSON.stringify(result));
            if (result.data > 0) {
                BackgroundService.startTaskUploading(this.state.mToken);
            }
        })

        StoreImageModel.getPendingCount().then(result => {
            console.log(JSON.stringify(result));
            if (result.data > 0) {
                BackgroundService.startImageUploading(this.state.mToken);
            }
        })
    }

    checkAlerts = () => {
        AlertModel.getUnReadCount().then(result => {
            console.log(JSON.stringify(result));
            if (result.data > 0) {
                this.setState({ notificationCount: result.data });
            }
        })

        if (this.state.loadAlert) {
            BackgroundService.getAlerts(this.state.mToken, 1).then((result) => {
                if (result) {
                    this.setState({ loadAlert: false }, () => {
                        this.checkAlerts()
                    });

                    if (result == 'tok') {
                        // this.addNotification('Fail to Authentication. Your token has been expired', 'logout', 'Logout', (mNotification) => {
                        // })
                        this.logout()
                    }

                }
            })
        }

    }

    componentWillUnmount() {
        this.setState({ isFetching: false });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ notificationCount: [] });
        console.log('state change' + JSON.stringify(nextProps));
        if (nextProps.isUpdated) {
            if (nextProps.type == 'asset') {
                this.checkAssets()
                this.checkChecklist()
            }
            if (nextProps.type == 'alert') {
                this.checkAlerts()
            }

        }

    }

    getDataFromStrorage = () => {
        DashboardModel.getUpdatedItem().then(result => {
            console.log(result);
            if (result.data) {
                this.setState({ data: HomeData }, () => {
                    this.setData(result.data)
                });
            } else {
                this.setState({ isRefreshing: false, animating: false });
            }
        })
    }

    _onNetworkChangeHandler = (status) => {
        this.setState({ isConnected: status })
        if (status == true && !this.state.isFetching) {
            LocalStore.getToken().then(value => {
                this.setState({ mToken: value });
                this.state.isConnected && BackgroundService.downloadDashboardData(this.state.mToken).then((result) => {
                    console.log(result);
                    if (result == 'tok') {
                        this.logout()
                    }
                });
            });
        }
    }


    addNotification = (message, action, actionTitle, callBack) => {
        let mNotifications = this.state.notifications
        let mNotification = {
            title: message,
            action: action,
            actionTitle: actionTitle,
            isLoad: false
        }
        mNotifications.push(mNotification)
        this.setState({ notifications: mNotifications }, () => {
            callBack(mNotification)
        });
    }

    setData = (mData) => {

        let homeData = this.state.data;
        let newHomeData = [];

        let assetMate = mData.assetMate;
        let docuMate = mData.docuMate;
        let taskMate = mData.taskMate;
        let totalComplaints = mData.totalComplaints;

        for (let index = 0; index < homeData.length; index++) {
            let featureCode = ''
            const element = homeData[index];
            if (element.id == 1) {
                element.count = assetMate;
                featureCode = FEATURES.Assatmate
            } else if (element.id == 2) {
                element.count = docuMate;
                featureCode = FEATURES.Documate
            } else if (element.id == 3) {
                element.count = taskMate;
                featureCode = FEATURES.View_Task
            } else if (element.id == 4) {
                element.count = totalComplaints;
                featureCode = FEATURES.View_Complaint
            }

            if (this.state.featureCodes.includes(featureCode)) {
                newHomeData.push(element);
            }
        }
        console.log(JSON.stringify(newHomeData));
        if (newHomeData.length == 0) {
            this.setState({ data: HomeData, message: message, isRefreshing: false, animating: false });
        } else {
            this.setState({ data: newHomeData, isRefreshing: false, animating: false });
        }


    }

    onRefresh() {
        this.getDashDataFromServer()
        this.getDataFromStrorage()
        this.checkAssets()
        this.checkChecklist()
        this.checkAlerts()
        this.getFeatures()
    }

    showAlert = (title, message) => {
        Alert.alert(title, message)
    }

    notificationProgress = (mItem, status) => {
        let mNotifications = this.state.notifications;
        var index = mNotifications.indexOf(mItem);
        let mNotification = mNotifications[index];
        mNotification.isLoad = status;
        mNotifications[index] = mNotification
        this.setState({ notifications: mNotifications });
    }

    removeNotification = (mItem) => {
        let mNotifications = this.state.notifications;
        var index = mNotifications.indexOf(mItem);
        if (index > -1) {
            mNotifications.splice(index, 1);
        }
        this.setState({ notifications: mNotifications });
    }

    onItemClickHandler(id, index) {
        switch (index) {
            case 0: {
                let route = this.state.data[index].route
                Navigation.navigate(route);
                break;
            }

            case 1: {
                let route = this.state.data[index].route
                Navigation.navigate(route);
                break;
            }
            case 2: {
                let route = this.state.data[index].route
                Navigation.navigate(route);
                break;
            }
            case 3: {
                let route = this.state.data[index].route
                Navigation.navigate(route);
                break;
            }
        }
    }

    onClickHandler(id, index) {
        console.log(id);

        switch (id) {
            case 'openDrawer': {
                Navigation.openDrawer();
                break;
            }
            case 'scan': {
                Navigation.navigate('ScanScreen');
                break;
            }
            case 'downloadAsset': {
                let mNotification = this.state.notifications[index];
                this.downloadAsset(mNotification)
                break;
            }
            case 'downloadChecklist': {
                let mNotification = this.state.notifications[index];
                this.downloadChecklist(mNotification)
                break;
            }
            case 'notification': {
                Navigation.navigate('AlertsList');
                break;
            }
            case 'logout': {
                this.logout()
                break;
            }
            case 'checkFeature': {
                BackgroundService.getFeatures(this.state.mToken).then((result) => {
                    console.log(result);
                    if (result) {
                        this.initFeature()
                    }
                })
            }
        }
    }

    logout = () => {
        this.cleanData()
        LocalStore.setToken('');
        LocalStore.setUser(null);
        Navigation.navigate('LoginScreen');
    }

    cleanData = () => {
        AssetModel.deleteAllItem()
        AlertModel.deleteAllItem()
        ChecklistModel.deleteAllItem()
    }

    downloadAsset = (mNotification) => {

        if (this.state.isConnected == false) {
            this.setState({
                message: 'No Internet Connection',
                snackVisible: true,
            })
            return;
        }

        this.notificationProgress(mNotification, true)
        BackgroundService.startAssetDownloading(this.state.mToken).then((result) => {
            console.log(result);
            if (result) {
                this.showAlert('Done', 'All asset downloaded succcessfully.')
                this.notificationProgress(mNotification, false)
                this.removeNotification(mNotification)
            } else {
                this.showAlert('Failed', 'Oops.. Something goes wrong')
                this.notificationProgress(mNotification, false)
            }
        })
    }

    downloadChecklist = (mNotification) => {
        if (this.state.isConnected == false) {
            this.setState({
                message: 'No Internet Connection',
                snackVisible: true,
            })
            return;
        }
        this.notificationProgress(mNotification, true)
        BackgroundService.startChecklistDownloading(this.state.mToken).then((result) => {
            console.log(result);
            if (result) {
                this.showAlert('Done', 'All checklist downloaded succcessfully.')
                this.notificationProgress(mNotification, false)
                this.removeNotification(mNotification)
            } else {
                this.showAlert('Failed', 'Oops.. Something goes wrong')
                this.notificationProgress(mNotification, false)
            }
        })
    }

    checkLastData() {
        LocalStore.getData().then(value => {
            console.log('mData ' + JSON.stringify(value));
            if (value != null) {
                if (value.route && value.alertId) {
                    console.log('route ' + value.route + " alertId " + value.alertId);
                    switch (value.route) {
                        case 'AlertDetails': {
                            Navigation.navigate(value.route, { alertId: value.alertId })
                            break;
                        }
                    }
                    LocalStore.setData(null);
                }
            }
        });
    }

    render() {
        var progressBar = <View></View>;
        if (this.state.animating) {
            progressBar = (
                <View style={{ height: '100%', alignContent: 'center', justifyContent: 'center' }}>
                    {this.state.animating ? <Loader animating={this.state.animating} message='View initialization...' /> : null}
                </View>

            )
        }
        var emptyView = <View></View>;
        if (this.state.message && !this.state.animating && this.state.featureCodes.length == 0) {
            emptyView = (
                <View style={{ height: '100%', alignContent: 'center', justifyContent: 'center', padding: 20 }}>
                    <Done
                        title='Opps...Sorry'
                        btnText='Try again'
                        message={this.state.message}
                        iconSize={80}
                        icon='frown'
                        onPress={() => { this.onClickHandler('checkFeature') }} />
                </View>
            )
        }

        var masterView = <View></View>;
        if (!this.state.animating) {
            masterView = (
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    < View >
                        <FlatList
                            keyboardShouldPersistTaps="always"
                            style={{ paddingLeft: 5, paddingRight: 5 }}
                            data={this.state.notifications}
                            renderItem={({ item, index }) => {
                                return <RowNotification item={item} index={index} onPress={(mAction) => this.onClickHandler(mAction, index)} />;
                            }}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>

                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <FlatList
                            keyboardShouldPersistTaps="always"
                            style={{ paddingLeft: 5, paddingRight: 5, flex: 1 }}
                            data={this.state.data}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefreshing}
                                    onRefresh={this.onRefresh.bind(this)}
                                />
                            }
                            renderItem={({ item, index }) => {
                                return <HomeCard item={item} index={index} onPress={() => this.onItemClickHandler('item', index)} />;
                            }}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>


                    {/* <View style={{ flex: 1 }}>
                            {this.state.isFetching ?
                                <ActivityIndicator size='small' style={{ marginTop: 10, alignSelf: 'center' }} /> :
                                <FAB
                                    color='black'
                                    style={styles.fab}
                                    small={false}
                                    icon={require('../../Assets/QRCode/qr-code.png')}
                                    onPress={() => this.onClickHandler('scan')}
                                />}

                        </View> */}
                </View >

            )
        }
        return (

            <View style={styles.container} >
                <Background>
                    <View>
                        <HomeHeader
                            onPress={(action) => this.onClickHandler(action, 0)}
                            cartCount={this.state.cartCount}
                            notificationCount={this.state.notificationCount}>
                            {this.state.title}
                        </HomeHeader>
                    </View>

                    <NetworkStatus onStatusChange={(status) => { this._onNetworkChangeHandler(status) }} />
                    {progressBar}
                    {masterView}
                    {emptyView}
                </Background>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    console.log(JSON.stringify(state));
    let isUpdated = state.DataReducer.isUpdated;
    let type = state.DataReducer.type;
    return { isUpdated: isUpdated, type: type };
};

export default connect(mapStateToProps, { dataChanged })(Home);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
    },
    fab: {
        alignItems: 'center',
        margin: 16,
        right: 0,
        bottom: 0,
        alignSelf: 'center',
        backgroundColor: 'white',
    },
})