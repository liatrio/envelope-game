import React, { useState, useEffect } from 'react';

const App = () => {
   const [text, setText] = useState('Loading...');

   useEffect(() => {
      fetch('/foo').then(async (response) => {
         const text = await response.text();
         setText(text);
      });
   }, []);

   return (
      <div>
         <h1>{text}</h1>
      </div>
   );
}

export default App;
