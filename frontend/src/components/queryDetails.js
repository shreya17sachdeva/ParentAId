import React from "react";
import { useQueriesContext } from "../hooks/useQueriesContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { formatDistanceToNow } from 'date-fns';

const QueryDetails = ({ query }) => {
  const { dispatch } = useQueriesContext();
  const { user } = useAuthContext();

  const handleClick = async () => {
    if (!user) {
      return;
    }

    const response = await fetch('/api/queries/' + query._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'DELETE_QUERY', payload: json });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date unavailable';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    try {
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date error';
    }
  };

  return (
    <div className="query-details">
      <h4>Question: {query.question}</h4>
      <h4>Answer:</h4>
      <p>{query.answer || 'No answer available'}</p>
      <p>Created: {formatDate(query.createdAt)}</p>
      <span className="material-symbols-outlined" onClick={handleClick}>
        delete
      </span>
    </div>
  );
};

export default QueryDetails;