import React, { useState } from "react";
import { useQueriesContext } from "../hooks/useQueriesContext";
import { useAuthContext } from "../hooks/useAuthContext";

const QueryForm = () => {
  const { dispatch } = useQueriesContext();
  const { user } = useAuthContext();

  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in');
      return;
    }

    const query = { question };

    try {
      // First, fetch the answer
      const answerResponse = await fetch('/api/queries/fetchAnswer', {
        method: 'POST',
        body: JSON.stringify(query),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });

      const answerJson = await answerResponse.json();

      if (!answerResponse.ok) {
        setError(answerJson.error);
        setEmptyFields(answerJson.emptyFields || []);
        return;
      }

      // Now, save the query with the answer
      const saveResponse = await fetch('/api/queries', {
        method: 'POST',
        body: JSON.stringify({
          question: question,
          answer: answerJson.answer
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });

      const saveJson = await saveResponse.json();

      if (!saveResponse.ok) {
        setError(saveJson.error);
        setEmptyFields(saveJson.emptyFields || []);
      } else {
        dispatch({ type: 'CREATE_QUERY', payload: saveJson });
        setQuestion('');
        setError('');
        setEmptyFields([]);
      }
    } catch (error) {
      setError('Failed to save query. Please try again later.');
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Ask a new Question?</h3>
      <label>Question: </label>
      <input
        type="text"
        onChange={(e) => setQuestion(e.target.value)}
        value={question}
        className={emptyFields.includes('question') ? 'error' : ''}
      />
      <button type="submit">Submit</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default QueryForm;