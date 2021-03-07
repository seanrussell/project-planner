import '../sass/sprint.scss';

import { parseRequestUrl, formatDate, rerender } from '../utils';
import { 
  getSprint, 
  deleteSprint, 
  updateSprint, 
  getProjects, 
  getStories, 
  updateStory, 
  addStory, 
  removeStoryFromSprint, 
  getTeamMembers,
  getStoriesInBacklogs,
  addStoriesToSprint,
  getBoardForSprint
} from '../api';
import Modal from '../components/Modal';

const modalTitle = 'modalTitle';
const deleteModalTitle = 'deleteModalTitle';
const deleteModalContent = 'deleteModalContent';
const storyModalTitle = 'storyModalTitle';
const pullModalTitle = 'pullModalTitle';
const recordId = 'recordId';
const recordType = 'recordType';
const sprintName = 'sprintName';
const projectId = 'projectId';
const createdDate = 'createdDate';
const startDate = 'startDate';
const endDate = 'endDate';
const cancelBtn = 'cancelBtn';
const confirmBtn = 'confirmBtn';
const cancelDeleteBtn = 'cancelDeleteBtn';
const confirmDeleteBtn = 'confirmDeleteBtn';
const storyTitle = 'storyTitle';
const storyCreatedDate = 'storyCreatedDate';
const storyDescription = 'storyDescription';
const storyEffort = 'storyEffort';
const storyState = 'storyState';
const storyAssigned = 'storyAssigned';
const storySprint = 'storySprint';
const confirmStoryBtn = 'confirmStoryBtn';
const confirmPullBtn = 'confirmPullBtn';

let sprintId;
let boardId;
let storiesInBacklog;

