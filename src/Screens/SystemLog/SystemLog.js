import React, { Component } from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, RefreshControl } from 'react-native'
import Loader from '../../Components/ProgressBar/Loader'
import RowLog from '../Row/RowLog'
import Navigation from '../../Service/Navigation'
import LocalStore from '../../Store/LocalStore'
import Header from '../../Components/ToolBar/Header'
import SystemLogModel from '../../Model/SystemLogModel';
import { dataChanged } from '../../Actions/DataChangedAction';
import { connect } from 'react-redux';
import { Button } from 'react-native-paper';
import { ConfirmDialog } from 'react-native-simple-dialogs';

class SystemLog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: 'System Logs',
            mToken: '',
            status: false,
            animating: true,
            showButton: false,
            dialogVisible: false,
            mCount: 0,
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
        console.log('getData');

        SystemLogModel.getAllItemsByLimit(this.state.data.length).then(result => {
            console.log(JSON.stringify(result.data));
            if (result.data.length > 0) {
                let listData = this.state.data;
                let data = listData.concat(result.data)
                this.setState({ loading: false, data: data, mCount: result.mCount, message: '', title: 'System Logs', animating: false })
            } else {
                if (this.state.data.length == 0) {
                    this.setState({ message: 'No Logs', animating: false, title: '', loading: false, });
                } else {
                    this.setState({ animating: false, loading: false, showButton: true });
                }
            }

        })
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

    showAlert = (title, message) => {
        Alert.alert(title, message)
    }


    onRefresh() {
        this.setState({ isRefreshing: true, showButton: false, data: [] }, () => {
            SystemLogModel.getAllItemsByLimit(this.state.data.length).then(result => {
                console.log(JSON.stringify(result.data));
                if (result.data.length > 0) {
                    let listData = this.state.data;
                    let data = listData.concat(result.data)
                    this.setState({ isRefreshing: false, data: data, mCount: result.mCount, })
                } else {
                    if (this.state.data.length == 0) {
                        this.setState({ message: 'No Logs', isRefreshing: false, });
                    } else {
                        this.setState({ isRefreshing: false, });
                    }
                }
            })
        });
    }

    clearLogs = () => {
        this.setState({ dialogVisible: false, data: [] }, () => {
            SystemLogModel.deleteAllItem().then(result => {
                console.log(JSON.stringify(result));
                this.getData()
            })
        })
    }

    onItemClickHandler(id, index) {
        switch (id) {
            case 'rootView': {

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
            case 'clear': {
                this.setState({ dialogVisible: true });
                break;
            }
        }
    }


    render() {

        var btnClear = <View></View>;
        if (!this.state.animating && !this.state.isRefreshing && !this.state.loading && this.state.showButton) {
            btnClear = (
                <View style={{ margin: 10 }}>
                    <Button
                        mode="contained"
                        color='#0A8BCC'
                        uppercase={false}
                        style={{}}
                        contentStyle={{ height: 50 }}
                        onPress={() => { this.onClickHandler('clear') }}  >Clear logs</Button>
                </View>

            )
        }

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
                                return <RowLog item={item} index={index} onPress={(action) => this.onItemClickHandler(action, index)} />;
                            }}
                            keyExtractor={(item, index) => index.toString()}
                            ListFooterComponent={this.renderFooter.bind(this)}
                            onEndReachedThreshold={0.4}
                            onEndReached={this.handleLoadMore.bind(this)}
                        />
                    </View>
                    {btnClear}
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
                <ConfirmDialog
                    title="Delete All System Logs"
                    message="Are you sure about that?"
                    visible={this.state.dialogVisible}
                    onTouchOutside={() => this.setState({ dialogVisible: false })}
                    positiveButton={{
                        title: "YES",
                        onPress: () => this.clearLogs()
                    }}
                    negativeButton={{
                        title: "NO",
                        onPress: () => this.setState({ dialogVisible: false })
                    }}
                />
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    let isUpdated = state.DataReducer.isUpdated;
    return { isUpdated: isUpdated };
};

export default connect(mapStateToProps, { dataChanged })(SystemLog);

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