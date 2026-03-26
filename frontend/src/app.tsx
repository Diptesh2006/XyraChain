import { Routes, Route, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import AnalysisCenter from './pages/AnalysisCenter';
import TriageChat from './pages/TriageChat';
import PatientVault from './pages/PatientVault';
import Profile from './pages/Profile';
import HospitalFinder from './pages/HospitalFinder';
import ChatWidget from './components/ChatWidget';

function App() {
  const location = useLocation();
  const showChatWidget = location.pathname !== '/triage';

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/analysis" element={<AnalysisCenter />} />
        <Route path="/triage" element={<TriageChat />} />
        <Route path="/vault" element={<PatientVault />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/find-doctor" element={<HospitalFinder />} />
      </Routes>

      {showChatWidget && <ChatWidget />}
    </>
  );
}

export default App;
