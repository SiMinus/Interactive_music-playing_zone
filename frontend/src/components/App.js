import React from 'react';
import { createRoot } from 'react-dom/client';
import HomePage from './HomePage';

function App() {
    return (
        <div className='center'>
            <HomePage/>
        </div>
    
    );
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);

export default App;

