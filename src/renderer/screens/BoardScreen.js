import '../sass/board.scss';

import { parseRequestUrl, formatDate, rerender } from '../utils';
import { getBoard, addTask, updateTask, deleteTask, getTeamMembers  } from '../api';
import Modal from '../components/Modal';
import dragula from 'dragula';
import jKanban from '../kanban';

let board = {};
let storyIdToLanesMap = {};

const moveTask = async (taskId, newBoardLaneId) => {
  const result = await updateTask(taskId, newBoardLaneId);
};

const sortTasks = async (tasks) => {
  let sort = 1;
  
  for (let task of tasks) {
    task.setAttribute('data-sortorder', sort++);
  }
}

const updateTasks = async (taskElems) => {
  let tasks = [];

  for (let taskElem of taskElems) {
    tasks.push({
      _id: taskElem.dataset.eid,
      sortorder: taskElem.dataset.sortorder
    });
  }

  const result = await updateTask(null, null, tasks, false);
}

const modalTitle = 'modalTitle';
const deleteModalTitle = 'deleteModalTitle';
const deleteModalContent = 'deleteModalContent';
const taskModalTitle = 'taskModalTitle';
const recordId = 'recordId';
const recordType = 'recordType';
const boardName = 'boardName';
const createdDate = 'createdDate';
const cancelBtn = 'cancelBtn';
const confirmBtn = 'confirmBtn';
const cancelDeleteBtn = 'cancelDeleteBtn';
const confirmDeleteBtn = 'confirmDeleteBtn';
const confirmTaskBtn = 'confirmTaskBtn';
const taskTitle = 'taskTitle';
const taskCreatedDate = 'taskCreatedDate';
const taskDescription = 'taskDescription';
const taskWorkRemaining = 'taskWorkRemaining';
const taskAssigned = 'taskAssigned';
const storyId = 'storyId';
const boardLaneId = 'boardLaneId';

let sprintId;
let kanbans = [];

