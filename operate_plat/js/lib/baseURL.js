/**
 * 获取域名端口
 */
function getBaseUrl(param) {
    // if (param == 'img') {
    //     return 'http://172.16.10.173:8015';
    // } else if (param == 'w') {//王喧
    //     return 'http://172.16.10.167:8002/goods';
    //     // return 'http://api.jxjia.net/goods';
    //     // return 'http://172.16.44.14:8007';
    // } else if (param == 'yy') {//岳禹成
    //     return 'http://172.16.10.167:8002';
    //     // return 'http://api.jxjia.net';
    //     // return 'http://172.16.44.45:8002';
    // } else if (param == 't') {//陶帅江
    //     return 'http://172.16.10.167:8002/goods';
    //     // return 'http://api.jxjia.net/goods';
    //     // return 'http://172.16.10.167:8002/goods';
    // } else if (param == 'lh') {
    //     return 'http://172.16.10.167:8002';
    //     // return 'http://api.jxjia.net';
    //     // return 'http://172.16.44.200:8002';
    // } else if (param == 'ys') {//袁帅
    //     return 'http://172.16.10.167:8002/area';
    //     // return 'http://api.jxjia.net/area';
    // } else if (param == 'g') {//郭斌磊
    //     return 'http://172.16.10.167:8002/promotion';
    //     // return 'http://api.jxjia.net/promotion';
    // } else if (param == 'y_jl') {//蒋磊
    //     return 'http://172.16.10.167:8002/user';
    //     // return 'http://api.jxjia.net/user';
    // } else {
    //     return 'http://172.16.10.167:8002';
    //     // return 'http://api.jxjia.net';
    // }


    if (param == 'img') {
        return 'http://172.16.10.173:8015';
    } else if (param == 'w') {//王喧
        return 'http://172.16.44.14:8007';
    } else if (param == 'yy') {//岳禹成
        return 'http://172.16.10.167:8002';
        // return 'http://172.16.44.45:8002';
    } else if (param == 't') {//陶帅江
         //return 'http://172.16.10.167:8002/goods';
    } else if (param == 'lh') {
        return 'http://172.16.44.15:8002';
    } else if (param == 'ys') {//袁帅
        return 'http://172.16.10.167:8002/area';
        // return 'http://api.jxjia.net/area';
    } else if (param == 'g') {//郭斌磊
        return 'http://172.16.10.167:8002/promotion';
        // return 'http://api.jxjia.net/promotion';
    } else if (param == 'y_jl') {//蒋磊
        return 'http://172.16.10.167:8002/user';
        // return 'http://api.jxjia.net/user';
    } else {
        return 'http://172.16.10.167:8002';
    }

    // if (param == 'img') {
    //     return 'http://172.16.40.153:8015';
    // } else if (param == 'yy') {//岳禹成
    //     return 'http://172.16.44.45:8002';
    // } else if (param == 'g') {//郭斌磊
    //     return 'http://172.16.40.157:8012';
    // } else if (param == 't') {
    //     return 'http://172.16.44.85:8007';
    // } else if (param == 'lh') {//李浩
    //     return 'http://172.16.44.200:8002';
    // } else if (param == 'w') {//王喧
    //     return 'http://172.16.44.12:8007';
    // } else if (param == 'ys') {
    //     return 'http://172.16.38.206:8008';
    // } else {
    //     return 'http://172.16.40.153:8002/goods';
    // }


    // if(param=="t"){//陶帅江
    //     return 'http://172.16.34.227:8007';
    // }else if(param=='g'){//郭斌磊
    //     return 'http://172.16.40.157:8012';
    // }else if(param=='w'){//王喧
    //     return 'http://172.16.34.37:8007';
    // }else if(param=='yy'){//岳禹成
    //     return 'http://172.16.40.134:8002';
    // }else if(param=='img'){//
    //     return 'http://172.16.40.153:8015';
    // }else if(param=='ys'){//袁帅
    //     return 'http://172.16.40.239:8008';
    // }else if(param=='lh'){//李浩
    //     return 'http://172.16.41.184:8002';
    // } else if(param=='loadimg'){
    //     return 'http://172.16.40.237:8005';
    // }
}

/**
 * 获取base路径
 */
function getBasePath() {
    return getHostPath() + "";
}

/**
 *    获取主机url
 */
function getHostPath() {
    var curWwwPath = window.document.location.href;
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    var localhostPaht = curWwwPath.substring(0, pos);

    return localhostPaht;
}