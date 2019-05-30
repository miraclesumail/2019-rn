
export const utils = {
      calculate: {
          '114': (arr) => {
              arr = arr.map(item => item.filter(e => e > 0).length);
              if(arr.includes(0)) return 0;
              return arr.reduce((prev, next) => prev*next)*4;
          },
          '115': (arr) => {
             let tempArr = arr.slice().map(item => item.filter(e => e > 0).length);
             if(tempArr.includes(0)) return 0;
             arr = arr.map(item => {
                   let temp = [];
                   item.map((v,i) => {
                        if(v) temp.push(i);
                        return v;
                   })
                   return temp;
             }) 
             console.log(arr);
             const finalArray = utils.getNumbers(arr);
             console.log(finalArray);
             return finalArray.length;
          },
          // 五星组选120计算注单方法
          '116': (arr) => {
              arr = arr.map(item => item.filter(e => e > 0).length)
              if(arr.includes(0)) return 0;
              return utils.zuhe(arr[0], 2)*utils.zuhe(arr[1], 3);
          },
          '117': (arr) => {
              arr = arr.map(item => item.filter(e => e > 0).length)
              if(arr.includes(0)) return 0;
              return utils.zuhe(arr[0], 3)*utils.zuhe(arr[1], 1);
          }
      },
      randomChoose: {
           '116': (arr) => {
               return arr.map((v,index) => {
                     let temp;
                     if(index)
                        temp = utils.getArrs(3);
                     else
                        temp = utils.getArrs(2);  
                     v = v.map((item, i) => temp.includes(i) ? 1 : 0)   
                     return v
               })       
           },
           '113': (arr) => {
               return arr.map((v, index) => {
                     let temp = utils.getArrs(1);
                     v = v.map((item, i) => temp.includes(i) ? 1 : 0)   
                     return v
               })
           }
      },
      // c 5 取 3
      zuhe(m,n){
        if(m == n)
            return 1

        if(m < n) return 0;    

        let gap = n,total = m, divider = 1;;

        for(let i = 1;i<gap;i++){
            total *= (m-i)
            divider *= (i+1)
        }
        return total/divider
      },
      getArrs(n) {
        let arr = [0,1,2,3,4,5,6,7,8,9], has = 0, temp= [];
        while(has < n) {
            let index = Math.random()*arr.length | 0;
            temp.push(arr[index]);
            arr.splice(index,1);
            has++;
        }
        return temp;
      },

      getNumbers(arr, added = null, ww=[]){
        if(!arr.length) return ww.push(added);
        arr = arr.slice();
        let temp = arr.shift();
        console.log(temp.length);
        for(let i = 0; i < temp.length; i++){
            if(added) {
               if(added.includes(temp[i])) continue;
               utils.getNumbers(arr, [...added, temp[i]], ww);
            } else {
               utils.getNumbers(arr, [temp[i]], ww);   
            }
        }   
        console.log(ww);
        return ww  
    },

    getBasketInfo(arr){
        let tempArr = arr.slice();
        tempArr = tempArr.map(ele => {
            let has = [];
            ele.forEach((v,i) => {
                v == 1 && has.push('0'+i);
            })
            return has.join(' ');
        });
        console.log(tempArr);
        return tempArr.join('|');
    }
}


