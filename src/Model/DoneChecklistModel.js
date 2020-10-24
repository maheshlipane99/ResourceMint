import { realm, Tables } from '../Database/DbConfig'
const tableName = Tables.DONE_CHECKLIST;

export default class DoneChecklistModel {

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

    static getPendingCount = async () => {
        let result = { data: [], message: '' }
        let r = realm.objects(tableName).filtered(`isSubmitted == false AND isDone == true`);
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

    static getAllPendingItems = async () => {
        let result = { data: [], message: '' }
        let r = realm.objects(tableName).filtered(`isSubmitted == false AND isDone == true`);
        result.data = r;
        if (result.data == null) {
            result.message = "No record found"
        }
        return result;
    }

    static getAllSubmitedItems = async () => {
        let result = { data: [], message: '' }
        let r = realm.objects(tableName).filtered(`isSubmitted == true`);
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
                if (!obj.doneChecklistId) {
                    obj.doneChecklistId = this.getPrimaryKeyId();
                }
                realm.create(tableName, obj, true);
            });

            result.data = obj
            result.message = "Successfully added";
            return result;
        } catch (err) {
            //   this.updateItem(obj.doneChecklistId, obj)
            return err.message
        }
    }

    static addAnswer = async (doneChecklistId, obj) => {
        let result = { data: null, message: '' }
        try {
            realm.write(() => {
                let answer = realm.create(Tables.ANSWER, obj, true);
                let mItem = realm.create(tableName, {
                    doneChecklistId: doneChecklistId,
                }, true);
                if (mItem.answers.filtered("questionIdFK == $0", obj.questionIdFk).length == 0) {
                    mItem.answers.push(answer);
                }
                result.message = "Successfully added in " + mItem.title;
            });
            return result;
        } catch (err) {
            return err.message
        }
    }

    static updateItem = async (id, obj) => {
        let result = { data: null, message: '' }
        obj.doneChecklistId = id;
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

    static getItemById = async (doneChecklistId) => {
        let result = { data: null, message: '' }
        try {
            let result = realm.objects(tableName).filtered(`doneChecklistId == "${doneChecklistId}"`)
            if (result != null && result[0] != null) {
                result.data = result[0];
            } else {
                result.message = "No record found"
            }
            return result
        } catch (e) {
            result.message = e.message
            return result
        }
    }

    static doneChecklist = async (doneChecklistId) => {
        let result = { data: null, message: '' }
        let obj = null
        let message = ''
        try {
            realm.write(() => {

                let result = realm.create(tableName, {
                    doneChecklistId: doneChecklistId,
                    isDone: true
                }, true);
                if (result != null) {
                    message = "Successfully Done"
                } else {
                    message = "No record found"
                }
            });
            result.data = null
            result.message = message
            return result
        } catch (e) {
            result.message = e.message
            return result
        }
    }

    static getDraftItemByAssetId = async (assetId, checklistId) => {
        let result = { data: null, message: '' }
        let emp = null
        let message = ''
        try {
            realm.write(() => {
                let result = realm.objects(tableName).filtered(`assetIdFK == "${assetId}" AND checklistIdFK == "${checklistId}" AND isDone == false AND isSubmitted == false `)
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

    static getHistoryChecklist = async (assetIdFk) => {
        let result = { data: null, message: '' }
        let emp = null
        let message = ''
        try {
            realm.write(() => {
                let result = realm.objects(tableName).filtered(`assetIdFK == "${assetIdFk}"`);;
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

    static getHistoryChecklistFilter = async (assetIdFk, currentCount) => {
        let mFrom = currentCount
        let mTo = (currentCount + 10)
        let result = { data: null, message: '', mCount: 0 }
        try {
            let data = realm.objects(tableName).filtered(`assetIdFK == "${assetIdFk}" AND isDone == true`).sorted('doneChecklistId', true).slice(mFrom, mTo)
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

    static getSubmitedChecklist = async (assetIdFk) => {
        let result = { data: null, message: '' }
        let emp = null
        let message = ''
        try {
            realm.write(() => {
                let result = realm.objects(tableName).filtered(`assetIdFK == "${assetIdFk}" AND isDone == false AND isSubmitted == true`);;
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
                let result = realm.objects(tableName).filtered(`doneChecklistId == "${id}"`)
                if (result != null && result[0] != null) {
                    realm.delete(result)
                    let answers = realm.objects(Tables.ANSWER).filtered(`doneChecklistIdFK == "${id}"`)
                    if (answers != null) {
                        realm.delete(answers)
                        message = "Record successsfuly deleted"
                    }
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
        let message = ''
        try {
            realm.write(() => {
                let result = realm.objects(tableName)
                if (result != null) {
                    realm.delete(result)
                    message = "All Record successsfuly deleted"
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

    static getPrimaryKeyId() {
        if (realm.objects(tableName).max("doneChecklistId")) {
            return realm.objects(tableName).max("doneChecklistId") + 1;
        }
        return 1;
    }

}