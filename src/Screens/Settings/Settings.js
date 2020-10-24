import React, { Component } from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, NetInfo } from 'react-native'
import Loader from '../../Components/ProgressBar/Loader'
import RowSetting from '../Row/RowSetting'
import BaseResponce from '../../Model/BaseResponce'
import { BASE_URL } from '../../Utils/Const'
import Navigation from '../../Service/Navigation'
import LocalStore from '../../Store/LocalStore'
import Header from '../../Components/ToolBar/Header'
import NetworkStatus from '../../Components/ToolBar/NetworkStatus'
import SettingOptions from '../../Utils/SettingOptions'
import BackgroundService from '../../Service/BackgroundService'
import AssetModel from '../../Model/AssetModel';
import DashboardModel from '../../Model/DashboardModel';
import ChecklistModel from '../../Model/ChecklistModel';
import DocumentModel from '../../Model/DocumentModel';
import { dataChanged } from '../../Actions/DataChangedAction';
import { connect } from 'react-redux';

var isConnected = false;
NetInfo.isConnected.fetch().done((isConnected1) => {
    isConnected = isConnected1
    console.log(isConnected);

});

class Settings extends Component {

    constructor() {
        super();
        this.state = {
            title: 'Offline Favourite',
            mToken: '',
            status: false,
            isFetching: false,
            data: SettingOptions

        }
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
        AssetModel.getCount().then(result => {
            console.log(JSON.stringify(result));
            this.setData(1, result.data, false)
        })

        ChecklistModel.getCount().then(result => {
            console.log(JSON.stringify(result));
            this.setData(2, result.data, false)
        })

        DocumentModel.getCount().then(result => {
            console.log(JSON.stringify(result));
            this.setData(3, result.data, false)
        })
        this.setState({ animating: false });
    }

    setData = (id, count, completed) => {
        let homeData = this.state.data;
        let newHomeData = [];
        for (let index = 0; index < homeData.length; index++) {
            const element = homeData[index];
            if (element.id == id) {
                element.count = count;
                element.isLoad = completed;
            }
            newHomeData.push(element);
        }
        this.setState({ data: newHomeData });
    }

    _onNetworkChangeHandler = (status) => {
        this.setState({ isConnected: status })
        if (status == true && !this.state.isFetching) {
            LocalStore.getToken().then(value => {
                this.setState({ mToken: value });
                //   this.state.isConnected && this.getData();
            });
        }
    }

    showAlert = (title, message) => {
        Alert.alert(title, message)
        this.props.dataChanged({ isUpdated: true, type: 'asset' });
        this.props.dataChanged({ isUpdated: false, type: 'asset' });
    }


    onRefresh() {
        this.getData();
        this.setState({ isFetching: false });
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
        console.log(this.state.data[index].count);

        switch (index) {
            case 0: {
                if (!isConnected) {
                    this.showAlert('No Connection', 'Hello! there is no internet connection')
                    return
                }
                let mItem = this.state.data[index];
                if (id == 'download') {
                    this.downloadAsset(mItem)
                } else if (id == 'reload') {
                    this.deleteAsset(mItem)
                }
                break;
            }

            case 1: {
                if (!isConnected) {
                    this.showAlert('No Connection', 'Hello! there is no internet connection')
                    return
                }
                let mItem = this.state.data[index];
                if (id == 'download') {
                    this.downloadChecklist(mItem)
                } else if (id == 'reload') {
                    this.deleteChecklist(mItem)
                }
                break;
            }
        }
    }

    downloadAsset = (mItem) => {
        this.notificationProgress(mItem, true)
        BackgroundService.startAssetDownloading(this.state.mToken).then((result) => {
            console.log(result);
            if (result) {
                this.showAlert('Done', 'All asset downloaded succcessfully.')
                this.getData()
            } else {
                this.showAlert('Failed', 'Failed')
                this.notificationProgress(mItem, false)
            }
        })
    }

    downloadChecklist = (mItem) => {
        this.notificationProgress(mItem, true)
        BackgroundService.startChecklistDownloading(this.state.mToken).then((result) => {
            console.log(result);
            if (result) {
                this.showAlert('Done', 'All checklist downloaded succcessfully.')
                this.getData()
            } else {
                this.showAlert('Failed', 'Failed')
                this.notificationProgress(mItem, false)
            }
        })
    }



    deleteAsset = (mItem) => {
        this.notificationProgress(mItem, true)
        AssetModel.deleteAllItem().then(result => {
            console.log(JSON.stringify(result));
            if (result.data) {
                this.downloadAsset(mItem)
            } else {
                this.showAlert('Failed', 'Failed')
                this.notificationProgress(mItem, false)
            }
        })
    }

    deleteChecklist = (mItem) => {
        this.notificationProgress(mItem, true)
        ChecklistModel.deleteAllItem().then(result => {
            console.log(JSON.stringify(result));
            if (result.data) {
                this.downloadChecklist(mItem)
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
        var progressBar = <View></View>;
        if (this.state.animating) {
            progressBar = (
                <View style={{ height: '100%', alignContent: 'center', justifyContent: 'center' }}>
                    {this.state.animating ? <Loader animating={this.state.animating} /> : null}
                </View>

            )
        }

        var masterView = <View></View>;
        if (!this.state.animating) {
            masterView = (
                <View style={{ flex: 1, flexDirection: 'column' }}>

                    <View style={{ flex: 1 }}>
                        <FlatList
                            keyboardShouldPersistTaps="always"
                            style={{ paddingLeft: 5, paddingRight: 5 }}
                            data={this.state.data}
                            renderItem={({ item, index }) => {
                                return <RowSetting item={item} index={index} onPress={(action) => this.onItemClickHandler(action, index)} />;
                            }}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                    <TouchableOpacity onPress={() => this.onClickHandler('log')} style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.textHeader} >View System Logs</Text>
                    </TouchableOpacity>
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

export default connect(mapStateToProps, { dataChanged })(Settings);

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