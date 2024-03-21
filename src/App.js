import { useRef, useState, useEffect } from 'preact/hooks';
import { h } from 'preact';
import './App.css';

// Separate data structure for categories and topics
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

// Initial seeds/names hardcoded by the user
const teams = [
  { seed: 1, name: "Lakers" },
  { seed: 2, name: "Celtics" },
  { seed: 3, name: "Bulls" },
  { seed: 4, name: "Heat" },
  { seed: 5, name: "Warriors" },
  { seed: 6, name: "Spurs" },
  { seed: 7, name: "Rockets" },
  { seed: 8, name: "Nets" },
  { seed: 9, name: "Jonnhy" },
  { seed: 10, name: "Rohnny" },
  { seed: 11, name: "Donny" },
  { seed: 12, name: "Koni" },
  { seed: 13, name: "Moni" },
  { seed: 14, name: "CHewbacca" },
  { seed: 15, name: "Bakaka" },
  { seed: 16, name: "Ratata" },
];

// Calculates total rounds needed for the tournament
const totalRoundsNeeded = (teamCount) => {
  return Math.ceil(Math.log(teamCount) / Math.log(2));
};

const generateRoundName = (numTeams) => {
  switch (numTeams) {
    case 2:
      return 'Finals';
    case 4:
      return 'Semifinals';
    case 8:
      return 'Quarterfinals';
    default:
      if (numTeams > 8) {
        return `Round of ${numTeams}`;
      } else {
        return `Round of ${numTeams * 2}`; // For intermediary rounds not explicitly named
      }
  }
};

// Pre-generates all rounds with placeholders
const pregenerateRounds = (teamCount) => {
  let rounds = [];
  let matchupsCount = teamCount / 2;
  for (let i = 0; i < totalRoundsNeeded(teamCount); i++) {
    let round = {
      name: generateRoundName(matchupsCount * 2),
      brackets: Array(matchupsCount).fill().map(() => ({ matchup: [{ name: '?' }, { name: '?' }], winner: null })), // TODO names should be null lol
    };
    rounds.push(round);
    matchupsCount /= 2; // Each subsequent round has half the number of matchups
  }
  return rounds;
};

const createInitialMatchups = (teams) => {
  // Sort teams by seed in ascending order
  const sortedTeams = [...teams].sort((a, b) => a.seed - b.seed);

  let matchups = [];
  for (let i = 0; i < sortedTeams.length / 2; i++) {
    matchups.push({ matchup: [sortedTeams[i], sortedTeams[sortedTeams.length - 1 - i]], winner: null });
  }
  return matchups;
};

