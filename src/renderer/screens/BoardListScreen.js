import '../sass/boardList.scss';

import { formatDate, rerender } from '../utils';
import { getBoards, getSprints, addBoard, updateBoard, deleteBoard } from '../api';
import Modal from '../components/Modal';

const modalTitle = 'modalTitle';
const recordId = 'recordId';
const boardName = 'boardName';
const createdDate = 'createdDate';
const sprintId = 'sprintId';
const cancelBtn = 'cancelBtn';
const confirmBtn = 'confirmBtn';
const cancelDeleteBtn = 'cancelDeleteBtn';
const confirmDeleteBtn = 'confirmDeleteBtn';

const BoardListScreen = {
  after_render: async () => {
    M.Modal.init(document.querySelectorAll('.modal'));
    M.FormSelect.init(document.querySelectorAll('.item-select'));

    document 
      .querySelector('.new-board')
      .addEventListener('click', () => {
        document.getElementById(modalTitle).innerText = 'New Board';
        document.getElementById(recordId).value = '';
        document.getElementById(boardName).value = '';
        const createDate = formatDate(new Date());
        document.getElementById(createdDate).value = createDate;

        const selectedOption = document.querySelector('#' + sprintId + ' option:checked');
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
          document.getElementById(boardName).value = updateBtn.dataset.name;
          document.getElementById(createdDate).value = updateBtn.dataset.created;
          
          const selectedOption = document.querySelector('#' + sprintId + ' option:checked');
          if (selectedOption) {
            selectedOption.removeAttribute('selected');
          }
          document.querySelector('#' + sprintId + ' option[value="' + updateBtn.dataset.sprint + '"]').setAttribute('selected', 'selected');
  
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
          const name = document.getElementById(boardName).value;
          const created = document.getElementById(createdDate).value;
          const sprint = (document.getElementById(sprintId).value.trim() === '') ? null: document.getElementById(sprintId).value;
          const board = {
            name,
            sprint,
            created
          };

          const id = document.getElementById(recordId).value;
            
          if (id) {
            board._id = id;
            await updateBoard(board);
            M.toast({html: 'Board updated successfully'});
          } else {
            await addBoard(board);
            M.toast({html: 'Board added successfully'});
          }

          rerender(BoardListScreen);
      });

      document
        .getElementById(confirmDeleteBtn)
        .addEventListener('click', async () => {
            const boardId = document.getElementById(recordId).value;
            await deleteBoard(boardId);
            M.toast({html: 'Board deleted successfully'});
            rerender(BoardListScreen);
        });
  },
  render: async () => {
    const sprints = await getSprints();
    const fieldOptions = sprints.map((sprint) => {
      const name = `${sprint.name} (${sprint.project.name})`; 
      return { id: sprint._id, name: name };
    });
    const boards = await getBoards();
    if (boards.error) {
        return `<div class="error">${boards.error}</div>`;
    }

    return `
      <div class="boards">
          <div class="row">
            <div class="col s12">
              <div class="card">
                <div class="card-content">
                  <div class="row">
                    <div class="col s8">
                      <div class="card-title">Boards</div>
                    </div>
                    <div class="col s4">
                      <div class="right-align">
                          <button data-target="theModal" class="waves-effect btn-floating modal-trigger new-board"><i class="material-icons">add</i></button>
                      </div>
                    </div>
                  </div>
                  <table class="highlight">
                    <thead>
                      <tr>
                          <th>Board Name</th>
                          <th>Sprint Name</th>
                          <th>Created Date</th>
                          <th class="right-align">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                    ${boards
                      .map(
                        (board) => `
                        <tr>
                          <td> <a href="/#/boards/${board._id}">${board.name}</a></td>
                          <td> ${(board.sprint) ? `
                            <a href="/#/sprints/${board.sprint._id}">${board.sprint.name}</a>
                            `: ''}
                            
                          </td>
                          <td>${formatDate(new Date(board.created))}</td>
                          <td class="right-align">
                            <button data-target="theModal" data-id="${board._id}" data-name="${board.name}" data-created="${formatDate(new Date(board.created))}" data-sprint="${(board.sprint) ? board.sprint._id: ''}" class="update btn-floating modal-trigger"><i class="small material-icons">edit</i></button>
                            <button data-target="deleteModal" data-id="${board._id}" class="delete btn-floating modal-trigger"><i class="small material-icons">delete</i></button>
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
            ${Modal.render({ modalId: 'theModal', type: 'Create', title: 'New Board', cancel: 'Cancel', cancelBtn: cancelBtn, confirmBtn: confirmBtn, confirm: 'Save', content: [{ type: 'text', disabled: false, fieldPlaceholder: 'Enter board name ...', fieldId: boardName, fieldLabel: 'Board Name', fieldValue: ''},{ type: 'text', disabled: true, fieldPlaceholder: '', fieldId: createdDate, fieldLabel: 'Created Date', fieldValue: ''}, { type: 'select', disabled: false, fieldId: sprintId, fieldLabel: 'Sprint Select', fieldValue: '', fieldOptions: fieldOptions}]})}
            ${Modal.render({ modalId: 'deleteModal', type: 'Delete', title: 'Delete Sprint', cancel: 'No, Cancel', cancelBtn: cancelDeleteBtn, confirmBtn: confirmDeleteBtn, confirm: 'Yes, Delete', content: 'Are you sure you want to delete this board?'})}
          </div>
        </div>
    `;
  }
};

export default BoardListScreen;