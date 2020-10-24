import { NavigationActions, DrawerActions } from 'react-navigation'

let _navigator

const backAction = NavigationActions.back({
  key: null
})


const openAction = DrawerActions.openDrawer({
  key: null
})

const closeAction = DrawerActions.closeDrawer({
  key: null
})

function setTopLevelNavigator(r) {
  _navigator = r
}


function getNavigator() {
 return _navigator ;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  )
}

function navigateFinal(routeName, params) {
  _navigator.dispatch(
    NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName, params})]
    })
  )
}

function openDrawer() {
  _navigator.dispatch(DrawerActions.openDrawer())
}
function closeDrawer() {
  _navigator.dispatch(DrawerActions.closeDrawer())
}

function back() {
  _navigator.dispatch(backAction);
}


export default {
  navigate,
  navigateFinal,
  setTopLevelNavigator,
  getNavigator,
  openDrawer,
  closeDrawer,
  back
}