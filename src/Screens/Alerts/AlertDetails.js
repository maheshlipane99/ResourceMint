import React, { Component } from 'react'
import { View, FlatList, StyleSheet, ActivityIndicator, Platform, ScrollView, Image } from 'react-native'
import Loader from '../../Components/ProgressBar/Loader'
import SweetImage from '../../Components/Image/SweetImage'
import EmptyMessage from '../../Components/ProgressBar/EmptyMessage'
import AssetOptions from '../../Utils/AssetOptions'
import Navigation from '../../Service/Navigation'
import LocalStore from '../../Store/LocalStore'
import Header from '../../Components/ToolBar/Header'
import { Button, Text, Snackbar, Divider, Card } from 'react-native-paper';
import AlertModel from '../../Model/AlertModel';
import BackgroundService from '../../Service/BackgroundService'

class AlertDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: 'Alert Details',
            mToken: '',
            status: false,
            animating: true,
            isFetching: false,
            isLoto: true,
            alertId: props.navigation.state.params.alertId,
            data: null,
            auditMaint: [],
            options: AssetOptions,
            image: 'http://13.232.85.218/assetmate/admin/uploads/asset_images/Trolley_mounted_ABC.jpg'
        }

    }


    componentDidMount = () => {

        LocalStore.getToken().then(value => {
            this.setState({ mToken: value }, () => {
                this.getData()
                this.getServerData()
            });
        });

    }

    componentWillUnmount() {
        this.setState({ isFetching: false });
    }


    getData() {
        AlertModel.getItemById(this.state.alertId + "").then(result => {
            let mData = result.data
            if (mData) {
                console.log(mData);
                this.setState({ animating: false, data: mData });
                if (!mData.message) {
                    this.getServerData()
                }
            } else {
                this.setState({ animating: false, data: null, message: 'Something went wrong' });
                console.log(result.message);
            }

        })
    }

    getServerData = () => {
        console.log(this.state.alertId);
        this.setState({ animating: true });
        BackgroundService.getAlertsDetails(this.state.mToken, this.state.alertId).then((result) => {
            console.log(JSON.stringify(result));
            if (result && !result.data) {
                this.getData()
            } else {
                this.setState({ animating: false, data: null, message: 'Something went wrong' });
            }
        })
    }

    takeAction = () => {
        switch (this.state.data.masterIdType) {
            case 'asset': {
                Navigation.navigate('AssetDetail', { assetId: this.state.data.masterIdFK });
                break;
            }
            case 'task': {
                Navigation.navigate('TaskDetail', { complaintId: this.state.data.masterIdFK, serverId: this.state.data.masterIdFK });
                break;
            }
            case 'complaint': {
                Navigation.navigate('ComplaintDetail', { complaintId: this.state.data.masterIdFK, serverId: this.state.data.masterIdFK });
                break;
            }
            case 'doneChecklist': {
                Navigation.navigate('DoneChecklist', { doneChecklistId: this.state.data.masterIdFK });
                break;
            }
        }
    }

    onClickHandler(id) {
        switch (id) {
            case 'action': {
                if (this.state.data.masterIdFK) {
                    console.log(this.state.data.masterIdFK);
                    this.takeAction()
                }
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

        var massage = <View></View>;
        if (!this.state.animating && !this.state.data && this.state.message) {
            massage = (
                <View style={{ height: '100%', alignContent: 'center', justifyContent: 'center' }}>
                    <EmptyMessage>{this.state.message}</EmptyMessage>
                </View>

            )
        }

        var mImageView = <View></View>;
        if (this.state.data && this.state.data.alertImage) {
            mImageView = (
                <Card style={[styles.detailContainer, { radius: 10, margin: 10 }]} elevation={5}>
                    <SweetImage
                        resizeMode='contain'
                        showMessage
                        source={{ uri: this.state.data.alertImage }}
                        style={{ width: '100%', height: 200, marginTop: 0, marginBottom: 1 }} />
                </Card>
            )
        }



        var masterView = <View></View>;
        if (!this.state.animating && this.state.data != null) {
            masterView = (

                <ScrollView style={styles.container}>

                    {mImageView}
                    <Card style={[styles.detailContainer, { radius: 10, margin: 10 }]} elevation={5}>
                        <View >
                            <Text style={[styles.textLabel, { marginBottom: 5 }]}>Title</Text>
                            <Text style={[styles.textTitle, { marginBottom: 10 }]}>{this.state.data.alertTitle}</Text>
                            <Divider />
                            <Text style={[styles.textLabel, { marginBottom: 5 }]}>Message</Text>
                            <Text style={[styles.textContent, { marginBottom: 10 }]}>{this.state.data.message}</Text>
                            <Divider />
                        </View>
                    </Card>
                    {(this.state.data && this.state.data.masterIdType != '' && this.state.data.masterIdFK != '' && this.state.data.masterIdFK != 0) ?
                        <View style={{ padding: 10 }}>
                            <Button
                                mode="contained"
                                color='#0A8BCC'
                                uppercase={false}
                                style={styles.btn}
                                disabled={this.state.isFetching}
                                loading={this.state.isFetching}
                                contentStyle={{ height: 50 }}
                                onPress={() => { this.onClickHandler('action') }}  >{this.state.isFetching ? 'Wait...' : 'Take Action'}</Button>
                        </View>
                        : null}
                </ ScrollView>

            )
        }
        return (

            <View style={styles.container}>
                <View>
                    <Header onPress={() => { this.props.navigation.goBack(null) }}>{this.state.title}</Header>
                </View>
                {progressBar}
                {massage}
                {masterView}
            </View>
        )
    }
}
export default AlertDetails

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
        fontSize: 14,
        fontFamily: 'Barlow-SemiBold',
        color: '#2D2D2D'
    },
})