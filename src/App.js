import { useState, useEffect } from 'preact/hooks';
import { h } from 'preact';
import './App.css';

// Updated data structure
const categoriesWithTopics = [
  {
    categoryName: "NBA Legends",
    topics: [
      { title: "Michael Jordan: The Greatest of All Time", isActive: false },
      { title: "Kobe Bryant's Legacy", isActive: false },
      { title: "Magic Johnson and Showtime Lakers", isActive: false },
      { title: "Larry Bird's Impact on the NBA", isActive: false },
    ]
  },
  {
    categoryName: "Famous Teams",
    topics: [
      { title: "1996 Chicago Bulls: The 72-10 Record", isActive: false },
      { title: "Golden State Warriors: The Splash Brothers Era", isActive: false },
    ]
  },
  {
    categoryName: "Basketball Fundamentals",
    topics: [
      { title: "The Art of Dribbling", isActive: false },
      { title: "Shooting Techniques", isActive: false },
      { title: "Defensive Strategies", isActive: false },
      { title: "Importance of Teamwork", isActive: false },
    ]
  },
  {
    categoryName: "International Basketball",
    topics: [
      { title: "The Growth of Basketball Worldwide", isActive: false },
      { title: "FIBA World Cup Highlights", isActive: false },
    ]
  },
  {
    categoryName: "Iconic Moments",
    topics: [
      { title: "LeBron James' Block in 2016 Finals", isActive: false },
      { title: "Ray Allen's Clutch Three in 2013 Finals", isActive: false },
      { title: "Derrick Rose: Youngest MVP", isActive: false },
      { title: "Vince Carter's Dunk Contest Victory", isActive: false },
    ]
  }
];


const App = () => {
  // Flatten topics to calculate active topic
  const flatTopics = categoriesWithTopics.flatMap(category => category.topics.map(topic => ({ ...topic, category: category.categoryName })));
  const [activeTopic, setActiveTopic] = useState(flatTopics[0].title);

  const cycleActiveTopic = (direction) => {
    const currentIndex = flatTopics.findIndex(topic => topic.title === activeTopic);
    let nextIndex = currentIndex;

    if (direction === 'forward') {
      nextIndex = (currentIndex + 1) % flatTopics.length;
    } else if (direction === 'backward') {
      nextIndex = (currentIndex - 1 + flatTopics.length) % flatTopics.length;
    }

    setActiveTopic(flatTopics[nextIndex].title);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        cycleActiveTopic('forward');
      } else if (e.key === "ArrowUp") {
        cycleActiveTopic('backward');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeTopic]);

  return (
    <div id="main-container">
      <Sidebar categoriesWithTopics={categoriesWithTopics} activeTopic={activeTopic} setActiveTopic={setActiveTopic} />
      <BottomBar activeTopic={activeTopic} />
    </div>
  );
};

const Sidebar = ({ categoriesWithTopics, activeTopic, setActiveTopic }) => {
  useEffect(() => {
    const activeElement = document.querySelector('.active');
    if (activeElement) {
      activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeTopic]);

  return (
    <div id="right-sidebar">
      {categoriesWithTopics.map((category, categoryIndex) => (
        <div key={categoryIndex}>
          <h3>{`${categoryIndex + 1}. ${category.categoryName}`}</h3>
          <ul id="topic-list">
            {category.topics.map((topic, topicIndex) => (
              <li key={topicIndex} className={topic.title === activeTopic ? 'active' : ''} onClick={() => setActiveTopic(topic.title)}>
                {`${topicIndex + 1}. ${topic.title}`}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

const BottomBar = ({ activeTopic }) => {
  return (
    <div id="bottom-bar">
      <div id="active-topic">{activeTopic}</div>
    </div>
  );
};

export default App;
