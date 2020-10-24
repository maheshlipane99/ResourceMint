const Realm = require('realm');
const version = 99
class Employee { }
Employee.schema = {
    name: 'Employee',
    primaryKey: 'id',
    properties: {
        id: { type: 'int', indexed: true },
        name: 'string',
        salary: 'int',
        createdOn: 'date',
        updatedOn: 'date'
    }
};


class Dashboard { }
Dashboard.schema = {
    name: 'Dashboard',
    primaryKey: 'id',
    properties: {
        id: { type: 'int', indexed: true },
        assetMate: 'int',
        docuMate: 'int',
        taskMate: 'int',
        totalComplaints: 'int',
        createdOn: 'date',
        updatedOn: 'date'
    }
};


class Document { }
Document.schema = {
    name: 'Document',
    primaryKey: 'documentCode',
    properties: {
        documentId: 'int',
        masterId: 'int',
        documentCode: { type: 'string', default: 0},
        documentTypeIdFK: 'int',
        documateTitle: 'string',
        description: 'string',
        documateFile: 'string',
        documentType: 'string',
        isDeleted:{ type: 'int', default: 0 },
        createdOn: { type: 'date', default: new Date() },
        updatedOn: { type: 'date', default: new Date() },
    }
};

class Checklist { }
Checklist.schema = {
    name: 'Checklist',
    primaryKey: 'checklistId',
    properties: {
        checklistId: 'int',
        categoryIdFK: 'int',
        title: 'string',
        isDeleted:{ type: 'int', default: 0 },
        createdOn: { type: 'date', default: new Date() },
        updatedOn: { type: 'date', default: new Date() },
        questions: { type: 'list', objectType: 'Question' }
    }
};


class DoneChecklist { }
DoneChecklist.schema = {
    name: 'DoneChecklist',
    primaryKey: 'doneChecklistId',
    properties: {
        doneChecklistId: { type: 'int', indexed: true },
        checklistIdFK: { type: 'int', default: 0 },
        assetIdFK: 'int',
        title: 'string',
        doneBy: 'string',
        isSubmitted: { type: 'bool', default: false },
        isDone: { type: 'bool', default: false },
        doneOn: { type: 'string', default: ''},
        createdOn: { type: 'date', default: new Date() },
        updatedOn: { type: 'date', default: new Date() },
        answers: { type: 'list', objectType: 'Answer' }
    }
};


class Answer { }
Answer.schema = {
    name: 'Answer',
    properties: {
        doneChecklistIdFK: 'int',
        questionIdFK: 'int',
        questionTitle: 'string',
        answer: 'string',
        isDanger: { type: 'int', default: 0 },
    }
};


class Question { }
Question.schema = {
    name: 'Question',
    primaryKey: 'questionId',
    properties: {
        questionId: { type: 'int', indexed: true },
        checkListIdFK: 'int',
        questionType: 'string',
        title: 'string',
        isRefer:{ type: 'int', default: 0 },
        isCompulsory:{ type: 'int', default: 1 },
        isDeleted:{ type: 'int', default: 0 },
        options: { type: 'list', objectType: 'Option' }
    }
};


class Option { }
Option.schema = {
    name: 'Option',
    primaryKey: 'questionOptionId',
    properties: {
        questionOptionId: 'int',
        isDanger: { type: 'int', default: 0 },
        referQuestionId: { type: 'int', default: 0 },
        questionOption: 'string',
        isDeleted:{ type: 'int', default: 0 },
    }
};


class Alert { }
Alert.schema = {
    name: 'Alert',
    primaryKey: 'alertId',
    properties: {
        alertId: 'int',
        masterIdFK: 'int',
        alertTitle: 'string',
        masterIdType: 'string',
        alertImage: 'string',
        message: { type: 'string', default: '' },
        isRead: { type: 'bool', default: false },
        createdOn: { type: 'date', default: new Date() },
        updatedOn: { type: 'date', default: new Date() },
    }
};

