import React, { Component } from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, RefreshControl } from 'react-native'
import Loader from '../../Components/ProgressBar/Loader'
import RowChsecklist from '../Row/RowHistory'
import Navigation from '../../Service/Navigation'
import LocalStore from '../../Store/LocalStore'
import Header from '../../Components/ToolBar/Header'
import DoneChecklistModel from '../../Model/DoneChecklistModel';
import BackgroundService from '../../Service/BackgroundService'
import { connect } from 'react-redux';
import { dataChanged } from '../../Actions/DataChangedAction';

class ChecklistHistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            assetId: props.navigation.state.params.assetId,
            title: 'History',
            mToken: '',
            status: false,
            animating: true,
            showButton: false,
            mCount: 0,
            data: []
        }
    }


    componentDidMount = () => {
        LocalStore.getToken().then(value => {
            this.setState({ mToken: value }, () => {
                this.getData()
                BackgroundService.getAssetDoneChecklist(this.state.mToken, this.state.assetId).then((result) => {
                    if (result) {
                        console.log('result ' + JSON.stringify(result));
                        this.setState({ data: [] }, () => {
                            this.getData()
                        });
                    }
                })
            });
        });


    }

    componentWillUnmount() {
        this.setState({ isFetching: false });
    }

    getData = () => {
        DoneChecklistModel.getHistoryChecklistFilter(this.state.assetId, this.state.data.length).then(result => {
            console.log(JSON.stringify(result.data));
            if (result.data.length > 0) {
                let listData = this.state.data;
                let data = listData.concat(result.data)
                this.setState({ loading: false, data: data, mCount: result.mCount, message: '', animating: false })
            } else {
                if (this.state.data.length == 0) {
                    this.setState({ message: 'No History', animating: false, loading: false, });
                } else {
                    this.setState({ animating: false, loading: false, });
                }
            }

        })
    }

    showAlert = (title, message) => {
        Alert.alert(title, message)
    }

    onItemClickHandler(id, index) {
        switch (id) {
            case 'rootView': {
                let doneChecklistId = this.state.data[index].doneChecklistId
                Navigation.navigate('DoneChecklist', { doneChecklistId: doneChecklistId });
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
            case 'scan': {
                Navigation.navigate('ScanScreen');
                // Navigation.navigate('AssetDetail');
                break;
            }
        }
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
            DoneChecklistModel.getHistoryChecklistFilter(this.state.assetId, this.state.data.length).then(result => {
                console.log(JSON.stringify(result.data));
                if (result.data.length > 0) {
                    let listData = this.state.data;
                    let data = listData.concat(result.data)
                    this.setState({ isRefreshing: false, data: data, mCount: result.mCount, })
                } else {
                    if (this.state.data.length == 0) {
                        this.setState({ message: 'No History', isRefreshing: false, });
                    } else {
                        this.setState({ isRefreshing: false, });
                    }
                }
            })
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
                                return <RowChsecklist item={item} index={index} onPress={(action) => this.onItemClickHandler(action, index)} />;
                            }}
                            keyExtractor={(item, index) => index.toString()}
                            ListFooterComponent={this.renderFooter.bind(this)}
                            onEndReachedThreshold={0.4}
                            onEndReached={this.handleLoadMore.bind(this)}
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
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    console.log(JSON.stringify(state));
    let isUpdated = state.DataReducer.isUpdated;
    let type = state.DataReducer.type;
    return { isUpdated: isUpdated, type: type };
};

export default connect(mapStateToProps, { dataChanged })(ChecklistHistory);

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