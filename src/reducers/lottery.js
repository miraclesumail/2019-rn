import update from 'immutability-helper';

const initialState = {
  people: 'dddddd',
  isFetching: false,
  error: false,
  refreshTime:'', // 记录上次刷新时间
  gamesList: {
      hotRecommend:[
        {name:'植物33', hot:3, isFavorite:true, id:111},
        {name:'植物11', hot:4, isFavorite:false, id:121},
        {name:'植物22', hot:3, isFavorite:false, id:131}
      ]
  },

  basketDatas: [
     {gameName: '直选 五星1', gameId:11, numbers:'05 07|08|03 09|07 08 06', beishu:1, zushu:2, total:100},
  ],
  latestInfo:null
}


export default function lotteryReducer (state = initialState, action) {
  switch (action.type) {
    case 'changePeople':
      return update(state, {
         people: {
             $set: 'aaaaa'
         }
      })

    case 'setLatestInfo': 
      return update(state, {
         latestInfo: {
           $set: action.latestInfo
         }     
      }) 
      
    case 'deleteLottery': 
       const newCollection = update(state.basketDatas, {$splice: [[action.index, 1]]});   
       return update(state.basketDatas, {basketDatas:{
            $set: newCollection.slice()
       }});       
    
    // 在这里添加购彩蓝 重复合并问题
    case 'addLotteryToBasket': 
      console.log(action);
      let needUpdate = {}, needPush = [];
      //{gameName: '直选 五星1', gameId:11, numbers:'05 07|08|03 09|07 08 06', beishu:1, zushu:2, total:100}
      for(let i = 0; i < action.lottery.length; i++) {
              const tempLottery = action.lottery[i];
              const index = state.basketDatas.findIndex(item => item.numbers == tempLottery.numbers && item.beishu == tempLottery.beishu);
              if(index != -1) {
                   console.log(index);
                   //console.log(index);
                   const targetLottery = state.basketDatas.slice()[index];
                   const combinedLottery = {...targetLottery, zushu: tempLottery.zushu + targetLottery.zushu, total: tempLottery.total + targetLottery.total}
                   needUpdate[index] = {$set: combinedLottery};
              } else {
                   needPush.push(tempLottery);
              }
      }
      let temp1;
      if(Object.keys(needUpdate).length)
          temp1 = update(state.basketDatas, needUpdate)

      if(needPush.length)  {
          let finalLottery;
          if(temp1) {
            finalLottery = update(temp1.slice(), {$push: [...needPush]})
          } else {
            finalLottery = update(state.basketDatas,  {$push: [...needPush]});
          }
          return update(state, {basketDatas: {
            $set: finalLottery.slice()
          }})
      } else
          return update(state.basketDatas, {basketDatas:{
                    $set: temp1.slice()
      }});       

       

      // const datas =  update(state.basketDatas, {$push: [...action.lottery]});
      // return  update(state, {basketDatas: {
      //      $set: datas.slice()   
      // }})
     
    case 'updateRefreshTime':
      console.log('ffre');
      console.log(action.refreshTime);
      return update(state, {
         refreshTime: {
             $set: action.refreshTime
         }
      })  
    case 'toggleLike': 
      let idx;
      const tempList = state.gamesList.hotRecommend.filter((item, index) => {
            const flag = action.id == item.id;
            flag && (idx = index);
            return flag;
      })[0];

      tempList.isFavorite = !tempList.isFavorite;
      const hotRecommend = update(state.gamesList.hotRecommend, {[idx]: {$set: tempList}})
      console.log(hotRecommend);
      return update(state, {
           gamesList: {
                hotRecommend: {
                   $set: hotRecommend.slice()
                }
           }
      })
    case 'deleteItem':
      const items = state.gamesList.hotRecommend.slice();
      items.splice(action.index, 1);
      return update(state, {
           gamesList: {
                hotRecommend: {
                   $set: [...items]
                }
           }
      })
    /**
     * const collection = [1, 2, {a: [12, 17, 15]}];
      const newCollection = update(collection, {2: {a: {$splice: [[1, 1, 13, 14]]}}});
       => [1, 2, {a: [12, 13, 14, 15]}]
     * 
     */
    case 'toTop':
      const list = state.gamesList.hotRecommend.slice()[action.index];
      // 连续操作
      const tempRecommend =  update(state.gamesList.hotRecommend, {$splice: [[action.index, 1]], $unshift: [list]});
      //const finalRecommend = update(state.gamesList.hotRecommend, {$unshift: [list]});
      return update(state, {
           gamesList: {
                hotRecommend: {
                   $set: tempRecommend.slice()
                }
           }
      })
    default:
      return state
  }
}