class Asset { }
Asset.schema = {
    name: 'Asset',
    primaryKey: 'assetId',
    properties: {
        assetId: 'int',
        assetTitle: 'string',
        assetCode: 'string',
        modelNumber: 'string',
        description: 'string',
        assetImage: { type: 'string', default: '' },
        companyAssetNo: { type: 'string', default: '' },
        installationDate: { type: 'string', default: '' },
        installedLocation: { type: 'string', default: '' },
        installedAt: { type: 'string', default: '' },
        userGuide: { type: 'string', default: '' },
        checkingDuration: { type: 'string', default: '' },
        durationTitle: { type: 'string', default: '' },
        warrenty: { type: 'string', default: '' },
        warrentyPeriod: { type: 'string', default: '' },
        organizationName: { type: 'string', default: '' },
        departmentTitle: { type: 'string', default: '' },
        supplierName: { type: 'string', default: '' },
        manufacturerName: { type: 'string', default: '' },
        categoryName: { type: 'string', default: '' },
        categoryId: 'int',
        auditMaint: { type: 'list', objectType: 'LastData' },
        isDeleted:{ type: 'int', default: 0 },
        message: { type: 'string', default: '' },
    }
};


class NewAsset { }
NewAsset.schema = {
    name: 'NewAsset',
    primaryKey: 'assetId',
    properties: {
        assetId: 'int',
        assetTitle: 'string',
        assetCode: 'string',
        modelNumber: 'string',
        description: { type: 'string', default: '' },
        image: { type: 'string', default: '' },
        companyAssetNo: { type: 'string', default: '' },
        installationDate: { type: 'string', default: '' },
        installationLocationTypeIdFK: { type: 'int', default: 0 },
        installedLocation: { type: 'string', default: '' },
        checkingDuration: { type: 'string', default: '' },
        durationTypeIdFK: { type: 'int', default: 0 },
        warrenty: { type: 'string', default: '' },
        warrantyDurationTypeIdFK: { type: 'int', default: 0 },
        supplierIdFK: { type: 'int', default: 0 },
        departmentIdFK: { type: 'int', default: 0 },
        manufacturerIdFK: { type: 'int', default: 0 },
        categoryIdFK: { type: 'int', default: 0 },
        isReady: { type: 'bool', default: false },
    }
};

class AssetImage { }
AssetImage.schema = {
    name: 'AssetImage',
    primaryKey: 'assetId',
    properties: {
        assetId: 'int',
        imageName: 'string',
        isSubmitted: { type: 'bool', default: false },
        createdOn: { type: 'date', default: new Date() },
    }
};

class AssetPosition { }
AssetPosition.schema = {
    name: 'AssetPosition',
    primaryKey: 'assetId',
    properties: {
        assetId: 'int',
        latitude: 'string',
        longitude: 'string',
        createdOn: { type: 'date', default: new Date() }
    }
};

class Features { }
Features.schema = {
    name: 'Features',
    primaryKey: 'featureIdFK',
    properties: {
        featureIdFK: 'int',
        featureCode: 'string',
        purpose: 'string',
        createdOn: { type: 'date', default: new Date() }
    }
};

class LocationType { }
LocationType.schema = {
    name: 'LocationType',
    primaryKey: 'locationTypeId',
    properties: {
        locationTypeId: 'int',
        title: 'string',
        isDeleted:{ type: 'int', default: 0 },
        createdOn: { type: 'date', default: new Date() }
    }
};

class DurationType { }
DurationType.schema = {
    name: 'DurationType',
    primaryKey: 'durationTypeId',
    properties: {
        durationTypeId: 'int',
        title: 'string',
        isDeleted:{ type: 'int', default: 0 },
        createdOn: { type: 'date', default: new Date() }
    }
};

class Supplier { }
Supplier.schema = {
    name: 'Supplier',
    primaryKey: 'supplierId',
    properties: {
        supplierId: 'int',
        title: 'string',
        isDeleted:{ type: 'int', default: 0 },
        createdOn: { type: 'date', default: new Date() }
    }
};

class Manufacturer { }
Manufacturer.schema = {
    name: 'Manufacturer',
    primaryKey: 'manufacturerId',
    properties: {
        manufacturerId: 'int',
        title: 'string',
        isDeleted:{ type: 'int', default: 0 },
        createdOn: { type: 'date', default: new Date() }
    }
};

