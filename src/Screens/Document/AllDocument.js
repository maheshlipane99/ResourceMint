import React, { Component } from 'react'
import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator, RefreshControl } from 'react-native'
import Loader from '../../Components/ProgressBar/Loader'
import SearchView from '../../Components/Input/SearchInput'
import RowDocument from '../Row/RowDocument'
import Navigation from '../../Service/Navigation'
import LocalStore from '../../Store/LocalStore'
import Header from '../../Components/ToolBar/Header'
import BackgroundService from '../../Service/BackgroundService'
import DocumentModel from '../../Model/DocumentModel';
import { Snackbar, FAB } from 'react-native-paper';

class AllDocument extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: 'Document',
            mToken: '',
            status: false,
            animating: true,
            progressVisible: false,
            mCount: 0,
            searchKey: '',
            data: []
        }
    }


    componentDidMount = () => {

        LocalStore.getToken().then(value => {
            this.setState({ mToken: value }, () => {
                this.getData()
                this.downloadAllDocument()
            });
        });
    }

    componentWillUnmount() {
        this.setState({ isFetching: false });
    }

    getData = () => {
        if (this.state.searchKey == '') {
            DocumentModel.getAllItemsByLimit(this.state.data.length).then(result => {
                console.log(JSON.stringify(result.data));
                if (result.data.length > 0) {
                    let listData = this.state.data;
                    let data = listData.concat(result.data)
                    this.setState({ loading: false, data: data, mCount: result.mCount, message: '', animating: false, isRefreshing: false })
                } else {
                    if (this.state.data.length == 0) {
                        this.setState({ message: 'No Document Available', animating: false, loading: false, isRefreshing: false });
                    } else {
                        this.setState({ animating: false, loading: false, });
                    }
                }

            })
        }
    }

    downloadAllDocument = () => {
        BackgroundService.downloadAllDocument(this.state.mToken, 1).then((result) => {
            console.log(JSON.stringify(result));
            if (result) {
                this.getData()
            }
        })
    }



    showAlert = (title, message) => {
        Alert.alert(title, message)
    }



    renderFooter = () => {
        //it will show indicator at the bottom of the list when data is loading otherwise it returns null
        if (!this.state.loading) return null;
        return (
            <ActivityIndicator
                style={{ color: '#000' }}
            />
        );
    };

    handleLoadMore = () => {
        console.log('fetch more');
        if (!this.state.loading) {
            this.getData()
        }
    };


    onRefresh() {
        this.setState({ isRefreshing: true, showButton: false, data: [] }, () => {
            this.getData()
        });
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

    returnData = (data) => {
        console.log(JSON.stringify(data));
        if (data.assetCode) {
            let documentCode = data.assetCode
            Navigation.navigate('DocumentDetail', { documentCode: documentCode });
        }
    }

    onClickHandler(id) {
        switch (id) {
            case 'openDrawer': {
                Navigation.openDrawer();
                break;
            }
            case 'search': {
                //   Navigation.navigate('SearchDocument', { assetId: this.state.assetId, categoryIdFK: this.state.categoryIdFK });
                break;
            }
            case 'scan': {
                Navigation.navigate('GetCode', { returnData: this.returnData.bind(this) });
                break;
            }
        }
    }

    searchADocument = (title) => {
        this.setState({ snackVisible: false, message1: '', searchKey: title })
        DocumentModel.searchAsset(title + "").then(result => {
            let mData = result.data
            if (mData.length > 0) {
                console.log(mData);
                this.setState({ data: mData, message: '', animating: false, loading: false });
            } else {
                this.showMessage("No Such a Document Found")
                if (!title) {
                    this.setState({ isRefreshing: true, data: [], loading: true }, () => {
                        this.getData()
                    });
                }
                console.log(result.message);
            }
        })
    }

    showMessage(message) {
        this.setState({
            message1: message,
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
                            extraData={this.state}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefreshing}
                                    onRefresh={this.onRefresh.bind(this)}
                                />
                            }
                            renderItem={({ item, index }) => {
                                return <RowDocument item={item} index={index} onPress={(action) => this.onItemClickHandler(action, index)} />;
                            }}
                            keyExtractor={(item, index) => index.toString()}
                            ListFooterComponent={this.renderFooter.bind(this)}
                            onEndReachedThreshold={0.4}
                            onEndReached={this.handleLoadMore.bind(this)}
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
                <View style={{ flexDirection: 'row', justifyContent: 'center',alignContent:'center',alignItems:'center' }}>
                    <View style={{ flex: 1 }}>
                        <SearchView onChangeText={text => this.searchADocument(text)}>Search Document</SearchView>
                    </View>

                    <FAB
                        color='black'
                        style={styles.fab}
                        small={false}
                        icon={require('../../Assets/QRCode/qr-code.png')}
                        onPress={() => this.onClickHandler('scan')}
                    />
                </View>

                {progressBar}
                {emptyView}
                {masterView}
            </View>
        )
    }
}
export default AllDocument

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