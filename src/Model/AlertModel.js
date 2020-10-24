import { realm, Tables } from '../Database/DbConfig'
const tableName = Tables.ALERT;

export default class AlertModel {

    constructor(obj) {
        obj && Object.assign(this, obj);
    }


    static getUnReadCount = async () => {
        let result = { data: [], message: '' }
        let r = realm.objects(tableName).filtered(`isRead == false `);
        result.data = r.length;
        if (r.length == 0) {
            result.message = "No record found"
        }
        return result;
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
        let r = realm.objects(tableName).sorted('alertId', true);
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
                realm.create(tableName, obj);
            });
            result.message = "Successfully added";
            return result;
        } catch (err) {
            this.updateItem(obj.alertId, obj)
            return err.message
        }
    }

    static updateItem = async ( obj) => {
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


    static makeReaded = async (obj) => {
        let result = { data: null, message: '' }
        try {
            realm.write(() => {
                obj.isRead = true;
                realm.create(tableName, obj, true);
            });
            result.data = obj
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
                let result = realm.objects(tableName).filtered(`alertId == "${id}"`)
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

    static deleteItem = async (id) => {
        let result = { data: null, message: '' }
        let message = ''
        try {
            realm.write(() => {
                let result = realm.objects(tableName).filtered(`alertId == "${id}"`);;
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