class Department { }
Department.schema = {
    name: 'Department',
    primaryKey: 'departmentId',
    properties: {
        departmentId: 'int',
        title: 'string',
        isDeleted:{ type: 'int', default: 0 },
        createdOn: { type: 'date', default: new Date() }
    }
};

class Category { }
Category.schema = {
    name: 'Category',
    primaryKey: 'categoryId',
    properties: {
        categoryId: 'int',
        title: 'string',
        isDeleted:{ type: 'int', default: 0 },
        createdOn: { type: 'date', default: new Date() }
    }
};

class RecentAsset { }
RecentAsset.schema = {
    name: 'RecentAsset',
    primaryKey: 'assetId',
    properties: {
        assetId: 'int',
        assetCode: 'string',
        createdOn: { type: 'date', default: new Date() },
        updatedOn: { type: 'date', default: new Date() },
    }
};

class LastData { }
LastData.schema = {
    name: 'LastData',
    properties: {
        title: 'string',
        onDate: 'string',
        doneBy: 'string',
        installAt: 'string',
    }
};


class SystemLog { }
SystemLog.schema = {
    name: 'SystemLog',
    primaryKey: 'id',
    properties: {
        id: 'int',
        log: 'string',
        createdOn: { type: 'date', default: new Date() },
    }
};



class User { }
User.schema = {
    name: 'User',
    primaryKey: 'userId',
    properties: {
        userId: 'int',
        userRoleIdFK: 'int',
        firstName: 'string',
        lastName: 'string',
        userRole: 'string',
        departmentTitle: 'string',
        profileImage: 'string',
        isDeleted:{ type: 'int', default: 0 },
        createdOn: { type: 'date', default: new Date() },
        updatedOn: { type: 'date', default: new Date() },
    }
};

class Status { }
Status.schema = {
    name: 'Status',
    primaryKey: 'complaintStatusId',
    properties: {
        complaintStatusId: 'int',
        title: 'string',
        isDeleted:{ type: 'int', default: 0 },
        isChecked: { type: 'bool', default: false },
        isCompleted: { type: 'bool', default: false },
        createdOn: { type: 'date', default: new Date() },
    }
};


class Complaint { }
Complaint.schema = {
    name: 'Complaint',
    primaryKey: 'complaintId',
    properties: {
        complaintId: { type: 'int', default: 0 },
        serverId: { type: 'int', default: 0 },
        typeOfComplaintFK: { type: 'int', default: 1 },
        assetCode: 'string',
        title: 'string',
        message: { type: 'string', default: '' },
        assetTitle: { type: 'string', default: '' },
        assetCode: { type: 'string', default: '' },
        complaintStatus: { type: 'string', default: 'Pending' },
        assignedUsers: { type: 'list', objectType: 'AssignedUser' },
        complaintImages: { type: 'list', objectType: 'ComplaintImage' },
        raisedBy: { type: 'string', default: '' },
        assignedByUserRole: { type: 'string', default: '' },
        isTransferred: { type: 'bool', default: false },
        isSubmitted: { type: 'bool', default: false },
        isDraft: { type: 'bool', default: false },
        isMy: { type: 'bool', default: false },
        raisedOn: { type: 'string', default: '' },
        createdOn: { type: 'date', default: new Date() },
        warning: { type: 'string', default: '' },
    }
};

class AssignedUser { }
AssignedUser.schema = {
    name: 'AssignedUser',
    properties: {
        userIdFK: 'int',
        createdOn: { type: 'date', default: new Date() },
    }
};

class ComplaintImage { }
ComplaintImage.schema = {
    name: 'ComplaintImage',
    properties: {
        imageName: 'string',
        isSubmitted: { type: 'bool', default: false },
        createdOn: { type: 'date', default: new Date() },
    }
};

class StoreComplaintImage { }
StoreComplaintImage.schema = {
    name: 'StoreComplaintImage',
    primaryKey: 'id',
    properties: {
        id: { type: 'int', indexed: true },
        complaintId: { type: 'int', default: 1 },
        imageName: 'string',
        isSubmitted: { type: 'bool', default: false },
        createdOn: { type: 'date', default: new Date() },
    }
};

