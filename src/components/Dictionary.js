// src/components/Dictionary.js

import React, { useState } from 'react';
import axios from 'axios';

const Dictionary = () => {
  const [word, setWord] = useState('');
  const [definitions, setDefinitions] = useState([]);
  const [error, setError] = useState('');

  const fetchDefinitions = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/word/${word}`);
      setDefinitions(response.data);
      setError('');
    } catch (error) {
      setError('Word not found');
      setDefinitions([]);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="Enter a word"
      />
      <button onClick={fetchDefinitions}>Search</button>
      {error && <p>{error}</p>}
      <ul>
        {definitions.map((definition, index) => (
          <li key={index}>{definition.meanings[0].definitions[0].definition}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dictionary;
