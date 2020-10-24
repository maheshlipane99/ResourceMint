import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native'
import { Snackbar, FAB } from 'react-native-paper';
import Navigation from '../../Service/Navigation'
import LocalStore from '../../Store/LocalStore'
import Header from '../../Components/ToolBar/Header'
import { dataChanged } from '../../Actions/DataChangedAction';
import { connect } from 'react-redux';
import ComplaintList from './ComplaintList';
import MyComplaintList from './MyComplaintList';
import { IndicatorViewPager } from 'rn-viewpager';
import FeaturesModel from '../../Model/FeaturesModel';
import { FEATURES } from '../../Utils/Const'


class ComplaintHome extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            mToken: '',
            status: false,
            animating: true,
            progressVisible: false,
            position: 0,
            showBtn: false,
            data: []
        }
    }


    componentDidMount = () => {
        this.initFeature()
        LocalStore.getToken().then(value => {
            this.setState({ mToken: value }, () => {

            });
        });
    }

    componentWillUnmount() {
        this.setState({ isFetching: false });
    }


    componentWillReceiveProps(nextProps) {
        console.log('state change' + JSON.stringify(nextProps));
        if (nextProps.isUpdated) {
            if (nextProps.type == 'raiseComplaint') {
                this.setState({ data: [] }, () => {
                    //  this.viewPager && this.viewPager.setPage(1);
                });
            }

        }

    }

    initFeature = () => {
        FeaturesModel.getItemById(FEATURES.Complaint_Raise).then(result => {
            console.log(JSON.stringify(result));
            if (result.data) {
                this.setState({ showBtn: true });
            }
        })
    }

    onClickHandler(id) {
        switch (id) {
            case '1': {
                this.viewPager && this.viewPager.setPage(0);
                break;
            }
            case '2': {
                this.viewPager && this.viewPager.setPage(1);
                break;
            }
            case 'add': {
                Navigation.navigate('RaiseComplaint', { returnData: this.returnData.bind(this) });
                break;
            }
        }
    }


    onPageSelected = (e) => {
        if ((e.position) == 0) {
            this.setState({ title: '', position: e.position });
        } else {
            this.setState({ title: '', position: e.position });
        }
    }

    onPageScroll = (e) => {

    }


    returnData = (data) => {
        console.log(JSON.stringify(data));
        if (data.status) {
            this.props.dataChanged({ isUpdated: true, type: 'raiseComplaint' });
            this.props.dataChanged({ isUpdated: false, type: 'raiseComplaint' });
            this.setState({ position: 1 }, () => {
                this.viewPager && this.viewPager.setPage(1);
            });
        }

    }

    render() {

        return (
            <View style={styles.container}>
                <Header onPress={() => { this.props.navigation.goBack(null) }}>{this.state.title}</Header>
                <ImageBackground source={require('../../Assets/Header/header_bg.png')} style={styles.backImage}  >
                    <View style={{ flex: 1, width: '100%', height: '100%', flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.onClickHandler('1')} style={styles.context}>
                            <Text style={(this.state.position == 0) ? styles.activeText : styles.inActiveText}  >Complaints</Text>
                            <View style={(this.state.position == 0) ? styles.activeBg : styles.inActiveBg}></View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.onClickHandler('2')} style={styles.context}>
                            <Text style={(this.state.position == 0) ? styles.inActiveText : styles.activeText} >My Complaint</Text>
                            <View style={(this.state.position == 0) ? styles.inActiveBg : styles.activeBg}></View>
                        </TouchableOpacity>
                    </View>

                </ImageBackground>
                <View style={{ flex: 1 }}>
                    <IndicatorViewPager
                        style={styles.viewPager}
                        onPageScroll={this.onPageScroll}
                        onPageSelected={this.onPageSelected}
                        ref={viewPager => { this.viewPager = viewPager; }}
                        initialPage={this.state.currentPosition}>
                        <View>
                            <ComplaintList />
                        </View>
                        <View>
                            <MyComplaintList />
                        </View>
                    </IndicatorViewPager>
                </View>
                <View style={{ position: 'relative' }}>
                    <Snackbar
                        duration={Snackbar.DURATION_SHORT}
                        visible={this.state.snackVisible}
                        onDismiss={() => this.setState({ snackVisible: false, message: '' })}
                    >{this.state.message} </Snackbar>
                </View>
                {this.state.showBtn ? <FAB
                    style={styles.fab}
                    small={false}
                    icon={require('../../Assets/Plus/plus.png')}
                    onPress={() => this.onClickHandler('add')}
                /> : null}
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    let isUpdated = state.DataReducer.isUpdated;
    let type = state.DataReducer.type;
    return { isUpdated: isUpdated, type: type };
};

export default connect(mapStateToProps, { dataChanged })(ComplaintHome);

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
    viewPager: {
        flex: 1
    },
    context: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
    },
    activeBg: {
        height: 5,
        backgroundColor: 'white',
    },
    inActiveBg: {
        height: 5,
        backgroundColor: '#0A8BCC',
    },
    activeText: {
        flex: 1,
        color: 'white',
        alignSelf: 'center',
        fontFamily: 'Barlow-Medium',
        fontSize: 16,
        textAlignVertical: 'center'
    },
    inActiveText: {
        flex: 1,
        color: '#A59F9D',
        alignSelf: 'center',
        fontFamily: 'Barlow-Light',
        fontSize: 14,
        textAlignVertical: 'center'
    },
    backImage: {
        width: '110%',
        height: 50,
        paddingLeft: 10,
        paddingRight: 10,
        resizeMode: "cover",
        alignSelf: 'center',
    },
})