class ChangeStatus { }
ChangeStatus.schema = {
    name: 'ChangeStatus',
    primaryKey: 'id',
    properties: {
        id: { type: 'int', indexed: true },
        complaintId: 'int',
        complaintStatusIdFK: 'int',
        isSubmitted: { type: 'bool', default: false },
        createdOn: { type: 'date', default: new Date() },
    }
};


class TransferComplaint { }
TransferComplaint.schema = {
    name: 'TransferComplaint',
    primaryKey: 'id',
    properties: {
        id: { type: 'int', indexed: true },
        complaintId: 'int',
        toUserIdFK: 'int',
        isSubmitted: { type: 'bool', default: false },
        createdOn: { type: 'date', default: new Date() },
    }
};


class NextAudit { }
NextAudit.schema = {
    name: 'NextAudit',
    primaryKey: 'id',
    properties: {
        id: { type: 'int', indexed: true },
        doneChecklistId: 'int',
        checkListIdFK: 'int',
        assetIdFK: 'int',
        lastAuditDone: 'string',
        nextAuditDate: 'string',
    }
};

class ChecklistImage { }
ChecklistImage.schema = {
    name: 'ChecklistImage',
    primaryKey: 'imageId',
    properties: {
        imageId: 'string',
        checklistImage: 'string',
        imageDescription: 'string',
        isSubmitted: { type: 'bool', default: false },
    }
};

class ComplaintTrack { }
ComplaintTrack.schema = {
    name: 'ComplaintTrack',
    primaryKey: 'complaintTrackId',
    properties: {
        complaintTrackId: { type: 'int'},
        complaintIdFK: 'int',
        userProfile: 'string',
        typeOfComplaint: 'string',
        typeOfUser: 'string',
        userName: 'string',
        createdDate: 'string',
        complaintStatus: 'string',
        createdOn: { type: 'date', default: new Date() },
    }
};

export const realm = new Realm({
    schema: [
        Employee,
        Dashboard,
        Checklist,
        Question,
        Option,
        Asset,
        NewAsset,
        AssetImage,
        AssetPosition,
        Features,
        LocationType,
        DurationType,
        Supplier,
        Manufacturer,
        Department,
        Category,
        LastData,
        DoneChecklist,
        Answer,
        Document,
        Alert,
        RecentAsset,
        SystemLog,
        User,
        Status,
        AssignedUser,
        Complaint,
        ComplaintImage,
        ChangeStatus,
        TransferComplaint,
        StoreComplaintImage,
        NextAudit,
        ChecklistImage,
        ComplaintTrack
    ],
    schemaVersion: version,
    migration: (oldRealm, newRealm) => {
        if (oldRealm.schemaVersion < version) {
            newRealm.deleteAll();
        }
    },
});

export const Tables = {
    EMPLOYEE: 'Employee',
    DASHBOARD: 'Dashboard',
    CHECKLIST: 'Checklist',
    QUESTION: 'Question',
    OPTION: 'Option',
    ASSET: 'Asset',
    NEW_ASSET: 'NewAsset',
    ASSET_IMAGE: 'AssetImage',
    ASSET_POSITION: 'AssetPosition',
    FEATURES: 'Features',
    DEPARTMENT: 'Department',
    SUPPLIER: 'Supplier',
    MANUFACTURER: 'Manufacturer',
    CATEGORY:'Category',
    DURATION_TYPE: 'DurationType',
    LOCATION_TYPE: 'LocationType',
    LASTDATA: 'LastData',
    DONE_CHECKLIST: 'DoneChecklist',
    ANSWER: 'Answer',
    DOCUMENT: 'Document',
    ALERT: 'Alert',
    RECENT_ASSET: 'RecentAsset',
    SYSTEM_LOG: 'SystemLog',
    USER: 'User',
    STATUS: 'Status',
    ASSIGNED_USER: 'AssignedUser',
    COMPLAINT: 'Complaint',
    COMPLAINT_IMAGE: 'ComplaintImage',
    STORE_COMPLAINT_IMAGE: 'StoreComplaintImage',
    CHANGE_STATUS: 'ChangeStatus',
    TRANSFER_COMPLAINT: 'TransferComplaint',
    NEXT_AUDIT: 'NextAudit',
    CHEKLIST_IMAGE: 'ChecklistImage',
    COMPLAINT_TRACK:'ComplaintTrack'
}
