import {AsyncStorage} from 'react-native';

async function resetAll() {
  try {
    await AsyncStorage.resetAll();
  } catch (error) {
    console.log("Error resetting data" + error);
  }
}

storeData = async () => {
  try {
    await AsyncStorage.setItem('@MySuperStore:key', 'I like to save it.');
    this._retrieveData();
  } catch (error) {
    // Error saving data
  }
};

retrieveData = async () => {
  try {
    const value = await AsyncStorage.getItem('@MySuperStore:key');
    if (value !== null) {
      // We have data!!
      console.log(value);
    }
  } catch (error) {
    // Error retrieving data
  }
};

//////////////////////////////////////////////////////////////

setLocality = async (value) => {
  try {
    await AsyncStorage.setItem('@Locality:key',  JSON.stringify(value));
  } catch (error) {
    // Error saving data
  }
};

getLocality = async () => {
  try {
    const value = await AsyncStorage.getItem('@Locality:key');
    if (value !== null) {
      const item = JSON.parse(value);
      return item;
    }
  } catch (error) {
    // Error retrieving data
  }
};

//////////////////////////////////////////////////////////////


setToken = async (value) => {
  try {
    await AsyncStorage.setItem('mToken', value);
  } catch (error) {
    // Error saving data
  }
};

 getToken = async () => {
  let mToken = '';
  try {
    mToken = await AsyncStorage.getItem('mToken') || 'none';
  } catch (error) {
    // Error retrieving data
    console.log(error.message);
  }
  return mToken;
}

//////////////////////////////////////////////////////////////


setFirebaseToken = async (value) => {
  try {
    await AsyncStorage.setItem('mFireToken', value);
  } catch (error) {
    // Error saving data
  }
};

 getFirebaseToken = async () => {
  let mToken = '';
  try {
    mToken = await AsyncStorage.getItem('mFireToken') || 'none';
  } catch (error) {
    // Error retrieving data
    console.log(error.message);
  }
  return mToken;
}

//////////////////////////////////////////////////////////////


setAddress = async (value) => {
  try {
    await AsyncStorage.setItem('@Address:key',  JSON.stringify(value));
  } catch (error) {
    // Error saving data
  }
};

getAddress= async () => {
  try {
    const value = await AsyncStorage.getItem('@Address:key');
    if (value !== null) {
      const item = JSON.parse(value);
      return item;
    }
  } catch (error) {
    // Error retrieving data
  }
};

//////////////////////////////////////////////////////////////

setUser = async (value) => {
  try {
    await AsyncStorage.setItem('@User:key',  JSON.stringify(value));
  } catch (error) {
    // Error saving data
  }
};

getUser = async () => {
  try {
    const value = await AsyncStorage.getItem('@User:key');
    if (value !== null) {
      const item = JSON.parse(value);
      return item;
    }
  } catch (error) {
    // Error retrieving data
  }
};

//////////////////////////////////////////////////////////////

setData = async (value) => {
  try {
    await AsyncStorage.setItem('@Data:key',  JSON.stringify(value));
  } catch (error) {
    // Error saving data
  }
};

getData = async () => {
  try {
    const value = await AsyncStorage.getItem('@Data:key');
    if (value !== null) {
      const item = JSON.parse(value);
      return item;
    }
  } catch (error) {
    // Error retrieving data
  }
};

//////////////////////////////////////////////////////////////

setFirst = async (value) => {
  try {
    await AsyncStorage.setItem('mFirst', value);
  } catch (error) {
    // Error saving data
  }
};

getFirst = async () => {
  let mFirst = false;
  try {
    mFirst = await AsyncStorage.getItem('mFirst') || 'none';
  } catch (error) {
    // Error retrieving data
    console.log(error.message);
  }
  return mFirst;
}


//////////////////////////////////////////////////////////////

setUserId = async (value) => {
  try {
    await AsyncStorage.setItem('userId', value);
  } catch (error) {
    // Error saving data
  }
};

getUserId= async () => {
  let userId = null;
  try {
    userId = await AsyncStorage.getItem('userId') || 'none';
  } catch (error) {
    // Error retrieving data
    console.log(error.message);
  }
  return userId;
}

//////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////

setLastScreen = async (value) => {
  try {
    await AsyncStorage.setItem('lastRout', value);
  } catch (error) {
    // Error saving data
  }
};

getLastScreen= async () => {
  let lastRout = 'HomeScreen';
  try {
    lastRout = await AsyncStorage.getItem('lastRout') || 'none';
  } catch (error) {
    // Error retrieving data
    console.log(error.message);
  }
  return lastRout;
}


//////////////////////////////////////////////////////////////

export default {
  resetAll,
  setToken,
  getToken,
  setFirebaseToken,
  getFirebaseToken,
  setLocality,
  getLocality,
  setAddress,
  getAddress,
  setUser,
  getUser,
  setData,
  getData,
  setFirst,
  getFirst,
  setUserId,
  getUserId,
  setLastScreen,
  getLastScreen,
}