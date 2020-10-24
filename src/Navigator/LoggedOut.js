import { createStackNavigator } from 'react-navigation'

import LoginScreen from '../Screens/Authorization/LoginScreen';
import ForgetPassword from '../Screens/Authorization/ForgetPassword';
import ChangePassword from '../Screens/Authorization/ChangePassword';

const LoggedOutNavigator = createStackNavigator({
  LoginScreen,
  ForgetPassword,
  ChangePassword
},
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
  });

export default LoggedOutNavigator