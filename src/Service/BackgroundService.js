import { NetInfo, } from "react-native";
import BaseResponce from '../Model/BaseResponce'
import { BASE_URL } from '../Utils/Const'
import AssetModel from '../Model/AssetModel';
import DashboardModel from '../Model/DashboardModel';
import ChecklistModel from '../Model/ChecklistModel';
import DoneChecklistModel from '../Model/DoneChecklistModel';
import DocumentModel from '../Model/DocumentModel';
import AlertModel from '../Model/AlertModel';
import SystemLogModel from '../Model/SystemLogModel';
import UserModel from '../Model/UserModel';
import StatusModel from '../Model/StatusModel';
import ComplaintModel from '../Model/ComplaintModel';
import TaskModel from '../Model/TaskModel';
import ChangeStatusModel from '../Model/ChangeStatusModel';
import TransCompModel from '../Model/TransCompModel';
import StoreImageModel from '../Model/StoreImageModel';
import ChekImageModel from '../Model/ChekImageModel';
import AssetImageModel from '../Model/AssetImageModel';
import NextAuditModel from '../Model/NextAuditModel';
import ComplaintTrackModel from '../Model/ComplaintTrackModel';

import LocationTypeModel from '../Model/LocationTypeModel';
import DurationTypeModel from '../Model/DurationTypeModel';
import SupplierModel from '../Model/SupplierModel';
import ManufacturerModel from '../Model/ManufacturerModel';
import CategoryModel from '../Model/CategoryModel';
import DepartmentModel from '../Model/DepartmentModel';
import AssetPositionModel from '../Model/AssetPositionModel';
import NewAssetModel from '../Model/NewAssetModel';
import FeaturesModel from '../Model/FeaturesModel';

const dashboard = new DashboardModel();
var isConnected = false;
NetInfo.isConnected.fetch().done((isConnected1) => {
  isConnected = isConnected1
  console.log(isConnected);

});

export default class BackgroundService {

  constructor(props) {
    this.props = props
  }


  static startAssetImageUploading = async (mToken) => {
    if (isConnected) {
      return AssetImageModel.getAllItems().then(result => {
        console.log(JSON.stringify(result.data));
        if (result.data) {
          result.data.forEach(element => {
            this.uploadAssetImage(mToken, element).then((result) => {
              console.log(JSON.stringify(result));
            })
          });
        } else {
          return 'No Image Pending';
        }

      })
    }
  }

  static uploadAssetImage(mToken, mData) {
    SystemLogModel.addItem('Asset Image Uploading Start')
    let uri = mData.imageName
    // uri='http://192.168.0.127:8001/mahesh.jpg'
    let filename = uri.split('/').pop()
    let name = filename
    let type = 'image/jpeg'
    const file = {
      uri,             // e.g. 'file:///path/to/file/image123.jpg'
      name,            // e.g. 'image123.jpg',
      type             // e.g. 'image/jpg'
    }
    console.log('file ' + JSON.stringify(file));
    const body = new FormData()
    body.append('file', file)

    return fetch(BASE_URL + 'addAssets/uploadAssetImage', {
      method: 'POST',
      headers: {
        'Authorization': mToken,
      },
      body
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("upload succes", JSON.stringify(responseJson));
        BaseResponce.setResponce(responseJson);
        if (BaseResponce.getStatus()) {
          return NewAssetModel.setImage(mData.assetId, responseJson.ImageName).then((result) => {
            console.log(JSON.stringify(result));
            this.startNewAssetUploading(mToken);
            return AssetImageModel.deleteItem(mData.assetId).then((result) => {
              console.log(JSON.stringify(result));
              SystemLogModel.addItem(BaseResponce.getMessage())
              return true
            })
          })
        } else {
          SystemLogModel.addItem(BaseResponce.getMessage())
          return false
        }
      })
      .catch((error) => {
        console.error(error);
        return false
      });
  };

  static startNewAssetUploading = async (mToken) => {
    if (isConnected) {
      return NewAssetModel.getAllReadyItems().then(result => {
        console.log(JSON.stringify(result.data));
        if (result.data) {
          result.data.forEach(element => {
            this.uploadNewAsset(mToken, element).then((result) => {
              return result
            })
          });
        } else {
          return 'No Checklist Available';
        }

      })
    }
  }


