import React from 'react';

import  Nav  from './components/Nav';
import { Info } from './features/info/Info';
import { Graph } from './features/graph/Graph';
import { Table } from './features/graph/Graph';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Nav/>
      </header>

      <main>
        <div className = "left-col">
          <section className="info-container">
            <Info />
          </section>
        </div>

        <div className="right-col">
          <section className="graph-container">
            <Graph />
          </section>
          <section>
            <Table/>
          </section>
        </div>
      </main>
      
    </div>
  );
}

export default App;
