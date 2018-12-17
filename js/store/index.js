import {applyMiddleware,createStore} from "redux";
import thunk from 'redux-thunk'
import reducers from '../reducer'
import {middleware} from "../navigator/AppNavigators";

//如何自定义中间键，比如自定义一个日志打印的中间键,每次触发redux的dispatch都会有log打印出来，便于调试
const logger=store=>next=>action=>{
    if(typeof action === 'function'){
        console.log('dispatching a function')
    }else{
        console.log('dispatching',action)
    }
    const result=next(action)
    console.log('nextState',store.getState())
}
const middlewares =[middleware,logger,thunk]
//创建store
export default createStore(reducers,applyMiddleware(...middlewares))