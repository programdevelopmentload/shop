/**
 * Created by mhp on 2018/6/9
 */
/** localstorage本地存储 */
function setItem() {
    debugger;
    localStorage.removeItem("storage_data");
    localStorage.setItem("storage_data", storage_data);
    localStorage.removeItem("check_arr");
    localStorage.setItem("check_arr", check_arr);
}

/** 从localstorage本地读取数据 */
function initLocalStorage() {
    storage_data_jump = localStorage.getItem("storage_data");
    check_arr_jump = localStorage.getItem("check_arr");
}

function setItem_price_setNew(storage_data, check_arr) {
    debugger;
    localStorage.removeItem("storage_data");
    localStorage.setItem("storage_data", storage_data);
    localStorage.removeItem("check_arr");
    localStorage.setItem("check_arr", check_arr);
}

function initPrice_setNew() {
    debugger;
    storage_data_jump = localStorage.getItem("storage_data");
    check_arr_jump = localStorage.getItem("check_arr");
}

function TOKEN_setIem(tokenStr) {
    localStorage.setItem("token", tokenStr);
}

function TOKEN_getIem() {
    // return localStorage.getItem("TOKEN");
    return localStorage.getItem("token");
}

function navTopMenu_setIem(paramdata) {
    localStorage.removeItem("navId");
    localStorage.setItem("navId", paramdata);
}

function navTopMenu_getIem() {
    return localStorage.getItem("navId");
}

function token_issue_setIem(paramdata) {
    localStorage.removeItem("token_issue");
    localStorage.setItem("token_issue", paramdata);
}

function token_issue_getIem() {
    return localStorage.getItem("token_issue");
}
//存储登录人id
function userId_setIem(paramdata) {
    localStorage.removeItem("user_id");
    localStorage.setItem("user_id", paramdata);
}
//抓取登录人id
function userId_getIem() {
    return localStorage.getItem("user_id");
}
//存储登录人姓名汉字
function userName_setIem(paramdata) {
    localStorage.removeItem("user_name");
    localStorage.setItem("user_name", paramdata);
}
//抓取登录人姓名汉字
function userName_getIem() {
    return localStorage.getItem("user_name");
}
//存储登录人电话号码
function userPhone_setIem(paramdata) {
    localStorage.removeItem("user_phone");
    localStorage.setItem("user_phone", paramdata);
}
//抓取登录人姓名汉字
function userPhone_getIem() {
    return localStorage.getItem("user_phone");
}
