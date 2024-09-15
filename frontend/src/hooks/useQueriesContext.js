import { QueriesContext } from "../context/queryContext";

import { useContext } from "react";

export const useQueriesContext = () => {
    const context = useContext(QueriesContext)

    if(!context) {
        throw Error('useQueriesContext must be used inside an QueriesContextProvider')
    }

    return context
}