export const gamesList = [
    {name:'重庆时时彩', id:111, children:[
        {name:'直选', id:112, children: [
            {name:'五星1', id:113, maxBei:24, balls:[
                  {key:'万位', values: [0, 0, 0, 0, 0, 0 ,0, 0, 0, 0]},
                  {key:'千位', values: [0, 0, 0, 0, 0, 0 ,0, 0, 0, 0]},
                  {key:'百位', values: [0, 0, 0, 0, 0, 0 ,0, 0, 0, 0]},
                  {key:'十位', values: [0, 0, 0, 0, 0, 0 ,0, 0, 0, 0]},
                  {key:'个位', values: [0, 0, 0, 0, 0, 0 ,0, 0, 0, 0]}
            ], }, 
            {name:'四星组合', id:114, balls:[
                {key:'千位', values: [0, 0, 0, 0, 0, 0 ,0, 0, 0, 0]},
                {key:'百位', values: [0, 0, 0, 0, 0, 0 ,0, 0, 0, 0]},
                {key:'十位', values: [0, 0, 0, 0, 0, 0 ,0, 0, 0, 0]},
                {key:'个位', values: [0, 0, 0, 0, 0, 0 ,0, 0, 0, 0]}
            ]}, {name:'三星直选', id:115, balls:[
                {key:'百位', values: [0, 0, 0, 0, 0, 0 ,0, 0, 0, 0]},
                {key:'十位', values: [0, 0, 0, 0, 0, 0 ,0, 0, 0, 0]},
                {key:'个位', values: [0, 0, 0, 0, 0, 0 ,0, 0, 0, 0]}
            ]} 
        ]},
        {name:'组选', id:112, children: [
            {name:'组选120', id:116, balls: [
                {key:'二重号', values: [0, 0, 0, 0, 0, 0 ,0, 0, 0, 0]},
                {key:'单号', values: [0, 0, 0, 0, 0, 0 ,0, 0, 0, 0]}
            ]}, {name:'组选60', id:117,
               balls: [
                    {key:'三重号', values: [0, 0, 0, 0, 0, 0 ,0, 0, 0, 0]},
                    {key:'单号', values: [0, 0, 0, 0, 0, 0 ,0, 0, 0, 0]}
                ]
            }, {name:'组选30', id:118, balls: [
                {key:'三重号', values: [0, 0, 0, 0, 0, 0 ,0, 0, 0, 0]},
                {key:'二重号', values: [0, 0, 0, 0, 0, 0 ,0, 0, 0, 0]}
            ]}
        ]}
    ]},
    {name:'新疆时时彩', id:211, children:[
        {name:'五星11', id:112, children: [
            {name:'五星111', id:123}, {name:'五星2', id:114}, {name:'五星3', id:115},  
        ]},
        {name:'四星11', id:112, children: [
            {name:'四星111', id:126}, {name:'四星2', id:117}, {name:'四星3', id:118},
        ]},
        {name:'三星11', id:112, children: [
            {name:'三星111', id:129}, {name:'三星2', id:120}, {name:'三星3', id:121}
        ]}
    ]},
    {name:'江西时时彩', id:311, children:[
        {name:'五星22', id:112, children: [
            {name:'五星122', id:133}, {name:'五星2', id:114}, {name:'五星3', id:115},  
        ]},
        {name:'四星', id:112, children: [
            {name:'四星122', id:136}, {name:'四星2', id:117}, {name:'四星3', id:118},
        ]},
        {name:'三星', id:112, children: [
            {name:'三星122', id:119}, {name:'三星2', id:120}, {name:'三星3', id:121}
        ]}
    ]},
    {name:'江西时时彩', id:311, children:[
        {name:'五星33', id:112, children: [
            {name:'五星31', id:143}, {name:'五星2', id:114}, {name:'五星3', id:115},  
        ]},
        {name:'四星', id:112, children: [
            {name:'四星13', id:146}, {name:'四星2', id:117}, {name:'四星3', id:118},
        ]},
        {name:'三星', id:112, children: [
            {name:'三星13', id:149}, {name:'三星2', id:120}, {name:'三星3', id:121}
        ]}
    ]}
]

//[1,2,3,4], [3,4,5,6], [4,5,6], [3,7,8]
var ww = []
function getNumbers(arr, added = null){
     if(!added)

     if(!arr.length) return ww.push(added);
     let temp = arr.shift();
     for(let i = 0; i < temp.length; i++){
         if(added) {
            if(added.includes(temp[i])) return;
            getNumbers(arr, [temp[i], ...added]);
         } else {
            getNumbers(arr, [temp[i]]);   
         }
     }     
}


export const lotteryRecords = [
        {game: '重庆时时彩', wanfa: '直选 五星1', date:'2019-05-29', gameId: 113, content: '05 07|08|03 09|07 08 06', beishu:3, zushu: 1, total: 6, status:1 },
        {game: '山东时时彩', wanfa: '直选 五星2', date:'2019-05-29', gameId: 113, content: '05 07|08 08 08|03 09|07 08 06', beishu:3, zushu: 2, total: 12, status:2},
        {game: '天津时时彩', wanfa: '直选 五星3', date:'2019-05-11', gameId: 113, content: '05 07|08 09|03 09|07 08 06', beishu:6, zushu: 1, total: 12, status:2},
        {game: '腾讯分分彩', wanfa: '直选 五星3', date:'2019-05-22', gameId: 113, content: '05 07|08 09|03 09|07 08 06', beishu:6, zushu: 1, total: 12, status:2},
        {game: '天津时时彩', wanfa: '直选 五星3', date:'2019-05-28', gameId: 113, content: '05 07|08 09|03 09|07 08 06', beishu:6, zushu: 1, total: 12, status:1},
        {game: '江西11选5', wanfa: '直选 五星3', date:'2019-05-23', gameId: 113, content: '05 07|08 09|03 09|07 08 06', beishu:6, zushu: 1, total: 12, status:3},
        {game: '江西11选5', wanfa: '直选 五星3', date:'2019-05-23', gameId: 113, content: '05 07|08 09|03 09|07 08 06', beishu:6, zushu: 1, total: 12, status:2},
        {game: '天津时时彩', wanfa: '直选 五星3', date:'2019-05-23', gameId: 113, content: '05 07|08 09|03 09|07 08 06', beishu:6, zushu: 1, total: 12, status:3}
]