  static uploadNewAsset = async (mToken, mData) => {
    if (isConnected) {
      SystemLogModel.addItem('Asset Uploading Start of Id : ' + mData.assetId)
      return fetch(BASE_URL + 'addAssets/addAsset/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        },
        body: JSON.stringify(mData),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);

          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus()) {
              let mId = mData.assetId
              try {
                return NewAssetModel.deleteItem(mId).then((result) => {
                  console.log(JSON.stringify(result));
                  SystemLogModel.addItem('Asset Uploading Done')
                })
              } catch (e) {
                console.log(e.message);
              }


            } else {
              console.log(BaseResponce.getMessage());
              return false
            }
          } else {
            console.log("message " + BaseResponce.getMessage());
            return false
          }

        })
        .catch((error) => {
          console.error(error);
          return false
        });
    } else {
      return false
    }
  }

  static getCheckMark = async (mToken) => {
    if (isConnected) {
      return AssetPositionModel.getAllItems().then(result => {
        console.log(JSON.stringify(result.data));
        if (result.data) {
          result.data.forEach(element => {
            this.uploadCheckMark(mToken, element, element.assetId).then((result) => {
              return result
            })
          });
        } else {
          return 'No Checklist Available';
        }
      })
    }
  }


  static uploadCheckMark = async (mToken, mData, mId) => {
    if (isConnected) {
      SystemLogModel.addItem('Asset Location Uploading Start of Asset Id : ' + mId)
      return fetch(BASE_URL + 'addAssets/addAssetLatLong/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        },
        body: JSON.stringify(mData),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            return AssetPositionModel.deleteItem(mId).then((result) => {
              SystemLogModel.addItem(BaseResponce.getMessage())
            })
          } else {
            console.log("message " + BaseResponce.getMessage());
            SystemLogModel.addItem(BaseResponce.getMessage())
            return false
          }

        })
        .catch((error) => {
          console.error(error);
          return false
        });
    }
  }

  static getCategory = async (mToken) => {
    if (isConnected) {
      SystemLogModel.addItem('Category  Downloading Start')
      return fetch(BASE_URL + 'addAssets/categoryList/', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              data.forEach(element => {
                CategoryModel.addItem(element)
              });
              SystemLogModel.addItem(data.length + ' Category  Downloaded')
              return true
            } else {
              console.log(BaseResponce.getMessage());
              SystemLogModel.addItem(BaseResponce.getMessage())
              return false
            }
          } else {
            console.log("message " + BaseResponce.getMessage());
            SystemLogModel.addItem(BaseResponce.getMessage())
            return false
          }

        })
        .catch((error) => {
          console.error(error);
          return false
        });

    }
  }

  static getLocationType = async (mToken) => {
    if (isConnected) {
      SystemLogModel.addItem('LocationType  Downloading Start')
      return fetch(BASE_URL + 'addAssets/installationLocationTypeList/', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              data.forEach(element => {
                LocationTypeModel.addItem(element)
              });
              SystemLogModel.addItem(data.length + ' LocationType  Downloaded')
              return true
            } else {
              console.log(BaseResponce.getMessage());
              SystemLogModel.addItem(BaseResponce.getMessage())
              return false
            }
          } else {
            console.log("message " + BaseResponce.getMessage());
            SystemLogModel.addItem(BaseResponce.getMessage())
            return false
          }

        })
        .catch((error) => {
          console.error(error);
          return false
        });

    }
  }

  static getDurationType = async (mToken) => {
    if (isConnected) {
      SystemLogModel.addItem('DurationType Downloading Start')
      return fetch(BASE_URL + 'addAssets/durationTypesList/', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              data.forEach(element => {
                DurationTypeModel.addItem(element)
              });
              SystemLogModel.addItem(data.length + ' DurationType Downloaded')
              return true
            } else {
              console.log(BaseResponce.getMessage());
              SystemLogModel.addItem(BaseResponce.getMessage())
              return false
            }
          } else {
            console.log("message " + BaseResponce.getMessage());
            SystemLogModel.addItem(BaseResponce.getMessage())
            return false
          }

        })
        .catch((error) => {
          console.error(error);
          return false
        });

    }
  }

  static getSupplier = async (mToken) => {
    if (isConnected) {
      SystemLogModel.addItem('Supplier Downloading Start')
      return fetch(BASE_URL + 'addAssets/suppliersList/', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              data.forEach(element => {
                SupplierModel.addItem(element)
              });
              SystemLogModel.addItem(data.length + ' Supplier Downloaded')
              return true
            } else {
              console.log(BaseResponce.getMessage());
              SystemLogModel.addItem(BaseResponce.getMessage())
              return false
            }
          } else {
            console.log("message " + BaseResponce.getMessage());
            SystemLogModel.addItem(BaseResponce.getMessage())
            return false
          }

        })
        .catch((error) => {
          console.error(error);
          return false
        });

    }
  }

  static getManufacturer = async (mToken) => {
    if (isConnected) {
      SystemLogModel.addItem('Manufacturer Downloading Start')
      return fetch(BASE_URL + 'addAssets/manufacturerList/', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              data.forEach(element => {
                ManufacturerModel.addItem(element)
              });
              SystemLogModel.addItem(data.length + ' Manufacturer Downloaded')
              return true
            } else {
              console.log(BaseResponce.getMessage());
              SystemLogModel.addItem(BaseResponce.getMessage())
              return false
            }
          } else {
            console.log("message " + BaseResponce.getMessage());
            SystemLogModel.addItem(BaseResponce.getMessage())
            return false
          }

        })
        .catch((error) => {
          console.error(error);
          return false
        });

    }
  }

  static getDepartment = async (mToken) => {
    if (isConnected) {
      SystemLogModel.addItem('Department Downloading Start')
      return fetch(BASE_URL + 'addAssets/departmentList/', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              data.forEach(element => {
                DepartmentModel.addItem(element)
              });
              SystemLogModel.addItem(data.length + ' Department Downloaded')
              return true
            } else {
              console.log(BaseResponce.getMessage());
              SystemLogModel.addItem(BaseResponce.getMessage())
              return false
            }
          } else {
            console.log("message " + BaseResponce.getMessage());
            SystemLogModel.addItem(BaseResponce.getMessage())
            return false
          }

        })
        .catch((error) => {
          console.error(error);
          return false
        });

    }
  }

  static getChecklistImage = async (mToken, imageId) => {
    if (isConnected) {
      let result = { data: false, message: '' }
      SystemLogModel.addItem('Checklist Image Checking Start of Id : ' + imageId)
      return fetch(BASE_URL + 'asset/getChecklistImage/' + imageId, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              return ChekImageModel.updateItem(data).then((result) => {
                console.log(JSON.stringify(result));
                SystemLogModel.addItem('Checklist Image Received of Id : ' + imageId)
                return data
              })
            } else {
              console.log(BaseResponce.getMessage());
              result.message = BaseResponce.getMessage()
              return result
            }
          } else {
            console.log("message " + BaseResponce.getMessage());
            result.message = BaseResponce.getMessage()
            return result
          }

        })
        .catch((error) => {
          console.error(error);
          result.message = error.message
          return result
        });
    }
  }

  static getTransferComplaintLocal = async (mToken) => {
    if (isConnected) {
      return TransCompModel.getAllPendingItems().then(result => {
        console.log(JSON.stringify(result.data));
        if (result.data) {
          result.data.forEach(element => {
            this.uploadTransComplaint(mToken, element, element.id).then((result) => {
              return result
            })
          });
        } else {
          return 'No Checklist Available';
        }
      })
    }
  }


  static uploadTransComplaint = async (mToken, mData, mId) => {
    if (isConnected) {
      SystemLogModel.addItem('Transfer Complaint Uploading Start of Id : ' + mId)
      return fetch(BASE_URL + 'complaints/transferComplaint/' + mData.complaintId + '?toUserIdFK=+' + mData.toUserIdFK, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        },
        body: JSON.stringify(mData),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus()) {
              return TransCompModel.deleteItem(mId).then((result) => {
                SystemLogModel.addItem(BaseResponce.getMessage())
                return true
              })
            } else {
              console.log(BaseResponce.getMessage());
              SystemLogModel.addItem(BaseResponce.getMessage())
              return false
            }
          } else {
            console.log("message " + BaseResponce.getMessage());
            SystemLogModel.addItem(BaseResponce.getMessage())
            return false
          }

        })
        .catch((error) => {
          console.error(error);
          return false
        });
    }
  }


  static getChangeStatus = async (mToken) => {
    if (isConnected) {
      return ChangeStatusModel.getAllPendingItems().then(result => {
        console.log(JSON.stringify(result.data));
        if (result.data) {
          result.data.forEach(element => {
            this.uploadChangeStatus(mToken, element, element.id).then((result) => {
              return result
            })
          });
        } else {
          return 'No Checklist Available';
        }
      })
    }
  }


  static uploadChangeStatus = async (mToken, mData, mId) => {
    if (isConnected) {
      SystemLogModel.addItem('Change Status Uploading Start of Id : ' + mId)
      return fetch(BASE_URL + 'complaints/changeComplaintStatus/' + mData.complaintId + '?complaintStatusIdFK=' + mData.complaintStatusIdFK, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        },
        body: JSON.stringify(mData),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus()) {
              return ChangeStatusModel.deleteItem(mId).then((result) => {
                SystemLogModel.addItem(BaseResponce.getMessage())
                return true
              })
            } else {
              console.log(BaseResponce.getMessage());
              SystemLogModel.addItem(BaseResponce.getMessage())
              return false
            }
          } else {
            console.log("message " + BaseResponce.getMessage());
            SystemLogModel.addItem(BaseResponce.getMessage())
            return false
          }

        })
        .catch((error) => {
          console.error(error);
          return false
        });
    }
  }

  static getAssetComplaints = async (mToken, assetId, mCurrentPage) => {
    if (isConnected) {
      var currentPage = parseInt(mCurrentPage)
      var totalPages = 0
      SystemLogModel.addItem('Complaints Checking Start')
      return fetch(BASE_URL + 'complaints/getAssetAssignedComplaints/' + currentPage + '?assetId=' + assetId + '&typeOfComplaint=2', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              totalPages = BaseResponce.getTotalPages();
              currentPage = BaseResponce.getCurrentPage();
              data.forEach(element => {
                element.isSubmitted = true
                element.serverId = element.complaintId
                ComplaintModel.addItem(element).then((result) => {
                  console.log(JSON.stringify(result));
                })
              });
              SystemLogModel.addItem(data.length + ' Complaints Receive')
              if (currentPage == totalPages) {
                return true
              } else {
                currentPage = parseInt(currentPage) + 1;
                this.getAssetComplaints(mToken, currentPage)
              }
            } else {
              console.log(BaseResponce.getMessage());
              if (BaseResponce.getMessage() == 'Fail to Authentication. Error -> TokenExpiredError: jwt expired') {
                SystemLogModel.addItem(BaseResponce.getMessage())
                return 'tok'
              }

            }
          } else {
            SystemLogModel.addItem(BaseResponce.getMessage())
            console.log("message " + BaseResponce.getMessage());
            return false
          }

        })
        .catch((error) => {
          console.error(error);
          return false
        });
    }
  }


  static getComplaintTrack = async (mToken, complaintId, mCurrentPage) => {
    if (isConnected) {
      var currentPage = parseInt(mCurrentPage)
      var totalPages = 0
      SystemLogModel.addItem('Complaints Track Checking Start')
      return fetch(BASE_URL + 'complaints/complaintsTrackList/' + complaintId + '/' + currentPage, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              totalPages = BaseResponce.getTotalPages();
              currentPage = BaseResponce.getCurrentPage();
              data.forEach(element => {
                ComplaintTrackModel.addItem(element).then((result) => {
                  console.log(JSON.stringify(result));
                })
              });
              SystemLogModel.addItem(BaseResponce.getMessage())
              SystemLogModel.addItem(data.length + ' Complaint Tracks Receive')
              // if (currentPage == totalPages) {
              //   return true
              // } else {
              //   currentPage = parseInt(currentPage) + 1;
              //   this.getComplaintTrack(mToken, currentPage)
              // }
              return true
            } else {
              console.log(BaseResponce.getMessage());
              if (BaseResponce.getMessage() == 'Fail to Authentication. Error -> TokenExpiredError: jwt expired') {
                SystemLogModel.addItem(BaseResponce.getMessage())
                return 'tok'
              }

            }
          } else {
            SystemLogModel.addItem(BaseResponce.getMessage())
            console.log("message " + BaseResponce.getMessage());
            return false
          }

        })
        .catch((error) => {
          console.error(error);
          return false
        });
    }
  }

  static startCheckImageUploading = async (mToken) => {
    if (isConnected) {
      return ChekImageModel.getAllPendingItems().then(result => {
        console.log(JSON.stringify(result.data));
        if (result.data) {
          result.data.forEach(element => {
            this.uploadCheckImage(mToken, element).then((result) => {
              console.log(JSON.stringify(result));
            })
          });
        } else {
          return 'No Image Pending';
        }

      })
    }
  }

  static uploadCheckImage(mToken, mData) {
    SystemLogModel.addItem('Checklist Image Uploading Start')
    let uri = mData.checklistImage
    // uri='http://192.168.0.127:8001/mahesh.jpg'
    let filename = uri.split('/').pop()
    let name = filename
    let type = 'image/jpeg'
    const file = {
      uri,             // e.g. 'file:///path/to/file/image123.jpg'
      name,            // e.g. 'image123.jpg',
      type             // e.g. 'image/jpg'
    }
    console.log('file ' + JSON.stringify(file));
    const body = new FormData()
    body.append('checklistImage', file)
    body.append('imageId', mData.imageId)
    body.append('imageDescription', mData.imageDescription)

    return fetch(BASE_URL + 'asset/uploadChecklistImage', {
      method: 'POST',
      headers: {
        'Authorization': mToken,
      },
      body
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("upload succes", JSON.stringify(responseJson));
        BaseResponce.setResponce(responseJson);
        if (BaseResponce.getStatus()) {
          return ChekImageModel.updateItem(mData).then((result) => {
            console.log(JSON.stringify(result));
            SystemLogModel.addItem(BaseResponce.getMessage())
            return true
          })
        } else {
          SystemLogModel.addItem(BaseResponce.getMessage())
          return false
        }
      })
      .catch((error) => {
        console.error(error);
        return false
      });
  };

  static startImageUploading = async (mToken) => {
    if (isConnected) {
      return StoreImageModel.getAllPendingItems().then(result => {
        console.log(JSON.stringify(result.data));
        if (result.data) {
          result.data.forEach(element => {
            this.uploadComplaintImage(mToken, element).then((result) => {
              console.log(JSON.stringify(result));
            })
          });
        } else {
          return 'No Image Pending';
        }

      })
    }
  }

  static uploadComplaintImage(mToken, mData) {
    SystemLogModel.addItem('Complaints Image Uploading Start')
    let uri = mData.imageName
    // uri='http://192.168.0.127:8001/mahesh.jpg'
    let filename = uri.split('/').pop()
    let name = filename
    let type = 'image/jpeg'
    const file = {
      uri,             // e.g. 'file:///path/to/file/image123.jpg'
      name,            // e.g. 'image123.jpg',
      type             // e.g. 'image/jpg'
    }
    console.log('file ' + JSON.stringify(file));
    const body = new FormData()
    body.append('complaintImages', file)

    return fetch(BASE_URL + 'complaints/uploadImage/' + mData.complaintId, {
      method: 'POST',
      headers: {
        'Authorization': mToken,
      },
      body
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("upload succes", JSON.stringify(responseJson));
        BaseResponce.setResponce(responseJson);
        if (BaseResponce.getStatus()) {
          return StoreImageModel.deleteItem(mData.id).then((result) => {
            console.log(JSON.stringify(result));
            SystemLogModel.addItem(BaseResponce.getMessage())
            return true
          })
        } else {
          SystemLogModel.addItem(BaseResponce.getMessage() + '')
          return false
        }
      })
      .catch((error) => {
        console.error(error);
        return false
      });
  };

  static startComplaintUploading = async (mToken) => {
    if (isConnected) {
      return ComplaintModel.getAllPendingItems().then(result => {
        console.log(JSON.stringify(result.data));
        if (result.data) {
          result.data.forEach(elementt => {
            let str = JSON.stringify(elementt)
            let element = JSON.parse(str)

            let assignedUsers = []
            elementt.assignedUsers.forEach(element1 => {
              assignedUsers.push(element1)
            });
            element.assignedUsers = assignedUsers;

            let complaintImages = []
            elementt.complaintImages.forEach(element2 => {
              complaintImages.push(element2)
            });
            element.complaintImages = complaintImages;
            if (assignedUsers.length == 0) {
              return true
            }
            this.uploadComplaint(mToken, element, element.complaintId).then((result) => {
              return result
            })
          });
        } else {
          return 'No Complaints Pending to Upload';
        }

      })
    }
  }


  static uploadComplaint = async (mToken, mData, mId) => {
    if (isConnected) {
      SystemLogModel.addItem('Complaint Uploading Start of Id : ' + mId)
      return fetch(BASE_URL + 'complaints/raisedComplaint/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        },
        body: JSON.stringify(mData),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              mData.complaintImages.forEach(element => {
                this.storeImage(data.complaintId, element.imageName)
              });
              data.serverId = data.complaintId
              data.complaintId = mId
              data.isMy = true
              data.complaintImages = mData.complaintImages
              data.typeOfComplaintFK = parseInt(data.typeOfComplaintFK)
              return ComplaintModel.deleteItem(data.complaintId).then((result) => {
                console.log(JSON.stringify(result));
                if (result.data) {
                  SystemLogModel.addItem(BaseResponce.getMessage())
                  SystemLogModel.addItem('Complaint Uploading Done of Id : ' + mId)
                  this.startImageUploading(mToken)
                  return true
                }
              })
            } else {
              console.log(BaseResponce.getMessage());
              let mNewObj=JSON.parse(JSON.stringify(mData))
              mNewObj.warning=BaseResponce.getMessage()
              ComplaintModel.updateItem(mNewObj)
              SystemLogModel.addItem(BaseResponce.getMessage())
              return false
            }
          } else {
            console.log("message " + BaseResponce.getMessage());
            SystemLogModel.addItem(BaseResponce.getMessage())
            return false
          }

        })
        .catch((error) => {
          console.error(error);
          return false
        });
    }
  }


  static startTaskUploading = async (mToken) => {
    if (isConnected) {
      return TaskModel.getAllPendingItems().then(result => {
        console.log(JSON.stringify(result.data));
        if (result.data) {
          result.data.forEach(elementt => {
            let str = JSON.stringify(elementt)
            let element = JSON.parse(str)

            let assignedUsers = []
            elementt.assignedUsers.forEach(element1 => {
              assignedUsers.push(element1)
            });
            element.assignedUsers = assignedUsers;

            let complaintImages = []
            elementt.complaintImages.forEach(element2 => {
              complaintImages.push(element2)
            });
            element.complaintImages = complaintImages;
            if (assignedUsers.length == 0) {
              return true
            }
            this.uploadTask(mToken, element, element.complaintId).then((result) => {
              return result
            })
          });
        } else {
          return 'No Checklist Available';
        }

      })
    }
  }

  static storeImage = async (complaintId, imageName) => {
    let mImage = {
      complaintId: complaintId,
      imageName: imageName
    }
    StoreImageModel.addItem(mImage).then((result) => {
      console.log(JSON.stringify(result));
    })
  }

  static uploadTask = async (mToken, mData, mId) => {
    if (isConnected) {
      console.log(JSON.stringify(mData));
      SystemLogModel.addItem('Task Uploading Start of Id : ' + mId)
      return fetch(BASE_URL + 'taskmate/createTask/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        },
        body: JSON.stringify(mData),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();

              mData.complaintImages.forEach(element => {
                this.storeImage(data.complaintId, element.imageName)
              });
              data.serverId = data.complaintId
              data.complaintId = mId
              data.isMy = true
              data.complaintImages = mData.complaintImages
              data.typeOfComplaintFK = parseInt(data.typeOfComplaintFK)

              return TaskModel.deleteItem(data.complaintId).then((result) => {
                console.log(JSON.stringify(result));
                if (result.data) {
                  SystemLogModel.addItem(BaseResponce.getMessage())
                  SystemLogModel.addItem('Task Uploading Done of Id : ' + mId)
                  this.startImageUploading(mToken)
                  return true
                }
              })
            } else {
              console.log(BaseResponce.getMessage());
              let mNewObj=JSON.parse(JSON.stringify(mData))
              mNewObj.warning=BaseResponce.getMessage()
              TaskModel.updateItem(mNewObj)
              SystemLogModel.addItem(BaseResponce.getMessage())
              return false
            }
          } else {
            console.log("message " + BaseResponce.getMessage());
            SystemLogModel.addItem(BaseResponce.getMessage())
            return false
          }

        })
        .catch((error) => {
          console.error(error);
          return false
        });
    }
  }

  static getAllStatus = async (mToken) => {
    if (isConnected) {
      SystemLogModel.addItem('Status Downloading Start')
      return fetch(BASE_URL + 'complaints/getAllStatus/', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              data.forEach(element => {
                StatusModel.addItem(element)
              });
              SystemLogModel.addItem(data.length + ' Status Downloaded')
              return true
            } else {
              console.log(BaseResponce.getMessage());
              SystemLogModel.addItem(BaseResponce.getMessage())
              return false
            }
          } else {
            console.log("message " + BaseResponce.getMessage());
            SystemLogModel.addItem(BaseResponce.getMessage())
            return false
          }

        })
        .catch((error) => {
          console.error(error);
          return false
        });

    }
  }

  static getFeatures = async (mToken) => {
    if (isConnected) {
      SystemLogModel.addItem('Features Downloading Start')
      return fetch(BASE_URL + 'home/assignedFeaturesById/', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              FeaturesModel.deleteAllItem().then((result) => {
                data.forEach(element => {
                  FeaturesModel.addItem(element).then((result) => {
                    console.log(JSON.stringify(result));
                    SystemLogModel.addItem(JSON.stringify(element)+ ' Feature Added')
                  })
                });
              })
              
              SystemLogModel.addItem(data.length + ' Features Downloaded')
              return true
            } else {
              console.log(BaseResponce.getMessage());
              SystemLogModel.addItem(BaseResponce.getMessage())
              return false
            }
          } else {
            console.log("message " + BaseResponce.getMessage());
            SystemLogModel.addItem(BaseResponce.getMessage())
            return false
          }

        })
        .catch((error) => {
          console.error(error);
          return false
        });

    }
  }


  static getAllUser = async (mToken, mCurrentPage) => {
    console.log(mCurrentPage);
    if (isConnected) {
      var currentPage = parseInt(mCurrentPage)
      var totalPages = 0
      SystemLogModel.addItem('User Downloading Start of Page : ' + mCurrentPage)
      return fetch(BASE_URL + 'complaints/getUserByOrganization/' + currentPage, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              totalPages = BaseResponce.getTotalPages();
              currentPage = BaseResponce.getCurrentPage();
              data.forEach(element => {
                console.log(JSON.stringify(element));
                UserModel.addItem(element).then((result) => {
                  console.log(JSON.stringify(result));
                })
              });
              SystemLogModel.addItem(data.length + 'User Downloaded of Page : ' + mCurrentPage)

              if (currentPage == totalPages) {
                return true
              } else {
                currentPage = parseInt(currentPage) + 1;
                console.log(currentPage);
                this.getAllUser(mToken, currentPage)
              }
            } else {
              console.log(BaseResponce.getMessage());
              SystemLogModel.addItem(BaseResponce.getMessage())
              return false
            }
          } else {
            console.log("message " + BaseResponce.getMessage());
            SystemLogModel.addItem(BaseResponce.getMessage())
            return false
          }

        })
        .catch((error) => {
          console.error(error);
          return false
        });
    }
  }

  static getAssetDoneChecklist = async (mToken, assetId) => {
    if (isConnected) {
      SystemLogModel.addItem('History Checklist Checking of Asset Id : ' + assetId)
      let result = { data: false, message: '' }
      return fetch(BASE_URL + 'asset/getDoneChecklistByAssetId/' + assetId, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              if (data) {
                data.forEach(element => {
                  element.isDone = true
                  DoneChecklistModel.addItem(element).then((result) => {

                  })
                });
                SystemLogModel.addItem(data.length + ' History Checklist Received of Asset Id : ' + assetId)
                return true
              }

            } else {
              console.log(BaseResponce.getMessage());
              result.message = BaseResponce.getMessage()
              SystemLogModel.addItem(BaseResponce.getMessage())
              return result
            }
          } else {
            console.log("message " + BaseResponce.getMessage());
            result.message = BaseResponce.getMessage()
            SystemLogModel.addItem(BaseResponce.getMessage())
            return result
          }

        })
        .catch((error) => {
          console.error(error);
          result.message = error.message
          return result
        });
    }
  }

  static getDoneChecklist = async (mToken, mId) => {
    if (isConnected) {
      SystemLogModel.addItem('Checklist Details Checking Start of Id : ' + mId)
      let result = { data: false, message: '' }
      return fetch(BASE_URL + 'asset/getDoneChecklist/' + mId, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              return DoneChecklistModel.updateItem(mId, data).then((result) => {
                console.log(JSON.stringify(result));
                if (result.data == null) {
                  SystemLogModel.addItem(BaseResponce.getMessage())
                  return true
                }
              })

            } else {
              console.log(BaseResponce.getMessage());
              result.message = BaseResponce.getMessage()
              SystemLogModel.addItem(BaseResponce.getMessage())
              return result
            }
          } else {
            console.log("message " + BaseResponce.getMessage());
            result.message = BaseResponce.getMessage()
            SystemLogModel.addItem(BaseResponce.getMessage())
            return result
          }

        })
        .catch((error) => {
          console.error(error);
          result.message = error.message
          return result
        });
    }
  }

  static getAlertsDetails = async (mToken, mId) => {
    if (isConnected) {
      let result = { data: false, message: '' }
      SystemLogModel.addItem('Alert Details Checking Start of Id : ' + mId)
      return fetch(BASE_URL + 'alert/getAlertById/' + mId, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              return AlertModel.updateItem(data).then((result) => {
                console.log(JSON.stringify(result));
                SystemLogModel.addItem('Alert Details Received of Id : ' + mId)
                return data
              })
            } else {
              console.log(BaseResponce.getMessage());
              result.message = BaseResponce.getMessage()
              return result
            }
          } else {
            console.log("message " + BaseResponce.getMessage());
            result.message = BaseResponce.getMessage()
            return result
          }

        })
        .catch((error) => {
          console.error(error);
          result.message = error.message
          return result
        });
    }
  }

  static getDocumentDetail = async (mToken, documentCode) => {
    if (isConnected) {
      let result = { data: false, message: '' }
      SystemLogModel.addItem('Document Details Checking Start of Id : ' + documentCode)
      return fetch(BASE_URL + 'documate/documateDetails/' + documentCode, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              return DocumentModel.updateItem(data).then((result) => {
                console.log(JSON.stringify(result));
                SystemLogModel.addItem('Document Details Received of Id : ' + documentCode)
                return data
              })
            } else {
              console.log(BaseResponce.getMessage());
              result.message = BaseResponce.getMessage()
              return result
            }
          } else {
            console.log("message " + BaseResponce.getMessage());
            result.message = BaseResponce.getMessage()
            return result
          }

        })
        .catch((error) => {
          console.error(error);
          result.message = error.message
          return result
        });
    }
  }

  static getAssetDetail = async (mToken, assetCode) => {
    if (isConnected) {
      let result = { data: false, message: '' }
      SystemLogModel.addItem('Asset Details Checking Start of Id : ' + assetCode)
      return fetch(BASE_URL + 'asset/assetFullDetails/?asset_code=' + assetCode, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              return AssetModel.updateItem(data).then((result) => {
                console.log(JSON.stringify(result));
                SystemLogModel.addItem('Asset Details Received of Id : ' + assetCode)
                return data
              })
            } else {
              console.log(BaseResponce.getMessage());
              result.message = BaseResponce.getMessage()
              return result
            }
          } else {
            console.log("message " + BaseResponce.getMessage());
            result.message = BaseResponce.getMessage()
            return result
          }

        })
        .catch((error) => {
          console.error(error);
          result.message = error.message
          return result
        });
    }
  }

  static getAlerts = async (mToken, mCurrentPage) => {
    if (isConnected) {
      var currentPage = parseInt(mCurrentPage)
      var totalPages = 0
      SystemLogModel.addItem('Alerts Checking Start')
      return fetch(BASE_URL + 'alert/getAllAlerts/' + currentPage, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              totalPages = BaseResponce.getTotalPages();
              currentPage = BaseResponce.getCurrentPage();
              data.forEach(element => {
                AlertModel.addItem(element).then((result) => {
                  console.log(JSON.stringify(result));
                })
              });
              SystemLogModel.addItem(data.length + ' Alerts Receive')
              if (currentPage == totalPages) {
                return true
              } else {
                currentPage = parseInt(currentPage) + 1;
                this.getAlerts(mToken, currentPage)
              }
            } else {
              console.log(BaseResponce.getMessage());
              if (BaseResponce.getMessage() == 'Fail to Authentication. Error -> TokenExpiredError: jwt expired' || BaseResponce.getStatusCode() == 401) {
                return 'tok'
              }

            }
          } else {
            console.log("message " + BaseResponce.getMessage());
            return false
          }

        })
        .catch((error) => {
          console.error(error);
          return false
        });
    }
  }

  static getNextAudit = async (mToken) => {
    if (isConnected) {
      SystemLogModel.addItem('Next Audit Checking Start')
      return fetch(BASE_URL + 'asset/getNextChecklistAuditDate', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              data.forEach(element => {
                NextAuditModel.addItem(element).then((result) => {
                  console.log(JSON.stringify(result));
                })
              });
              SystemLogModel.addItem(data.length + ' Next Audit Receive')
              return true
            } else {
              console.log(BaseResponce.getMessage());
              if (BaseResponce.getMessage() == 'Fail to Authentication. Error -> TokenExpiredError: jwt expired') {
                SystemLogModel.addItem(BaseResponce.getMessage())
                return 'tok'
              }

            }
          } else {
            console.log("message " + BaseResponce.getMessage());
            SystemLogModel.addItem(BaseResponce.getMessage())
            return false
          }

        })
        .catch((error) => {
          console.error(error);
          return false
        });
    }
  }

  static getComplaintDetails = async (mToken, mId, complaintId) => {
    if (isConnected) {
      let result = { data: false, message: '' }
      SystemLogModel.addItem('Complaint Details Checking Start of Id : ' + mId)
      return fetch(BASE_URL + 'complaints/getComplaintDetails/' + mId, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              data.complaintId = complaintId
              data.isSubmitted = true
              return ComplaintModel.updateItem(data).then((result) => {
                console.log(JSON.stringify(result));
                SystemLogModel.addItem('Complaint Details Received of Id : ' + mId)
                return data
              })
            } else {
              console.log(BaseResponce.getMessage());
              result.message = BaseResponce.getMessage()
              return result
            }
          } else {
            console.log("message " + BaseResponce.getMessage());
            result.message = BaseResponce.getMessage()
            return result
          }

        })
        .catch((error) => {
          console.error(error);
          result.message = error.message
          return result
        });
    }
  }

  static getTaskDetails = async (mToken, mId, complaintId) => {
    if (isConnected) {
      let result = { data: false, message: '' }
      SystemLogModel.addItem('Task Details Checking Start of Id : ' + mId)
      return fetch(BASE_URL + 'taskmate/getTaskDetails/' + mId, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              data.complaintId = complaintId
              data.isSubmitted = true
              return TaskModel.updateItem(data).then((result) => {
                console.log(JSON.stringify(result));
                SystemLogModel.addItem(BaseResponce.getMessage())
                SystemLogModel.addItem('Task Details Received of Id : ' + mId)
                return data
              })
            } else {
              console.log(BaseResponce.getMessage());
              result.message = BaseResponce.getMessage()
              return result
            }
          } else {
            console.log("message " + BaseResponce.getMessage());
            result.message = BaseResponce.getMessage()
            return result
          }

        })
        .catch((error) => {
          console.error(error);
          result.message = error.message
          return result
        });
    }
  }

  static getComplaints = async (mToken, mCurrentPage) => {
    if (isConnected) {
      var currentPage = parseInt(mCurrentPage)
      var totalPages = 0
      SystemLogModel.addItem('Complaints Checking Start')
      return fetch(BASE_URL + 'complaints/getAllAssignedComplaints/' + currentPage + '?typeOfComplaint=2', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              totalPages = BaseResponce.getTotalPages();
              currentPage = BaseResponce.getCurrentPage();
              data.forEach(element => {
                element.isSubmitted = true
                element.serverId = element.complaintId
                ComplaintModel.addItem(element).then((result) => {
                  console.log(JSON.stringify(result));
                })
              });
              SystemLogModel.addItem(data.length + ' Complaints Receive')
              if (currentPage == totalPages) {
                return true
              } else {
                currentPage = parseInt(currentPage) + 1;
                this.getComplaints(mToken, currentPage)
              }
            } else {
              console.log(BaseResponce.getMessage());
              if (BaseResponce.getMessage() == 'Fail to Authentication. Error -> TokenExpiredError: jwt expired') {
                SystemLogModel.addItem(BaseResponce.getMessage())
                return 'tok'
              }

            }
          } else {
            SystemLogModel.addItem(BaseResponce.getMessage())
            console.log("message " + BaseResponce.getMessage());
            return false
          }

        })
        .catch((error) => {
          console.error(error);
          return false
        });
    }
  }

  static getMyComplaints = async (mToken, mCurrentPage) => {
    if (isConnected) {
      var currentPage = parseInt(mCurrentPage)
      var totalPages = 0
      SystemLogModel.addItem('Complaints Checking Start')
      return fetch(BASE_URL + 'complaints/getComplaintByMe/' + currentPage + '?typeOfComplaint=2', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              totalPages = BaseResponce.getTotalPages();
              currentPage = BaseResponce.getCurrentPage();
              data.forEach(element => {
                element.isSubmitted = true
                element.isMy = true
                element.serverId = element.complaintId
                ComplaintModel.addItem(element).then((result) => {
                  console.log(JSON.stringify(result));
                })
              });
              SystemLogModel.addItem(data.length + ' Complaints Receive')
              if (currentPage == totalPages) {
                return true
              } else {
                currentPage = parseInt(currentPage) + 1;
                this.getMyComplaints(mToken, currentPage)
              }
            } else {
              console.log(BaseResponce.getMessage());
              if (BaseResponce.getMessage() == 'Fail to Authentication. Error -> TokenExpiredError: jwt expired') {
                SystemLogModel.addItem(BaseResponce.getMessage())
                return 'tok'
              }

            }
          } else {
            SystemLogModel.addItem(BaseResponce.getMessage())
            console.log("message " + BaseResponce.getMessage());
            return false
          }

        })
        .catch((error) => {
          console.error(error);
          return false
        });
    }
  }

  static getTasks = async (mToken, mCurrentPage) => {
    if (isConnected) {
      var currentPage = parseInt(mCurrentPage)
      var totalPages = 0
      SystemLogModel.addItem('Complaints Checking Start')
      return fetch(BASE_URL + 'complaints/getAllAssignedComplaints/' + currentPage + '?typeOfComplaint=1', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              totalPages = BaseResponce.getTotalPages();
              currentPage = BaseResponce.getCurrentPage();
              data.forEach(element => {
                element.isSubmitted = true
                element.serverId = element.complaintId
                ComplaintModel.addItem(element).then((result) => {
                  console.log(JSON.stringify(result));
                })
              });
              SystemLogModel.addItem(data.length + ' Complaints Receive')
              if (currentPage == totalPages) {
                return true
              } else {
                currentPage = parseInt(currentPage) + 1;
                this.getTasks(mToken, currentPage)
              }
            } else {
              console.log(BaseResponce.getMessage());
              if (BaseResponce.getMessage() == 'Fail to Authentication. Error -> TokenExpiredError: jwt expired') {
                SystemLogModel.addItem(BaseResponce.getMessage())
                return 'tok'
              }

            }
          } else {
            SystemLogModel.addItem(BaseResponce.getMessage())
            console.log("message " + BaseResponce.getMessage());
            return false
          }

        })
        .catch((error) => {
          console.error(error);
          return false
        });
    }
  }

  static getMyTasks = async (mToken, mCurrentPage) => {
    if (isConnected) {
      var currentPage = parseInt(mCurrentPage)
      var totalPages = 0
      SystemLogModel.addItem('Complaints Checking Start')
      return fetch(BASE_URL + 'complaints/getComplaintByMe/' + currentPage + '?typeOfComplaint=1', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              totalPages = BaseResponce.getTotalPages();
              currentPage = BaseResponce.getCurrentPage();
              data.forEach(element => {
                element.isSubmitted = true
                element.isMy = true
                element.serverId = element.complaintId
                ComplaintModel.addItem(element).then((result) => {
                  console.log(JSON.stringify(result));
                })
              });
              SystemLogModel.addItem(data.length + ' Complaints Receive')
              if (currentPage == totalPages) {
                return true
              } else {
                currentPage = parseInt(currentPage) + 1;
                this.getMyTasks(mToken, currentPage)
              }
            } else {
              console.log(BaseResponce.getMessage());
              if (BaseResponce.getMessage() == 'Fail to Authentication. Error -> TokenExpiredError: jwt expired') {
                SystemLogModel.addItem(BaseResponce.getMessage())
                return 'tok'
              }

            }
          } else {
            SystemLogModel.addItem(BaseResponce.getMessage())
            console.log("message " + BaseResponce.getMessage());
            return false
          }

        })
        .catch((error) => {
          console.error(error);
          return false
        });
    }
  }

  static getTransComplaints = async (mToken, mCurrentPage) => {
    if (isConnected) {
      var currentPage = parseInt(mCurrentPage)
      var totalPages = 0
      SystemLogModel.addItem('Complaints Checking Start')
      return fetch(BASE_URL + 'complaints/getTransferedComplaint/' + currentPage + '?typeOfComplaint=2', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              totalPages = BaseResponce.getTotalPages();
              currentPage = BaseResponce.getCurrentPage();
              data.forEach(element => {
                element.isSubmitted = true
                element.serverId = element.complaintId
                element.typeOfComplaintFK = 2
                element.isTransferred = true
                ComplaintModel.addItem(element).then((result) => {
                  console.log(JSON.stringify(result));
                })
              });
              SystemLogModel.addItem(data.length + ' Complaints Receive')
              if (currentPage == totalPages) {
                return true
              } else {
                currentPage = parseInt(currentPage) + 1;
                this.getTransComplaints(mToken, currentPage)
              }
            } else {
              console.log(BaseResponce.getMessage());
              if (BaseResponce.getMessage() == 'Fail to Authentication. Error -> TokenExpiredError: jwt expired') {
                SystemLogModel.addItem(BaseResponce.getMessage())
                return 'tok'
              }

            }
          } else {
            SystemLogModel.addItem(BaseResponce.getMessage())
            console.log("message " + BaseResponce.getMessage());
            return false
          }

        })
        .catch((error) => {
          console.error(error);
          return false
        });
    }
  }

  static getTransTasks = async (mToken, mCurrentPage) => {
    if (isConnected) {
      var currentPage = parseInt(mCurrentPage)
      var totalPages = 0
      SystemLogModel.addItem('Task Checking Start')
      return fetch(BASE_URL + 'complaints/getTransferedComplaint/' + currentPage + '?typeOfComplaint=1', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              totalPages = BaseResponce.getTotalPages();
              currentPage = BaseResponce.getCurrentPage();
              data.forEach(element => {
                element.isSubmitted = true
                element.serverId = element.complaintId
                element.typeOfComplaintFK = 1
                element.isTransferred = true
                ComplaintModel.addItem(element).then((result) => {
                  console.log(JSON.stringify(result));
                })
              });
              SystemLogModel.addItem(data.length + ' Task Receive')
              if (currentPage == totalPages) {
                return true
              } else {
                currentPage = parseInt(currentPage) + 1;
                this.getTransTasks(mToken, currentPage)
              }
            } else {
              console.log(BaseResponce.getMessage());
              if (BaseResponce.getMessage() == 'Fail to Authentication. Error -> TokenExpiredError: jwt expired') {
                SystemLogModel.addItem(BaseResponce.getMessage())
                return 'tok'
              }

            }
          } else {
            SystemLogModel.addItem(BaseResponce.getMessage())
            console.log("message " + BaseResponce.getMessage());
            return false
          }

        })
        .catch((error) => {
          console.error(error);
          return false
        });
    }
  }

  static downloadCategoryDocument = async (mToken, categoryId, mCurrentPage) => {
    if (isConnected) {
      var currentPage = parseInt(mCurrentPage)
      var totalPages = 0
      SystemLogModel.addItem('Category Document Downloading Start of Page : ' + mCurrentPage)
      return fetch(BASE_URL + 'documate/documateList/' + currentPage + '?masterId=' + categoryId + '&documateTypeIdFK=1', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              totalPages = BaseResponce.getTotalPages();
              currentPage = BaseResponce.getCurrentPage();
              data.forEach(element => {
                console.log(JSON.stringify(element));
                DocumentModel.addItem(element).then((result) => {
                  console.log(JSON.stringify(result));
                })
              });
              SystemLogModel.addItem(data.length + 'Category Document Downloaded of Page : ' + mCurrentPage)

              if (currentPage == totalPages) {
                return true
              } else {
                currentPage = parseInt(currentPage) + 1;
                this.downloadCategoryDocument(mToken, categoryId, currentPage)
              }
            } else {
              console.log(BaseResponce.getMessage());
              return false
            }
          } else {
            console.log("message " + BaseResponce.getMessage());
            return false
          }

        })
        .catch((error) => {
          console.error(error);
          return false
        });
    }
  }

  static downloadAssetDocument = async (mToken, assetId, mCurrentPage) => {
    if (isConnected) {
      var currentPage = parseInt(mCurrentPage)
      var totalPages = 0
      SystemLogModel.addItem('Asset Document Downloading Start of Page : ' + mCurrentPage)
      return fetch(BASE_URL + 'documate/documateList/' + currentPage + '?masterId=' + assetId + '&documateTypeIdFK=2', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              totalPages = BaseResponce.getTotalPages();
              currentPage = BaseResponce.getCurrentPage();
              data.forEach(element => {
                console.log(JSON.stringify(element));
                DocumentModel.addItem(element).then((result) => {
                  console.log(JSON.stringify(result));
                })
              });
              SystemLogModel.addItem(data.length + 'Asset Document Downloaded of Page : ' + mCurrentPage)

              if (currentPage == totalPages) {
                return true
              } else {
                currentPage = parseInt(currentPage) + 1;
                this.downloadAssetDocument(mToken, assetId, currentPage)
              }
            } else {
              console.log(BaseResponce.getMessage());
              return false
            }
          } else {
            console.log("message " + BaseResponce.getMessage());
            return false
          }

        })
        .catch((error) => {
          console.error(error);
          return false
        });
    }
  }

  static downloadAllDocument = async (mToken, mCurrentPage) => {
    if (isConnected) {
      var currentPage = parseInt(mCurrentPage)
      var totalPages = 0
      SystemLogModel.addItem('Common Document Downloading Start of Page : ' + mCurrentPage)
      return fetch(BASE_URL + 'documate/allDocumateList/' + currentPage, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              totalPages = BaseResponce.getTotalPages();
              currentPage = BaseResponce.getCurrentPage();
              data.forEach(element => {
                console.log(JSON.stringify(element));
                DocumentModel.addItem(element).then((result) => {
                  console.log(JSON.stringify(result));
                })
              });
              SystemLogModel.addItem(data.length + 'Common Document Downloaded of Page : ' + mCurrentPage)

              if (currentPage == totalPages) {
                return true
              } else {
                currentPage = parseInt(currentPage) + 1;
                this.downloadAllDocument(mToken, currentPage)
              }
            } else {
              console.log(BaseResponce.getMessage());
              return false
            }
          } else {
            console.log("message " + BaseResponce.getMessage());
            return false
          }

        })
        .catch((error) => {
          console.error(error);
          return false
        });
    }
  }

  static downloadGeneralDocument = async (mToken, mCurrentPage) => {
    if (isConnected) {
      var currentPage = parseInt(mCurrentPage)
      var totalPages = 0
      SystemLogModel.addItem('General Document Downloading Start of Page : ' + mCurrentPage)
      return fetch(BASE_URL + 'documate/documateList/' + currentPage + '?masterId=' + 0 + '&documateTypeIdFK=3', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              totalPages = BaseResponce.getTotalPages();
              currentPage = BaseResponce.getCurrentPage();
              data.forEach(element => {
                console.log(JSON.stringify(element));
                DocumentModel.addItem(element).then((result) => {
                  console.log(JSON.stringify(result));
                })
              });
              SystemLogModel.addItem(data.length + 'General Document Downloaded of Page : ' + mCurrentPage)

              if (currentPage == totalPages) {
                return true
              } else {
                currentPage = parseInt(currentPage) + 1;
                this.downloadGeneralDocument(mToken, currentPage)
              }
            } else {
              console.log(BaseResponce.getMessage());
              return false
            }
          } else {
            console.log("message " + BaseResponce.getMessage());
            return false
          }

        })
        .catch((error) => {
          console.error(error);
          return false
        });
    }
  }

  static startAssetDownloading = async (mToken) => {
    if (isConnected) {
      SystemLogModel.addItem('Asset Downloading Start')
      return fetch(BASE_URL + 'asset/allassetDetails', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              data.forEach(element => {
                AssetModel.addItem(element).then((result) => {
                  console.log(JSON.stringify(result));
                })
              });
              SystemLogModel.addItem(data.length + ' Asset Downloaded')
              return true
            } else {
              console.log(BaseResponce.getMessage());
              return false
            }
          } else {
            console.log("message " + BaseResponce.getMessage());
            return false
          }

        })
        .catch((error) => {
          console.error(error);
          return false
        });

    }
  }

  static startChecklistDownloading = async (mToken) => {
    if (isConnected) {
      SystemLogModel.addItem('Assinged Checklist Downloading Start')
      return fetch(BASE_URL + 'asset/allChecklist/', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              data.forEach(element => {
                ChecklistModel.addItem(element).then((result) => {
                  console.log(JSON.stringify(result));
                })
              });
              SystemLogModel.addItem(data.length + ' Assinged Checklist Downloaded')
              return true
            } else {
              console.log(BaseResponce.getMessage());
              return false
            }
          } else {
            console.log("message " + BaseResponce.getMessage());
            return false
          }

        })
        .catch((error) => {
          console.error(error);
          return false
        });
    }
  }

  static downloadDashboardData = async (mToken) => {
    if (isConnected) {
      SystemLogModel.addItem('Dashboard data checking start').then((result) => {
        console.log(JSON.stringify(result));
      })
      return fetch(BASE_URL + 'home/counters/', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              dashboard.addItem(data).then(result => {
                console.log(result.message);
              })
              SystemLogModel.addItem('Dashboard Refresh')
              return true
            } else {
              console.log(BaseResponce.getMessage());
              if (BaseResponce.getMessage() == 'Fail to Authentication. Error -> TokenExpiredError: jwt expired' || BaseResponce.getMessage() == 'Unauthorized') {
                return 'tok'
              }
            }

          } else {
            console.log("message " + BaseResponce.getMessage());
            return false
          }

        })
        .catch((error) => {
          console.error(error);
          return false
        });
    }
  }

  static startUploading = async (mToken) => {
    if (isConnected) {
      return DoneChecklistModel.getAllPendingItems().then(result => {
        console.log(JSON.stringify(result.data));
        if (result.data) {
          result.data.forEach(element => {
            let mData = {
              checklistIdFK: element.checklistIdFK,
              assetIdFK: element.assetIdFK,
              doneOn: element.doneOn,
              answers: []
            }
            let answers = []
            element.answers.forEach(element => {
              answers.push(element)
            });
            mData.answers = answers;
            this.uploadChecklist(mToken, mData, element.doneChecklistId).then((result) => {
              return result
            })
          });
        } else {
          return 'No Checklist Available';
        }

      })
    }
  }


  static uploadChecklist = async (mToken, mData, mId) => {
    if (isConnected) {
      SystemLogModel.addItem('Checklist Uploading Start of Id : ' + mId)
      return fetch(BASE_URL + 'asset/saveChecklist/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': mToken,
        },
        body: JSON.stringify(mData),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);

          BaseResponce.setResponce(responseJson);
          if (BaseResponce != null) {
            if (BaseResponce.getStatus() && BaseResponce.getData() != null) {
              var data = BaseResponce.getData();
              data.doneChecklistId = mId
              data.isSubmitted = true
              data.isDone = true
              return DoneChecklistModel.deleteItem(data.doneChecklistId).then((result) => {
                console.log(JSON.stringify(result));
                return DoneChecklistModel.addItem(data).then((result) => {
                  console.log(JSON.stringify(result));
                  if (result.data) {
                    SystemLogModel.addItem('Checklist Uploading Done of Id : ' + mId)
                    return true
                  }
                })
              })

            } else {
              console.log(BaseResponce.getMessage());
              return false
            }
          } else {
            console.log("message " + BaseResponce.getMessage());
            return false
          }

        })
        .catch((error) => {
          console.error(error);
          return false
        });
    } else {
      return false
    }
  }
}

