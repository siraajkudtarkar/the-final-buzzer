import logo from './logo.png';
import './App.css';
import CountdownTimer from './components/CountdownTimer';
import TaskManagement from './components/TaskManagement';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <CountdownTimer initialSeconds={0} />
        <TaskManagement />
      </header>
    </div>
  );
}

export default App;