const App = () => {
  const pregeneratedRounds = pregenerateRounds(teams.length);
  const updatedFirstRoundMatchups = createInitialMatchups(teams);
  pregeneratedRounds[0].brackets = updatedFirstRoundMatchups;

  const [rounds, setRounds] = useState(pregeneratedRounds);
  const [currentRound, setCurrentRound] = useState(0);

  // Combine topics and brackets for cycling
  const flatItems = [
    ...categoriesWithTopics.flatMap(category => category.topics),
    ...rounds.flatMap(round => round.brackets),
  ];
  const [activeItem, setActiveItem] = useState(flatItems[0]);

  // Function to cycle active topic/bracket
  const cycleActiveItem = (direction) => {
    const currentIndex = flatItems.findIndex(item => item === activeItem);
    let nextIndex = currentIndex;

    if (direction === 'forward') {
      nextIndex = (currentIndex + 1) % flatItems.length;
    } else if (direction === 'backward') {
      nextIndex = (currentIndex - 1 + flatItems.length) % flatItems.length;
    }

    setActiveItem(flatItems[nextIndex]);
    // After setting the new active item, scroll to its header
    scrollToActiveHeader(flatItems[nextIndex]);
  };

  // Additional function to scroll to the active item's header
  const scrollToActiveHeader = (activeItem) => {
    let headerId = '';
    if ('title' in activeItem) {
      // It's a topic, find its category
      const category = categoriesWithTopics.find(cat => cat.topics.includes(activeItem));
      headerId = `header-${category.categoryName}`;
    } else if ('matchup' in activeItem) {
      // It's a matchup, find its round
      const round = rounds.find(r => r.brackets.includes(activeItem));
      headerId = `header-${round.name}`;
    }
    // If we have a valid headerId, scroll to it
    if (headerId) {
      const headerElement = document.getElementById(headerId);
      if (headerElement) {
        headerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };



  const updateFutureRounds = (updatedRounds, currentRound) => {
    if (currentRound + 1 < updatedRounds.length) {
      // Logic to advance winners to the next round
      const winners = updatedRounds[currentRound].brackets.map(bracket => bracket.winner !== null ? teams[bracket.matchup[bracket.winner].seed - 1] : null);
      const nextRoundMatchups = createInitialMatchups(winners.filter(winner => winner !== null));
      updatedRounds[currentRound + 1].brackets = nextRoundMatchups;
    }
    return updatedRounds;
  };

  const selectWinner = (winnerIndex) => {
    if ('matchup' in activeItem) { // Ensure we're working with a matchup
      let updatedRounds = [...rounds];
      // Find the round of the active matchup
      const activeRoundIndex = updatedRounds.findIndex(round =>
        round.brackets.some(bracket => bracket === activeItem));

      if (activeRoundIndex === currentRound) { // Act only if the active matchup is in the current round
        const activeMatchupIndex = updatedRounds[activeRoundIndex].brackets.findIndex(bracket => bracket === activeItem);
        updatedRounds[activeRoundIndex].brackets[activeMatchupIndex].winner = winnerIndex;

        // Logic to update future rounds and potentially advance the current round
        const allDecided = updatedRounds[currentRound].brackets.every(bracket => bracket.winner !== null);
        if (allDecided) {
          updatedRounds = updateFutureRounds(updatedRounds, currentRound);
          setCurrentRound(currentRound + 1);
          // Optionally, update activeItem here as well
          // setActiveItem(updatedRounds[currentRound + 1] ? updatedRounds[currentRound + 1].brackets[0] : flatItems[0]);
        }
        setRounds(updatedRounds);
      }
    }
  };



  useEffect(() => {
    const flatItemsUpdate = [
      ...categoriesWithTopics.flatMap(category => category.topics),
      ...rounds.flatMap(round => round.brackets),
    ];

    // Improved check for the current activeItem's existence in the updated lists
    const activeExistsInUpdated = flatItemsUpdate.some(item => {
      // Adjust logic for topics
      if ('title' in activeItem && item.title === activeItem.title) {
        return true; // Found the topic
      } else if ('matchup' in activeItem && 'matchup' in item) {
        // Adjust logic for brackets/matchups
        return item.matchup[0].name === activeItem.matchup[0].name && item.matchup[1].name === activeItem.matchup[1].name;
      }
      return false;
    });

    // Update activeItem if it no longer exists in the updated list
    if (!activeExistsInUpdated) {
      setActiveItem(flatItemsUpdate[0]); // Reset to the first available item
    }
  }, [rounds, categoriesWithTopics]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Merging key handling logic for cycling topics/brackets and selecting winners
      if (e.key === "ArrowDown") {
        cycleActiveItem('forward');
      } else if (e.key === "ArrowUp") {
        cycleActiveItem('backward');
      } else if (e.key === "ArrowRight") {
        selectWinner(1);
      } else if (e.key === "ArrowLeft") {
        selectWinner(0);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeItem, currentRound, rounds]);

  return (
    <div id="main-container">
      <Sidebar categoriesWithTopics={categoriesWithTopics} rounds={rounds} activeItem={activeItem} setActiveItem={setActiveItem} scrollToActiveHeader={scrollToActiveHeader} />
      <BottomBar activeItem={activeItem} />
    </div>
  );
};

const Sidebar = ({ categoriesWithTopics, rounds, activeItem, setActiveItem, scrollToActiveHeader }) => {
  // Ref for the sidebar container
  const sidebarRef = useRef(null);

  const adjustBottomPadding = () => {
    if (sidebarRef.current) {
      const sidebar = sidebarRef.current;
      const sidebarHeight = sidebar.offsetHeight;

      // Set the bottom padding to the sidebar's height
      sidebar.style.paddingBottom = `${sidebarHeight}px`;
    }
  };

  useEffect(() => {
    scrollToActiveHeader(activeItem);
    // After ensuring the active header is visible, adjust the padding if needed
    adjustBottomPadding();
  }, [activeItem]);

  return (
    <div id="right-sidebar" ref={sidebarRef}>
      {categoriesWithTopics.map((category, categoryIndex) => (
        <div key={`topic-${categoryIndex}`}>
          <h3 id={`header-${category.categoryName}`}>{category.categoryName}</h3>
          <ul>
            {category.topics.map((topic, topicIndex) => (
              <li key={`topic-item-${topicIndex}`}
                className={topic === activeItem ? 'active' : ''}
                onClick={() => setActiveItem(topic)}>
                {topic.title}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {rounds.map((round, roundIndex) => (
        <div key={`round-${roundIndex}`}>
          <h3 id={`header-${round.name}`}>{round.name}</h3>
          <ul>
            {round.brackets.map((bracket, bracketIndex) => (
              <li key={`bracket-item-${bracketIndex}`}
                className={bracket === activeItem ? 'active' : ''}
                onClick={() => setActiveItem(bracket)}>
                {bracket.matchup[0].name !== '?' ?
                  `${bracket.matchup[0].seed}. ${bracket.matchup[0].name} vs. ${bracket.matchup[1].seed}. ${bracket.matchup[1].name}` :
                  "? vs ?"}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};


const BottomBar = ({ activeItem }) => {
  let content = 'Select an item'; // Default message when no item is active

  // Determine the content based on the type of the active item
  if (activeItem) {
    if (activeItem.title) {
      // It's a topic
      content = activeItem.title;
    } else if (activeItem.matchup) {
      // It's a bracket
      const { matchup, winner } = activeItem;
      const matchupContent = matchup[0].name !== '?' ? `${matchup[0].seed}. ${matchup[0].name} vs. ${matchup[1].seed}. ${matchup[1].name}` : "? vs ?";

      // Prepare styled content to highlight the winner
      content = (
        <span>
          {matchup.map((team, index) => (
            <span key={index} style={winner === index ? { fontWeight: 'bold', textDecoration: 'underline' } : {}}>
              {index > 0 ? ' vs. ' : ''}{team.seed}. {team.name}
            </span>
          ))}
        </span>
      );

      // If it's a placeholder match, revert to the simple text display
      if (matchup[0].name === '?') {
        content = matchupContent;
      }
    }
  }

  return (
    <div id="bottom-bar">
      <div id="active-item">{typeof content === 'string' ? content : content}</div>
    </div>
  );
};

export default App;
