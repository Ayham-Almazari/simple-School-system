export default function authCheck({next, store}){
    if (!store.getters['auth/check'] && store.getters['auth/token']){
        store.dispatch("auth/fetchUser");
        return next()
    }else if (store.getters["auth/check"] && store.getters["auth/token"]){
        return next()
    }else
        return next({name:"login"})
}
