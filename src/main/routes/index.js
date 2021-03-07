import { ipcMain } from 'electron';
import { nanoid } from 'nanoid';
import User from '../models/User';
import Project from '../models/Project';
import Backlog from '../models/Backlog';
import Sprint from '../models/Sprint';
import Board from '../models/Board';
import BoardLane from '../models/BoardLane';
import Story from '../models/Story';
import Task from '../models/Task';
import ProjectTeamMember from '../models/ProjectTeamMember';

const addBoardLanes = async (storyIds, boardId) => {
    if (storyIds.length > 0) {
        let bls = [];
        // Create board lanes
        for (let storyId of storyIds) {
            bls.push({
                board: boardId,
                story: storyId,
                title: 'To Do',
                name: '_todo_' + nanoid(10),
                sort: 1

            });
            
            bls.push({
                board: boardId,
                story: storyId,
                title: 'In Progress',
                name: '_inprogress_' + nanoid(10),
                sort: 2

            });
            
            bls.push({
                board: boardId,
                story: storyId,
                title: 'Complete',
                name: '_complete_' + nanoid(10),
                sort: 3
            });
        }

        await BoardLane.create(bls);
    }
};


const initRoutes = () => {

    // GET Projects
    ipcMain.handle('projects:get', async (event, arg) => {
        if (arg) {
            // Single project
            const project = await Project.findById(arg);
                return JSON.stringify(project);
        } else {
            // All projects
            try {
                const projects = await Project.find().sort({ created: 1 });
                return JSON.stringify(projects);
            } catch (err) {
                console.log(err);
            }
        }
    });

    // ADD Project
    ipcMain.handle('projects:add', async (event, arg) => {
        if (arg) {
            const project = await Project.create(arg);
            return JSON.stringify(project);
        } 
    });

    // UPDATE Project
    ipcMain.handle('projects:update', async (event, arg) => {
        if (arg) {
            const project = await Project.updateOne({ _id: arg._id }, arg);
            return JSON.stringify(project);
        } 
    });

    // DELETE Project
    ipcMain.handle('projects:delete', async (event, arg) => {
        if (arg) {
            const project = await Project.deleteOne({ _id: arg});
            return JSON.stringify(project);
        } 
    });

    // GET Backlogs
    ipcMain.handle('backlogs:get', async (event, backlogId, projectId) => {
        if (backlogId) {
            // Single backlog
            const backlog = await Backlog.findById(backlogId).populate('project');
            return JSON.stringify(backlog);
        } else {
            // All backlogs
            try {
                const filter = (projectId) ? { project: projectId }: {};
                const backlogs = await Backlog.find(filter).populate('project').sort({ created: 1 });
                return JSON.stringify(backlogs);
            } catch (err) {
                console.log(err);
            }
        }
    });

    // ADD Backlog
    ipcMain.handle('backlogs:add', async (event, arg) => {
        if (arg) {
            const backlog = await Backlog.create(arg);
            return JSON.stringify(backlog);
        } 
    });

    // UPDATE Backlog
    ipcMain.handle('backlogs:update', async (event, arg) => {
        if (arg) {
            const backlog = await Backlog.updateOne({ _id: arg._id }, arg);
            return JSON.stringify(backlog);
        } 
    });

    // DELETE Backlog
    ipcMain.handle('backlogs:delete', async (event, arg) => {
        if (arg) {
            const backlog = await Backlog.deleteOne({ _id: arg});
            return JSON.stringify(backlog);
        } 
    });

    // GET Sprints
    ipcMain.handle('sprints:get', async (event, sprintId, projectId) => {
        if (sprintId) {
            // Single sprint
            const sprint = await Sprint.findById(sprintId).populate('project');
            return JSON.stringify(sprint);
        } else {
            // All sprints
            try {
                const filter = (projectId) ? { project: projectId }: {};
                const sprints = await Sprint.find(filter).populate('project').sort({ created: 1 });
                return JSON.stringify(sprints);
            } catch (err) {
                console.log(err);
            }
        }
    });

    // ADD Sprint
    ipcMain.handle('sprints:add', async (event, arg) => {
        if (arg) {
            const sprint = await Sprint.create(arg);

            // create default board
            const board = new Board({
                name: sprint.name + ' Board',
                sprint: sprint._id,
                created: Datetime.now(),
                createdBy: sprint.createdBy
            });

            await board.save();

            return JSON.stringify(sprint);
        } 
    });

    // UPDATE Sprint
    ipcMain.handle('sprints:update', async (event, arg) => {
        if (arg) {
            const sprint = await Sprint.updateOne({ _id: arg._id }, arg);
            return JSON.stringify(sprint);
        } 
    });

    // DELETE Sprint
    ipcMain.handle('sprints:delete', async (event, arg) => {
        if (arg) {
            const sprint = await Sprint.deleteOne({ _id: arg});

            // Remove stories from sprint 

            // Delete board lanes assigned to stories 

            // Delete board associated with sprint
            

            return JSON.stringify(sprint);
        } 
    });

    // GET Boards
    ipcMain.handle('boards:get', async (event, arg) => {
        if (arg) {
            // Single board
            let board = await Board.findById(arg).populate({ path: 'sprint', populate: { path: 'project'}});
            board = JSON.parse(JSON.stringify(board));
            
            // GET all board lanes in board
            let boardLanes = await BoardLane.find({ board: board._id }).populate('story').sort({ sort: 1 }); 
            boardLanes = JSON.parse(JSON.stringify(boardLanes));

            let boardLaneMap = boardLanes.reduce((acc, boardLane) => {
                return { ...acc, [boardLane._id]: boardLane };
            }, {});

            // GET all stories in board
            let stories = await Story.find({ board: board._id }).populate('assigned');
            stories = JSON.parse(JSON.stringify(stories));

            // GET all tasks for each story in board
            let storyMap = stories.reduce((acc, story) => {
                return { ...acc, [story._id]: story };
            }, {});

            let tasks = await Task.find({ story: { $in: Object.keys(storyMap) }}).populate('assigned').sort({ sortorder: 1 });
            tasks = JSON.parse(JSON.stringify(tasks));
            
            // Add Tasks to stories and board lanes
            tasks.forEach((task) => {
                if (!storyMap[task.story].tasks) {
                    storyMap[task.story]['tasks'] = [];
                }
                storyMap[task.story].tasks.push(task);

                if (task.boardlane in boardLaneMap) {
                    if (!boardLaneMap[task.boardlane].tasks) {
                        boardLaneMap[task.boardlane]['tasks'] = [];
                    }
                    boardLaneMap[task.boardlane].tasks.push(task);
                }
            });

            // Add boardlanes to stories
            boardLanes.forEach((boardlane) => {
                if (!storyMap[boardlane.story._id].boardlanes) {
                    storyMap[boardlane.story._id]['boardlanes'] = [];
                }
                storyMap[boardlane.story._id].boardlanes.push(boardlane);
            });
            
            // Add stories and board lanes to board
            board['stories'] = storyMap ? Object.values(storyMap): [];
            board['boardlanes'] = boardLaneMap ? Object.values(boardLaneMap): [];

            return JSON.stringify(board);
        } else {
            // All boards
            try {
                const boards = await Board.find().populate({ path: 'sprint', populate: { path: 'project'}}).sort({ created: 1 });
                return JSON.stringify(boards);
            } catch (err) {
                console.log(err);
            }
        }
    });

    // GET Board for sprint
    ipcMain.handle('boards:sprint:get', async (event, sprintId) => {
        if (sprintId) {
            const board = await Board.findOne({ sprint: sprintId });
            return JSON.stringify(board);
        } 
    });

    // ADD Board
    ipcMain.handle('boards:add', async (event, arg) => {
        if (arg) {
            const board = await Board.create(arg);
            return JSON.stringify(board);
        } 
    });

    // UPDATE Board
    ipcMain.handle('boards:update', async (event, arg) => {
        if (arg) {
            const board = await Board.updateOne({ _id: arg._id }, arg);
            return JSON.stringify(board);
        } 
    });

    // DELETE Board
    ipcMain.handle('boards:delete', async (event, arg) => {
        if (arg) {
            const board = await Board.deleteOne({ _id: arg});
            return JSON.stringify(board);
        } 
    });

    // ADD Task
    ipcMain.handle('tasks:add', async (event, arg) => {
        if (arg) {
            const createdTask = await Task.create(arg); 
            const task = await Task.findById({ _id: createdTask._id}).populate('assigned');
            return JSON.stringify(task);  
        } 
    });

    // UPDATE Task
    ipcMain.handle('tasks:update', async (event, taskId, boardLaneId, tasks, fullUpate) => {
        if (taskId && boardLaneId) {
            await Task.updateOne({ _id: taskId }, { boardlane: boardLaneId }); 
            const task = await Task.findById({ _id: taskId}).populate('assigned');
            return JSON.stringify(task); 
        } else {
            if (fullUpate) {
                const res = await Task.updateOne({ _id: tasks._id }, tasks);
            } else {
                for (let task of tasks) {
                    const res = await Task.updateOne({ _id: task._id }, { sortorder: task.sortorder }); 
                }
            }
            return JSON.stringify(tasks);
        }
    });

    // DELETE Task
    ipcMain.handle('tasks:delete', async (event, arg) => {
        if (arg) {
            const task = await Task.deleteOne({ _id: arg});
            return JSON.stringify(task);
        } 
    });

    // GET Stories
    ipcMain.handle('stories:get', async (event, backlogId, sprintId) => {
        if (backlogId) {
            // Stories for backlog
            const stories = await Story.find({ backlog: backlogId }).populate('assigned').populate('sprint');
            return JSON.stringify(stories);
        } else {
            // All stories
            try {
                const filter = (sprintId) ? { sprint: sprintId }: {};
                const stories = await Story.find(filter).populate('assigned').populate('sprint');
                return JSON.stringify(stories);
            } catch (err) {
                console.log(err);
            }
        }
    });

    // ADD Story
    ipcMain.handle('stories:add', async (event, arg) => {
        if (arg) {
            const story = await Story.create(arg);

            if (story.board != null) {
                addBoardLanes([story._id], story.board._id);
            }

            return JSON.stringify(story);
        } 
    });

    // UPDATE Story
    ipcMain.handle('stories:update', async (event, arg) => {
        if (arg) {
            const story = await Story.updateOne({ _id: arg._id }, arg);
            return JSON.stringify(story);
        } 
    });

    // DELETE Story
    ipcMain.handle('stories:delete', async (event, arg) => {
        if (arg) {
            const board = await Story.deleteOne({ _id: arg});
            return JSON.stringify(board);
        } 
    });

    // REMOVE Story from sprint
    ipcMain.handle('stories:sprint:delete', async (event, arg) => {
        if (arg) {
            const story = await Story.updateOne({ _id: arg}, { sprint: null, board: null });
            await BoardLane.deleteMany({ story: arg });
            return JSON.stringify(story);
        } 
    });

    // GET Stories from backlogs
    ipcMain.handle('stories:backlogs:get', async (event, projectId) => {
        // Get backlogs in project 
        const backlogs = await Backlog.find({ project: projectId });
        const backlogMap = backlogs.reduce((acc, backlog) => {
            return { ...acc, [backlog._id]: backlog };
        }, {});
        
        // Stories for backlog
        const stories = await Story.find({ backlog: { $in: Object.keys(backlogMap) }, sprint: { $eq: null}}).populate('assigned').populate('backlog');
        
        return JSON.stringify(stories);
    });

    // ADD Stories to sprint
    ipcMain.handle('stories:sprint:add', async (event, sprintId, storyIds, boardId) => {
        // GET stories
        const stories = await Story.updateMany({ _id: { $in: storyIds}}, { sprint: sprintId, state: 'Committed', board: boardId });
        addBoardLanes(storyIds, boardId);
        return JSON.stringify(stories);
    });

    // GET Teammembers
    ipcMain.handle('teammembers:get', async (event, projectId) => { 
        try {
            const filter = (projectId) ? { project: projectId }: {};
            const teammembers = await ProjectTeamMember.find(filter).populate('user');
            return JSON.stringify(teammembers);
        } catch (err) {
            console.log(err);
        }
    });

};

export default initRoutes;