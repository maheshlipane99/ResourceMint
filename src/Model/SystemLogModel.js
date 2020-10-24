import { realm, Tables } from '../Database/DbConfig'
const tableName = Tables.SYSTEM_LOG;

export default class SystemLogModel {

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
        let r = realm.objects(tableName).sorted('createdOn', true);
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
            let data = realm.objects(tableName).sorted('id', true).slice(mFrom, mTo)
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

    static addItem = async (log) => {
        let result = { data: null, message: '' }
        let obj = { id: this.getPrimaryKeyId(), log: log }
        try {
            realm.write(() => {
                realm.create(tableName, obj);
            });
            result.message = "Successfully added";
            return result;
        } catch (err) {
            this.updateItem(obj)
            return err.message
        }
    }

    static updateItem = async (log) => {
        let result = { data: null, message: '' }
        let obj = { log: log }
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
                let result = realm.objects(tableName).filtered(`id == "${id}"`);;
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
                let result = realm.objects(tableName).filtered(`id == "${id}"`);;
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

    static getPrimaryKeyId() {
        if (realm.objects(tableName).max("id")) {
            return realm.objects(tableName).max("id") + 1;
        }
        return 1;
    }
}