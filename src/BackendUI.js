import { useState } from 'preact/hooks';
import { h } from 'preact';


const BackendUI = ({ onCategoriesWithTopicsChange, onEndCategoriesWithTopicsChange, onTeamsChange }) => {
    const [categoriesWithTopics, setCategoriesWithTopics] = useState([]);
    const [endCategoriesWithTopics, setEndCategoriesWithTopics] = useState([]);
    const [teamSeed, setTeamSeed] = useState('');
    const [teamName, setTeamName] = useState('');
    const [teams, setTeams] = useState([]);

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

    // !TODO make the team name editable once entered.

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

    // Validate and save data
    const handleSave = () => {
        if (teams.length % 2 !== 0) {
            alert("Please ensure the number of teams is even before saving.");
            return;
        }
        onCategoriesWithTopicsChange(categoriesWithTopics.filter(category => category.categoryName));
        onEndCategoriesWithTopicsChange(endCategoriesWithTopics.filter(category => category.categoryName));
        onTeamsChange(teams);
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

    // Component return remains mostly unchanged, with additions for delete functionality...
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '1590px', maxHeight: '895px', paddingLeft: '30px', paddingRight: '30px'}}>
            <div style={{ flexBasis: '48%'}}>
                <h2>Manage Categories and Topics</h2>
                {categoriesWithTopics.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="item">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                type="text"
                                value={category.categoryName}
                                onChange={(e) => handleCategoryNameChange(categoryIndex, e.target.value)}
                                placeholder="Category Name"
                            />
                            <span className="delete-btn" onClick={() => handleDeleteCategory(categoryIndex)} style={{ marginLeft: '10px', cursor: 'pointer' }}>❌</span>
                        </div>
                        <ul>
                            {category.topics.map((topic, topicIndex) => (
                                <li key={topicIndex} className="item">
                                    <input
                                        type="text"
                                        value={topic.title}
                                        onChange={(e) => handleTopicTitleChange(categoryIndex, topicIndex, e.target.value)}
                                        placeholder="Topic Title"
                                    />
                                    <span className="delete-btn" onClick={() => handleDeleteTopic(categoryIndex, topicIndex)} style={{ marginLeft: '10px', cursor: 'pointer' }}>❌</span>
                                </li>
                            ))}
                            <li key="add-topic" style={{ listStyleType: 'none' }}>
                                <button onClick={() => handleAddNewTopic(categoryIndex)} style={{ background: 'none', border: 'none', padding: '0', cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}>
                                    + Add Topic
                                </button>
                            </li>

                        </ul>
                    </div>
                ))}
                <li style={{ listStyleType: 'none' }}>
                    <button onClick={handleAddNewCategory} style={{ background: 'none', border: 'none', padding: '0', cursor: 'pointer', color: '#007bff', textDecoration: 'underline', marginTop: '10px' }}>
                        + Add Category
                    </button>
                </li>
            </div>
            <div style={{ flexBasis: '48%' }}>
                <h2>Manage Teams</h2>
                <ul>
                    {teams.map((team, index) => (
                        <li key={index} className="team-item">
                            Seed: <input type="number" value={team.seed} onChange={(e) => setTeamSeed(e.target.value)} placeholder="Seed (1-16)" min="1" max="16" />
                            Name: <input type="text" value={team.name} onChange={(e) => setTeamName(e.target.value)} placeholder="Team Name" />
                            <span className="delete-btn" onClick={() => handleDeleteTeam(index)}>❌</span>
                        </li>
                    ))}
                    <li style={{ listStyleType: 'none' }}>
                        <input type="number" value={teamSeed} onChange={(e) => setTeamSeed(e.target.value)} placeholder="Seed (1-16)" min="1" max="16" />
                        <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Team Name" />
                        <button onClick={handleAddTeam}>Add Team</button>
                    </li>
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
                                onChange={(e) => handleEndCategoryNameChange(categoryIndex, e.target.value)}
                                placeholder="End Category Name"
                            />
                            <span className="delete-btn" onClick={() => handleDeleteEndCategory(categoryIndex)} style={{ marginLeft: '10px', cursor: 'pointer' }}>❌</span>
                        </div>
                        <ul>
                            {category.topics.map((topic, topicIndex) => (
                                <li key={topicIndex} className="item">
                                    <input
                                        type="text"
                                        value={topic.title}
                                        onChange={(e) => handleEndTopicTitleChange(categoryIndex, topicIndex, e.target.value)}
                                        placeholder="End Topic Title"
                                    />
                                    <span className="delete-btn" onClick={() => handleDeleteEndTopic(categoryIndex, topicIndex)} style={{ marginLeft: '10px', cursor: 'pointer' }}>❌</span>
                                </li>
                            ))}
                            <li key="add-end-topic" style={{ listStyleType: 'none' }}>
                                <button onClick={() => handleAddNewEndTopic(categoryIndex)} style={{ background: 'none', border: 'none', padding: '0', cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}>
                                    + Add End Topic
                                </button>
                            </li>
                        </ul>
                    </div>
                ))}
                <button onClick={handleAddNewEndCategory} style={{ background: 'none', border: 'none', padding: '0', cursor: 'pointer', color: '#007bff', textDecoration: 'underline', marginTop: '10px' }}>
                    + Add End Category
                </button>
            </div>
            <div id="save-button-container">
                <button onClick={handleSave} style={{ padding: '10px 20px', backgroundColor: 'aquamarine',fontSize: '16px' }}>
                    Save All Changes
                </button>
            </div>
        </div>

    );
};

export default BackendUI;