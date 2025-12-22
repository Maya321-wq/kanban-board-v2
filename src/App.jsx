// // src/App.jsx
// import React, { lazy, Suspense } from 'react';
// import { BoardProvider } from './context/BoardProvider';
// import Header from './components/Header';
// import Toolbar from './components/Toolbar';
// import Board from './components/Board';

// // Lazy-load heavy modal (Requirement §7: Code Splitting + Suspense)
// const CardDetailModal = lazy(() => import('./components/CardDetailModal'));

// export default function App() {
//   return (
//     <BoardProvider>
//       <div className="min-h-screen flex flex-col bg-gray-50">
//         <Header />
//         <Toolbar />
//         <main className="flex-1">
//           <Board />
//         </main>
//         <Suspense fallback={<div className="fixed inset-0 bg-black/20 flex items-center justify-center text-white">Loading card...</div>}>
//           <CardDetailModal />
//         </Suspense>
//       </div>
//     </BoardProvider>
//   );
// }

// src/App.jsx
import React, { lazy, Suspense } from 'react';
import { BoardProvider } from './context/BoardProvider';
import Header from './components/Header';
import Toolbar from './components/Toolbar';
import Board from './components/Board';

// Lazy-load heavy modal (Requirement §7: Code Splitting + Suspense)
const CardDetailModal = lazy(() => import('./components/CardDetailModal'));

export default function App() {
  return (
    <BoardProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <Toolbar />
        <main className="flex-1">
          <Board />
        </main>
        <Suspense fallback={
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 shadow-2xl">
              <div className="flex items-center gap-3">
                <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-gray-700 font-medium">Loading card...</span>
              </div>
            </div>
          </div>
        }>
          <CardDetailModal />
        </Suspense>
      </div>
    </BoardProvider>
  );
}

