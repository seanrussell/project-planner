import '../sass/sprintList.scss';

import { formatDate, rerender } from '../utils';
import { getSprints, getProjects, addSprint, updateSprint, deleteSprint } from '../api';
import Modal from '../components/Modal';

const modalTitle = 'modalTitle';
const recordId = 'recordId';
const sprintName = 'sprintName';
const createdDate = 'createdDate';
const projectId = 'projectId';
const startDate = 'startDate';
const endDate = 'endDate';
const cancelBtn = 'cancelBtn';
const confirmBtn = 'confirmBtn';
const cancelDeleteBtn = 'cancelDeleteBtn';
const confirmDeleteBtn = 'confirmDeleteBtn';

const SprintListScreen = {
    after_render: async () => {
      M.Modal.init(document.querySelectorAll('.modal'));
      M.FormSelect.init(document.querySelectorAll('.item-select'));
      const options = {
        format: 'mm/dd/yyyy'
      };
      M.Datepicker.init(document.querySelectorAll('.datepicker'), options);

      document 
        .querySelector('.new-sprint')
        .addEventListener('click', () => {
          document.getElementById(modalTitle).innerText = 'New Sprint';
          document.getElementById(recordId).value = '';
          document.getElementById(sprintName).value = '';
          document.getElementById(startDate).value = '';
          document.getElementById(endDate).value = '';
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
            document.getElementById(recordId).value = deleteBtn.dataset.id;
          });
        }

      document
        .getElementById(confirmBtn)
        .addEventListener('click', async () => {
            const name = document.getElementById(sprintName).value;
            const created = document.getElementById(createdDate).value;
            const project = document.getElementById(projectId).value;
            const startdate = document.getElementById(startDate).value;
            const enddate = document.getElementById(endDate).value;
            const sprint = {
              name,
              project,
              created,
              startdate,
              enddate
            };

            const id = document.getElementById(recordId).value;
            
            if (id) {
              backlog._id = id;
              await updateSprint(sprint);
              M.toast({html: 'Sprint updated successfully'});
            } else {
              await addSprint(sprint);
              M.toast({html: 'Sprint added successfully'});
            }

            rerender(SprintListScreen);
        });

        document
        .getElementById(confirmDeleteBtn)
        .addEventListener('click', async () => {
            const sprintId = document.getElementById(recordId).value;
            await deleteSprint(sprintId);
            M.toast({html: 'Sprint deleted successfully'});
            rerender(SprintListScreen);
        });
    },
    render: async () => {
        const projects = await getProjects();
        const fieldOptions = projects.map((project) => {
          return { id: project._id, name: project.name };
        });
        const sprints = await getSprints();
        if (sprints.error) {
            return `<div class="error">${sprints.error}</div>`;
        }
    
        return `
        <div class="sprints">
          <div class="row">
            <div class="col s12">
              <div class="card">
                <div class="card-content">
                  <div class="row">
                    <div class="col s8">
                      <div class="card-title">Sprints</div>
                    </div>
                    <div class="col s4">
                      <div class="right-align">
                          <button data-target="theModal" class="waves-effect btn-floating modal-trigger new-sprint"><i class="material-icons">add</i></button>
                      </div>
                    </div>
                  </div>
                  <table class="highlight">
                    <thead>
                      <tr>
                          <th>Sprint Name</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Project Name</th>
                          <th>Created Date</th>
                          <th class="right-align">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                    ${sprints
                      .map(
                        (sprint) => `
                        <tr>
                          <td> <a href="/#/sprints/${sprint._id}">${sprint.name}</a></td>
                          <td>${formatDate(new Date(sprint.startdate))}</td>
                          <td>${formatDate(new Date(sprint.enddate))}</td>
                          <td> <a href="/#/projects/${sprint.project._id}">${sprint.project.name}</a></td>
                          <td>${formatDate(new Date(sprint.created))}</td>
                          <td class="right-align">
                            <button data-target="theModal" data-id="${sprint._id}" data-name="${sprint.name}" data-created="${formatDate(new Date(sprint.created))}" data-project="${sprint.project._id}" data-startdate="${formatDate(new Date(sprint.startdate))}" data-enddate="${formatDate(new Date(sprint.enddate))}" class="update btn-floating modal-trigger"><i class="small material-icons">edit</i></button>
                            <button data-target="deleteModal" data-id="${sprint._id}" class="delete btn-floating modal-trigger"><i class="small material-icons">delete</i></button>
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
            ${Modal.render({ modalId: 'deleteModal', type: 'Delete', title: 'Delete Sprint', cancel: 'No, Cancel', cancelBtn: cancelDeleteBtn, confirmBtn: confirmDeleteBtn, confirm: 'Yes, Delete', content: 'Are you sure you want to delete this sprint?'})}
          </div>
        </div>
        `;
    }
  };
  export default SprintListScreen;