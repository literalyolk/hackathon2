import logo from './logo.svg';
import './App.css';
import Avataaars from 'react-avataaars';
import { useState, useEffect } from 'react';

function getInitialStats() {
  // Simulate stats from localStorage or backend
  const stats = JSON.parse(localStorage.getItem('fitfrogProfileStats') || '{}');
  return {
    caloriesBurned: stats.caloriesBurned || 0,
    daysUsingApp: stats.daysUsingApp || 1,
    workoutsLogged: stats.workoutsLogged || 0,
    firstLogin: stats.firstLogin || new Date().toISOString(),
  };
}

const avatarItems = {
  accessoriesType: [
    { value: 'Blank', label: 'None', unlock: 0 },
    { value: 'Prescription01', label: 'Glasses', unlock: 1 },
    { value: 'Kurt', label: 'Sunglasses', unlock: 2 },
    { value: 'Round', label: 'Round Glasses', unlock: 3 },
  ],
  topType: [
    { value: 'ShortHairShortFlat', label: 'Short Flat', unlock: 0 },
    { value: 'LongHairStraight', label: 'Long Straight', unlock: 2 },
    { value: 'NoHair', label: 'No Hair', unlock: 3 },
    { value: 'Hat', label: 'Hat', unlock: 4 },
  ],
  hairColor: [
    { value: 'Brown', label: 'Brown', unlock: 0 },
    { value: 'Black', label: 'Black', unlock: 1 },
    { value: 'Blonde', label: 'Blonde', unlock: 2 },
    { value: 'Red', label: 'Red', unlock: 3 },
  ],
  skinColor: [
    { value: 'Light', label: 'Light', unlock: 0 },
    { value: 'Brown', label: 'Brown', unlock: 1 },
    { value: 'DarkBrown', label: 'Dark Brown', unlock: 2 },
    { value: 'Black', label: 'Black', unlock: 3 },
  ],
};

const achievements = [
  { key: 'caloriesBurned', label: 'Calories Burned', target: 1000, unlock: 1, desc: 'Burn 1,000 calories' },
  { key: 'daysUsingApp', label: 'Days Using App', target: 7, unlock: 2, desc: 'Use the app for 7 days' },
  { key: 'workoutsLogged', label: 'Workouts Logged', target: 10, unlock: 3, desc: 'Log 10 workouts' },
  { key: 'caloriesBurned', label: 'Calories Burned', target: 5000, unlock: 4, desc: 'Burn 5,000 calories' },
];

function App() {
  const [avatar, setAvatar] = useState({
    topType: 'ShortHairShortFlat',
    accessoriesType: 'Blank',
    hairColor: 'Brown',
    facialHairType: 'Blank',
    clotheType: 'Hoodie',
    clotheColor: 'Blue03',
    eyeType: 'Default',
    eyebrowType: 'Default',
    mouthType: 'Smile',
    skinColor: 'Light',
  });
  const [page, setPage] = useState('main');
  const [stats, setStats] = useState(getInitialStats());
  const [unlocked, setUnlocked] = useState([0]);

  useEffect(() => {
    // Simulate stat updates (replace with real logic)
    const interval = setInterval(() => {
      setStats(s => {
        const days = Math.floor((Date.now() - new Date(s.firstLogin).getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return { ...s, daysUsingApp: days };
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Unlock items based on achievements
    let unlockedArr = [0];
    achievements.forEach(a => {
      if (stats[a.key] >= a.target) unlockedArr.push(a.unlock);
    });
    setUnlocked(unlockedArr);
  }, [stats]);

  function renderAvatarCustomizer() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.5rem' }}>
        <label>
          Hair Style:
          <select value={avatar.topType} onChange={e => setAvatar(a => ({ ...a, topType: e.target.value }))}>
            {avatarItems.topType.filter(i => unlocked.includes(i.unlock)).map(i => (
              <option key={i.value} value={i.value}>{i.label}</option>
            ))}
          </select>
        </label>
        <label>
          Accessories:
          <select value={avatar.accessoriesType} onChange={e => setAvatar(a => ({ ...a, accessoriesType: e.target.value }))}>
            {avatarItems.accessoriesType.filter(i => unlocked.includes(i.unlock)).map(i => (
              <option key={i.value} value={i.value}>{i.label}</option>
            ))}
          </select>
        </label>
        <label>
          Hair Color:
          <select value={avatar.hairColor} onChange={e => setAvatar(a => ({ ...a, hairColor: e.target.value }))}>
            {avatarItems.hairColor.filter(i => unlocked.includes(i.unlock)).map(i => (
              <option key={i.value} value={i.value}>{i.label}</option>
            ))}
          </select>
        </label>
        <label>
          Skin Color:
          <select value={avatar.skinColor} onChange={e => setAvatar(a => ({ ...a, skinColor: e.target.value }))}>
            {avatarItems.skinColor.filter(i => unlocked.includes(i.unlock)).map(i => (
              <option key={i.value} value={i.value}>{i.label}</option>
            ))}
          </select>
        </label>
      </div>
    );
  }

  function renderAchievements() {
    return (
      <div style={{ margin: '2rem 0' }}>
        <h3>Achievements</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {achievements.map(a => (
            <li key={a.desc} style={{ margin: '0.5rem 0', color: stats[a.key] >= a.target ? 'green' : 'gray' }}>
              <strong>{a.label}:</strong> {a.desc} {stats[a.key] >= a.target ? '✅' : `(${stats[a.key]}/${a.target})`}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        {page === 'main' && (
          <>
            <h2>Customize Your Avatar</h2>
            <Avataaars
              style={{ width: 180, height: 180, background: '#fff', borderRadius: '50%', margin: '1rem auto' }}
              {...avatar}
            />
            {renderAvatarCustomizer()}
            <button style={{ marginTop: '2rem' }} onClick={() => setPage('profile')}>Go to Profile</button>
          </>
        )}
        {page === 'profile' && (
          <>
            <h2>Your Profile</h2>
            <Avataaars
              style={{ width: 180, height: 180, background: '#fff', borderRadius: '50%', margin: '1rem auto' }}
              {...avatar}
            />
            <div style={{ margin: '1rem 0' }}>
              <div><strong>Calories Burned:</strong> {stats.caloriesBurned}</div>
              <div><strong>Days Using App:</strong> {stats.daysUsingApp}</div>
              <div><strong>Workouts Logged:</strong> {stats.workoutsLogged}</div>
            </div>
            {renderAchievements()}
            <button onClick={() => setPage('main')}>Back to Avatar</button>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
