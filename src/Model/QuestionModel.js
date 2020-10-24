import { realm ,Tables} from '../Database/DbConfig'
const tableName=Tables.QUESTION;

export default class QuestionModel {

    constructor(obj) {
        obj && Object.assign(this, obj);
    }

    getAllItems= async () => {
        let result = { data: [], message: '' }
        let r = realm.objects(tableName);
        result.data = r;
        return result;
    }

    addItem= async (obj) => {
        let result = { data: null, message: '' }
        obj.createdOn=new Date();
        obj.updatedOn=new Date();

        try {
            realm.write(() => {
                realm.create(tableName, obj);
            });
            result.message ="Successfully added";
            return result;
        } catch (err) {
            console.log(err.message);
            return err.message
        }
    }

    updateItem = async (id,obj) => {
        let result = { data: null, message: '' }
        obj.id=id;
        obj.updatedOn=new Date();
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
                let result = realm.objects(tableName).filtered(`questionId == "${id}"`);;
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
                let result = realm.objects(tableName).filtered(`questionId == "${id}"`);;
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

    getPrimaryKeyId() {
        if (realm.objects(tableName).max("id")) {
            return realm.objects(tableName).max("id") + 1;
        }
        return 1;
    }


    getUpdatedItem = async () => {
        let result = { data: null, message: '' }
        if (realm.objects(tableName).sorted('id', true)) {
            let data= realm.objects(tableName).sorted('id', true)[0];
            result.data=data;
        }
        return result;
    }
}