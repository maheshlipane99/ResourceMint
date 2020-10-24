import { createBottomTabNavigator, createDrawerNavigator, createStackNavigator } from 'react-navigation'

import DrawerContent from '../Components/Menu/Left'
import { Dimensions } from 'react-native'

const deviceWidth = Dimensions.get("window").width;

import HomePage from '../Screens/Home/Home';
import ScanScreen from '../Screens/ScanScreen/ScanScreen';
import SearchAsset from '../Screens/ScanScreen/SearchAsset';
import AssetDetail from '../Screens/Asset/AssetDetail';
import AssetFullDetail from '../Screens/Asset/AssetFullDetail';
import AddAsset from '../Screens/Asset/AddAsset';
import WebScreen from '../Screens/WebScreen/WebScreen';
import Question from '../Screens/Question/Question';
import LinkedQuestion from '../Screens/Question/LinkedQuestion';
import TakePhotoQuestion from '../Screens/Question/TakePhotoQuestion';
import PendingList from '../Screens/Settings/PendingList'
import Settings from '../Screens/Settings/Settings'
import NewChecklist from '../Screens/Checklist/NewChecklist'
import ChecklistHistory from '../Screens/Checklist/ChecklistHistory'
import DoneChecklist from '../Screens/Checklist/DoneChecklist'
import Outbox from '../Screens/Outbox/Outbox'
import AssetDocument from '../Screens/Document/AssetDocument'
import SearchDocument from '../Screens/Document/SearchDocument'
import AllDocument from '../Screens/Document/AllDocument'
import DocumentDetail from '../Screens/Document/DocumentDetail'
import Profile from '../Screens/Profile/Profile'
import AlertsList from '../Screens/Alerts/AlertsList'
import AlertDetails from '../Screens/Alerts/AlertDetails'
import SystemLog from '../Screens/SystemLog/SystemLog'
import ComplaintList from '../Screens/Complaint/ComplaintList'
import ComplaintHome from '../Screens/Complaint/ComplaintHome'
import AssetComplaintList from '../Screens/Complaint/AssetComplaintList'
import StatusList from '../Screens/Status/StatusList'
import RaiseComplaint from '../Screens/Complaint/RaiseComplaint'
import AssetRaiseComplaint from '../Screens/Complaint/AssetRaiseComplaint'
import GetCode from '../Screens/ScanScreen/GetCode'
import CameraScreen from '../Screens/Camera/CameraScreen'
import MultiUser from '../Screens/User/MultiUser'
import SingleUser from '../Screens/User/SingleUser'
import ComplaintDetail from '../Screens/Complaint/ComplaintDetail'
import MyComplaintList from '../Screens/Complaint/MyComplaintList'

import CreateTask from '../Screens/Task/CreateTask'
import TaskDetail from '../Screens/Task/TaskDetail'
import MyTaskList from '../Screens/Task/MyTaskList'
import TaskList from '../Screens/Task/TaskList'
import TaskHome from '../Screens/Task/TaskHome'

import Category from '../Screens/Category/Category'
import Department from '../Screens/Department/Department'
import Supplier from '../Screens/Supplier/Supplier'
import Manufacturer from '../Screens/Manufacturer/Manufacturer'
import LocationType from '../Screens/LocationType/LocationType'
import DurationType from '../Screens/DurationType/DurationType'

import DocumentViewer from '../Screens/Document/DocumentViewerExample'

const AppNavigator = createDrawerNavigator({
    HomeScreen: {
        screen: HomePage,
    }
},
    {
        contentComponent: DrawerContent,
        contentOptions: {
            activeTintColor: "#e91e63"
        },
        headerMode: "none",
        initialRouteName: "HomeScreen",
        drawerWidth: deviceWidth - 50,
        // drawerType: 'slide',
    }
);

const StackNavigator = createStackNavigator({

    //important: key and screen name (i.e. DrawerNavigator) should be same while using the drawer navigator inside stack navigator.

    AppNavigator: {
        screen: AppNavigator
    },
    ScanScreen,
    SearchAsset,
    AssetDetail,
    AssetFullDetail,
    AddAsset,
    WebScreen,
    Question,
    LinkedQuestion,
    TakePhotoQuestion,
    Settings,
    PendingList,
    NewChecklist,
    ChecklistHistory,
    DoneChecklist,
    Outbox,
    AssetDocument,
    SearchDocument,
    AllDocument,
    DocumentDetail,
    Profile,
    AlertsList,
    AlertDetails,
    DocumentViewer,
    SystemLog,
    ComplaintHome,
    ComplaintList,
    AssetComplaintList,
    AssetRaiseComplaint,
    RaiseComplaint,
    StatusList,
    GetCode,
    CameraScreen,
    MultiUser,
    SingleUser,
    ComplaintDetail,
    MyComplaintList,
    TaskDetail,
    TaskList,
    MyTaskList,
    CreateTask,
    TaskHome,
    Category,
    Manufacturer,
    Supplier,
    Department,
    LocationType,
    DurationType
},
    {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        }
    });



export default StackNavigator