import React, { Component } from 'react'
import { View, Text, FlatList, StyleSheet, Alert, RefreshControl, ActivityIndicator } from 'react-native'
import Loader from '../../Components/ProgressBar/Loader'
import RowTask from '../Row/RowTask'
import Navigation from '../../Service/Navigation'
import LocalStore from '../../Store/LocalStore'
import Header from '../../Components/ToolBar/Header'
import BackgroundService from '../../Service/BackgroundService'
import TaskModel from '../../Model/TaskModel';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { dataChanged } from '../../Actions/DataChangedAction';
import { connect } from 'react-redux';


class MyTaskList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: 'Tasks By Me',
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
                this.getServerData()
                BackgroundService.startTaskUploading(this.state.mToken).then(result => () => {
                    console.log(JSON.stringify(result));
                })
            });
        });
    }

    componentWillUnmount() {
        this.setState({ isFetching: false });
    }


    componentWillReceiveProps(nextProps) {
        console.log('state change' + JSON.stringify(nextProps));
        if (!nextProps.isUpdated && nextProps.type == 'createTask') {
            this.setState({ data: [] }, () => {
                this.getData()
            });
        }
    }

    getData = () => {
        TaskModel.getMyTask(this.state.data.length).then(result => {
            console.log(JSON.stringify(result.data));
            if (result.data.length > 0) {
                let listData = this.state.data;
                let data = listData.concat(result.data)
                this.setState({ loading: false, data: data, mCount: result.mCount, message: '', animating: false })
            } else {
                if (this.state.data.length == 0) {
                    this.setState({ message: 'No Tasks', animating: false, loading: false, });
                } else {
                    this.setState({ animating: false, loading: false, showButton: true });
                }
            }

        })

    }

    getServerData = () => {
        BackgroundService.getMyTasks(this.state.mToken, 1).then((result) => {
            if (result) {
                this.setState({ data: [] }, () => {
                    this.getData()
                });
            }
        })
    }

    showAlert = (title, message) => {
        Alert.alert(title, message)
    }

    onRefresh() {
        this.setState({ isRefreshing: true, showButton: false, data: [] }, () => {
            TaskModel.getMyTask(this.state.data.length).then(result => {
                console.log(JSON.stringify(result.data));
                if (result.data.length > 0) {
                    let listData = this.state.data;
                    let data = listData.concat(result.data)
                    this.setState({ isRefreshing: false, data: data, mCount: result.mCount, })
                } else {
                    if (this.state.data.length == 0) {
                        this.setState({ message: 'No Task', isRefreshing: false, });
                    } else {
                        this.setState({ isRefreshing: false, });
                    }
                }
            })
        });
        this.getServerData()
    }

    onItemClickHandler(id, index) {
        switch (id) {
            case 'rootView': {
                let mItem = this.state.data[index]
                console.log(JSON.stringify(mItem));

                if (mItem.isDraft) {
                    Navigation.navigate('CreateTask');
                } else {
                    if (mItem.message) {
                        Navigation.navigate('TaskDetail', { complaintId: mItem.complaintId, serverId: 0 });
                    } else {
                        BackgroundService.getTaskDetails(this.state.mToken, mItem.serverId).then((result) => {
                            console.log(JSON.stringify(result));
                            if (result && result.message != '') {
                                Navigation.navigate('TaskDetail', { complaintId: mItem.complaintId, serverId: 0 });
                            }
                        })
                    }
                }

                break;
            }
        }
    }

    onClickHandler(id) {
        switch (id) {
            case 'adasd': {
                Navigation.openDrawer();
                break;
            }
            case 'add': {
                Navigation.navigate('CreateTask');
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
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefreshing}
                                    onRefresh={this.onRefresh.bind(this)}
                                />
                            }
                            renderItem={({ item, index }) => {
                                return <RowTask item={item} index={index} onPress={(action) => this.onItemClickHandler(action, index)} />;
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
                {/* <View>
                    <Header onPress={() => { this.props.navigation.goBack(null) }}>{this.state.title}</Header>
                </View> */}
                {progressBar}
                {emptyView}
                {masterView}
                {/* <FAB
                    style={styles.fab}
                    small={false}
                    icon={require('../../Assets/Plus/plus.png')}
                    onPress={() => this.onClickHandler('add')}
                /> */}
                <ProgressDialog
                    visible={this.state.progressVisible}
                    title="Document Opening"
                    message="Please, wait..."
                />
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    let isUpdated = state.DataReducer.isUpdated;
    let type = state.DataReducer.type;
    return { isUpdated: isUpdated, type: type };
};

export default connect(mapStateToProps, { dataChanged })(MyTaskList);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#0A8BCC',
    },
})