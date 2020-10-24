import React, { Component } from 'react'
import { View, FlatList, StyleSheet, ActivityIndicator, Platform, ScrollView, Image } from 'react-native'
import Loader from '../../Components/ProgressBar/Loader'
import Navigation from '../../Service/Navigation'
import LocalStore from '../../Store/LocalStore'
import Header from '../../Components/ToolBar/Header'
import { Card, } from 'react-native-paper';
import { Button, Text, Snackbar, Divider } from 'react-native-paper';
import DocumentModel from '../../Model/DocumentModel';
import ImageViewDialog from '../../Components/DialogBox/ImageViewDialog'
import { dataChanged } from '../../Actions/DataChangedAction';
import { connect } from 'react-redux';
import BackgroundService from '../../Service/BackgroundService'

var RNFS = require('react-native-fs');
var SavePath = Platform.OS === 'ios' ? RNFS.MainBundlePath : RNFS.DocumentDirectoryPath;
import FileViewer from 'react-native-file-viewer';
import { ProgressDialog } from 'react-native-simple-dialogs';

class DocumentDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: 'Document Details',
            mToken: '',
            visibleModel: false,
            animating: true,
            isFetching: false,
            progressVisible: false,
            dialogVisible: false,
            documentCode: props.navigation.state.params.documentCode,
            data: null,
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
        DocumentModel.getItemById(this.state.documentCode + "").then(result => {
            let mData = result.data
            if (mData) {
                console.log(JSON.stringify(mData));
                this.setState({ animating: false, data: mData }, () => {

                });

            } else {
                this.showMessage("Invalid Document")
                console.log(result.message);
            }
        })
    }


    getServerData = () => {
        console.log(this.state.documentCode);
        BackgroundService.getDocumentDetail(this.state.mToken, this.state.documentCode).then((result) => {
            console.log(JSON.stringify(result));
            if (result && !result.data) {
                this.getData()
            } else {
                this.setState({ animating: false, data: null, message: 'No document found' });
            }
        })
    }

    onRefresh() {
        this.getData();
        this.setState({ isFetching: false });
    }



    onClickHandler(id) {
        switch (id) {
            case 'view': {
                let url = this.state.data.documateFile
                this.openFile(url)
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

    showMessage(message) {
        this.setState({
            messageText: message,
            snackVisible: true,
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

        var btn = <View style={{ padding: 10 }}>
            <Button
                mode="contained"
                color='#0A8BCC'
                uppercase={false}
                style={styles.btn}
                disabled={this.state.animating}
                loading={this.state.animating}
                contentStyle={{ height: 50 }}
                onPress={() => { this.onClickHandler('view') }}  >View Document</Button>
        </View>


        var masterView = <View></View>;
        if (!this.state.animating && this.state.data != null) {
            masterView = (
                <View style={styles.container}>
                    <ScrollView style={{ flex: 1, margin: 10 }}>

                        <View style={{ backgroundColor: 'white', borderRadius: 10, borderColor: '#E9E6E5', borderWidth: 1 }}>
                            <View style={{ flexDirection: 'column', flex: 1, padding: 10 }}>
                                <View style={{ backgroundColor: 'white', flexDirection: 'row', }}>
                                    <View style={{ alignSelf: 'center', alignItems: 'center', marginRight: 10, }}>
                                        <Image source={require('../../Assets/AssetOption/archive.png')} style={styles.backImage} />
                                        {this.state.data.documateFile ? <Text style={styles.textDocument} >{this.state.data.documateFile.split('.').pop().split(/\#|\?/)[0]} </Text> : null}
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.textHeader} >{this.state.data.documateTitle}</Text>
                                        <Text style={styles.textType} >{this.state.data.documentType} Document</Text>
                                        <Divider />
                                        <Text style={styles.textDescription} >{this.state.data.description}</Text>
                                    </View>
                                </View>
                                <Text style={styles.textDate} >{new Date(this.state.data.updatedOn).toDateString()}</Text>
                            </View>
                        </View>
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
                <ProgressDialog
                    visible={this.state.progressVisible}
                    title="Document Opening"
                    message="Please, wait..."
                />
                <View style={{ position: 'relative' }}>
                    <Snackbar
                        duration={Snackbar.DURATION_SHORT}
                        visible={this.state.snackVisible}
                        onDismiss={() => this.setState({ snackVisible: false, messageText: '' })}
                    >{this.state.messageText} </Snackbar>
                </View>

            </View>
        )
    }
}

const mapStateToProps = (state) => {
    let isUpdated = state.DataReducer.isUpdated;
    return { isUpdated: isUpdated };
};

export default connect(mapStateToProps, { dataChanged })(DocumentDetail);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
    },
    btn: {
        marginTop: 10,
        fontFamily: 'Barlow-Medium',
        fontSize: 10,
    },
    textHeader: {
        color: '#707070',
        fontFamily: 'Barlow-Medium',
        fontSize: 16,
        padding: 0,
        alignSelf: 'flex-start'

    },
    textType: {
        color: '#A59F9D',
        fontFamily: 'Barlow-Light',
        fontSize: 12,
        marginBottom: 3,
        alignSelf: 'flex-start'

    },
    textDocument: {
        color: '#A59F9D',
        fontFamily: 'Barlow-Light',
        fontSize: 12,
        marginBottom: 3,

    },
    textDescription: {
        color: '#A59F9D',
        fontFamily: 'Barlow-Light',
        fontSize: 12,
        marginTop: 5,
        alignSelf: 'flex-start'

    },
    textDate: {
        width: '100%',
        color: '#C686D8',
        fontFamily: 'Barlow-Light',
        fontSize: 12,
        padding: 0,
        textAlign: 'right',
        alignSelf: 'flex-start'

    },
    backImage: {
        width: 24,
        height: 24,
        resizeMode: "center",
    },
})