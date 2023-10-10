// Define the GitHub API base URL
const apiUrl = 'https://api.github.com';

// Define the headers with the Accept header for version 3 of the API
const headers = {
    'Accept': 'application/vnd.github.v3+json'
};

// Function to search for GitHub users by name
async function searchUsersByName(username) {
    try {
        const response = await fetch(`${apiUrl}/search/users?q=${username}`, {
            method: 'GET',
            headers: headers
        });

        if (response.ok) {
            const data = await response.json();
            return data.items; // Extract user data from the response
        } else {
            throw new Error('Failed to fetch user data');
        }
    } catch (error) {
        console.error('Error searching for users:', error);
    }
}

// Function to fetch public repositories for a GitHub user
async function fetchUserRepositories(username) {
    try {
        const response = await fetch(`${apiUrl}/users/${username}/repos`, {
            method: 'GET',
            headers: headers
        });

        if (response.ok) {
            const repositories = await response.json();
            return repositories; // Extract repositories data from the response
        } else {
            throw new Error('Failed to fetch user repositories');
        }
    } catch (error) {
        console.error('Error fetching user repositories:', error);
    }
}

// Example usage:
const username = 'octocat'; // Replace with the GitHub username you want to search for

// Search for users by name
searchUsersByName(username)
    .then(users => {
        // Display user data or handle it as needed
        console.log('Users:', users);
    });

// Fetch public repositories for a user
fetchUserRepositories(username)
    .then(repositories => {
        // Display user repositories data or handle it as needed
        console.log('User Repositories:', repositories);
    });

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const userList = document.getElementById('user-list');
    const repositoryList = document.getElementById('repository-list');
    
    let currentSearchType = 'user'; // Initial search type

    // Function to fetch data based on the current search type
    async function fetchData(keyword) {
        try {
            let endpoint;
            if (currentSearchType === 'user') {
                endpoint = `https://api.github.com/search/users?q=${keyword}`;
            } else if (currentSearchType === 'repo') {
                endpoint = `https://api.github.com/search/repositories?q=${keyword}`;
            }
            
            const response = await fetch(endpoint);
            const data = await response.json();
            return data.items; // Extract relevant data items based on search type
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Function to display data based on the current search type
    function displayData(data) {
        if (currentSearchType === 'user') {
            const userHtml = data.map(user => `
                <div>
                    <h2>${user.login}</h2>
                    <img src="${user.avatar_url}" alt="${user.login}" width="100">
                    <a href="${user.html_url}" target="_blank">View Profile</a>
                </div>
            `).join('');
            userList.innerHTML = userHtml;
        } else if (currentSearchType === 'repo') {
            const repositoryHtml = data.map(repo => `
                <div>
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'No description available'}</p>
                    <a href="${repo.html_url}" target="_blank">View Repository</a>
                </div>
            `).join('');
            repositoryList.innerHTML = repositoryHtml;
        }
    }

    // Handle form submission
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const keyword = searchInput.value.trim();

        if (keyword) {
            const data = await fetchData(keyword);
            if (data) {
                displayData(data);
            }
        }
    });

    // Handle search type toggle button click
    searchButton.addEventListener('click', () => {
        currentSearchType = currentSearchType === 'user' ? 'repo' : 'user';
        searchInput.placeholder = `Search ${currentSearchType === 'user' ? 'users' : 'repositories'} by keyword`;
    });
});
