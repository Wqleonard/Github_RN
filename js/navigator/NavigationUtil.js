/**
 * 全局导航静态类
 */

export default class NavigationUtil{
    /**
     * 跳转到指定页面
     * @param params,page
     */
    static goPage(params,page){
        const navigation=NavigationUtil.navigation
        if(!navigation){
            console.log('NavigationUtil.navigation can not be null')
        }else{
            navigation.navigate(page,{
                ...params
            })
        }
    }

    /**
     * 返回上一页
     * @param navigation
     */
    static goBack(navigation){
        navigation.goBack()
    }

    /**
     * 重置到首页
     * @param params
     */
    static resetToHomePage(params){
      const {navigation}=params
      navigation.navigate('Main')
    }

    /**
     * 跳转到PopularTab页
     * 可以将该navigationTab跳转到传递的topTab的路由
     * 但是当前父navigation还停留在当前的路由，需要跳转到navigationTab所在的路由才能查看到
     * 子跳父确可以，很神奇
     * 总结：子路由调用父navigation跳转父下面的其它路由可以成功跳转，父路由调用父下指定其它路由的子navigation，
     * 跳转至某一子路由，子navigation完成跳转，但是当前路由没能跳到该指定其它路由，可以跳转后看到效果
     * @param params,page
     */
    static goPopularTabPage(params,page){
        const navigation=NavigationUtil.navigationTab
        if(!navigation){
            console.log('NavigationUtil.navigationTab can not be null')
        }else{
            navigation.navigate(page,{
                ...params
            })
        }
    }

    /**
     * 跳转至Detail页并替换
     * @param navigation
     */
    static replaceDetail(){
        NavigationUtil.navigation.replace('DetailPage')
    }
}