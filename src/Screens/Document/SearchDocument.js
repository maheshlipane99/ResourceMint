import React, { Component } from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native'
import Loader from '../../Components/ProgressBar/Loader'
import RowSearchDocument from '../Row/RowSearchDocument'
import Navigation from '../../Service/Navigation'
import LocalStore from '../../Store/LocalStore'
import Header from '../../Components/ToolBar/Header'
import BackgroundService from '../../Service/BackgroundService'
import DocumentModel from '../../Model/DocumentModel';
import { Card, TextInput, Button, Snackbar } from 'react-native-paper';
import { rgba } from 'polished'

var RNFS = require('react-native-fs');
var SavePath = Platform.OS === 'ios' ? RNFS.MainBundlePath : RNFS.DocumentDirectoryPath;
import FileViewer from 'react-native-file-viewer';

class SearchDocument extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: 'Search Document',
            assetId: props.navigation.state.params.assetId,
            categoryIdFK: props.navigation.state.params.categoryIdFK,
            mToken: '',
            status: false,
            animating: true,
            progressVisible: false,
            assetCode: '',
            data: []
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
        DocumentModel.getAllCategoryDocument(this.state.categoryIdFK).then(result => {
            console.log(JSON.stringify(result.data));
            if (result.data != null) {
                this.setState({ data: result.data, message: '', animating: false });
            } else {
                this.setState({ message: 'No Document Available', animating: false, title: '' });
            }

        })
    }


    showAlert = (title, message) => {
        Alert.alert(title, message)
    }


    onRefresh() {
        this.getData();
        this.setState({ isFetching: false });
    }

    onItemClickHandler(id, index) {
        switch (id) {
            case 'rootView': {
                let documentCode = this.state.data[index].documentCode
                Navigation.navigate('DocumentDetail', { documentCode: documentCode });
                break;
            }
        }
    }

    showMessage(message) {
        this.setState({
            message1: message,
            snackVisible: true,
        })
    }

    onClickHandler(id) {
        switch (id) {
            case 'openDrawer': {
                Navigation.openDrawer();
                break;
            }
            case 'search': {
                if (this.state.assetCode) {
                    this.checkAssetOffline(this.state.assetCode);
                } else {
                    this.showMessage('Enter Document Name');
                }
                break;
            }
        }
    }

    searchAsset = (assetCode) => {
        this.setState({ snackVisible: false, message1: '' })
        DocumentModel.searchAsset(assetCode + "").then(result => {
            let mData = result.data
            if (mData.length > 0) {
                console.log(mData);
                this.setState({ data: mData, message: '', animating: false });
            } else {
                this.showMessage("No Such a Document Found")
                console.log(result.message);
            }
        })
    }

    checkAssetOffline = (assetCode) => {
        this.setState({ snackVisible: false, message1: '' })
        DocumentModel.getItemByAssetCode(assetCode + "").then(result => {
            let mData = result.data
            if (mData) {
                console.log(mData);
                this.goNext(mData);
                RecentAssetModel.addItem(mData)
            } else {
                this.showMessage("No Such a Document Found")
                console.log(result.message);
            }
        })
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


    goNext = (data) => {
        if (data != null) {
            console.log(JSON.stringify(data));
            Navigation.navigate('AssetDetail', { data });
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

                    <Card style={{ flex: 1, margin: 10, backgroundColor: 'white', radius: 10, padding: 15, borderColor: '#E9E6E5' }} elevation={5}>
                        <TextInput
                            label='Enter Document Name'
                            autoCapitalize='none'
                            underlineColor='#707070'
                            style={[styles.input, {}]}
                            onChangeText={text => this.searchAsset(text)}
                        />
                        <Text style={styles.textLight}>Type name to get asset document.</Text>
                        <FlatList
                            keyboardShouldPersistTaps="always"
                            style={{ paddingLeft: 5, paddingRight: 5 }}
                            data={this.state.data}
                            renderItem={({ item, index }) => {
                                return <RowSearchDocument item={item} index={index} onPress={(action) => this.onItemClickHandler(action, index)} />;
                            }}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </Card>
                    {/* <Button
                        mode="contained"
                        color='#0A8BCC'
                        uppercase={false}
                        style={{ marginBottom: 10, marginLeft: 10, marginRight: 10 }}
                        disabled={this.state.isFetching}
                        loading={this.state.isFetching}
                        contentStyle={{ height: 45 }}
                        onPress={() => { this.onClickHandler('search') }}  >{this.state.isFetching ? 'Wait...' : 'Get Document'}</Button> */}

                    <View style={{ position: 'relative' }}>
                        <Snackbar
                            duration={Snackbar.DURATION_SHORT}
                            visible={this.state.snackVisible}
                            onDismiss={() => this.setState({ snackVisible: false, message1: '' })}
                        >{this.state.message1} </Snackbar>
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
            </View>
        )
    }
}
export default SearchDocument

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
    input: {
        backgroundColor: rgba('#FFFFFF', 0),
        fontFamily: 'Barlow-Regular'
    },
    textLight: {
        fontSize: 12,
        marginTop: 10,
        fontFamily: 'Barlow-Light',
        color: '#707070'
    },
})