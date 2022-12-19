import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import InputText from './components/InputText';
import TodoList from "./components/TodoList";

function App() {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" element={<InputText/>} />
                    <Route path="/input-text" element={<InputText/>} />
                    <Route path="/list" element={<TodoList/>} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;