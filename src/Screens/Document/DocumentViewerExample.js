import React, { Component } from 'react';
import {
    View,
    Platform,
    Button,
    Alert,
    ActivityIndicator,
    Text
} from 'react-native';
var RNFS = require('react-native-fs');
var SavePath = Platform.OS === 'ios' ? RNFS.MainBundlePath : RNFS.DocumentDirectoryPath;
import FileViewer from 'react-native-file-viewer';
import { ProgressDialog } from 'react-native-simple-dialogs';
const url = 'https://www.sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4';

export default class DocumentViewerExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progressVisible: false,
            message: 'Test'
        }
    }

    componentDidMount() {


    }

    componentWillUnmount() {

    }

    downloadOpenFile = (url) => {
        this.setState({ animating: true, message: 'start' });
        var filename = url.split('/').pop()
        var extension = url.split('.').pop().split(/\#|\?/)[0]
        const localFile = `${SavePath}/${filename}.${extension}`
        const options = {
            fromUrl: url,
            toFile: localFile
        };
        RNFS.downloadFile(options).promise
            .then(() => FileViewer.open(localFile))
            .then(() => {
                // success
                this.setState({ animating: false, message: 'success' });
            })
            .catch(error => {
                // error
                this.setState({ animating: false, message: 'error' });
            });
    }

    openFile = (url) => {
        this.setState({ progressVisible: true });
        var filename = url.split('/').pop()
        var extension = url.split('.').pop().split(/\#|\?/)[0]
        const localFile = `${SavePath}/${filename}.${extension}`
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
        return (
            <View>

                <Button
                    onPress={() => this.openFile(url)}
                    title="Direct Open"
                    accessibilityLabel="See a Document"
                />
                <ProgressDialog
                    visible={this.state.progressVisible}
                    title="Document Opening"
                    message="Please, wait..."
                />
                <Text>{this.state.message}</Text>


            </View>

        )
    }
}