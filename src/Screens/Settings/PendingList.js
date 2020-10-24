import React, { Component } from 'react'
import { View, Text, FlatList, StyleSheet, RefreshControl, Alert, NetInfo } from 'react-native'
import Loader from '../../Components/ProgressBar/Loader'
import EmptyMessage from '../../Components/ProgressBar/EmptyMessageHappy'
import RowPending from '../Row/RowPending'
import Navigation from '../../Service/Navigation'
import LocalStore from '../../Store/LocalStore'
import Header from '../../Components/ToolBar/Header'
import NetworkStatus from '../../Components/ToolBar/NetworkStatus'
import PendingOption from '../../Utils/PendingOption'
import BackgroundService from '../../Service/BackgroundService'
import DoneChecklistModel from '../../Model/DoneChecklistModel';
import ComplaintModel from '../../Model/ComplaintModel';
import StoreImageModel from '../../Model/StoreImageModel';
import ChekImageModel from '../../Model/ChekImageModel';
import TaskModel from '../../Model/TaskModel';
import { dataChanged } from '../../Actions/DataChangedAction';
import { connect } from 'react-redux';

var noConectionMessage = "Hello! there is no internet connection"

var isConnected = false;
NetInfo.isConnected.fetch().done((isConnected1) => {
    isConnected = isConnected1
    console.log(isConnected);

});

class PendingList extends Component {

    constructor() {
        super();
        this.state = {
            title: 'Ready to Upload',
            mToken: '',
            status: false,
            animating: true,
            data: [],
            isConnected:isConnected

        }
    }


    checkConnection = () => {
       return NetInfo.isConnected.fetch().done((isConnected) => {
            console.log(isConnected);
        return isConnected
        });
    }

    componentDidMount = () => {

        LocalStore.getToken().then(value => {
            this.setState({ mToken: value }, () => {
                this.getData()
            });
        });

    }

    componentWillUnmount() {
        this.setState({ isFetching: false });
    }

    getData = () => {
        DoneChecklistModel.getPendingCount().then(result => {
            console.log(JSON.stringify(result));

            if (result.data > 0) {
                let element = { id: "1", title: "Pending Checklists", route: "Outbox", count: result.data, icon: 6, featureCode: "#A958BF", isLoad: false }
                this.setData(element)
            }
        })

        ComplaintModel.getPendingCount().then(result => {
            console.log(JSON.stringify(result));
            if (result.data > 0) {
                let element = { id: "2", title: "Pending Complaints", route: "MyComplaintList", count: result.data, icon: 6, featureCode: "#A958BF", isLoad: false }
                this.setData(element)
            }
        })

        TaskModel.getPendingCount().then(result => {
            console.log(JSON.stringify(result));
            if (result.data > 0) {
                let element = { id: "3", title: "Pending Task", route: "MyTaskList", count: result.data, icon: 6, featureCode: "#A958BF", isLoad: false }
                this.setData(element)
            }
        })

        StoreImageModel.getPendingCount().then(result => {
            console.log(JSON.stringify(result));
            if (result.data > 0) {
                let element = { id: "4", title: "Pending Images", route: "", count: result.data, icon: 6, featureCode: "#A958BF", isLoad: false }
                this.setData(element)
            }
        })

        ChekImageModel.getPendingCount().then(result => {
            console.log(JSON.stringify(result));
            if (result.data > 0) {
                let element = { id: "5", title: "Pending Checklist Images", route: "", count: result.data, icon: 6, featureCode: "#A958BF", isLoad: false }
                this.setData(element)
            }
        })
        this.setState({ animating: false, isRefreshing: false }, () => {
            console.log(JSON.stringify(this.state.data));

        });
    }


    setData = (element) => {
        let homeData = this.state.data;
        homeData.push(element);
        this.setState({ data: homeData });
    }

    removeData = (id) => {
        let homeData = this.state.data;
        let newHomeData = [];
        for (let index = 0; index < homeData.length; index++) {
            const element = homeData[index];
            if (element.id == id) {
                newHomeData.pop(element);
            } else {
                newHomeData.push(element);
            }

        }
        this.setState({ data: newHomeData });
    }

    _onNetworkChangeHandler = (status) => {
        this.setState({ isConnected: status })
    }

    showAlert = (title, message) => {
        Alert.alert(title, message)
        this.props.dataChanged({ isUpdated: true, type: 'asset' });
        this.props.dataChanged({ isUpdated: false, type: 'asset' });
    }


    onRefresh() {
        this.setState({ data: [] }, () => {
            this.getData();
        });
    }


    notificationProgress = (mItem, status) => {
        let data = this.state.data;
        var index = data.indexOf(mItem);
        let mObject = data[index];
        mObject.isLoad = status;
        data[index] = mObject
        this.setState({ data: data });
    }

