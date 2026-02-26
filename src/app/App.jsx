import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from '../pages/Dashboard';
import WorkSession from '../pages/WorkSession';
import Roadmap from '../pages/Roadmap';
import Analytics from '../pages/Analytics';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="timer" element={<WorkSession />} />
                    <Route path="roadmap" element={<Roadmap />} />
                    <Route path="analytics" element={<Analytics />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