const BoardScreen = {
  after_render: async () => {
    M.Modal.init(document.querySelectorAll('.modal'));
    M.FormSelect.init(document.querySelectorAll('.item-select'));

    board.stories.forEach((story) => {
      story.boardlanes = story.boardlanes.map((lane) => {
        lane['id'] = lane._id;

        if (lane.tasks) {
          lane.tasks = lane.tasks.map((task) => {
            task['id'] = task._id;
            return { 
              ...task, 
              drop: function(el) { 
                  const b = document.getElementById(el.dataset.eid).closest('.kanban-board');
                  moveTask(el.dataset.eid, b.dataset.id);
                  const tasksInLane = b.querySelectorAll('.kanban-item');
                  sortTasks(tasksInLane);
                  updateTasks(tasksInLane);
              }
            };
          });
        }

        return lane;
      });

      storyIdToLanesMap[story._id] = story;
    });

    const boards = document.querySelectorAll('.kanbanBoard');

    for (let b of boards) {
      const storyId = b.getAttribute('data-story');
      
      const kanban = new jKanban(dragula, {
        element: '#' + b.getAttribute('id'),
        gutter: '10px',
        responsivePercentage: true,
        itemHandleOptions: {
          enabled: true,
          handleClass: 'drag-handler',
          customHandler: `<div class="card">
                            <div class="card-content">
                              <div class="row">
                                <div class="col s12">
                                  <div class="card-title drag-component">
                                    <div class="row">
                                      <div class="col s1">
                                        <i class="small material-icons drag-handler">dehaze</i>
                                      </div>
                                      <div class="col s9">
                                        <span data-target="taskModal" class="item-title task-edit modal-trigger truncate" data-id="%b" data-title="%t" data-description="%d" data-created="%c" data-assigned="%u" data-workremaining="%w">%t</span>
                                      </div>
                                      <div class="col s2 right-align">
                                        <button data-target="deleteModal" data-id="%b" class="task-delete btn-floating btn-small modal-trigger"><i class="tiny material-icons">delete</i></button>
                                      </div>
                                    </div>  
                                  </div>
                                </div>
                                <div class="col s12">
                                  <div class="row card-details">
                                    <div class="col s9">
                                      <div class="item-assigned">
                                        <span class="item-avatar"><img src="%i" width="20" height="20" /></span>
                                        <span class="item-name">%a</span>
                                      </div>
                                    </div>
                                    <div class="col s3">
                                      <div class="item-remaining">
                                        <span class="item-work">%w</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                        </div>`
        },
        itemAddOptions: {
          enabled: false,                                              
          content: '+',                                                  
          class: 'kanban-title-button btn-floating',
          footer: false
        }, 
        boards: storyIdToLanesMap[storyId].boardlanes
      });

      kanbans.push(kanban);
    }

    const newTaskBtns = document.querySelectorAll('.task-new');

    for (let newTaskBtn of newTaskBtns) {
      newTaskBtn.addEventListener('click', () => {
        document.getElementById(taskModalTitle).innerText = `Create Task`;
        document.getElementById(recordId).value = '';
        document.getElementById(taskTitle).value = '';
        document.getElementById(taskCreatedDate).value = formatDate(new Date());
        document.getElementById(taskDescription).value = '';
        document.getElementById(taskWorkRemaining).value = '';
        document.getElementById(taskAssigned).value = '';
        document.getElementById(storyId).value = newTaskBtn.dataset.story;
        document.getElementById(boardLaneId).value = newTaskBtn.dataset.boardlane;

        const selectedOption = document.querySelector('#' + taskAssigned + ' option:checked');
        if (selectedOption) {
          selectedOption.removeAttribute('selected');
        }
        
        M.FormSelect.init(document.querySelectorAll('.item-select'));
      });
    }

    const taskEditBtns = document.querySelectorAll('.task-edit');

    for (let taskEditBtn of taskEditBtns) {
      taskEditBtn.addEventListener('click', () => {
        document.getElementById(taskModalTitle).innerText = `Update ${taskEditBtn.dataset.title}`;
        document.getElementById(recordId).value = taskEditBtn.dataset.id;
        document.getElementById(taskTitle).value = taskEditBtn.dataset.title;
        document.getElementById(taskCreatedDate).value = formatDate(new Date(taskEditBtn.dataset.created));
        document.getElementById(taskDescription).value = taskEditBtn.dataset.description;
        document.getElementById(taskWorkRemaining).value = taskEditBtn.dataset.workremaining;
        document.getElementById(taskAssigned).value = taskEditBtn.dataset.assigned;

        const selectedOption = document.querySelector('#' + taskAssigned + ' option:checked');
        if (selectedOption) {
          selectedOption.removeAttribute('selected');
        }
        document.querySelector('#' + taskAssigned + ' option[value="' + taskEditBtn.dataset.assigned + '"]').setAttribute('selected', 'selected');

        M.FormSelect.init(document.querySelectorAll('.item-select'));
      });
    }

    const taskDeleteBtns = document.querySelectorAll('.task-delete');

    for (let taskDeleteBtn of taskDeleteBtns) {
      taskDeleteBtn.addEventListener('click', () => {
        document.getElementById(deleteModalTitle).innerText = 'Delete Task';
        document.getElementById(recordId).value = taskDeleteBtn.dataset.id;
        document.getElementById(recordType).value = 'task';
        document.querySelector('#' + deleteModalContent).textContent = 'Are you sure you want to delete this task?';
      });
    }

    const updateBtns = document.querySelectorAll('.update');

    for (let updateBtn of updateBtns) {
      updateBtn.addEventListener('click', () => {
        document.getElementById(modalTitle).innerText = `Update ${updateBtn.dataset.name}`;
        document.getElementById(recordId).value = updateBtn.dataset.id;
        document.getElementById(boardName).value = updateBtn.dataset.name;
        document.getElementById(createdDate).value = updateBtn.dataset.created;
        
        M.FormSelect.init(document.querySelectorAll('.item-select'));
      });
    }

    const deleteBtns = document.querySelectorAll('.delete');

    for (let deleteBtn of deleteBtns) {
      deleteBtn.addEventListener('click', () => {
        document.getElementById(deleteModalTitle).innerText = 'Delete Board';
        document.getElementById(recordId).value = deleteBtn.dataset.id;
        document.getElementById(recordType).value = 'board';
        document.querySelector('#' + deleteModalContent).textContent = 'Are you sure you want to delete this board?';
      });
    }

    document
      .getElementById(confirmBtn)
        .addEventListener('click', async () => {
            const id = document.getElementById(recordId).value;
            const name = document.getElementById(boardName).value;
            const created = document.getElementById(createdDate).value;
            const board = {
              _id: id,
              name,
              sprint: sprintId,
              created
            };

            await updateBoard(board);
            M.toast({html: 'Board updated successfully'});
            rerender(BoardListScreen);
        });

    document
      .getElementById(confirmDeleteBtn)
        .addEventListener('click', async () => {
            const id = document.getElementById(recordId).value;
            const type = document.getElementById(recordType).value;
            
            if (type && type === 'task') {
              await deleteTask(id);
              M.toast({html: 'Task deleted successfully'});
            } else {
              await deleteBoard(id);
              M.toast({html: 'Board deleted successfully'});
            }
            rerender(BoardScreen);
        });

    document
      .getElementById(confirmTaskBtn)
        .addEventListener('click', async () => {
            const title = document.getElementById(taskTitle).value;
            const created = document.getElementById(taskCreatedDate).value;
            const description = document.getElementById(taskDescription).value;
            const workremaining = document.getElementById(taskWorkRemaining).value;
            const assigned = document.getElementById(taskAssigned).value;
            
            const task = {
              title,
              description,
              created,
              workremaining
            };

            const id = document.getElementById(recordId).value;
          
            if (assigned && assigned.trim() !== '') {
              task['assigned'] = assigned;
            }

            if (id) {
              task['_id'] = id;
              await updateTask(null, null, task, true);
              M.toast({html: 'Task updated successfully'});
              rerender(BoardScreen);
            } else {
              const story = document.getElementById(storyId).value;
              const boardlane = document.getElementById(boardLaneId).value;

              task['story'] = story;
              task['boardlane'] = boardlane;

              let targetBoard;
              for (let kanban of kanbans) {
                if (kanban.findBoard(boardlane)) {
                  targetBoard = kanban;
                  break;
                }
              }

              task['sortorder'] = targetBoard.getBoardElements(boardlane).length + 1;
              
              let createdTask = await addTask(task);
              
              
              // Add event handler for task deletion


              M.toast({html: 'Task added successfully'});

              targetBoard.addElement(boardlane, createdTask);
            }
        });

    const sprintBtns = document.querySelectorAll('.sprint-btn');

    for (let sprintBtn of sprintBtns) {
      sprintBtn.addEventListener('click', () => {
        window.location = `/#/sprints/${sprintId}`;
      });
    }
  },
  render: async () => {
    const request = parseRequestUrl();
    board = await getBoard(request.id);
    console.log('THE BOARD: ', board);
    if (board.error) {
        return `<div class="error">${board.error}</div>`;
    }
  
    sprintId = board.sprint._id;

    const teammembers = await getTeamMembers(board.sprint.project._id);
    const teamMemberOptions = teammembers.map((teammember) => {
      return { id: teammember.user._id, name: teammember.user.name };
    });

    return `
    <div class="board">
      <div class="row">
        <div class="col s12">
          <div class="card">
            <div class="card-content">
              <div class="row">
                <div class="col s8">
                  <div class="card-title">${board.name}</div>
                </div>
                <div class="col s4">
                  
                </div>
              </div> 
              <button data-target="theModal" data-id="${board._id}" data-name="${board.name}" data-created="${formatDate(new Date(board.created))}" data-sprint="${(board.sprint) ? board.sprint._id: ''}" class="update btn-floating modal-trigger"><i class="small material-icons">edit</i></button>
              <button data-target="deleteModal" data-id="${board._id}" class="delete btn-floating modal-trigger"><i class="small material-icons">delete</i></button>
              <button class="sprint-btn btn-floating"><i class="small material-icons">blur_linear</i></button>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col s12">
          <div class="card">
            <div class="card-content">
              <div class="row">
                <div class="col s3">
                    <span class="stories-title">Stories</span>
                </div>
                <div class="col s9">
                    <span class="tasks-title">Tasks</span>
                </div>
              </div> 
              <div class="row">
                <div class="col s12">
                  <div class="stories">
                    ${board.stories.map(
                        (story) => `
                        <div class="row">
                          <div class="col s3">
                            <div class="row story-card">
                              <div class="col s12">
                                <div class="card">
                                  <div class="card-content">
                                    <span class="card-title">${story.title}</span>
                                    <div class="row card-details">
                                      <div class="col s9">
                                        <div class="item-assigned">
                                          <span class="item-avatar"><img src="${story.assigned.avatar}" width="20" height="20" /></span>
                                          <span class="item-name">${story.assigned.name}</span>
                                        </div>
                                      </div>
                                      <div class="col s3">
                                        <div class="item-remaining">
                                          Effort: <span class="item-work">${story.effort}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                            </div>
                            <div class="row">
                              <div class="col s12 right-align">
                                <button data-target="taskModal" class="task-new btn-floating modal-trigger" data-story="${story._id}" data-boardlane="${story.boardlanes[0]._id}"><i class="small material-icons left">add</i></button>
                              </div>
                            </div>
                          </div>
                          <div class="col s9">
                            <div class="row">
                              <div class="col s12">
                                <div class="kanbanBoard" id="${story.uuid}" data-story="${story._id}"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                          `
                      )
                      .join('\n')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>          
      </div>
      <div class="actions">
        ${Modal.render({ modalId: 'theModal', type: 'Create', title: 'New Board', modalTitle: modalTitle, cancel: 'Cancel', cancelBtn: cancelBtn, confirmBtn: confirmBtn, confirm: 'Save', content: [{ type: 'text', disabled: false, fieldPlaceholder: 'Enter board name ...', fieldId: boardName, fieldLabel: 'Board Name', fieldValue: ''},{ type: 'text', disabled: true, fieldPlaceholder: '', fieldId: createdDate, fieldLabel: 'Created Date', fieldValue: ''}]})}
        ${Modal.render({ modalId: 'deleteModal', type: 'Delete', modalTitle: deleteModalTitle, title: 'Delete Board', cancel: 'No, Cancel', cancelBtn: cancelDeleteBtn, confirmBtn: confirmDeleteBtn, confirm: 'Yes, Delete', modalContent: deleteModalContent, content: 'Are you sure you want to delete this board?'})}
        ${Modal.render({ modalId: 'taskModal', type: 'Task', modalTitle: taskModalTitle, title: 'Create Task', cancel: 'Cancel', cancelBtn: cancelBtn, confirmBtn: confirmTaskBtn, confirm: 'Save', storyId: storyId, boardLaneId: boardLaneId, content: [{ type: 'text', disabled: false, fieldPlaceholder: 'Enter task title ...', fieldId: taskTitle, fieldLabel: 'Task Title', fieldValue: ''}, { type: 'text', disabled: true, fieldPlaceholder: '', fieldId: taskCreatedDate, fieldLabel: 'Created Date', fieldValue: ''}, { type: 'text', disabled: false, fieldPlaceholder: '', fieldId: taskWorkRemaining, fieldLabel: 'Work Remaining', fieldValue: ''},{ type: 'select', disabled: false, fieldId: taskAssigned, fieldLabel: 'Assigned User', fieldValue: '', fieldOptions: teamMemberOptions},{ type: 'textarea', disabled: false, fieldId: taskDescription, fieldLabel: 'Description', fieldValue: ''}]})}
      </div>
    </div>
    `;
  },
};
export default BoardScreen;