    onItemClickHandler(id, index) {
        console.log(this.state.data[index].route);
        let mItem = this.state.data[index];


        switch (mItem.id) {
            case '1': {

                if (id == 'upload') {
                    if (!this.state.isConnected) {
                        this.showAlert('No Connection', noConectionMessage)
                        return
                    }
                    this.uploadChecklist(mItem)

                } else if ('rootView') {
                    Navigation.navigate(mItem.route);
                }
                break;
            }

            case '2': {

                if (id == 'upload') {
                      if (!this.state.isConnected) {
                       this.showAlert('No Connection', noConectionMessage)
                        return
                    }
                    this.uploadComplaint(mItem)
                } else if ('rootView') {
                    Navigation.navigate(mItem.route);
                }
                break;
            }

            case '3': {
                if (id == 'upload') {
                      if (!this.state.isConnected) {
                       this.showAlert('No Connection', noConectionMessage)
                        return
                    }
                    this.uploadTask(mItem)
                } else if ('rootView') {
                    Navigation.navigate(mItem.route);
                }
                break;
            }

            case '4': {
                if (id == 'upload') {
                      if (!this.state.isConnected) {
                       this.showAlert('No Connection', noConectionMessage)
                        return
                    }
                    this.uploadImages(mItem)
                } else if ('rootView') {
                    Navigation.navigate(mItem.route);
                }
                break;
            }

            case '5': {
                if (id == 'upload') {
                      if (!this.state.isConnected) {
                       this.showAlert('No Connection', noConectionMessage)
                        return
                    }
                    this.uploadCheckImages(mItem)
                } else if ('rootView') {
                    Navigation.navigate(mItem.route);
                }
                break;
            }
        }
    }

    uploadChecklist = (mItem) => {
        this.notificationProgress(mItem, true)
        BackgroundService.startUploading(this.state.mToken).then((result) => {
            console.log(result);
            if (result) {
                this.showAlert('Done', 'All checklist uploading succcessfully. If any checklist is remaning then try pull to refresh.')
                this.onRefresh()
            } else {
                this.showAlert('Failed', 'Failed')
                this.notificationProgress(mItem, false)
            }
        })
    }

    uploadComplaint = (mItem) => {
        this.notificationProgress(mItem, true)
        BackgroundService.startComplaintUploading(this.state.mToken).then((result) => {
            console.log(result);
            if (result) {
                this.showAlert('Done', 'All complaints uploading succcessfully. If any complaint is remaning then try pull to refresh.')
                this.onRefresh()
            } else {
                this.showAlert('Failed', 'Failed')
                this.notificationProgress(mItem, false)
            }
        })
    }


    uploadTask = (mItem) => {
        this.notificationProgress(mItem, true)
        BackgroundService.startTaskUploading(this.state.mToken).then((result) => {
            console.log(result);
            if (true) {
                this.showAlert('Done', 'All task uploading succcessfully. If any task is remaning then try pull to refresh.')
                this.onRefresh()
            } else {
                this.showAlert('Failed', 'Failed')
                this.notificationProgress(mItem, false)
            }
        })
    }

    uploadImages = (mItem) => {
        this.notificationProgress(mItem, true)
        BackgroundService.startImageUploading(this.state.mToken).then((result) => {
            console.log(result);
            if (true) {
                this.showAlert('Done', 'All Image uploading succcessfully. If any image is remaning then try pull to refresh.')
                this.onRefresh()
            } else {
                this.showAlert('Failed', 'Failed')
                this.notificationProgress(mItem, false)
            }
        })
    }

    uploadCheckImages = (mItem) => {
        this.notificationProgress(mItem, true)
        BackgroundService.startCheckImageUploading(this.state.mToken).then((result) => {
            console.log(result);
            if (true) {
                this.showAlert('Done', 'All Image uploading succcessfully. If any image is remaning then try pull to refresh.')
                this.onRefresh()
            } else {
                this.showAlert('Failed', 'Failed')
                this.notificationProgress(mItem, false)
            }
        })
    }

    onClickHandler(id) {
        switch (id) {
            case 'log': {
                Navigation.navigate('SystemLog');
                break;
            }
        }
    }


    render() {

        var message = <View></View>;
        if (!this.state.animating && this.state.data.length == 0) {
            message = (
                <View style={{ height: '100%', alignContent: 'center', justifyContent: 'center' }}>
                    <EmptyMessage>Everything Up-to-date</EmptyMessage>
                </View>

            )
        }

        var progressBar = <View></View>;
        if (this.state.animating) {
            progressBar = (
                <View style={{ height: '100%', alignContent: 'center', justifyContent: 'center' }}>
                    {this.state.animating ? <Loader animating={this.state.animating} /> : null}
                </View>

            )
        }

        var masterView = <View></View>;
        if (!this.state.animating && this.state.data) {
            masterView = (
                <View style={{ flex: 1, flexDirection: 'column' }}>

                    <View style={{ flex: 1 }}>
                        <FlatList
                            keyboardShouldPersistTaps="always"
                            style={{ paddingLeft: 5, paddingRight: 5 }}
                            data={this.state.data}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefreshing}
                                    onRefresh={this.onRefresh.bind(this)}
                                />
                            }
                            renderItem={({ item, index }) => {
                                return <RowPending item={item} index={index} onPress={(action) => this.onItemClickHandler(action, index)} />;
                            }}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                </View>

            )
        }
        return (

            <View style={styles.container}>
                <View>
                    <Header onPress={() => { this.props.navigation.goBack(null) }}>{this.state.title}</Header>
                </View>
                <NetworkStatus onStatusChange={(status) => { this._onNetworkChangeHandler(status) }} />
                {progressBar}
                {message}
                {masterView}
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    console.log(JSON.stringify(state));
    let isUpdated = state.DataReducer.isUpdated;
    return { isUpdated: isUpdated };
};

export default connect(mapStateToProps, { dataChanged })(PendingList);

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