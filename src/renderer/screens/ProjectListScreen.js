import '../sass/projectList.scss';

import { formatDate, rerender } from '../utils';
import { getProjects, addProject, updateProject, deleteProject } from '../api';
import Modal from '../components/Modal';

const modalTitle = 'modalTitle';
const recordId = 'recordId';
const projectName = 'projectName';
const createdDate = 'createdDate';
const cancelBtn = 'cancelBtn';
const confirmBtn = 'confirmBtn';
const cancelDeleteBtn = 'cancelDeleteBtn';
const confirmDeleteBtn = 'confirmDeleteBtn';

const ProjectListScreen = {
  after_render: async () => {
    M.Modal.init(document.querySelectorAll('.modal'));

    document 
      .querySelector('.new-project')
      .addEventListener('click', () => {
        document.getElementById(modalTitle).innerText = 'New Project';
        document.getElementById(recordId).value = '';
        document.getElementById(projectName).value = '';
        const createDate = formatDate(new Date());
        document.getElementById(createdDate).value = createDate;
      });
    
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
          const created = document.getElementById(createdDate).value;
          const project = {
            name,
            created
          };

          const id = document.getElementById(recordId).value;
            
          if (id) {
            project._id = id;
            await updateProject(project);
            M.toast({html: 'Project updated successfully'});
          } else {
            await addProject(project);
            M.toast({html: 'Project added successfully'});
          }
          
          rerender(ProjectListScreen);

      });

    document
      .getElementById(confirmDeleteBtn)
      .addEventListener('click', async () => {
          const projectId = document.getElementById(recordId).value;
          await deleteProject(projectId);
          M.toast({html: 'Project deleted successfully'});
          rerender(ProjectListScreen);
      });
  },
  render: async () => {
    const projects = await getProjects();

    if (projects.error) {
        return `<div class="error">${projects.error}</div>`;
    }

    return `
        <div class="projects">
          <div class="row">
              <div class="col s12">
                <div class="card">
                  <div class="card-content">
                    <div class="row">
                      <div class="col s8">
                        <div class="card-title">Projects</div>
                      </div>
                      <div class="col s4">
                        <div class="right-align">
                            <button data-target="theModal" class="waves-effect btn-floating modal-trigger new-project"><i class="material-icons">add</i></button>
                        </div>
                      </div>
                    </div>
                    <table class="highlight responsive-table">
                      <thead>
                        <tr>
                            <th>Project Name</th>
                            <th>Created Date</th>
                            <th class="right-align">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                      ${projects
                        .map(
                          (project) => `
                          <tr>
                            <td> <a href="/#/projects/${project._id}">${project.name}</a></td>
                            <td>${formatDate(new Date(project.created))}</td>
                            <td class="right-align">
                              <button data-target="theModal" data-id="${project._id}" data-name="${project.name}" data-created="${formatDate(new Date(project.created))}" class="update btn-floating modal-trigger"><i class="small material-icons">edit</i></button>
                              <button data-target="deleteModal" data-id="${project._id}" class="delete waves-effect btn-floating modal-trigger"><i class="small material-icons">delete</i></button>
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
              ${Modal.render({ modalId: 'theModal', type: 'Create', title: 'New Project', modalTitle: modalTitle, cancel: 'Cancel', cancelBtn: cancelBtn, confirmBtn: confirmBtn, confirm: 'Save', content: [{ type: 'text', disabled: false, fieldPlaceholder: 'Enter project name ...', fieldId: projectName, fieldLabel: 'Project Name', fieldValue: ''}, { type: 'text', disabled: true, fieldPlaceholder: '', fieldId: createdDate, fieldLabel: 'Created Date', fieldValue: ''}]})}
              ${Modal.render({ modalId: 'deleteModal', type: 'Delete', title: 'Delete Project', cancel: 'No, Cancel', cancelBtn: cancelDeleteBtn, confirmBtn: confirmDeleteBtn, confirm: 'Yes, Delete', content: 'Are you sure you want to delete this project?'})}
          </div>
        </div>
    `;
  }
};
export default ProjectListScreen;