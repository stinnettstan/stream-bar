import { useRef, useState, useEffect } from 'preact/hooks';
import { h } from 'preact';
import './App.css';
import BackendUI from './BackendUI.js';

// Separate data structure for categories and topics
// const categoriesWithTopics = [
//   {
//     categoryName: "NBA Legends",
//     topics: [
//       { title: "Michael Jordan: The Greatest of All Time", isActive: false },
//       { title: "Kobe Bryant's Legacy", isActive: false },
//       { title: "Magic Johnson and Showtime Lakers", isActive: false },
//       { title: "Larry Bird's Impact on the NBA", isActive: false },
//     ]
//   },
//   {
//     categoryName: "Famous Teams",
//     topics: [
//       { title: "1996 Chicago Bulls: The 72-10 Record", isActive: false },
//       { title: "Golden State Warriors: The Splash Brothers Era", isActive: false },
//     ]
//   },
//   {
//     categoryName: "International Basketball",
//     topics: [
//       { title: "The Growth of Basketball Worldwide", isActive: false },
//       { title: "FIBA World Cup Highlights", isActive: false },
//     ]
//   },
//   {
//     categoryName: "Iconic Moments",
//     topics: [
//       { title: "LeBron James' Block in 2016 Finals", isActive: false },
//       { title: "Ray Allen's Clutch Three in 2013 Finals", isActive: false },
//       { title: "Derrick Rose: Youngest MVP", isActive: false },
//       { title: "Vince Carter's Dunk Contest Victory", isActive: false },
//     ]
//   }
// ];

// Initial seeds/names hardcoded by the user
// const teams = [
//   { seed: 1, name: "Lakers" },
//   { seed: 2, name: "Celtics" },
//   { seed: 3, name: "Bulls" },
//   { seed: 4, name: "Heat" },
//   { seed: 5, name: "Warriors" },
//   { seed: 6, name: "Spurs" },
//   { seed: 7, name: "Rockets" },
//   { seed: 8, name: "Nets" },
//   { seed: 9, name: "Jonnhy" },
//   { seed: 10, name: "Rohnny" },
//   { seed: 11, name: "Donny" },
//   { seed: 12, name: "Koni" },
//   { seed: 13, name: "Moni" },
//   { seed: 14, name: "CHewbacca" },
//   { seed: 15, name: "Bakaka" },
//   { seed: 16, name: "Ratata" },
// ];

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
  if (teamCount <= 0) return [];
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
  if (teams.length === 0) return [];
  // Sort teams by seed in ascending order
  const sortedTeams = [...teams].sort((a, b) => a.seed - b.seed);

  let matchups = [];
  for (let i = 0; i < sortedTeams.length / 2; i++) {
    matchups.push({ matchup: [sortedTeams[i], sortedTeams[sortedTeams.length - 1 - i]], winner: null });
  }
  return matchups;
};

