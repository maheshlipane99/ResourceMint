import { realm, Tables } from '../Database/DbConfig'
const tableName = Tables.DOCUMENT;

export default class DocumentModel {

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
            let data = realm.objects(tableName).sorted('documentId', true).filtered(`isDeleted == 0`).slice(mFrom, mTo)
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

    static getAllAssetDocument = async (assetId) => {
        let result = { data: null, message: '' }
        let emp = null
        let message = ''
        try {
            realm.write(() => {
                let result = realm.objects(tableName).filtered(`masterId == "${assetId}" AND documentTypeIdFK == 2 `);;
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

    static getAllCategoryDocument = async (categoryId) => {
        let result = { data: null, message: '' }
        let emp = null
        let message = ''
        try {
            realm.write(() => {
                let result = realm.objects(tableName).filtered(`masterId == "${categoryId}" AND documentTypeIdFK == 1 `);;
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

    static getAllGeneralDocument = async () => {
        let result = { data: null, message: '' }
        let emp = null
        let message = ''
        try {
            realm.write(() => {
                let result = realm.objects(tableName).filtered(` documentTypeIdFK == 3 `);;
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


    static searchAsset = async (documateTitle) => {
        let result = { data: [], message: '' }
        let result1 = realm.objects(tableName).filtered(`documateTitle LIKE "*${documateTitle}*"`);
        if (result1.length > 0) {
            result.data = result1;
        } else {
            result.message = "No record found"
        }
        return result;
    }

    static searchAssetDocument = async (documateTitle, assetId, documentTypeIdFK) => {
        let result = { data: [], message: '' }
        let result1 = realm.objects(tableName).filtered(`masterId == "${assetId}" AND documentTypeIdFK =="${documentTypeIdFK}" AND documateTitle LIKE "*${documateTitle}*"`);
        if (result1.length > 0) {
            result.data = result1;
        } else {
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
            obj.documentId ? this.updateItem(obj) : null
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

    static getItemById = async (documentCode) => {
        let result = { data: null, message: '' }
        let emp = null
        let message = ''
        try {
            realm.write(() => {
                let result = realm.objects(tableName).filtered(`documentCode == "${documentCode}"`);;
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
                let result = realm.objects(tableName).filtered(`assetCode == "${assetCode}"`);;
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
                let result = realm.objects(tableName).filtered(`documentId == "${id}"`);;
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
        if (realm.objects(tableName).max("documentId")) {
            return realm.objects(tableName).max("documentId") + 1;
        }
        return 1;
    }
}