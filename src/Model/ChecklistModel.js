import { realm, Tables } from '../Database/DbConfig'
const tableName = Tables.CHECKLIST;

export default class ChecklistModel {

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
        if (result.data == null) {
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
            this.updateItem(obj.checklistId, obj)
            return err.message
        }
    }

    static updateItem = async (id, obj) => {
        let result = { data: null, message: '' }
        obj.id = id;
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
                let result = realm.objects(tableName).filtered(`checklistId == "${id}" AND isDeleted == 0`);;
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

    static getItemByCatId = async (categoryIdFK) => {
        let result = { data: null, message: '' }
        let emp = null
        let message = ''
        try {
            realm.write(() => {
                let result = realm.objects(tableName).filtered(`categoryIdFK == "${categoryIdFK}" AND questions.@size > 0 AND isDeleted == 0`);;
                if (result != null) {
                    emp = result;
                } else { 
                    emp = false
                    message = "No record found"
                }
            });
            result.data = emp
            result.message = message
            return result
        } catch (e) {
            result.data = false
            result.message = e.message
            return result
        }
    }

    static deleteItem = async (id) => {
        let result = { data: null, message: '' }
        let message = ''
        try {
            realm.write(() => {
                let result = realm.objects(tableName).filtered(`checklistId == "${id}"`);;
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
        let message = data=''
        try {
            realm.write(() => {
                let result = realm.objects(tableName)
                if (result != null) {
                    realm.delete(result)
                    message = "All Record successsfuly deleted"
                    data=true
                } else {
                    message = "No record found"
                    data=false
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