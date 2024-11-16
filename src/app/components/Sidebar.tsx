// app/components/Sidebar.tsx
'use client';

import React from 'react';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-base-200 p-4">
      <h2 className="text-xl font-bold mb-4">Bafflity</h2>
      <ul className="menu">
        <li>
          <a>Home</a>
        </li>
        <li>
          <a>About</a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
