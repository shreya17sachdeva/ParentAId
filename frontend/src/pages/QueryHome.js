import React, { useEffect } from 'react';
import { useQueriesContext } from "../hooks/useQueriesContext";
import { useAuthContext } from "../hooks/useAuthContext";
import QueryDetails from '../components/queryDetails';
import QueryForm from '../components/queryForm';

const Queries = () => {
  const { queries, dispatch } = useQueriesContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchQueries = async () => {
      const response = await fetch('/api/queries', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({type: 'SET_QUERIES', payload: json});
      }
    };

    if (user) {
      fetchQueries();
    }
  }, [dispatch, user]);

  return (
    <div className="home">
      <div className="queries">
        {queries && queries.map((query) => (
          <QueryDetails key={query._id} query={query} />
        ))}
      </div>
      <QueryForm />
    </div>
  );
};

export default Queries;