import { createContext, useReducer } from "react";

export const QueriesContext = createContext()

export const queriesReducer = (state, action) => {
    switch (action.type) {
        case 'SET_QUERIES':
            return {
                queries: action.payload
            }

        case 'CREATE_QUERY':
            return {
                queries: [action.payload, ...state.queries]
            }

        case 'DELETE_QUERY':
            return {
                queries: state.queries.filter((q) => q._id !== action.payload._id)
            }

        case 'UPDATE_QUERY':
            // Assuming `UPDATE_QUERY` will update the answer of an existing query
            return {
                queries: state.queries.map(query =>
                    query.question === action.payload.question ? { ...query, answer: action.payload.answer } : query
                )
            };

        default:
            return state
    }
}

export const QueriesContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(queriesReducer, {
        queries: []
    })



    return (
        <QueriesContext.Provider value={{ ...state, dispatch }}>
            {children}
        </QueriesContext.Provider>
    )
}