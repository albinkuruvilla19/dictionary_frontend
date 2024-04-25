import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [word, setWord] = useState('');
  const [wordData, setWordData] = useState(null);
  const [error, setError] = useState('');
  const [audioSrc, setAudioSrc] = useState('');
  const [randomWord, setRandomWord] = useState(null);

  useEffect(() => {
    fetchRandomWord();
  }, []);

  const fetchRandomWord = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/list/words/');
      if (response.status === 200) {
        const randomIndex = Math.floor(Math.random() * response.data.length);
        setRandomWord(response.data[randomIndex]);
        setError('');
      } else {
        setError('Failed to fetch random word');
        setRandomWord(null);
      }
    } catch (error) {
      setError('Failed to fetch random word');
      setRandomWord(null);
    }
  };

  const fetchWordData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/${word}/`);
      if (response.status === 200) {
        setWordData(response.data[0]);
        setError('');
        // Reset audio source when new word is searched
        setAudioSrc('');
      } else {
        setError('Word not found');
        setWordData(null);
      }
    } catch (error) {
      setError('Word Not Found');
      setWordData(null);
    }
  };

  const playAudio = (src) => {
    setAudioSrc(src);
  };

  return (
    <>
    <div className="container2">
        {randomWord && (
          <div className="word-of-the-day">
            <h2>Word of the Day</h2>
            <h3>"{randomWord.word}"</h3>
            <p>{randomWord.definition}</p>
          </div>
        )}
      </div>
      <div className="container">
        <h1 className="app-heading">Look Up a word, Learn it forever!!</h1>

        <div className="search-container">
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Enter a word"
            className="input-field"
          />
          <button onClick={fetchWordData} className="search-button">
            Search
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}
        {wordData && (
          <div className="word-data-container">
            <h2>Word: {wordData.word}</h2>
            {wordData.phonetics.some((phonetic) => phonetic.audio) && (
              <div>
                <h3>Phonetics:</h3>
                <ul className="phonetics-list">
                  {wordData.phonetics.map((phonetic, index) => (
                    phonetic.audio && (
                      <li key={index} className="phonetic-item">
                        <p>{phonetic.text}</p>
                        <audio controls className="phonetic-audio" src={phonetic.audio} />
                      </li>
                    )
                  ))}
                </ul>
              </div>
            )}
            <h3>Definitions:</h3>
            <ul className="definitions-list">
              {wordData.meanings.map((meaning, index) => (
                <li key={index} className="meaning-item">
                  <p><strong>Part of Speech:</strong> {meaning.partOfSpeech}</p>
                  <ol>
                    {meaning.definitions.map((definition, idx) => (
                      <li key={idx} className="definition-item">
                        <p><strong>Definition:</strong> {definition.definition}</p>
                        {definition.synonyms.length > 0 && <p><strong>Synonyms:</strong> {definition.synonyms.join(', ')}</p>}
                        {definition.antonyms.length > 0 && <p><strong>Antonyms:</strong> {definition.antonyms.join(', ')}</p>}
                        {definition.example && <p><strong>Example:</strong> {definition.example}</p>}
                      </li>
                    ))}
                  </ol>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
