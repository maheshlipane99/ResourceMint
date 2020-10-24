import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Text, Platform } from 'react-native';

import Header from '../../Components/ToolBar/Header'
import LocalStore from '../../Store/LocalStore'
import Navigation from '../../Service/Navigation';
import Loader from '../../Components/ProgressBar/Loader'
import RowAnswer from '../Row/RowAnswer';
import DoneChecklistModel from '../../Model/DoneChecklistModel';
import BackgroundService from '../../Service/BackgroundService'
import { Button, Snackbar, Divider, Card } from 'react-native-paper';
import ChekImageModel from '../../Model/ChekImageModel';
import ImageViewDialog from '../../Components/DialogBox/ImageViewDialog'

import Share from 'react-native-share';
var RNFS = require('react-native-fs');
var SavePath = Platform.OS === 'ios' ? RNFS.MainBundlePath : RNFS.DocumentDirectoryPath;
import { ProgressDialog } from 'react-native-simple-dialogs';

class DoneChecklist extends Component {

    constructor(props) {
        super(props);
        this.state = {
            doneChecklistId: props.navigation.state.params.doneChecklistId,
            isConnected: false,
            title: 'Checklist',
            currentPosition: 0,
            answers: [],
            message: '',
            isFeatching: true,
            snackVisible: false,
            doneChecklistIdFk: 0,
            checkTitle: '',
            isSubmitted: false,
            onDate: '',
            assetIdFK: 0
        }
    }

    componentDidMount = () => {

        LocalStore.getToken().then(value => {
            this.setState({ mToken: value }, () => {
                this.loadChecklist()
            });
        });


    }

    showMessage(message) {
        this.setState({
            message1: message,
            snackVisible: true,
        })
    }




    loadChecklist = () => {
        console.log('Id ' + this.state.doneChecklistId);
        DoneChecklistModel.getItemById(this.state.doneChecklistId).then((result) => {
            console.log(JSON.stringify(result.data));
            let data = result.data
            if (data) {
                this.setState({ data: data.answers, assetIdFK: data.assetIdFK, checkTitle: data.title, isSubmitted: data.isSubmitted, doneBy: data.doneBy, onDate: data.doneOn, isFeatching: false, });
            } else {
                BackgroundService.getDoneChecklist(this.state.mToken, this.state.doneChecklistId).then((result) => {
                    if (result) {
                        this.loadChecklist()
                    }
                })
            }

        })
    }

    checkImage = (mImageId, check) => {
        ChekImageModel.getItemById(mImageId + "").then(result => {
            let mData = result.data
            if (mData && mData.checklistImage) {
                console.log(mData);
                this.setState({ visibleModel: true, imageName: mData.checklistImage });
            } else {
                if (!check) {
                    BackgroundService.getChecklistImage(this.state.mToken, mImageId).then((result) => {
                        console.log(JSON.stringify(result));
                        this.checkImage(mImageId, true)
                    })
                } else {
                    this.showMessage("No Image Found")
                }
                console.log(result.message)
            }
        })
    }

    onItemClickHandler(id, index) {
        switch (id) {
            case 'viewPhoto': {
                let mItem = this.state.data[index]
                this.checkImage(mItem.answer, false)
                break;
            }

        }
    }

    onClickHandler(id) {
        switch (id) {
            case 'viewAssset': {
                Navigation.navigate('AssetDetail', { assetId: this.state.assetIdFK });
                break;
            }

            case 'cancel': {
                this.viewPager && this.viewPager.setPage(0);
                break;
            }

        }

    }

    onModelItemClickHandler = (id, data) => {
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
                            let message='*'+this.state.data.title+'*'
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
                                    let message='*'+this.state.data.title+'*'
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


    render() {

        var imageViewModel = <View></View>;
        if (this.state.visibleModel) {
            imageViewModel = (
                <View>
                    <ImageViewDialog
                        modalVisible={true}
                        index={0}
                        imageName={this.state.imageName}
                        onPress={(action, index) => this.onModelItemClickHandler(action, index)}
                        showMessage={(message) => this.showMessage(message)}
                    />
                </View>
            )
        }

        var emptyView = <View></View>;
        if (this.state.message && !this.state.isSubmitted) {
            emptyView = (
                <View style={{ height: '100%', alignContent: 'center', justifyContent: 'center' }}>
                    <Text style={[styles.text, { alignSelf: 'center' }]}>{this.state.message}</Text>
                </View>
            )
        }

        var progressBar = <View></View>;
        if (this.state.isFeatching) {
            progressBar = (
                <View style={{ height: '100%', alignContent: 'center', justifyContent: 'center' }}>
                    {this.state.isFeatching ? <Loader animating={this.state.isFeatching} /> : null}
                </View>

            )
        }

        var masterView = <View></View>;
        if (!this.state.animating && this.state.message == '') {
            masterView = (
                <View style={{ flex: 1, flexDirection: 'column' }}>

                    <View style={{ flex: 1 }}>
                        <Card style={[styles.detailContainer, { radius: 10, margin: 10, padding: 10 }]} elevation={5}>
                            <View >
                                <Text style={[styles.textLabel, { marginBottom: 5 }]}>Title</Text>
                                <Text style={[styles.textTitle, { marginBottom: 10 }]}>{this.state.checkTitle}</Text>
                                <Divider />
                                <Text style={[styles.textLabel, { marginBottom: 5 }]}>Done By</Text>
                                <Text style={[styles.textTitle, { marginBottom: 10 }]}>{this.state.doneBy}</Text>
                                <Divider />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                    <View>
                                        <Text style={[styles.textLabel, { marginBottom: 5 }]}>Status</Text>
                                        <Text style={[styles.textContent, { marginBottom: 10 }]}>{this.state.isSubmitted ? 'Submitted' : 'Pending'}</Text>
                                    </View>
                                    <View>
                                        <Text style={[styles.textLabel, { marginBottom: 5 }]}>Done On</Text>
                                        <Text style={[styles.textContent, { marginBottom: 10 }]}>{this.state.onDate}</Text>
                                    </View>
                                    <View style={{ paddingRight: 10, alignSelf: 'center' }}>
                                        <Button
                                            mode="contained"
                                            color='#0A8BCC'
                                            uppercase={false}
                                            loading={false}
                                            disabled={false}
                                            style={{ alignSelf: 'center' }}
                                            contentStyle={{}}
                                            onPress={() => { this.onClickHandler('viewAssset') }} > View Asset </Button>
                                    </View>
                                </View>
                            </View>
                        </Card>
                        <FlatList
                            keyboardShouldPersistTaps="always"
                            style={{ paddingLeft: 5, paddingRight: 5 }}
                            data={this.state.data}
                            renderItem={({ item, index }) => {
                                return <RowAnswer item={item} index={index} onPress={(action) => this.onItemClickHandler(action, index)} />;
                            }}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        <View style={{ position: 'relative' }}>
                            <Snackbar
                                duration={Snackbar.DURATION_SHORT}
                                visible={this.state.snackVisible}
                                onDismiss={() => this.setState({ snackVisible: false, message1: '' })}
                            >{this.state.message1} </Snackbar>
                        </View>
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
                {imageViewModel}
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

export default DoneChecklist;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        flex: 1,
    },
    textCount: {
        fontSize: 14,
        fontFamily: 'Barlow-Regular',
        textAlign: 'center',
        color: 'white',
        alignItems: 'center',
        backgroundColor: 'transparent',
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