import { realm, Tables } from '../Database/DbConfig'
const tableName = Tables.COMPLAINT;

export default class ComplaintModel {

    constructor(obj) {
        obj && Object.assign(this, obj);
    }

    static getCount = async () => {
        let result = { data: [], message: '' }
        let r = realm.objects(tableName).filtered(`typeOfComplaintFK == 2`);
        result.data = r.length;
        if (r.length == 0) {
            result.message = "No record found"
        }
        return result;
    }

    static getPendingCount = async () => {
        let result = { data: [], message: '' }
        let r = realm.objects(tableName).filtered(`isSubmitted == false AND isDraft == false AND typeOfComplaintFK == 2`);
        result.data = r.length;
        if (r.length == 0) {
            result.message = "No record found"
        }
        return result;
    }

    static getAllItems = async () => {
        let result = { data: [], message: '' }
        let r = realm.objects(tableName).filtered(`typeOfComplaintFK == 2`);
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
            let data = realm.objects(tableName).sorted('complaintId', true).filtered(`complaintId != 0 AND serverId != 0 AND typeOfComplaintFK == 2 AND isSubmitted==true AND isMy==false`).slice(mFrom, mTo)
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


    static getMyComplaints = async (currentCount) => {
        let mFrom = currentCount
        let mTo = (currentCount + 20)
        let result = { data: null, message: '', mCount: 0 }
        try {
            let data = realm.objects(tableName).sorted('complaintId', true).filtered(`typeOfComplaintFK == 2 AND isMy==true`).slice(mFrom, mTo)
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

    static search = async (key) => {
        let result = { data: [], message: '' }
        let result1 = realm.objects(tableName).filtered(`title LIKE "*${key}*"`);
        if (result1.length > 0) {
            result.data = result1;
        } else {
            result.message = "No record found"
        }
        return result;
    }

    static getAllPendingItems = async () => {
        let result = { data: [], message: '' }
        let r = realm.objects(tableName).filtered(`isSubmitted == false AND isDraft == false AND typeOfComplaintFK == 2`);
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
                if (obj.complaintId == null) {
                    obj.complaintId = this.getPrimaryKeyId();
                }
                realm.create(tableName, obj);
            });
            result.data = obj;
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
                if (obj.complaintStatus == null) {
                    obj.complaintStatus = obj.ActualComplaintStatus
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

    static changeStatus = async (status, obj) => {
        let result = { data: null, message: '' }
        try {
            realm.write(() => {
                obj.complaintStatus = status
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
                let result = realm.objects(tableName).filtered(`complaintId == "${id}"`);;
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


    static getDraftItem = async () => {
        let result = { data: null, message: '' }
        let emp = null
        let message = ''
        try {
            realm.write(() => {
                let result = realm.objects(tableName).filtered(`isDraft == true AND typeOfComplaintFK == 2`);;
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
                let result = realm.objects(tableName).filtered(`complaintId != 0 AND serverId != 0 AND assetCode == "${assetCode}"`);;
                if (result != null) {
                    emp = result;
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
                let result = realm.objects(tableName).filtered(`complaintId == "${id}"`);;
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
        if (realm.objects(tableName).max("complaintId")) {
            return realm.objects(tableName).max("complaintId") + 1;
        }
        return 1;
    }
}