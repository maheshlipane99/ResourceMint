
let mResponce

function setResponce(responce) {
  mResponce = responce
}


function getStatus() {
  return mResponce.status
}

function getStatusCode() {
  return mResponce.status_code
}

function getData() {
  return mResponce.data
}

function getError() {
  return mResponce.status
}

function getMessage() {
  return mResponce.message
}


function getCurrentPage() {
  return mResponce.currentPage
}

function getTotalPages() {
  return mResponce.totalPages
}


export default {
  setResponce,
  getStatus,
  getStatusCode,
  getData,
  getCurrentPage,
  getTotalPages,
  getError,
  getMessage
}