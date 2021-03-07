import '../sass/backlogList.scss';

import { formatDate, rerender } from '../utils';
import { getBacklogs, getProjects, addBacklog, updateBacklog, deleteBacklog } from '../api';
import Modal from '../components/Modal';

const modalTitle = 'modalTitle';
const recordId = 'recordId';
const backlogName = 'backlogName';
const createdDate = 'createdDate';
const projectId = 'projectId';
const cancelBtn = 'cancelBtn';
const confirmBtn = 'confirmBtn';
const cancelDeleteBtn = 'cancelDeleteBtn';
const confirmDeleteBtn = 'confirmDeleteBtn';

const BacklogListScreen = {
    after_render: async () => {
      M.Modal.init(document.querySelectorAll('.modal'));
      M.FormSelect.init(document.querySelectorAll('.item-select'));

      document 
        .querySelector('.new-backlog')
        .addEventListener('click', () => {
          document.getElementById(modalTitle).innerText = 'New Backlog';
          document.getElementById(recordId).value = '';
          document.getElementById(backlogName).value = '';
          const createDate = formatDate(new Date());
          document.getElementById(createdDate).value = createDate;

          const selectedOption = document.querySelector('#' + projectId + ' option:checked');
          if (selectedOption) {
            selectedOption.removeAttribute('selected');
          }

          M.FormSelect.init(document.querySelectorAll('.item-select'));
        });
      
      const updateBtns = document.querySelectorAll('.update');

      for (let updateBtn of updateBtns) {
        updateBtn.addEventListener('click', () => {
          document.getElementById(modalTitle).innerText = `Update ${updateBtn.dataset.name}`;
          document.getElementById(recordId).value = updateBtn.dataset.id;
          document.getElementById(backlogName).value = updateBtn.dataset.name;
          document.getElementById(createdDate).value = updateBtn.dataset.created;
          
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
          document.getElementById(recordId).value = deleteBtn.dataset.id;
        });
      }

      document
        .getElementById(confirmBtn)
        .addEventListener('click', async () => {
            const project = document.getElementById(projectId).value;
            const name = document.getElementById(backlogName).value;
            const created = document.getElementById(createdDate).value;
            const backlog = {
              project,
              name,
              created
            };

            const id = document.getElementById(recordId).value;
            
            if (id) {
              backlog._id = id;
              await updateBacklog(backlog);
              M.toast({html: 'Backlog updated successfully'});
            } else {
              await addBacklog(backlog);
              M.toast({html: 'Backlog added successfully'});
            }

            rerender(BacklogListScreen);
        });

      document
        .getElementById(confirmDeleteBtn)
        .addEventListener('click', async () => {
            const backlogId = document.getElementById(recordId).value;
            await deleteBacklog(backlogId);
            M.toast({html: 'Backlog deleted successfully'});
            rerender(BacklogListScreen);
        });
    },
    render: async () => {
        const projects = await getProjects();
        const fieldOptions = projects.map((project) => {
          return { id: project._id, name: project.name };
        });
        const backlogs = await getBacklogs();
        if (backlogs.error) {
            return `<div class="error">${backlogs.error}</div>`;
        }
    
        return `
        <div class="backlogs">
          <div class="row">
              <div class="col s12">
                <div class="card">
                  <div class="card-content">
                    <div class="row">
                      <div class="col s8">
                        <div class="card-title">Backlogs</div>
                      </div>
                      <div class="col s4">
                        <div class="right-align">
                            <button data-target="theModal" class="waves-effect btn-floating modal-trigger new-backlog"><i class="material-icons">add</i></button>
                        </div>
                      </div>
                    </div>
                    <table class="highlight">
                      <thead>
                        <tr>
                            <th>Backlog Name</th>
                            <th>Project Name</th>
                            <th>Created Date</th>
                            <th class="right-align">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                      ${backlogs
                        .map(
                          (backlog) => `
                          <tr>
                            <td> <a href="/#/backlogs/${backlog._id}">${backlog.name}</a></td>
                            <td> <a href="/#/projects/${backlog.project._id}">${backlog.project.name}</a></td>
                            <td>${formatDate(new Date(backlog.created))}</td>
                            <td class="right-align">
                              <button data-target="theModal" data-id="${backlog._id}" data-name="${backlog.name}" data-created="${formatDate(new Date(backlog.created))}" data-project="${backlog.project._id}" class="update btn-floating modal-trigger"><i class="small material-icons">edit</i></button>
                              <button data-target="deleteModal" data-id="${backlog._id}" class="delete btn-floating modal-trigger"><i class="small material-icons">delete</i></button>
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
             ${Modal.render({ modalId: 'theModal', type: 'Create', title: 'New Backlog', modalTitle: modalTitle, cancel: 'Cancel', cancelBtn: cancelBtn, confirmBtn: confirmBtn, confirm: 'Save', content: [{ type: 'text', disabled: false, fieldPlaceholder: 'Enter backlog name ...', fieldId: backlogName, fieldLabel: 'Backlog Name', fieldValue: ''},{ type: 'text', disabled: true, fieldPlaceholder: '', fieldId: createdDate, fieldLabel: 'Created Date', fieldValue: ''}, { type: 'select', disabled: false, fieldId: projectId, fieldLabel: 'Project Select', fieldValue: '', fieldOptions: fieldOptions}]})}
             ${Modal.render({ modalId: 'deleteModal', type: 'Delete', title: 'Delete Backlog', cancel: 'No, Cancel', cancelBtn: cancelDeleteBtn, confirmBtn: confirmDeleteBtn, confirm: 'Yes, Delete', content: 'Are you sure you want to delete this backlog?'})}
          </div>
        </div>
        `;
    }
  };
  export default BacklogListScreen;