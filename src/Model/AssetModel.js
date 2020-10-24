import { realm, Tables } from '../Database/DbConfig'
const tableName = Tables.ASSET;

export default class AssetModel {

    constructor(obj) {
        obj && Object.assign(this, obj);
    }

    static getCount = async () => {
        let result = { data: [], message: '' }
        let r = realm.objects(tableName);
        result.data = r.length;
        if (r.length == 0) {
            result.message = "No record found"
        }
        return result;
    }

    static searchAsset = async (assetCode) => {
        let result = { data: [], message: '' }
        let result1 = realm.objects(tableName).filtered(`assetCode LIKE "*${assetCode}*" AND isDeleted == 0`);
        if (result1.length > 0) {
            result.data = result1;
        } else {
            result.message = "No record found"
        }
        return result;
    }

    getAllItems = async () => {
        let result = { data: [], message: '' }
        let r = realm.objects(tableName);
        result.data = r;
        if (r) {
            result.message = "No record found"
        }
        return result;
    }

    static addItem = async (obj) => {
        let result = { data: null, message: '' }

        try {
            realm.write(() => {
                if(obj.userGuide==null){
                    obj.userGuide='' 
                }
                realm.create(tableName, obj);
            });
            result.message = "Successfully added";
            return result;
        } catch (err) {
            this.updateItem(obj)
            return err.message
        }
    }

    static updateItem = async ( obj) => {
        let result = { data: null, message: '' }
        try {
            realm.write(() => {
                if(obj.userGuide==null){
                    obj.userGuide='' 
                }
                realm.create(tableName, obj, true);
            });
            result.message = "Successfully updated";
            return result;
        } catch (err) {
            result.message = err.message
            return result
        }
    }

    static getItemById = async (id) => {
        let result = { data: null, message: '' }
        let emp = null
        let message = ''
        try {
            realm.write(() => {
                let result = realm.objects(tableName).filtered(`assetId == "${id}" AND isDeleted == 0`);;
                if (result != null && result[0] != null) {
                    emp = result[0];
                } else {
                    message = "No record found"
                }
            });
            result.data = emp
            result.message = message
            return result
        } catch (e) {
            result.message = e.message
            return result
        }
    }


    static getItemByAssetCode = async (assetCode) => {
        let result = { data: null, message: '' }
        let emp = null
        let message = ''
        try {
            realm.write(() => {
                let result = realm.objects(tableName).filtered(`assetCode == "${assetCode}" AND isDeleted == 0`);;
                if (result != null && result[0] != null) {
                    emp = result[0];
                } else {
                    message = "No record found"
                }
            });
            result.data = emp
            result.message = message
            return result
        } catch (e) {
            result.message = e.message
            return result
        }
    }

    deleteItem = async (id) => {
        let result = { data: null, message: '' }
        let message = ''
        try {
            realm.write(() => {
                let result = realm.objects(tableName).filtered(`assetId == "${id}"`);;
                if (result != null && result[0] != null) {
                    realm.delete(result[0])
                    message = "Record successsfuly deleted"
                } else {
                    message = "No record found"
                }
            });
            result.message = message
            return result
        } catch (e) {
            result.message = e.message
            return result
        }
    }

    static deleteAllItem = async () => {
        let result = { data: null, message: '' }
        let message = data = ''
        try {
            realm.write(() => {
                let result = realm.objects(tableName)
                if (result != null) {
                    realm.delete(result)
                    message = "All Record successsfuly deleted"
                    data = true
                } else {
                    message = "No record found"
                    data = false
                }
            });
            result.message = message
            result.data = data
            return result
        } catch (e) {
            result.message = e.message
            return result
        }
    }

    getPrimaryKeyId() {
        if (realm.objects(tableName).max("id")) {
            return realm.objects(tableName).max("id") + 1;
        }
        return 1;
    }


    getUpdatedItem = async () => {
        let result = { data: null, message: '' }
        if (realm.objects(tableName).sorted('id', true)) {
            let data = realm.objects(tableName).sorted('id', true)[0];
            result.data = data;
        }
        return result;
    }
}