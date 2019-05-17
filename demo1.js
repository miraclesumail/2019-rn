const { ofType, combineEpics, createEpicMiddleware } = ReduxObservable;

const fetchUser = (userName) => ({type:'fetchUser', userName})

// 对于dispatch type为fetchUser的action 会忽略 并用mergeMap获取action的内容
const fetchUserEpic = (action$) => action$.ofType('fetchUser').mergeMap((action) => ajax.getJson(`url${action.payload}`).map(response => fetchUserFulfilled(response)))

// 利用combineEpics接受一个 epic的function combineEpics同combineReducers一样 可以接受多个epic
const rootEpic = combineEpics(fetchUserEpic);

const epicMiddleware = createEpicMiddleware();
// 注意 在reducer里面找不到对应的type也不会报错
const pingEpic = action$ =>
  action$.ofType('PING')
    .delay(1000) // 异步等待 1000ms 然后继续
    .mapTo({ type: 'PONG' });

// 有2个reducer  shops people
const {combineRecuders} = Redux;
const rootReducers = combineRecuders({shops, people});    

createStore(rootReducers, applyMiddleware(epicMiddleware));

epicMiddleware.run(rootEpic);

/*
 *  1. 在rn ios中直接可以 调用messaure来量  安卓需要调用onlayout
 *  2. 使用direct manipulation 操作不会导致 dom tree整个重渲染
 * 
 *   never too old to learn, never too late to turn
 *   one eyewitness is better than ten hearsays
 *   pride goes before and shames comes after     never too old to learn never too late to turn 
 */

class progress {
      constructor(){
          this.progress = 0;
          this.observableFns = {};
          this.randomTime = {min:500, max:1500};
          this.randomDistance = {min:5, max:15};
          this.timer = null;
      }
      
      init(){
          this.observe('progress', this.progressChangeCallback.bind(this));
          this.beginChange();
      }

      progressChangeCallback(value){
          console.log(value);
      }

      observe(property, fn){
          if(!this[property]){
             this[property] = [fn];
          }else{
             this[property].push(fn); 
          }
      }

      trigger(property){
          this.observableFns[property].forEach(fn => {
                fn(this[property]);
          });
      }

      beginChange(){
          const {min:minTime, max:maxTime} = this.randomTime;
          const {min:minDistance, max:maxDistance} = this.randomDistance;
          
          if(this.progress > 100) return;

          this.timer = setTimeout(() => {
                this.progress = this.progress + minDistance + Math.random()*(maxDistance - minDistance);
                this.trigger('progress');
                this.beginChange();
          }, minTime + Math.random()*(maxTime - minTime))
      }
}