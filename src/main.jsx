// // src/main.jsx
// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import './styles/global.css';
// import App from './App';

// /**
//  * Application entry point.
//  * 
//  * Initializes MSW (Mock Service Worker) only in development mode
//  * to simulate server interactions as required by §3.
//  */

// async function enableMocking() {
//   if (import.meta.env.MODE !== 'development') {
//     return;
//   }

//   try {
//     const { worker } = await import('../mocks/browser.js');
//     await worker.start({
//       onUnhandledRequest: 'bypass',
//       serviceWorker: {
//         url: '/mockServiceWorker.js'
//       }
//     });
//     console.log('🔧 MSW enabled');
//   } catch (error) {
//     console.warn('⚠️ MSW not available:', error);
//   }
// }

// enableMocking().then(() => {
//   const root = createRoot(document.getElementById('root'));
//   root.render(
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>
//   );
// });


// src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import App from './App';

/**
 * Application entry point.
 * 
 * Initializes MSW (Mock Service Worker) only in development mode
 * to simulate server interactions as required by §3.
 */

async function enableMocking() {
  if (import.meta.env.MODE !== 'development') {
    return;
  }

  try {
    const { worker } = await import('../mocks/browser.js');
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js'
      }
    });
    console.log('🔧 MSW enabled');
  } catch (error) {
    console.warn('⚠️ MSW not available:', error);
  }
}

enableMocking().then(() => {
  const root = createRoot(document.getElementById('root'));
  root.render(<App />);
});