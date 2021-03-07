import { ipcRenderer } from 'electron';

export const getProjects = async () => {
    try {
        let response;
        await ipcRenderer.invoke('projects:get')
            .then((result) => {
                response = JSON.parse(result);
            });
        return response;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message };
    }
};

export const getProject = async (id) => {
    try {
        let response;
        await ipcRenderer.invoke('projects:get', id)
            .then((result) => {
                response = JSON.parse(result);
            });
        return response;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message };
    }
};

export const addProject = async (project) => {
    try {
        let response;
        await ipcRenderer.invoke('projects:add', project)
            .then((result) => {
                response = JSON.parse(result);
            });
        return response;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message };
    }
};

export const updateProject = async (project) => {
    try {
        let response;
        await ipcRenderer.invoke('projects:update', project)
            .then((result) => {
                response = JSON.parse(result);
            });
        return response;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message };
    }
};

export const deleteProject = async (arg) => {
    try {
        let response;
        await ipcRenderer.invoke('projects:delete', arg)
            .then((result) => {
                response = JSON.parse(result);
            });
        return response;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message };
    }
};

export const getBacklogs = async (projectId) => {
    try {
        let response;
        await ipcRenderer.invoke('backlogs:get', null, projectId)
            .then((result) => {
                response = JSON.parse(result);
            });
        return response;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message };
    }
};

export const getBacklog = async (id) => {
    try {
        let response;
        await ipcRenderer.invoke('backlogs:get', id)
            .then((result) => {
                response = JSON.parse(result);
            });
        return response;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message };
    }
};

export const addBacklog = async (backlog) => {
    try {
        let response;
        await ipcRenderer.invoke('backlogs:add', backlog)
            .then((result) => {
                response = JSON.parse(result);
            });
        return response;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message };
    }
};

export const updateBacklog = async (backlog) => {
    try {
        let response;
        await ipcRenderer.invoke('backlogs:update', backlog)
            .then((result) => {
                response = JSON.parse(result);
            });
        return response;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message };
    }
};

export const deleteBacklog = async (arg) => {
    try {
        let response;
        await ipcRenderer.invoke('backlogs:delete', arg)
            .then((result) => {
                response = JSON.parse(result);
            });
        return response;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message };
    }
};

export const getSprints = async (projectId) => {
    try {
        let response;
        await ipcRenderer.invoke('sprints:get', null, projectId)
            .then((result) => {
                response = JSON.parse(result);
            });
        return response;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message };
    }
};

export const getSprint = async (id) => {
    try {
        let response;
        await ipcRenderer.invoke('sprints:get', id)
            .then((result) => {
                response = JSON.parse(result);
            });
        return response;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message };
    }
};

export const addSprint = async (sprint) => {
    try {
        let response;
        await ipcRenderer.invoke('sprints:add', sprint)
            .then((result) => {
                response = JSON.parse(result);
            });
        return response;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message };
    }
};

export const updateSprint = async (sprint) => {
    try {
        let response;
        await ipcRenderer.invoke('sprints:update', sprint)
            .then((result) => {
                response = JSON.parse(result);
            });
        return response;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message };
    }
};

export const deleteSprint = async (arg) => {
    try {
        let response;
        await ipcRenderer.invoke('sprints:delete', arg)
            .then((result) => {
                response = JSON.parse(result);
            });
        return response;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message };
    }
};

export const getBoards = async () => {
    try {
        let response;
        await ipcRenderer.invoke('boards:get')
            .then((result) => {
                response = JSON.parse(result);
            });
        return response;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message };
    }
};

export const getBoard = async (id) => {
    try {
        let response;
        await ipcRenderer.invoke('boards:get', id)
            .then((result) => {
                response = JSON.parse(result);
            });
        return response;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message };
    }
};

export const getBoardForSprint = async (sprintId) => {
    try {
        let response;
        await ipcRenderer.invoke('boards:sprint:get', sprintId)
            .then((result) => {
                response = JSON.parse(result);
            });
        return response;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message };
    }
};

export const addBoard = async (board) => {
    try {
        let response;
        await ipcRenderer.invoke('boards:add', board)
            .then((result) => {
                response = JSON.parse(result);
            });
        return response;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message };
    }
};

export const updateBoard = async (board) => {
    try {
        let response;
        await ipcRenderer.invoke('boards:update', board)
            .then((result) => {
                response = JSON.parse(result);
            });
        return response;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message };
    }
};

export const deleteBoard = async (arg) => {
    try {
        let response;
        await ipcRenderer.invoke('boards:delete', arg)
            .then((result) => {
                response = JSON.parse(result);
            });
        return response;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message };
    }
};

export const addTask = async (task) => {
    try {
        let response;
        await ipcRenderer.invoke('tasks:add', task)
            .then((result) => {
                response = JSON.parse(result);
            });
        return response;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message };
    }
};

export const updateTask = async (id, boardId, tasks, fullUpdate) => {
    try {
        let response;
        await ipcRenderer.invoke('tasks:update', id, boardId, tasks, fullUpdate)
            .then((result) => {
                response = JSON.parse(result);
            });
        return response;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message };
    }
};

export const deleteTask = async (arg) => {
    try {
        let response;
        await ipcRenderer.invoke('tasks:delete', arg)
            .then((result) => {
                response = JSON.parse(result);
            });
        return response;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message };
    }
};


export const getStories = async (backlogId, sprintId) => {
    try {
        let response;
        await ipcRenderer.invoke('stories:get', backlogId, sprintId)
            .then((result) => {
                response = JSON.parse(result);
            });
        return response;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message };
    }
};

export const addStory = async (story) => {
    try {
        let response;
        await ipcRenderer.invoke('stories:add', story)
            .then((result) => {
                response = JSON.parse(result);
            });
        return response;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message };
    }
};

export const updateStory = async (story) => {
    try {
        let response;
        await ipcRenderer.invoke('stories:update', story)
            .then((result) => {
                response = JSON.parse(result);
            });
        return response;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message };
    }
};

export const deleteStory = async (arg) => {
    try {
        let response;
        await ipcRenderer.invoke('stories:delete', arg)
            .then((result) => {
                response = JSON.parse(result);
            });
        return response;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message };
    }
};

export const removeStoryFromSprint = async (arg) => {
    try {
        let response;
        await ipcRenderer.invoke('stories:sprint:delete', arg)
            .then((result) => {
                response = JSON.parse(result);
            });
        return response;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message };
    }
};

export const getTeamMembers = async (id) => {
    try {
        let response;
        await ipcRenderer.invoke('teammembers:get', id)
            .then((result) => {
                response = JSON.parse(result);
            });
        return response;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message };
    }
};

export const getStoriesInBacklogs = async (projectId) => {
    try {
        let response;
        await ipcRenderer.invoke('stories:backlogs:get', projectId)
            .then((result) => {
                response = JSON.parse(result);
            });
        return response;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message };
    }
};

export const addStoriesToSprint = async (sprintId, storyIds, boardId) => {
    try {
        let response;
        await ipcRenderer.invoke('stories:sprint:add', sprintId, storyIds, boardId)
            .then((result) => {
                response = JSON.parse(result);
            });
        return response;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message };
    }
};
