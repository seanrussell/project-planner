import '../sass/project.scss';

import { parseRequestUrl, formatDate, rerender } from '../utils';
import { getProject, updateProject, deleteProject, getBacklogs, getSprints } from '../api';
import Modal from '../components/Modal';

const modalTitle = 'modalTitle';
const recordId = 'recordId';
const projectName = 'projectName';
const createdDate = 'createdDate';
const cancelBtn = 'cancelBtn';
const confirmBtn = 'confirmBtn';
const cancelDeleteBtn = 'cancelDeleteBtn';
const confirmDeleteBtn = 'confirmDeleteBtn';

let project;

const ProjectScreen = {
  after_render: async () => {
    M.Modal.init(document.querySelectorAll('.modal'));

    const updateBtns = document.querySelectorAll('.update');

    for (let updateBtn of updateBtns) {
      updateBtn.addEventListener('click', () => {
        document.getElementById(modalTitle).innerText = `Update ${updateBtn.dataset.name}`;
        document.getElementById(recordId).value = updateBtn.dataset.id;
        document.getElementById(projectName).value = updateBtn.dataset.name;
        document.getElementById(createdDate).value = updateBtn.dataset.created;
      });
    }

    const deleteBtns = document.querySelectorAll('.delete');

    for (let deleteBtn of deleteBtns) {
      deleteBtn.addEventListener('click', () => {
        document.getElementById(recordId).value = deleteBtn.dataset.id;
      });
    }
    
    document
      .getElementById(confirmBtn)
      .addEventListener('click', async () => {
          const name = document.getElementById(projectName).value;
          project.name = name;
          await updateProject(project);
          M.toast({html: 'Project updated successfully'});
          rerender(ProjectScreen);
      });

    document
      .getElementById(confirmDeleteBtn)
      .addEventListener('click', async () => {
          const projectId = document.getElementById(recordId).value;
          await deleteProject(projectId);
          M.toast({html: 'Project deleted successfully'});
          document.location.hash = '/projects';
      });
  },
  render: async () => {
    const request = parseRequestUrl();
    project = await getProject(request.id);
    const backlogs = await getBacklogs(request.id);
    const sprints = await getSprints(request.id);
    
    if (project.error) {
        return `<div class="error">${project.error}</div>`;
    }

    return `
    <div class="project">
      <div class="row">
        <div class="col s12">
          <div class="card">
            <div class="card-content">
              <div class="row">
                <div class="col s8">
                  <div class="card-title">${project.name}</div>
                </div>
                <div class="col s4">
                  
                </div>
              </div>
              <button data-target="theModal" data-id="${project._id}" data-name="${project.name}" data-created="${formatDate(new Date(project.created))}" class="update btn-floating modal-trigger"><i class="small material-icons">edit</i></button>
              <button data-target="deleteModal" data-id="${project._id}" class="delete btn-floating modal-trigger"><i class="small material-icons">delete</i></button>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col s6">
          <div class="card">
            <div class="card-content">
              <div class="row">
                <div class="col s8">
                  <div class="card-title">Backlogs</div>
                </div>
                <div class="col s4">
                  
                </div>
              </div>
              <table class="highlight">
                <thead>
                  <tr>
                      <th>Backlog Name</th>
                      <th>Created Date</th>
                  </tr>
                </thead>
                <tbody>
                ${backlogs
                  .map(
                    (backlog) => `
                    <tr>
                      <td> <a href="/#/backlogs/${backlog._id}">${backlog.name}</a></td>
                      <td>${formatDate(new Date(backlog.created))}</td>
                    </tr>
                `)
                  .join('\n')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="col s6">
          <div class="card">
            <div class="card-content">
              <div class="row">
                <div class="col s8">
                  <div class="card-title">Sprints</div>
                </div>
                <div class="col s4">
                  
                </div>
              </div>
              <table class="highlight">
                <thead>
                  <tr>
                      <th>Sprint Name</th>
                      <th>Created Date</th>
                  </tr>
                </thead>
                <tbody>
                ${sprints
                  .map(
                    (sprint) => `
                    <tr>
                      <td> <a href="/#/sprints/${sprint._id}">${sprint.name}</a></td>
                      <td>${formatDate(new Date(sprint.created))}</td>
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
          ${Modal.render({ modalId: 'theModal', type: 'Create', title: 'New Project', modalTitle: modalTitle, cancel: 'Cancel', cancelBtn: cancelBtn, confirmBtn: confirmBtn, confirm: 'Save', content: [{ type: 'text', disabled: false, fieldPlaceholder: 'Enter project name ...', fieldId: projectName, fieldLabel: 'Project Name', fieldValue: ''}, { type: 'text', disabled: true, fieldPlaceholder: '', fieldId: createdDate, fieldLabel: 'Created Date', fieldValue: ''}]})}
          ${Modal.render({ modalId: 'deleteModal', type: 'Delete', title: 'Delete Project', cancel: 'No, Cancel', cancelBtn: cancelDeleteBtn, confirmBtn: confirmDeleteBtn, confirm: 'Yes, Delete', content: 'Are you sure you want to delete this project?'})}
      </div>
    </div>
    `;
  },
};
export default ProjectScreen;