import React, { Component } from 'react'
import { View, FlatList, StyleSheet, ActivityIndicator, Platform, ScrollView, Image } from 'react-native'
import Loader from '../../Components/ProgressBar/Loader'
import RowAssetOption from '../Row/RowAssetOption'
import AssetOptions from '../../Utils/AssetOptions'
import SweetImage from '../../Components/Image/SweetImage'
import { BASE_URL } from '../../Utils/Const'
import Navigation from '../../Service/Navigation'
import LocalStore from '../../Store/LocalStore'
import Header from '../../Components/ToolBar/Header'
import { Card, } from 'react-native-paper';
import { Button, TextInput, Text, Snackbar, Divider } from 'react-native-paper';
import AssetModel from '../../Model/AssetModel';
import AssetPositionModel from '../../Model/AssetPositionModel';
import BackgroundService from '../../Service/BackgroundService'

var RNFS = require('react-native-fs');
var SavePath = Platform.OS === 'ios' ? RNFS.MainBundlePath : RNFS.DocumentDirectoryPath;
import FileViewer from 'react-native-file-viewer';

import RNLocation from 'react-native-location';

class AssetDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: 'Asset Details',
            mToken: '',
            status: false,
            animating: true,
            isFetching: false,
            progressVisible: false,
            isLoading: false,
            isLoto: true,
            assetId: props.navigation.state.params.assetId,
            data: null,
            options: AssetOptions,
            latitude: '',
            longitude: ''
        }

    }


    componentDidMount = () => {
        LocalStore.getToken().then(value => {
            this.setState({ mToken: value }, () => {
                this.getData()
                this.checkLastPosition()
            });
        });
    }

    componentWillUnmount() {
        this.setState({ isFetching: false });
    }


    getData() {
        AssetModel.getItemById(this.state.assetId + "").then(result => {
            let mData = result.data
            if (mData) {
                console.log(mData);
                this.setState({ animating: false, data: mData });
            } else {
                this.showMessage("Invalid Asset Code")
                console.log(result.message);

            }
        })
    }

    checkLastPosition = () => {
        AssetPositionModel.getItemById(this.state.assetId + "").then(result => {
            let mData = result.data
            if (mData) {
                console.log(mData);
                this.setState({ showBtn: false });
            } else {
                this.setState({ showBtn: true });
                console.log(result.message);
            }
        })
    }

    getLocation = () => {
        this.setState({ isLoading: true });
        RNLocation.configure({
            distanceFilter: 5.0
        })
        RNLocation.requestPermission({
            ios: "whenInUse",
            android: {
                detail: "coarse"
            }
        }).then(granted => {
            if (granted) {
                this.locationSubscription = RNLocation.subscribeToLocationUpdates(locations => {
                    /* Example location returned
                    {
                      speed: -1,
                      longitude: -0.1337,
                      latitude: 51.50998,
                      accuracy: 5,
                      heading: -1,
                      altitude: 0,
                      altitudeAccuracy: -1
                      floor: 0
                      timestamp: 1446007304457.029,
                      fromMockProvider: false
                    }
                    */
                    let mData = locations[0]
                    console.log(JSON.stringify(locations));
                    this.setState({ isLoading: false, latitude: mData.latitude, longitude: mData.longitude, showBtn: false }, () => {
                        this.setLocation()
                    });

                })
            }
        })

    }

    setLocation = () => {
        let location = {
            assetId: this.state.assetId,
            latitude: this.state.latitude + '',
            longitude: this.state.longitude + '',
        }

        AssetPositionModel.addItem(location).then(result => {
            let mData = result
            console.log(mData);
            if (mData && mData.data) {
                this.checkLastPosition()
                BackgroundService.getCheckMark(this.state.mToken);
            }
        })
    }

    onRefresh() {
        this.getData();
        this.setState({ isFetching: false });
    }

    onItemClickHandler(id, index) {
        switch (id) {
            case 0: {
                let route = this.state.options[index].route
                Navigation.navigate(route, { assetId: this.state.data.assetId, categoryIdFK: this.state.data.categoryId });
                break;
            }

            case 1: {
                let route = this.state.options[index].route
                Navigation.navigate(route, { assetId: this.state.data.assetId });
                break;
            }
            case 2: {

                let route = this.state.options[index].route
                console.log(route);
                Navigation.navigate(route, { assetId: this.state.data.assetId, categoryIdFK: this.state.data.categoryId });
                break;
            }
            case 3: {
                let route = this.state.options[index].route
                Navigation.navigate(route, { assetCode: this.state.data.assetCode, assetId: this.state.data.assetId });
                break;
            }
            case 4: {
                // let route = this.state.options[index].route
                // Navigation.navigate(route, { assetCode: this.state.data.assetCode });
                break;
            }
            case 5: {
                let route = this.state.options[index].route
                Navigation.navigate(route, { assetId: this.state.data.assetId });
                break;
            }
            case 6: {
                let route = this.state.options[index].route
                // Navigation.navigate(route, { url: this.state.data.userGuide });
                if (this.state.data.userGuide) {
                    this.openFile(this.state.data.userGuide)
                }

                break;
            }
        }
    }


    onClickHandler(id) {
        console.log(id);

        switch (id) {
            case 'loto': {
                Navigation.navigate('WebScreen', { url: this.state.data.userGuide });
                break;
            }
            case 'audit': {
                Navigation.navigate('Question', { categoryId: this.state.data.categoryId, assetId: this.state.data.assetId, assetmentTypeId: 1 });
                break;
            }
            case 'maintenance': {
                Navigation.navigate('Question', { categoryId: this.state.data.categoryId, assetId: this.state.data.assetId, assetmentTypeId: 2 });
                break;
            }
            case 'check': {
                this.getLocation()
                break;
            }
        }
    }

    openFile = (url) => {
        this.setState({ progressVisible: true });
        var filename = url.split('/').pop()
        var extension = url.split('.').pop().split(/\#|\?/)[0]
        //  const localFile = `${SavePath}/${filename}.${extension}`
        const localFile = `${SavePath}/${filename}`
        RNFS.exists(localFile)
            .then((exists) => {
                if (exists) {
                    FileViewer.open(localFile, { showOpenWithDialog: true })
                        .then(() => {
                            // success
                            this.setState({ progressVisible: false });
                        })
                        .catch(error => {
                            // error
                            this.setState({ progressVisible: false });
                        });
                } else {
                    const options = {
                        fromUrl: url,
                        toFile: localFile
                    };
                    RNFS.downloadFile(options).promise
                        .then(() => FileViewer.open(localFile))
                        .then(() => {
                            // success
                            this.setState({ progressVisible: false });
                        })
                        .catch(error => {
                            // error
                            this.setState({ progressVisible: false });
                        });
                }
            });


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
        if (!this.state.animating && this.state.data != null) {
            masterView = (
                <ScrollView style={styles.container}>
                    <Card style={[styles.detailContainer, { radius: 10, margin: 10 }]} elevation={5}>
                        <SweetImage
                            resizeMode='contain'
                            source={{ uri: this.state.data.assetImage }}
                            showMessage
                            style={{ width: '100%', height: 200, marginTop: 0, marginBottom: 1 }} />
                    </Card>
                    <Card style={[styles.detailContainer, { radius: 10, margin: 10 }]} elevation={5}>
                        <View >
                            <Text style={[styles.textLabel, { marginBottom: 5 }]}>Asset Code</Text>
                            <Text style={[styles.textContent, { marginBottom: 10 }]}>{this.state.data.assetCode}</Text>
                            <Divider />
                            <Text style={[styles.textLabel, { marginBottom: 5 }]}>Company Asset Number</Text>
                            <Text style={[styles.textContent, { marginBottom: 10 }]}>{this.state.data.companyAssetNo}</Text>
                            <Divider />
                            <Text style={[styles.textLabel, { marginBottom: 5 }]}>Asset Title</Text>
                            <Text style={[styles.textContent, { marginBottom: 10 }]}>{this.state.data.assetTitle}</Text>
                            <Divider />
                            <Text style={[styles.textLabel, { marginBottom: 5 }]}>Model Number</Text>
                            <Text style={[styles.textContent, { marginBottom: 10 }]}>{this.state.data.modelNumber}</Text>
                            <Divider />
                            <Text style={[styles.textLabel, { marginBottom: 5, marginTop: 10 }]}>Description</Text>
                            <Text style={[styles.textContent, { marginBottom: 10 }]}>{this.state.data.description}</Text>
                            {this.state.data.message
                                ? <View>
                                    <Divider />
                                    <Text style={[styles.textLabel, { marginBottom: 5, marginTop: 10 }]}>Warning</Text>
                                    <Text style={[styles.textContent, { marginBottom: 10, color: 'red' }]}>{this.state.data.message}</Text>
                                </View> : null
                            }
                        </View>
                    </Card>

                    <FlatList
                        keyboardShouldPersistTaps="always"
                        style={{ paddingLeft: 5, paddingRight: 5, marginBottom: 5 }}
                        data={this.state.options}
                        renderItem={({ item, index }) => {
                            return <RowAssetOption item={item} index={index} onPress={(mId) => this.onItemClickHandler(mId, index)} />;
                        }}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={3}
                    />
                    {this.state.showBtn ?
                        <View style={{ padding: 10 }}>
                            <Button
                                mode="contained"
                                color='#0A8BCC'
                                uppercase={false}
                                style={styles.btn}
                                disabled={this.state.isLoading}
                                loading={this.state.isLoading}
                                contentStyle={{ height: 50 }}
                                onPress={() => { this.onClickHandler('check') }}  >{this.state.isLoading ? 'Location featching...' : 'Check Out'}</Button>
                        </View> : null}
                </ ScrollView>
            )
        }

        return (

            <View style={styles.container}>
                <View>
                    <Header onPress={() => { this.props.navigation.goBack(null) }}>{this.state.title}</Header>
                </View>
                {progressBar}
                {masterView}
            </View>
        )
    }
}
export default AssetDetail

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