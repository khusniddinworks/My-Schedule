import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from '../pages/Dashboard';
import WorkSession from '../pages/WorkSession';
import Roadmap from '../pages/Roadmap';
import Analytics from '../pages/Analytics';

function App() {
    try {
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
    } catch (error) {
        console.error("App Render Error:", error);
        return <div className="p-20 text-center font-bold text-rose-500">SYSTEM RECOVERY MODE: Error detected in application logic.</div>;
    }
}

export default App;
