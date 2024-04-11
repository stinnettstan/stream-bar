import { useState } from 'preact/hooks';
import { h } from 'preact';


const BackendUI = ({ className, onCategoriesWithTopicsChange, onEndCategoriesWithTopicsChange, onTeamsChange, onRoundNamesChange, onBracketNameChange, onTangentChange}) => {
    const [categoriesWithTopics, setCategoriesWithTopics] = useState([]);
    const [endCategoriesWithTopics, setEndCategoriesWithTopics] = useState([]);
    const [teamSeed, setTeamSeed] = useState('');
    const [teamName, setTeamName] = useState('');
    const [teams, setTeams] = useState([]);
    const [roundNames, setRoundNames] = useState(['Finals', 'Semifinals', 'Quarterfinals', 'Round of 16']);
    const [bracketName, setBracketName] = useState('');
    const [tangent, setTangent] = useState('');
    const addButtonStyling = { background: 'none', border: 'none', padding: '0', cursor: 'pointer', color: '#007bff', textDecoration: 'underline', marginTop: '10px' };

    // Add new category
    const handleAddNewCategory = () => {
        setCategoriesWithTopics([...categoriesWithTopics, { categoryName: '', topics: [] }]);
    };

    // Update category name
    const handleCategoryNameChange = (index, newName) => {
        const updatedCategories = [...categoriesWithTopics];
        updatedCategories[index].categoryName = newName;
        setCategoriesWithTopics(updatedCategories);
    };

    // Add new topic to a specific category
    const handleAddNewTopic = (categoryIndex) => {
        const updatedCategories = [...categoriesWithTopics];
        updatedCategories[categoryIndex].topics.push({ title: '', isActive: false });
        setCategoriesWithTopics(updatedCategories);
    };

    // Update topic title
    const handleTopicTitleChange = (categoryIndex, topicIndex, newTitle) => {
        const updatedCategories = [...categoriesWithTopics];
        updatedCategories[categoryIndex].topics[topicIndex].title = newTitle;
        setCategoriesWithTopics(updatedCategories);
    };
    // Add new end category
    const handleAddNewEndCategory = () => {
        setEndCategoriesWithTopics([...endCategoriesWithTopics, { categoryName: '', topics: [] }]);
    };

    // Update end category name
    const handleEndCategoryNameChange = (index, newName) => {
        const updatedEndCategories = [...endCategoriesWithTopics];
        updatedEndCategories[index].categoryName = newName;
        setEndCategoriesWithTopics(updatedEndCategories);
    };

    // Add new topic to a specific end category
    const handleAddNewEndTopic = (categoryIndex) => {
        const updatedEndCategories = [...endCategoriesWithTopics];
        updatedEndCategories[categoryIndex].topics.push({ title: '', isActive: false });
        setEndCategoriesWithTopics(updatedEndCategories);
    };

    // Update end topic title
    const handleEndTopicTitleChange = (categoryIndex, topicIndex, newTitle) => {
        const updatedEndCategories = [...endCategoriesWithTopics];
        updatedEndCategories[categoryIndex].topics[topicIndex].title = newTitle;
        setEndCategoriesWithTopics(updatedEndCategories);
    };

    const handleRoundNameChange = (roundIndex, newRoundName) => {
        const updated = [...roundNames];
        updated[roundIndex] = newRoundName;
        setRoundNames(updated);
    }

    // Update team name by index
    const handleTeamNameChange = (index, newName) => {
        const updatedTeams = [...teams];
        updatedTeams[index].name = newName;
        setTeams(updatedTeams);
    };

    // Update team seed by index and ensure uniqueness
    const handleTeamSeedChange = (index, newSeed) => {
        const seedInt = parseInt(newSeed, 10);
        if (!isNaN(seedInt) && seedInt >= 1 && seedInt <= 16 && !teams.some((t, i) => t.seed === seedInt && i !== index)) {
            const updatedTeams = [...teams];
            updatedTeams[index].seed = seedInt;
            setTeams(updatedTeams.sort((a, b) => a.seed - b.seed));
        } else {
            alert("Invalid seed or seed already used.");
        }
    };

    // Add new team with validation for seed uniqueness
    const handleAddTeam = () => {
        const seedInt = parseInt(teamSeed, 10);
        if (!isNaN(seedInt) && seedInt >= 1 && seedInt <= 16 && !teams.some(t => t.seed === seedInt)) {
            const newTeams = [...teams, { seed: seedInt, name: teamName }];
            setTeams(newTeams.sort((a, b) => a.seed - b.seed));
            setTeamSeed('');
            setTeamName('');
        } else {
            alert("Invalid seed or seed already used.");
        }
    };

    // Validate and save data with at least one section filled
    const handleSave = () => {
        // Check if at least one section is not empty
        const isAnySectionFilled = categoriesWithTopics.some(category => category.categoryName) ||
            endCategoriesWithTopics.some(category => category.categoryName) ||
            teams.length > 0;

        // Validate the filled sections further if necessary (e.g., teams must be an even number)
        const areTeamsValid = teams.length % 2 === 0;

        if (!isAnySectionFilled) {
            alert("Please fill in at least one section before saving.");
            return;
        }

        if (!areTeamsValid) {
            alert("Please ensure the number of teams is even before saving.");
            return;
        }

        // Proceed with saving if the validations pass
        onCategoriesWithTopicsChange(categoriesWithTopics.filter(category => category.categoryName));
        onEndCategoriesWithTopicsChange(endCategoriesWithTopics.filter(category => category.categoryName));
        onTeamsChange(teams);
        onRoundNamesChange(roundNames);
        onBracketNameChange(bracketName);
    };

    // Delete category by index
    const handleDeleteCategory = (categoryIndex) => {
        const updatedCategories = [...categoriesWithTopics];
        updatedCategories.splice(categoryIndex, 1);
        setCategoriesWithTopics(updatedCategories);
    };

    // Delete topic from a specific category
    const handleDeleteTopic = (categoryIndex, topicIndex) => {
        const updatedCategories = [...categoriesWithTopics];
        updatedCategories[categoryIndex].topics.splice(topicIndex, 1);
        setCategoriesWithTopics(updatedCategories);
    };

    // Delete end category by index
    const handleDeleteEndCategory = (categoryIndex) => {
        const updatedEndCategories = [...endCategoriesWithTopics];
        updatedEndCategories.splice(categoryIndex, 1);
        setEndCategoriesWithTopics(updatedEndCategories);
    };

    // Delete end topic from a specific category
    const handleDeleteEndTopic = (categoryIndex, topicIndex) => {
        const updatedEndCategories = [...endCategoriesWithTopics];
        updatedEndCategories[categoryIndex].topics.splice(topicIndex, 1);
        setEndCategoriesWithTopics(updatedEndCategories);
    };

    // Delete team by index
    const handleDeleteTeam = (teamIndex) => {
        const updatedTeams = [...teams];
        updatedTeams.splice(teamIndex, 1);
        setTeams(updatedTeams);
    };

    // Function to send the dynamic topic to App
    const handleTangentSubmit = () => {
        onTangentChange(tangent); // Propagate up to App
        setTangent(''); // Optionally clear after sending
    };

    // Component return remains mostly unchanged, with additions for delete functionality...
    return (
        <div className={`${className}`} style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '1590px', maxHeight: '895px', paddingLeft: '30px', paddingRight: '30px' }}>
            <div style={{ flexBasis: '48%' }}>
                <h2>Manage Categories and Topics</h2>
                {categoriesWithTopics.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="item">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                type="text"
                                value={category.categoryName}
                                onInput={(e) => handleCategoryNameChange(categoryIndex, e.target.value)}
                                placeholder="Category Name"
                            />
                            <span className="delete-btn" onClick={() => handleDeleteCategory(categoryIndex)}>❌</span>
                        </div>
                        <ul>
                            {category.topics.map((topic, topicIndex) => (
                                <li key={topicIndex} className="item">
                                    <input
                                        type="text"
                                        value={topic.title}
                                        onInput={(e) => handleTopicTitleChange(categoryIndex, topicIndex, e.target.value)}
                                        placeholder="Topic Title"
                                    />
                                    <span className="delete-btn" onClick={() => handleDeleteTopic(categoryIndex, topicIndex)} >❌</span>
                                </li>
                            ))}
                            <li key="add-topic" style={{ listStyleType: 'none' }}>
                                <button onClick={() => handleAddNewTopic(categoryIndex)} style={addButtonStyling}>
                                    + Add Topic
                                </button>
                            </li>

                        </ul>
                    </div>
                ))}
                <li style={{ listStyleType: 'none' }}>
                    <button onClick={handleAddNewCategory} style={addButtonStyling}>
                        + Add Category
                    </button>
                </li>
                <div>
                <h3>Tangent</h3>
                    <input
                        type="text"
                        value={tangent}
                        onChange={(e) => setTangent(e.target.value)}
                        placeholder="Enter a temp tangent"
                    />
                    <button onClick={handleTangentSubmit}>Show Tangent!</button>
                </div>
            </div>
            <div style={{ flexBasis: '48%' }}>
                <div>
                    <h2>Bracket Name</h2>
                    <input type="text"
                        value={bracketName}
                        onInput={(e) => setBracketName(e.target.value)}
                        placeholder="Bracket Name" />
                </div>
                <h2>Manage Teams</h2>
                <ul>
                    {teams.map((team, index) => (
                        <li key={index} className="team-item">
                            Seed: <input type="number" value={team.seed} onInput={(e) => handleTeamSeedChange(index, e.target.value)} placeholder="Seed (1-16)" min="1" max="16" />
                            Name: <input type="text" value={team.name} onInput={(e) => handleTeamNameChange(index, e.target.value)} placeholder="Team Name" />
                            <span className="delete-btn" onClick={() => handleDeleteTeam(index)}>❌</span>
                        </li>
                    ))}
                    <li style={{ listStyleType: 'none' }}>
                        <input type="number" value={teamSeed} onInput={(e) => setTeamSeed(e.target.value)} placeholder="Seed (1-16)" min="1" max="16" />
                        <input type="text" value={teamName} onInput={(e) => setTeamName(e.target.value)} placeholder="Team Name" />
                        <button onClick={handleAddTeam}>Add Team</button>
                    </li>
                </ul>
                <h2>Manage Round Names</h2>
                <ul>
                    {roundNames.map((roundName, index) =>
                    (<li key={index}>
                        <input type="text"
                            value={roundName}
                            onInput={(e) => handleRoundNameChange(index, e.target.value)}
                            placeholder="Round Name" />
                    </li>
                    ))}
                </ul>
            </div>
            <div style={{ flexBasis: '48%' }}>
                <h2>Manage End Categories and Topics</h2>
                {endCategoriesWithTopics.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="item">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                type="text"
                                value={category.categoryName}
                                onInput={(e) => handleEndCategoryNameChange(categoryIndex, e.target.value)}
                                placeholder="End Category Name"
                            />
                            <span className="delete-btn" onClick={() => handleDeleteEndCategory(categoryIndex)}>❌</span>
                        </div>
                        <ul>
                            {category.topics.map((topic, topicIndex) => (
                                <li key={topicIndex} className="item">
                                    <input
                                        type="text"
                                        value={topic.title}
                                        onInput={(e) => handleEndTopicTitleChange(categoryIndex, topicIndex, e.target.value)}
                                        placeholder="End Topic Title"
                                    />
                                    <span className="delete-btn" onClick={() => handleDeleteEndTopic(categoryIndex, topicIndex)}>❌</span>
                                </li>
                            ))}
                            <li key="add-end-topic" style={{ listStyleType: 'none' }}>
                                <button onClick={() => handleAddNewEndTopic(categoryIndex)} style={addButtonStyling}>
                                    + Add End Topic
                                </button>
                            </li>
                        </ul>
                    </div>
                ))}
                <button onClick={handleAddNewEndCategory} style={addButtonStyling}>
                    + Add End Category
                </button>
            </div>
            <div id="save-button-container">
                <button onClick={handleSave} style={{ padding: '10px 20px', backgroundColor: 'aquamarine', fontSize: '16px' }}>
                    Generate Sidebar (Press ⌘/Ctrl + B to Hide)
                </button>
            </div>
        </div>

    );
};

export default BackendUI;