import { useAuthContext } from './useAuthContext';
import { useQueriesContext } from './useQueriesContext';

export const useLogout = () => {
    const { dispatch } = useAuthContext()
    const { dispatch: queriesDispatch } = useQueriesContext()

    const logout = () => {
        //remove user from storage
        localStorage.removeItem('user')

        //dispatch logout action
        dispatch({type: 'LOGOUT'})
        queriesDispatch({type: 'SET_QUERIES', payload: null})
    }

    return {logout}
}