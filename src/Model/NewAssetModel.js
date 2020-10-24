import { realm, Tables } from '../Database/DbConfig'
const tableName = Tables.NEW_ASSET;

export default class NewAssetModel {

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

    static getAllItems = async () => {
        let result = { data: [], message: '' }
        let r = realm.objects(tableName);
        result.data = r;
        if (r) {
            result.message = "No record found"
        }
        return result;
    }



    static getAllItemsByLimit = async (currentCount) => {
        let mFrom = currentCount
        let mTo = (currentCount + 20)
        let result = { data: null, message: '', mCount: 0 }
        try {
            let data = realm.objects(tableName).sorted('title', false).slice(mFrom, mTo)
            if (data != null) {
                result.data = data
                result.mCount = result.length
            } else {
                result.message = "No record found"
            }
            return result
        } catch (e) {
            result.message = e.message
            return result
        }
    }

    static getAllReadyItems = async () => {
        let result = { data: [], message: '' }
        let r = realm.objects(tableName).filtered(`isReady == true`);
        result.data = r;
        if (result.data == null) {
            result.message = "No record found"
        }
        return result;
    }

    static addItem = async (obj) => {
        let result = { data: null, message: '' }

        try {
            realm.write(() => {
                realm.create(tableName, obj, true);
            });
            result.message = "Successfully added";
            return result;
        } catch (err) {
            this.updateItem(obj)
            return err.message
        }
    }

    static updateItem = async (obj) => {
        let result = { data: null, message: '' }
        try {
            realm.write(() => {
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
                let result = realm.objects(tableName).filtered(`assetId == "${id}"`);;
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

    static setImage = async (id, image) => {
        let result = { data: null, message: '' }
        let emp = null
        let message = ''
        try {
            realm.write(() => {
                let result = realm.objects(tableName).filtered(`assetId == "${id}"`);;
                if (result != null && result[0] != null) {
                    emp = result[0];
                    emp.image=image
                    emp.isReady=true
                    realm.create(tableName, emp, true);
                    message = "Successfully image added";
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

    static  deleteItem = async (id) => {
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
}