const App = () => {
  const [categoriesWithTopics, setCategoriesWithTopics] = useState([]);
  const [endCategoriesWithTopics, setEndCategoriesWithTopics] = useState([]);
  const [teams, setTeams] = useState([]);
  const pregeneratedRounds = pregenerateRounds(teams.length);
  const updatedFirstRoundMatchups = createInitialMatchups(teams);
  if (pregeneratedRounds.length > 0) {
    pregeneratedRounds[0].brackets = updatedFirstRoundMatchups
  }

  const [rounds, setRounds] = useState(pregeneratedRounds);
  const [currentRound, setCurrentRound] = useState(0);

  const flatItems = [
    ...categoriesWithTopics.flatMap(category => category.topics),
    ...rounds.flatMap(round => round.brackets),
    ...endCategoriesWithTopics.flatMap(category => category.topics),
  ];

  const [activeItem, setActiveItem] = useState(flatItems[0] || {});

  // Functions to manage Backend UI inputs
  const handleCategoryTopicChange = (newCategoriesWithTopics) => {
    setCategoriesWithTopics(newCategoriesWithTopics);
    setActiveItem(flatItems[0] || {});
  };

  const handleEndCategoriesWithTopicsChange = (newEndCategoriesWithTopics) => {
    setEndCategoriesWithTopics(newEndCategoriesWithTopics);
    setActiveItem(flatItems[0] || {});
  };

  const handleTeamsChange = (newTeams) => {
    setTeams(newTeams);
    const newRounds = pregenerateRounds(newTeams.length);
    const firstRoundMatchups = createInitialMatchups(newTeams);
    if (newRounds[0]) newRounds[0].brackets = firstRoundMatchups;
    setRounds(newRounds);
    setCurrentRound(0);
    setActiveItem(flatItems[0] || {});
    // setActiveItem(firstRoundMatchups[0] || {});
  };

  // Additional function to scroll to the active item's header
  const scrollToActiveHeader = (activeItem) => {
    if (!activeItem) return;
    let headerId = '';

    // It's a topic in the initial categories
    if ('title' in activeItem && categoriesWithTopics.some(cat => cat.topics.includes(activeItem))) {
      const category = categoriesWithTopics.find(cat => cat.topics.includes(activeItem));
      headerId = `header-${category.categoryName}`;
    }
    // It's a topic in the end categories
    else if ('title' in activeItem && endCategoriesWithTopics.some(cat => cat.topics.includes(activeItem))) {
      const category = endCategoriesWithTopics.find(cat => cat.topics.includes(activeItem));
      headerId = `header-${category.categoryName}-end`; // Ensure this ID format is unique and used when rendering end category headers
    }
    // It's a matchup
    else if ('matchup' in activeItem) {
      const round = rounds.find(r => r.brackets.includes(activeItem));
      headerId = `header-${round.name}`;
    }
    if (headerId) {
      const headerElement = document.getElementById(headerId);
      const sidebarContainer = document.getElementById('right-sidebar'); // Assuming this is the ID of your sidebar

      if (headerElement && sidebarContainer) {
        // Use offsetTop to get the distance from the header element to the top of its offsetParent (sidebar)
        const scrollToPosition = headerElement.offsetTop;

        // Scroll the sidebar container to the header element's top offset
        sidebarContainer.scrollTo({ top: scrollToPosition, behavior: 'smooth' });
      }
    }
    // ? Below approach scrolls to activeItem, not the header... I think
    // if (headerId) {
    //   const headerElement = document.getElementById(headerId);
    //   if (headerElement) {
    //     const container = document.getElementById('right-sidebar'); // Assuming the container has an ID or reference
    //     if (container) {
    //       const headerTop = headerElement.getBoundingClientRect().top;
    //       const containerTop = container.getBoundingClientRect().top;
    //       const scrollPosition = headerTop - containerTop + container.scrollTop;

    //       container.scrollTo({ top: scrollPosition, behavior: 'smooth' });
    //     }
    //   }
    // }
  };

  // Function to cycle active topic/bracket
  const cycleActiveItem = (direction) => {
    if (!flatItems.length) return; // Early return if there are no items to cycle through
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
    if ('matchup' in activeItem && rounds.length) { // Ensure we're working with a matchup
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
      ...endCategoriesWithTopics.flatMap(category => category.topics),
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
  }, [rounds, categoriesWithTopics, endCategoriesWithTopics]);

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
      <BackendUI onCategoriesWithTopicsChange={handleCategoryTopicChange} onTeamsChange={handleTeamsChange} onEndCategoriesWithTopicsChange={handleEndCategoriesWithTopicsChange} />
      <Sidebar categoriesWithTopics={categoriesWithTopics} endCategoriesWithTopics={endCategoriesWithTopics} rounds={rounds} activeItem={activeItem} setActiveItem={setActiveItem} scrollToActiveHeader={scrollToActiveHeader} />
      <BottomBar activeItem={activeItem} />
    </div>
  );
};

const Sidebar = ({ categoriesWithTopics, endCategoriesWithTopics, rounds, activeItem, setActiveItem, scrollToActiveHeader }) => {
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
      {categoriesWithTopics.length > 0 && categoriesWithTopics.map((category, categoryIndex) => (
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
      {rounds.length > 0 && rounds.map((round, roundIndex) => (
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

      {endCategoriesWithTopics.length > 0 && endCategoriesWithTopics.map((category, categoryIndex) => (
        <div key={`end-topic-${categoryIndex}`}>
          <h3 id={`header-${category.categoryName}-end`}>{category.categoryName}</h3>
          <ul>
            {category.topics.map((topic, topicIndex) => (
              <li key={`end-topic-item-${topicIndex}`}
                className={topic === activeItem ? 'active' : ''}
                onClick={() => setActiveItem(topic)}>
                {topic.title}
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
