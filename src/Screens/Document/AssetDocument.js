import React, { Component } from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native'
import Loader from '../../Components/ProgressBar/Loader'
import SearchView from '../../Components/Input/SearchInput'
import RowDocument from '../Row/RowDocument'
import Navigation from '../../Service/Navigation'
import LocalStore from '../../Store/LocalStore'
import Header from '../../Components/ToolBar/Header'
import BackgroundService from '../../Service/BackgroundService'
import DocumentModel from '../../Model/DocumentModel';
import { Snackbar } from 'react-native-paper';

class AssetDocument extends Component {

    constructor(props) {
        super(props);
        this.state = {
            assetId: props.navigation.state.params.assetId,
            categoryIdFK: props.navigation.state.params.categoryIdFK,
            title: 'Document',
            mToken: '',
            status: false,
            animating: true,
            progressVisible: false,
            data: []
        }
    }


    componentDidMount = () => {

        LocalStore.getToken().then(value => {
            this.setState({ mToken: value }, () => {
                this.getData()
                this.downloadCategoryDocument()
                this.downloadAssetDocument()
            });
        });
    }

    componentWillUnmount() {
        this.setState({ isFetching: false });
    }

    getData = () => {
        DocumentModel.getAllAssetDocument(this.state.assetId).then(result => {
            console.log(JSON.stringify(result.data));
            if (result.data && result.data.length > 0) {
                console.log(result.data.length);
                let listData = this.state.data;
                let data = listData.concat(result.data)
                this.setState({ data: result.data, message: '', animating: false });
            } else {
                if (this.state.data.length == 0) {
                    this.setState({ message: 'No Document Available', animating: false, });
                    this.getCatDocument()
                } else {
                    this.setState({ animating: false, });
                }
            }

        })


    }
    getCatDocument = () => {
        DocumentModel.getAllCategoryDocument(this.state.categoryIdFK).then(result => {
            console.log(JSON.stringify(result.data));
            if (result.data && result.data.length > 0) {
                console.log(result.data.length);
                let listData = this.state.data;
                let data = listData.concat(result.data)
                this.setState({ data: result.data, message: '', animating: false });
            } else {
                if (this.state.data.length == 0) {
                    this.setState({ message: 'No Document Available', animating: false, });
                } else {
                    this.setState({ animating: false, });
                }
            }

        })

    }

    downloadCategoryDocument = () => {
        BackgroundService.downloadCategoryDocument(this.state.mToken, this.state.categoryIdFK, 1).then((result) => {
            console.log(JSON.stringify(result));
            if (result) {
                this.getData()
            }
        })
    }


    downloadAssetDocument = () => {
        BackgroundService.downloadAssetDocument(this.state.mToken, this.state.assetId, 1).then((result) => {
            console.log(JSON.stringify(result));
            if (result) {
                this.getData()
            }
        })
    }

    searchADocument = (title) => {
        this.setState({ snackVisible: false, message1: '' })
        if (title) {
            DocumentModel.searchAssetDocument(title + "", this.state.categoryIdFK, 1).then(result => {
                let mData = result.data
                if (mData.length > 0) {
                    console.log(mData);
                    this.setState({ data: mData, message: '', animating: false });
                } 
            })

            DocumentModel.searchAssetDocument(title + "", this.state.assetId, 2).then(result => {
                let mData = result.data
                if (mData.length > 0) {
                    console.log(mData);
                    this.setState({ data: mData, message: '', animating: false });
                } 
            })
        } else {
            this.getData()
        }
    }

    showMessage(message) {
        this.setState({
            message1: message,
            snackVisible: true,
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


    onClickHandler(id) {
        switch (id) {
            case 'openDrawer': {
                Navigation.openDrawer();
                break;
            }
            case 'search': {
                Navigation.navigate('SearchDocument', { assetId: this.state.assetId, categoryIdFK: this.state.categoryIdFK });
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

                    <View style={{ flex: 1 }}>
                        <FlatList
                            keyboardShouldPersistTaps="always"
                            style={{ paddingLeft: 5, paddingRight: 5 }}
                            data={this.state.data}
                            renderItem={({ item, index }) => {
                                return <RowDocument item={item} index={index} onPress={(action) => this.onItemClickHandler(action, index)} />;
                            }}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
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
                <SearchView onChangeText={text => this.searchADocument(text)}>Search Document</SearchView>
                {progressBar}
                {emptyView}
                {masterView}
            </View>
        )
    }
}
export default AssetDocument

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