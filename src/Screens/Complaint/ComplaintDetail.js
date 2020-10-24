import React, { Component } from 'react'
import { View, FlatList, StyleSheet, ActivityIndicator, RefreshControl, ScrollView, NetInfo, Platform } from 'react-native'
import Loader from '../../Components/ProgressBar/Loader'
import RowImage from '../Row/RowImage'
import RowComTrack from '../Row/RowComTrack'
import Navigation from '../../Service/Navigation'
import LocalStore from '../../Store/LocalStore'
import Header from '../../Components/ToolBar/Header'
import { Card, } from 'react-native-paper';
import { Button, Text, Snackbar, Divider } from 'react-native-paper';
import ComplaintModel from '../../Model/ComplaintModel';
import ComplaintTrackModel from '../../Model/ComplaintTrackModel';
import AssetModel from '../../Model/AssetModel';
import ChangeStatusModel from '../../Model/ChangeStatusModel';
import StatusModel from '../../Model/StatusModel';
import TransCompModel from '../../Model/TransCompModel';
import ImageViewDialog from '../../Components/DialogBox/ImageViewDialog'
import { ConfirmDialog } from 'react-native-simple-dialogs';
import { dataChanged } from '../../Actions/DataChangedAction';
import { connect } from 'react-redux';
import BackgroundService from '../../Service/BackgroundService'
import SystemLogModel from '../../Model/SystemLogModel';
import BaseResponce from '../../Model/BaseResponce'
import { BASE_URL } from '../../Utils/Const'
var isConnected = false;
NetInfo.isConnected.fetch().done((isConnected1) => {
    isConnected = isConnected1
    console.log(isConnected);

});

import Share from 'react-native-share';
var RNFS = require('react-native-fs');
var SavePath = Platform.OS === 'ios' ? RNFS.MainBundlePath : RNFS.DocumentDirectoryPath;
import { ProgressDialog } from 'react-native-simple-dialogs';

class ComplaintDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: 'Complaint Details',
            mToken: '',
            visibleModel: false,
            animating: true,
            isFetching: false,
            progressVisible: false,
            dialogVisible: false,
            isUpdated: false,
            complaintId: props.navigation.state.params.complaintId,
            data: null,
            imageName: '',
            complaintImages: [],
            complaintTrack: [],
            complaintStatusId: 1,
            serverId: props.navigation.state.params.serverId,
        }

    }


    componentDidMount = () => {
        LocalStore.getToken().then(value => {
            this.setState({ mToken: value }, () => {
                this.getData()
                this.updateChangesToServer()
            });
        });
    }

    componentWillUnmount() {
        this.setState({ isFetching: false });
    }


    getData() {
        ComplaintModel.getItemById(this.state.complaintId + "").then(result => {
            let mData = result.data
            if (mData) {
                console.log(JSON.stringify(mData));
                let newData = JSON.parse(JSON.stringify(mData))
                this.setState({ animating: false, data: mData, serverId: mData.serverId, isRefreshing: false }, () => {
                    this.checkStatus(mData.complaintStatus)
                });
                if (mData.isSubmitted && !this.state.isUpdated) {
                    this.getServerData()
                    this.getComplaintTrack()
                    this.getComplaintTrackFromServer()
                }
                mData.complaintImages.forEach(element => {
                    console.log(JSON.stringify(element));
                });
            } else {
                this.getServerData()
                console.log(result.message);
            }
        })
    }

    getServerData = () => {
        BackgroundService.getComplaintDetails(this.state.mToken, this.state.serverId, this.state.complaintId).then((result) => {
            console.log(JSON.stringify(result));
            if (result) {
                this.setState({ isUpdated: true }, () => {
                    this.getData()
                });
            }
        })
    }

    getComplaintTrack() {
        ComplaintTrackModel.getAllComplaintTrack(this.state.serverId + "").then(result => {
            let mData = result.data
            if (mData) {
                console.log(JSON.stringify(mData));
                this.setState({ complaintTrack: mData });
            }
        })
    }

    getComplaintTrackFromServer = () => {
        BackgroundService.getComplaintTrack(this.state.mToken, this.state.serverId, 0).then((result) => {
            console.log(JSON.stringify(result));
            this.getComplaintTrack()
        })
    }

    updateChangesToServer = () => {
        BackgroundService.getTransferComplaintLocal(this.state.mToken).then((result) => {
            console.log(JSON.stringify(result));
            this.getServerData()
        })

        BackgroundService.getChangeStatus(this.state.mToken).then((result) => {
            console.log(JSON.stringify(result));
        })
    }

    checkStatus = (status) => {
        StatusModel.getAllItemsByLimit(0).then(result => {
            console.log(JSON.stringify(result.data));
            if (result.data.length > 0) {
                let str = JSON.stringify(result.data)
                let mDataList = JSON.parse(str)
                for (let index = 0; index < mDataList.length; index++) {
                    const element = mDataList[index];
                    if (element.title.includes(status)) {
                        console.log('Current Status is ' + element.title);
                        this.setState({ complaintStatusId: element.complaintStatusId });
                    }
                }
            }
        })
    }


    onRefresh() {
        if (this.state.data && this.state.data.isSubmitted) {
            console.log('onRefresh');
            this.getServerData();
            this.getComplaintTrackFromServer()
        }
    }


    onItemClickHandler(id, index) {
        switch (id) {
            case 'rootView': {
                let imageName = this.state.data.complaintImages[index].imageName
                this.setState({ visibleModel: true, index, imageName });
                break
            }
        }
    }


    onClickHandler(id) {
        switch (id) {
            case 'action': {

                // Navigation.navigate('SingleUser', { returnData: this.returnData.bind(this) });
                Navigation.navigate('StatusList', { complaintStatusId: this.state.complaintStatusId, returnData: this.returnData.bind(this) });
                break;
            }
            case 'asset': {
                this.checkAsset()
                break;
            }
            case 'cancel': {
                this.setState({ dialogVisible: true });
                break;
            }
            case 'accept': {
                this.acceptComplaint(2)
                break;
            }
            case 'reject': {
                this.acceptComplaint(3)
                break;
            }
        }
    }

    cancelComplaint = () => {
        this.setState({ dialogVisible: false }, () => {
            this.props.navigation.goBack();
            ComplaintModel.deleteItem(this.state.complaintId + "").then(result => {
                this.props.dataChanged({ isUpdated: true, type: 'complaint' });
                this.props.dataChanged({ isUpdated: false, type: 'complaint' });
            })
        });
    }

    checkAsset = () => {
        if (this.state.data && this.state.data.assetCode) {
            AssetModel.getItemByAssetCode(this.state.data.assetCode + "").then(result => {
                let mData = result.data
                if (mData) {
                    console.log(mData);
                    Navigation.navigate('AssetDetail', { assetId: mData.assetId });
                } else {
                    this.showMessage("Invalid Asset Code")
                    console.log(result.message);
                }
            })
        }
    }

    changeStatus = (userId, status) => {
        if (this.state.complaintId) {
            let changeComplaint = {
                complaintId: this.state.complaintId,
                complaintStatusIdFK: this.state.complaintStatusId
            }

            ChangeStatusModel.addItem(changeComplaint).then(result => {
                console.log(JSON.stringify(result));
                // this.showMessage(result.message)
            })

            ComplaintModel.changeStatus(status, this.state.data).then(result => {
                console.log(JSON.stringify(result));
                this.props.dataChanged({ isUpdated: true, type: 'complaint' });
                this.props.dataChanged({ isUpdated: false, type: 'complaint' });
                this.getData()
                //  this.showMessage(result.message)
            })

            if (userId) {
                this.transferComplaint(userId)
            }
            this.updateChangesToServer()

        }
    }

    transferComplaint = (userId) => {
        if (this.state.complaintId) {
            let changeComplaint = {
                complaintId: this.state.complaintId,
                toUserIdFK: userId
            }

            TransCompModel.addItem(changeComplaint).then(result => {
                console.log(JSON.stringify(result));
                this.showMessage(result.message)
            })
        }
    }

    onModelItemClickHandler = (id, index) => {
        switch (id) {
            case 'close': {
                this.setState({ visibleModel: false });
                break;
            }
            case 'share': {
                this.setState({ visibleModel: false }, () => {
                    let mData = this.state.imageName;
                    this.shareFile(mData, 'image/jpeg')
                });
                break;
            }
        }
    }


    shareFile = (url, type) => {
        this.setState({ progressVisible: true });
        var filename = url.split('/').pop()
        var extension = url.split('.').pop().split(/\#|\?/)[0]
        const localFile = `${SavePath}/${filename}`
        RNFS.exists(localFile)
            .then((exists) => {
                if (exists) {
                    RNFS.readFile(localFile, 'base64')
                        .then(res => {
                            console.log(res);
                            let message = '*' + this.state.data.title + '*'
                            let base64Data = `data:${type};base64,` + res;
                            let options1 = {
                                message: message,
                                type: type,
                                url: base64Data // (Platform.OS === 'android' ? 'file://' + filePath)
                            };
                            Share.open(options1);
                            this.setState({ progressVisible: false });
                        });

                } else {
                    const options = {
                        fromUrl: url,
                        toFile: localFile
                    };
                    RNFS.downloadFile(options).promise
                        .then(() => {
                            // success
                            RNFS.readFile(localFile, 'base64')
                                .then(res => {
                                    console.log(res);
                                    let message = '*' + this.state.data.title + '*'
                                    let base64Data = `data:${type};base64,` + res;
                                    let options1 = {
                                        message: message,
                                        type: type,
                                        url: base64Data // (Platform.OS === 'android' ? 'file://' + filePath)
                                    };
                                    Share.open(options1);
                                    this.setState({ progressVisible: false });
                                });
                        })
                        .catch(error => {
                            // error
                            this.setState({ progressVisible: false });
                        });
                }
            });
    }


    returnData = (data) => {
        console.log(data);
        if (data.complaintStatusId) {
            this.setState({ complaintStatusId: data.complaintStatusId, statusTitle: data.statusTitle }, () => {
                if (data.complaintStatusId == 5) {
                    Navigation.navigate('SingleUser', { returnData: this.returnData.bind(this) });
                } else {
                    this.changeStatus('', data.statusTitle)
                }
            });
        } else if (data.assignedUsers) {
            this.setState({ assignedUsers: data.assignedUsers, selectedUser: data.selectedUser }, () => {
                let user = data.selectedUser[0]
                if (user && user.userId) {
                    let status = this.state.statusTitle + ' (' + user.firstName + ' ' + user.lastName + ')'
                    this.changeStatus(user.userId, status)
                }
            });
        }

    }

    showMessage(message) {
        this.setState({
            messageText: message,
            snackVisible: true,
        })
    }


    acceptComplaint = (mStatus) => {
        if (isConnected) {
            this.setState({ isFetching: true });
            SystemLogModel.addItem('Complaint Accept : ' + mStatus)
            fetch(BASE_URL + 'complaints/confrimComplaintRequest/' + this.state.serverId + '?transferStatusIdFK=' + mStatus, {
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
                            SystemLogModel.addItem(BaseResponce.getMessage())
                            let mData = JSON.parse(JSON.stringify(this.state.data))
                            if (mStatus == 2) {
                                mData.complaintStatus = 'Assigned'
                            } else {
                                mData.complaintStatus = 'Cancel'
                            }

                            mData.isTransferred = false
                            if (mData.assignedUsers) {
                                mData.assignedUsers = []
                            }
                            if (mData.complaintImages) {
                                mData.complaintImages = []
                            }

                            ComplaintModel.updateItem(mData).then(result => {
                                console.log(JSON.stringify(result));
                                this.props.dataChanged({ isUpdated: true, type: 'complaint' });
                                this.props.dataChanged({ isUpdated: false, type: 'complaint' });
                                this.getData();
                            });
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

    render() {
        var progressBar = <View></View>;
        if (this.state.animating) {
            progressBar = (
                <View style={{ height: '100%', alignContent: 'center', justifyContent: 'center' }}>
                    {this.state.animating ? <Loader animating={this.state.animating} /> : null}
                </View>

            )
        }

        var btn = <View style={{ padding: 10 }}>
            <Button
                mode="contained"
                color='#0A8BCC'
                uppercase={false}
                style={styles.btn}
                disabled={this.state.animating}
                loading={this.state.animating}
                contentStyle={{ height: 50 }}
                onPress={() => { this.onClickHandler('action') }}  >Action</Button>
        </View>
        if (this.state.data != null && this.state.data.complaintStatus == 'Pending' && !this.state.data.isSubmitted) {
            btn = (
                <View style={{ padding: 10 }}>
                    <Button
                        mode="contained"
                        color='#0A8BCC'
                        uppercase={false}
                        style={styles.btn}
                        disabled={this.state.animating}
                        loading={this.state.animating}
                        contentStyle={{ height: 50 }}
                        onPress={() => { this.onClickHandler('cancel') }}  >Cancel Complaint</Button>
                </View>

            )
        } else if (this.state.data != null && (this.state.data.complaintStatus == 'Done' || this.state.data.complaintStatus == 'Cancel' || this.state.data.complaintStatus == 'Transfer')) {
            btn = (null)
        } else if (this.state.isFetching) {
            btn = (
                <View style={{ padding: 10, alignContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator
                        style={{ color: '#000' }}
                    />
                </View>
            )
        }

        var imageViewModel = <View></View>;
        if (this.state.visibleModel) {
            imageViewModel = (
                <View>
                    <ImageViewDialog
                        modalVisible={true}
                        index={this.state.index}
                        imageName={this.state.imageName}
                        onPress={(action, index) => this.onModelItemClickHandler(action, index)}
                        showMessage={(message) => this.showMessage(message)}
                    />
                </View>
            )
        }

        if (this.state.data != null && this.state.data.isTransferred) {
            btn = (
                <View style={{ padding: 10, flexDirection: 'row' }}>
                    <Button
                        mode="contained"
                        color='#0A8BCC'
                        uppercase={false}
                        style={[styles.btn, { flex: 1, marginRight: 2 }]}
                        disabled={this.state.animating}
                        loading={this.state.animating}
                        contentStyle={{ height: 50 }}
                        onPress={() => { this.onClickHandler('accept') }}  >Accept</Button>

                    <Button
                        mode="outlined"
                        color='#707070'
                        uppercase={false}
                        style={[styles.btn, { flex: 1, marginLeft: 2 }]}
                        disabled={this.state.animating}
                        loading={this.state.animating}
                        contentStyle={{ height: 50 }}
                        onPress={() => { this.onClickHandler('reject') }}  >Reject</Button>
                </View>
            )
        }
        var masterView = <View></View>;
        if (!this.state.animating && this.state.data != null) {
            masterView = (
                <View style={styles.container}>
                    <ScrollView style={{ flex: 1 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this.onRefresh.bind(this)}
                            />
                        }>
                        {this.state.data.complaintImages.length > 0 ? <Card style={[styles.detailContainer, { radius: 10, margin: 10 }]} elevation={5}>
                            <FlatList
                                keyboardShouldPersistTaps="always"
                                style={{ paddingLeft: 5, paddingRight: 5, marginBottom: 5 }}
                                data={this.state.data.complaintImages}
                                renderItem={({ item, index }) => {
                                    return <RowImage item={item} index={index} onPress={(mId) => this.onItemClickHandler(mId, index)} />;
                                }}
                                keyExtractor={(item, index) => index.toString()}
                                numColumns={3}
                            />
                        </Card>
                            : null
                        }
                        <Card style={[styles.detailContainer, { radius: 10, margin: 10 }]} elevation={5}>
                            <View >
                                <Text style={[styles.textLabel, { marginBottom: 5 }]}>Subject</Text>
                                <Text style={[styles.textContent, { marginBottom: 10 }]}>{this.state.data.title}</Text>
                                <Divider />
                                {this.state.data.message ?
                                    <View>
                                        <Text style={[styles.textLabel, { marginBottom: 5 }]}>Message</Text>
                                        <Text style={[styles.textContent, { marginBottom: 10 }]}>{this.state.data.message}</Text>
                                        <Divider />
                                    </View> : null}
                                <Text style={[styles.textLabel, { marginBottom: 5, marginTop: 10 }]}>Raised By</Text>
                                <Text style={[styles.textContent, { marginBottom: 10 }]}>{this.state.data.raisedBy} ({this.state.data.assignedByUserRole})</Text>
                                <Divider />
                                <Text style={[styles.textLabel, { marginBottom: 5, marginTop: 10 }]}>Status</Text>
                                <Text style={[styles.textContent, { marginBottom: 10 }]}>{this.state.data.complaintStatus}</Text>
                                {this.state.data.warning
                                    ? <View>
                                        <Divider />
                                        <Text style={[styles.textLabel, { marginBottom: 5, marginTop: 10 }]}>Warning</Text>
                                        <Text style={[styles.textContent, { marginBottom: 10, color: 'red' }]}>{this.state.data.warning}</Text>
                                    </View> : null
                                }
                                <Divider />
                                <Text style={[styles.textLabel, { marginBottom: 5 }]}>Asset Code</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={[styles.textContent, { marginBottom: 10, flex: 1 }]}>{this.state.data.assetCode}</Text>
                                    <Button
                                        mode="outlined"
                                        color='#707070'
                                        uppercase={false}
                                        style={{ marginRight: 4, flex: 1 }}
                                        contentStyle={{}}
                                        onPress={() => { this.onClickHandler('asset') }} >View Asset</Button>
                                </View>
                            </View>
                        </Card>
                        {(this.state.complaintTrack.length > 0)
                            ? <View style={{ padding: 0, backgroundColor: 'white', marginTop: 10, }}>
                                <Divider style={[{ marginLeft: 10, marginRight: 10 }]} />
                                <Text style={[styles.textContent, { padding: 10, marginLeft: 10 }]}>Activities :</Text>
                                <FlatList
                                    keyboardShouldPersistTaps="always"
                                    data={this.state.complaintTrack}
                                    renderItem={({ item, index }) => {
                                        return <RowComTrack item={item} index={index} onPress={(action) => this.onItemClickHandler(action, index)} />
                                    }}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </View> : null}
                    </ ScrollView>

                    {btn}
                </View>

            )
        }

        return (

            <View style={styles.container}>
                <View>
                    <Header onPress={() => { this.props.navigation.goBack(null) }}>{this.state.title}</Header>
                </View>
                {progressBar}
                {masterView}
                {imageViewModel}
                <View style={{ position: 'relative' }}>
                    <Snackbar
                        duration={Snackbar.DURATION_SHORT}
                        visible={this.state.snackVisible}
                        onDismiss={() => this.setState({ snackVisible: false, messageText: '' })}
                    >{this.state.messageText} </Snackbar>
                </View>
                <View>
                    <ConfirmDialog
                        title="Cancel"
                        message="Are you sure to cancel complaint?"
                        visible={this.state.dialogVisible}
                        onTouchOutside={() => this.setState({ dialogVisible: false })}
                        positiveButton={{
                            title: "YES",
                            onPress: () => this.cancelComplaint()
                        }}
                        negativeButton={{
                            title: "NO",
                            onPress: () => this.setState({ dialogVisible: false })
                        }}
                    />

                </View>
                <View>
                    <ProgressDialog
                        visible={this.state.progressVisible}
                        title="Fetching Data"
                        message="Please, wait..."
                    />
                </View>

            </View>
        )
    }
}

const mapStateToProps = (state) => {
    let isUpdated = state.DataReducer.isUpdated;
    return { isUpdated: isUpdated };
};

export default connect(mapStateToProps, { dataChanged })(ComplaintDetail);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
    },
    detailContainer: {
        padding: 10,
    },
    textBtn: {
        marginTop: 10,
        fontFamily: 'Barlow-Light',
        fontSize: 10,
    },
    btn: {
        marginTop: 10,
        fontFamily: 'Barlow-Medium',
        fontSize: 10,
    },
    textLabel: {
        color: '#C1C0C0',
        fontSize: 12,
        fontFamily: 'Barlow-Light',
    },
    textContent: {
        color: '#2D2D2D',
        fontFamily: 'Barlow-Regular',
        fontSize: 14
    },
    textTitle: {
        fontSize: 16,
        fontFamily: 'Barlow-Medium',
        color: '#646464'
    },
})