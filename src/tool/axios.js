//import JsonP from 'jsonp'
import axios from 'axios'
export default class Axios {
    // static jsonp(options) {
    //     return new Promise((resolve, reject) => {
    //         JsonP(options.url, {
    //             param: 'callback'
    //         }, function (err, response) {
    //             if (response.status == 'success') {
    //                 resolve(response);
    //             } else {
    //                 reject(response.messsage);
    //             }
    //         })
    //     })
    // }

    static ajax(options){
        let baseApi = 'http://192.168.93.227:3000/customer';
        return new Promise((resolve,reject)=>{
            // axios.post(baseApi + options.url, {title:'qqqq'}).then((response)=>{
            //     if (response.status == '200'){
            //         let res = response.data;
            //         resolve(res);
            //     }else{
            //         reject(response.data);
            //     }
            // })
            console.log('xiaba');
            axios({
                url:options.url,
                method: options.method || 'get',
                baseURL:baseApi,
                timeout:5000,
                [options.method == 'post' ? 'data' : 'params']: options.data || ''
            }).then((response)=>{
                console.log(response.data);
                resolve(response.data);
                // if (response.status == '200'){
                //     let res = response.data;
                //     resolve(res);
                // }else{
                //     reject(response.data);
                // }
            }).catch(function(error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                 // ADD THIS THROW error
                  throw error;
                });
        });
    }
}