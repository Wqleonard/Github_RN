import Types from '../types'
import DataStore from '../../expand/dao/dataStore'
/**
 * 获取最热数据的异步action
 * @param theme
 * @returns {{theme: *, type: string}}
 */
export function onRefreshPopular(storeName,url,pageSize) {
    return dispatch=>{
        dispatch({type:Types.POPULAR_REFRESH,storeName})
        let dataStore=new DataStore()
        dataStore.fetchData(url) //异步action与数据流
            .then(data=>{
                handleData(dispatch,storeName,data,pageSize)
            })
            .catch(error=>{
                console.log(error.toString())
                dispatch({
                    type:Types.POPULAR_REFRESH_FAIL,
                    storeName,
                    error
                })
            })
    }
}

/**
 *
 * @param storeName
 * @param pageIndex 第几页
 * @param pageSize 每页展示条数
 * @param dataArray 原始数据
 * @param callback  回调函数，向调用页面通信，比如异常信息展示，加载完成等
 */
export function onLoadMorePopular(storeName,pageIndex,pageSize,dataArray=[],callback) {
   return dispatch=>{
       setTimeout(()=>{
           //模拟网络请求
           if((pageIndex-1)*pageSize>=dataArray.length){
               //已加载完全部数据
               if(typeof callback ==='function'){
                   callback('no more')
               }
               dispatch({
                   type:Types.POPULAR_LOAD_MORE_FAIL,
                   error:'no more',
                   storeName,
                   pageIndex:--pageIndex,
                   projectModes:dataArray,
               })
           }else{
               let max=pageSize*pageIndex>dataArray.length?dataArray.length:pageSize*pageIndex
               dispatch({
                   type:Types.POPULAR_LOAD_MORE_SUCCESS,
                   storeName,
                   pageIndex,
                   projectModes: dataArray.slice(0,max)
               })
           }
       },500)
   }
}
//第一次加载数据时调用的
function handleData(dispatch,storeName,data, pageSize) {
    let fixItems=[]
    if(data&&data.data&&data.data.items){
        fixItems=data.data.items
    }
  dispatch({
      type: Types.POPULAR_REFRESH_SUCCESS,
      items:fixItems,//全部数据
      projectModes:pageSize>fixItems.length?fixItems:fixItems.slice(0,pageSize),//第一次要展示的数据
      storeName,
      pageIndex:1,
  })
}