const SprintScreen = {
  after_render: async () => {
    M.Modal.init(document.querySelectorAll('.modal'));
    M.FormSelect.init(document.querySelectorAll('.item-select'));
    const options = {
      format: 'mm/dd/yyyy'
    };
    M.Datepicker.init(document.querySelectorAll('.datepicker'), options);

    const updateBtns = document.querySelectorAll('.update');

    for (let updateBtn of updateBtns) {
      updateBtn.addEventListener('click', () => {
        document.getElementById(modalTitle).innerText = `Update ${updateBtn.dataset.name}`;
        document.getElementById(recordId).value = updateBtn.dataset.id;
        document.getElementById(sprintName).value = updateBtn.dataset.name;
        document.getElementById(createdDate).value = updateBtn.dataset.created;
        document.getElementById(startDate).value = updateBtn.dataset.startdate;
        document.getElementById(endDate).value = updateBtn.dataset.enddate;
        
        const selectedOption = document.querySelector('#' + projectId + ' option:checked');
        if (selectedOption) {
          selectedOption.removeAttribute('selected');
        }
        document.querySelector('#' + projectId + ' option[value="' + updateBtn.dataset.project + '"]').setAttribute('selected', 'selected');

        M.FormSelect.init(document.querySelectorAll('.item-select'));
      });
    }

    const deleteBtns = document.querySelectorAll('.delete');

    for (let deleteBtn of deleteBtns) {
      deleteBtn.addEventListener('click', () => {
        document.getElementById(deleteModalTitle).innerText = `Delete ${deleteBtn.dataset.name}`;
        document.getElementById(recordId).value = deleteBtn.dataset.id;
        document.getElementById(recordType).value = 'sprint';
        document.querySelector('#' + deleteModalContent).textContent = 'Are you sure you want to delete this sprint?';
      });
    }

    const storyNewBtns = document.querySelectorAll('.story-new');

    for (let newBtn of storyNewBtns) {
      newBtn.addEventListener('click', () => {
        document.getElementById(storyModalTitle).innerText = `Create Story`;
        document.getElementById(recordId).value = '';
        document.getElementById(storyTitle).value = '';
        document.getElementById(storyCreatedDate).value = formatDate(new Date());
        document.getElementById(storyDescription).value = '';
        document.getElementById(storyEffort).value = '';
        document.getElementById(storyState).value = 'New';
        document.getElementById(storyAssigned).value = '';
        document.getElementById(storySprint).value = sprintId;

        const selectedOption = document.querySelector('#' + storyAssigned + ' option:checked');
        if (selectedOption) {
          selectedOption.removeAttribute('selected');
        }
        
        M.FormSelect.init(document.querySelectorAll('.item-select'));
      });
    }

    const storyUpdateBtns = document.querySelectorAll('.story-update');

    for (let updateBtn of storyUpdateBtns) {
      updateBtn.addEventListener('click', () => {
        document.getElementById(storyModalTitle).innerText = `Update ${updateBtn.dataset.title}`;
        document.getElementById(recordId).value = updateBtn.dataset.id;
        document.getElementById(storyTitle).value = updateBtn.dataset.title;
        document.getElementById(storyCreatedDate).value = updateBtn.dataset.created;
        document.getElementById(storyDescription).value = updateBtn.dataset.description;
        document.getElementById(storyEffort).value = updateBtn.dataset.effort;
        document.getElementById(storyState).value = updateBtn.dataset.state;

        const selectedOption = document.querySelector('#' + storyAssigned + ' option:checked');
        if (selectedOption) {
          selectedOption.removeAttribute('selected');
        }
        document.querySelector('#' + storyAssigned + ' option[value="' + updateBtn.dataset.assigned + '"]').setAttribute('selected', 'selected');

        const selectedSprintOption = document.querySelector('#' + storySprint + ' option:checked');
        if (selectedSprintOption) {
          selectedSprintOption.removeAttribute('selected');
        }
        document.querySelector('#' + storySprint + ' option[value="' + updateBtn.dataset.sprint + '"]').setAttribute('selected', 'selected');

        M.FormSelect.init(document.querySelectorAll('.item-select'));
      });
    }

    const storyDeleteBtns = document.querySelectorAll('.story-delete');

    for (let deleteBtn of storyDeleteBtns) {
      deleteBtn.addEventListener('click', () => {
        document.getElementById(deleteModalTitle).innerText = `Remove ${deleteBtn.dataset.title}`;
        document.getElementById(recordId).value = deleteBtn.dataset.id;
        document.getElementById(recordType).value = 'story';
        document.querySelector('#' + deleteModalContent).textContent = 'Are you sure you want to remove this story from this sprint?';
      });
    }

    const boardBtns = document.querySelectorAll('.board-btn');

    for (let boardBtn of boardBtns) {
      boardBtn.addEventListener('click', () => {
        window.location = `/#/boards/${boardId}`;
      });
    }

    document
      .getElementById(confirmBtn)
        .addEventListener('click', async () => {
            const id = document.getElementById(recordId).value;
            const name = document.getElementById(sprintName).value;
            const created = document.getElementById(createdDate).value;
            const project = document.getElementById(projectId).value;
            const startdate = document.getElementById(startDate).value;
            const enddate = document.getElementById(endDate).value;
            const sprint = {
              _id: id,
              name,
              project,
              created,
              startdate,
              enddate
            };

            await updateSprint(sprint);
            M.toast({html: 'Sprint updated successfully'});
            rerender(SprintScreen);
        });

      document
        .getElementById(confirmDeleteBtn)
          .addEventListener('click', async () => {
            const id = document.getElementById(recordId).value;
            const type = document.getElementById(recordType).value;
            
            if (type === 'sprint') {
              await deleteSprint(id);
              M.toast({html: 'Sprint deleted successfully'});
              document.location.hash = '/sprints';
            } else if (type === 'story') {
              await removeStoryFromSprint(id);
              M.toast({html: 'Story removed from sprint successfully'});
              rerender(SprintScreen);
            }
          });

      document
        .getElementById(confirmStoryBtn)
          .addEventListener('click', async () => {
              const title = document.getElementById(storyTitle).value;
              const created = document.getElementById(storyCreatedDate).value;
              const description = document.getElementById(storyDescription).value;
              const effort = document.getElementById(storyEffort).value;
              const assigned = document.getElementById(storyAssigned).value;
              const sprint = document.getElementById(storySprint).value;
              const state = (sprint && sprint !== '') ? 'Committed': 'New';
              const story = {
                title,
                description,
                created,
                effort,
                state,
                board: boardId
              };

              const id = document.getElementById(recordId).value;
            
              if (assigned && assigned.trim() !== '') {
                story['assigned'] = assigned;
              }

              if (sprint && sprint.trim() !== '') {
                story['sprint'] = sprint;
              }

              if (id) {
                story['_id'] = id;
                await updateStory(story);
                M.toast({html: 'Story updated successfully'});
              } else {
                await addStory(story);
                M.toast({html: 'Story added successfully'});
              }
    
              rerender(SprintScreen);
          });

        if (storiesInBacklog.length > 0) {
          document
            .getElementById(confirmPullBtn)
              .addEventListener('click', async () => {
                const storiesSelected = document.querySelectorAll('input[type="checkbox"]:checked');
      
                let storyIds = [];
                for (let storySelected of storiesSelected) {
                  storyIds.push(storySelected.getAttribute('data-id'));
                }

                if (storyIds) {
                  await addStoriesToSprint(sprintId, storyIds, boardId);
                  M.toast({html: 'Stories added to sprint successfully'});
                  rerender(SprintScreen);
                }
              });
          }
  },
  render: async () => {
    const projects = await getProjects();
    const fieldOptions = projects.map((project) => {
      return { id: project._id, name: project.name };
    });
    const request = parseRequestUrl();
    const sprint = await getSprint(request.id);
    const sprintOptions = [{ id: sprint._id, name: sprint.name }];
    sprintId = sprint._id;

    const stories = await getStories(null, request.id);
    storiesInBacklog = await getStoriesInBacklogs(sprint.project._id);
    
    if (sprint.error) {
        return `<div class="error">${sprint.error}</div>`;
    }

    const teammembers = await getTeamMembers(sprint.project._id);
    const teamMemberOptions = teammembers.map((teammember) => {
      return { id: teammember.user._id, name: teammember.user.name };
    });

    const board = await getBoardForSprint(sprintId);
    boardId = board._id;

    return `
    <div class="sprint">
      <div class="row">
        <div class="col s12">
          <div class="card">
            <div class="card-content">
              <div class="row">
                <div class="col s8">
                  <div class="card-title">${sprint.name}</div>
                </div>
                <div class="col s4">
                  
                </div>
              </div>
              <button data-target="theModal" data-id="${sprint._id}" data-name="${sprint.name}" data-created="${formatDate(new Date(sprint.created))}" data-project="${sprint.project._id}" data-startdate="${formatDate(new Date(sprint.startdate))}" data-enddate="${formatDate(new Date(sprint.enddate))}" class="update btn-floating modal-trigger"><i class="small material-icons">edit</i></button>
              <button data-target="deleteModal" data-id="${sprint._id}" data-name="${sprint.name}" class="delete btn-floating modal-trigger"><i class="small material-icons">delete</i></button>
              <button class="board-btn btn-floating modal-trigger"><i class="small material-icons">dashboard</i></button>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col s12">
          <div class="card">
            <div class="card-content">
              <div class="row">
                <div class="col s8">
                  <div class="card-title">Stories</div>
                </div>
                <div class="col s4 right-align">
                ${(storiesInBacklog.length > 0) ? '<button data-target="pullModal" class="story-new btn-floating modal-trigger"><i class="small material-icons left">list</i></button>': ''}
                  <button data-target="storyModal" class="story-new btn-floating modal-trigger"><i class="small material-icons left">add</i></button>
                </div>
              </div>
              <table class="highlight">
                <thead>
                  <tr>
                      <th>Story Name</th>
                      <th>Created Date</th>
                      <th>State</th>
                      <th>Sprint</th>
                      <th class="right-align">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${stories
                    .map(
                      (story) => `
                      <tr>
                        <td>${story.title}</td>
                        <td>${formatDate(new Date(story.created))}</td>
                        <td>${story.state}</td>
                        <td>${(story.sprint) ? story.sprint.name: ''}</td>
                        <td class="right-align">
                            <button data-target="storyModal" data-id="${story._id}" data-title="${story.title}" data-created="${formatDate(new Date(story.created))}" data-description="${story.description}" data-effort="${story.effort}" data-assigned="${(story.assigned) ? story.assigned._id: ''}" data-sprint="${(story.sprint) ? story.sprint._id: ''}" data-state="${story.state}" class="story-update btn-floating modal-trigger"><i class="small material-icons">edit</i></button>
                            <button data-target="deleteModal" data-id="${story._id}" data-title="${story.title}" class="story-delete waves-effect btn-floating modal-trigger"><i class="small material-icons">clear</i></button>
                          </td>
                      </tr>
                  `)
                    .join('\n')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="actions">
        ${Modal.render({ modalId: 'theModal', type: 'Create', modalTitle: modalTitle, title: 'New Sprint', cancel: 'Cancel', cancelBtn: cancelBtn, confirmBtn: confirmBtn, confirm: 'Save', content: [{ type: 'text', disabled: false, fieldPlaceholder: 'Enter sprint name ...', fieldId: sprintName, fieldLabel: 'Sprint Name', fieldValue: ''},{ type: 'text', disabled: true, fieldPlaceholder: '', fieldId: createdDate, fieldLabel: 'Created Date', fieldValue: ''}, { type: 'date', disabled: false, fieldPlaceholder: 'MM/DD/YYYY', fieldId: startDate, fieldLabel: 'Start Date', fieldValue: ''}, { type: 'date', disabled: false, fieldPlaceholder: 'MM/DD/YYY', fieldId: endDate, fieldLabel: 'End Date', fieldValue: ''}, { type: 'select', disabled: false, fieldId: projectId, fieldLabel: 'Project Select', fieldValue: '', fieldOptions: fieldOptions}]})}
        ${Modal.render({ modalId: 'deleteModal', type: 'Delete', modalTitle: deleteModalTitle, title: 'Delete Sprint', cancel: 'No, Cancel', cancelBtn: cancelDeleteBtn, confirmBtn: confirmDeleteBtn, confirm: 'Yes, Delete', modalContent: deleteModalContent, content: 'Are you sure you want to delete this sprint?'})}
        ${Modal.render({ modalId: 'storyModal', type: 'Story', modalTitle: storyModalTitle, title: 'Create Story', cancel: 'Cancel', cancelBtn: cancelBtn, confirmBtn: confirmStoryBtn, confirm: 'Save', content: [{ type: 'text', disabled: false, fieldPlaceholder: 'Enter story title ...', fieldId: storyTitle, fieldLabel: 'Story Title', fieldValue: ''}, { type: 'text', disabled: true, fieldPlaceholder: '', fieldId: storyCreatedDate, fieldLabel: 'Created Date', fieldValue: ''}, { type: 'text', disabled: false, fieldPlaceholder: '', fieldId: storyEffort, fieldLabel: 'Effort', fieldValue: ''},{ type: 'text', disabled: true, fieldPlaceholder: '', fieldId: storyState, fieldLabel: 'State', fieldValue: 'New'},{ type: 'textarea', disabled: false, fieldId: storyDescription, fieldLabel: 'Description', fieldValue: ''}, { type: 'select', disabled: false, fieldId: storyAssigned, fieldLabel: 'Assigned User', fieldValue: '', fieldOptions: teamMemberOptions}, { type: 'select', disabled: false, fieldId: storySprint, fieldLabel: 'Sprint', fieldValue: '', fieldOptions: sprintOptions}]})}
        ${(storiesInBacklog.length > 0) ? Modal.render({ modalId: 'pullModal', type: 'Pull', modalTitle: pullModalTitle, title: 'Add Stories to Sprint From Backlog', cancel: 'Cancel', cancelBtn: cancelBtn, confirmBtn: confirmPullBtn, confirm: 'Add To Sprint', content: storiesInBacklog}): ''}
      </div>
    </div>     
    `;
  },
};
export default SprintScreen;