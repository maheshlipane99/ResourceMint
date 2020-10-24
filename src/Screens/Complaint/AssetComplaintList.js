import React, { Component } from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, RefreshControl } from 'react-native'
import Loader from '../../Components/ProgressBar/Loader'
import SearchInput from '../../Components/Input/SearchInput'
import { FAB } from 'react-native-paper';
import RowComplaint from '../Row/RowComplaint'
import Navigation from '../../Service/Navigation'
import LocalStore from '../../Store/LocalStore'
import Header from '../../Components/ToolBar/Header'
import BackgroundService from '../../Service/BackgroundService'
import ComplaintModel from '../../Model/ComplaintModel';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { dataChanged } from '../../Actions/DataChangedAction';
import { connect } from 'react-redux';
import FeaturesModel from '../../Model/FeaturesModel';
import { FEATURES } from '../../Utils/Const'


class AssetComplaintList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            assetCode: props.navigation.state.params.assetCode,
            assetId: props.navigation.state.params.assetId,
            title: 'Complaints',
            mToken: '',
            status: false,
            animating: true,
            showBtn: false,
            progressVisible: false,
            data: []
        }
    }


    componentDidMount = () => {
        this.initFeature()
        LocalStore.getToken().then(value => {
            this.setState({ mToken: value }, () => {
                this.getData(false)
                BackgroundService.startComplaintUploading(this.state.mToken).then(result => () => {
                    console.log(JSON.stringify(result));
                })
            });
        });
    }

    componentWillUnmount() {
        this.setState({ isFetching: false });
    }


    componentWillReceiveProps(nextProps) {

        console.log('state change' + JSON.stringify(nextProps));
        if (nextProps.isUpdated) {
            if (nextProps.type == 'complaint') {
                this.setState({ data: [] }, () => {
                    this.getData(false)
                });
            }

        }

    }

    initFeature = () => {
        FeaturesModel.getItemById(FEATURES.Complaint_Raise).then(result => {
            console.log(JSON.stringify(result));
            if (result.data) {
                this.setState({ showBtn: true });
            }
        })
    }

    getData = (check) => {
        ComplaintModel.getItemByAssetCode(this.state.assetCode).then(result => {
            console.log(JSON.stringify(result.data));
            if (result.data.length > 0) {
                let listData = this.state.data;
                let data = listData.concat(result.data)
                this.setState({ loading: false, data: result.data, mCount: result.mCount, message: '', animating: false })
            } else {
                if (this.state.data.length == 0) {
                    this.setState({ message: 'No Complaint', animating: false, loading: false, });
                    if (!check) {
                        this.getServerData()
                    }

                } else {
                    this.setState({ animating: false, loading: false, showButton: true });
                }
            }

        })
    }

    showAlert = (title, message) => {
        Alert.alert(title, message)
    }

    getServerData = () => {
        BackgroundService.getAssetComplaints(this.state.mToken, this.state.assetId, 1).then((result) => {
            console.log(JSON.stringify(result));
            if (result) {
                this.getData(true)
            }
        })
    }

    onRefresh() {
        this.setState({ isRefreshing: true, showButton: false, data: [] }, () => {
            ComplaintModel.getAllItemsByLimit(this.state.data.length).then(result => {
                console.log(JSON.stringify(result.data));
                if (result.data.length > 0) {
                    let listData = this.state.data;
                    let data = listData.concat(result.data)
                    this.setState({ isRefreshing: false, data: data, mCount: result.mCount, })
                } else {
                    if (this.state.data.length == 0) {
                        this.setState({ message: 'No Complaint', isRefreshing: false, });
                    } else {
                        this.setState({ isRefreshing: false, });
                    }
                }
            })
        });
        this.getServerData()
    }

    onItemClickHandler(id, index) {
        switch (id) {
            case 'rootView': {
                let mItem = this.state.data[index]
                console.log(JSON.stringify(mItem));

                if (mItem.isDraft) {
                    Navigation.navigate('RaiseComplaint');
                } else {
                    if (mItem.message) {
                        Navigation.navigate('ComplaintDetail', { complaintId: mItem.complaintId, serverId: 0 });
                    } else {
                        BackgroundService.getComplaintDetails(this.state.mToken, mItem.complaintId).then((result) => {
                            console.log(JSON.stringify(result));
                            if (result && result.message != '') {
                                Navigation.navigate('ComplaintDetail', { complaintId: mItem.complaintId, serverId: 0 });
                            }
                        })
                    }
                }

                break;
            }
        }
    }


    onClickHandler(id) {
        switch (id) {
            case 'adasd': {
                Navigation.openDrawer();
                break;
            }
            case 'add': {
                Navigation.navigate('AssetRaiseComplaint', { assetCode: this.state.assetCode });
                break;
            }
        }
    }

    search = (title) => {
        this.setState({ snackVisible: false, message1: '', searchKey: title })
        ComplaintModel.search(title + "").then(result => {
            let mData = result.data
            if (mData.length > 0) {
                console.log(mData);
                this.setState({ data: mData, message: '', animating: false, loading: false });
            } else {
                this.showMessage("No Such a Complaint Found")
                if (!title) {
                    this.setState({ isRefreshing: true, data: [], loading: true }, () => {
                        this.getData(false)
                    });
                }
                console.log(result.message);
            }
        })
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
        var emptyView = <View></View>;
        if (this.state.message && !this.state.animating) {
            emptyView = (
                <View style={{ height: '100%', alignContent: 'center', justifyContent: 'center' }}>
                    <Text style={[styles.text, { alignSelf: 'center' }]}>{this.state.message}</Text>
                </View>
            )
        }

        var masterView = <View></View>;
        if (!this.state.animating && this.state.message == '') {
            masterView = (
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <SearchInput onChangeText={text => this.search(text)}>Search </SearchInput>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            keyboardShouldPersistTaps="always"
                            style={{ paddingLeft: 5, paddingRight: 5 }}
                            data={this.state.data} refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefreshing}
                                    onRefresh={this.onRefresh.bind(this)}
                                />
                            }
                            renderItem={({ item, index }) => {
                                return <RowComplaint item={item} index={index} onPress={(action) => this.onItemClickHandler(action, index)} />;
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
                {progressBar}
                {emptyView}
                {masterView}
                {this.state.showBtn ? <FAB
                    style={styles.fab}
                    small={false}
                    icon={require('../../Assets/Plus/plus.png')}
                    onPress={() => this.onClickHandler('add')}
                /> : null}
                <ProgressDialog
                    visible={this.state.progressVisible}
                    title="Document Opening"
                    message="Please, wait..."
                />
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    let isUpdated = state.DataReducer.isUpdated;
    let type = state.DataReducer.type;
    return { isUpdated: isUpdated, type: type };
};

export default connect(mapStateToProps, { dataChanged })(AssetComplaintList);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#0A8BCC',
    },
})