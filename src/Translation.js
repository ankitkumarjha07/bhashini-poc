import React, { useState } from 'react';
import bhashini from 'bhashini-translation';

function Translation() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');

  const translateText = async () => {
    try {
      const sourceLang = 'en';
      const targetLang = 'hi'; // Replace with your desired target language code

      // Call the NMT function to translate the text
      const translationResult = await bhashini.tts(sourceLang, targetLang, inputText, "female");

      // Update the state with the translated text
      setTranslatedText(translationResult);
    } catch (error) {
      console.error('Translation error:', error);
    }
  };

  return (
    <div>
      <h2>Translate Text</h2>
      <textarea
        placeholder="Enter text to translate"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button onClick={translateText}>Translate</button>
      <div>
        <h2>Translated Text</h2>
        <p>{translatedText}</p>
      </div>
    </div>
  );
}

export default Translation;