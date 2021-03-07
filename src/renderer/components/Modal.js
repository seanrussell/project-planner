import '../sass/modal.scss';

const Modal = {
    render: (props) => {
        return `
        <div id="${props.modalId}" class="modal modal-fixed-footer">
            <div class="modal-content">
                <h4 id="${props.modalTitle}">${props.title}</h4>
                <div class="row">
                    <form class="col s12">
                        <div class="row">
                            <input type="hidden" id="recordId" value="">
                            <input type="hidden" id="recordType" value="">
                            <input type="hidden" id="storyId" value="${props.storyId}">
                            <input type="hidden" id="boardLaneId" value="${props.boardLaneId}">
                        ${(props.type === 'Delete') ? `
                            <div class="input-field col s12">
                                <span id="${props.modalContent}">${props.content}</span>
                            </div>
                            `: (props.type === 'Pull') ? 
                                `<form action="#">
                                    <table class="highlight">
                                        <thead>
                                            <tr>
                                                <th>Stories Available to Add</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        ${props.content.map((story) => `
                                            <tr>
                                                <td>
                                                    <label>
                                                        <input type="checkbox" data-id="${story._id}" />
                                                        <span>${story.title} (${story.backlog.name})</span>
                                                    </label>    
                                                </td>
                                            </tr>
                                        `)
                                            .join('\n')}
                                        </tbody>
                                    </table>
                                </form>`: 
                                    (props.type === 'Create' || props.type === 'Update') ? 
                                        props.content.map((item) => `
                                            ${(item.type === 'text') ? `
                                                <div class="input-field col s6">
                                                    <input ${(item.disabled) ? 'disabled': ''} placeholder="${item.fieldPlaceholder}" id="${item.fieldId}" type="text" class="validate" value="${item.fieldValue}">
                                                    <label for="${item.fieldId}" class="active">${item.fieldLabel}</label>
                                                </div>
                                            `: (item.type === 'date') ? ` 
                                                <div class="input-field col s6">
                                                    <input type="text" id="${item.fieldId}" class="datepicker" placeholder="${item.fieldPlaceholder}" value="${item.fieldValue}">
                                                    <label for="${item.fieldId}" class="active">${item.fieldLabel}</label>
                                                </div>
                                            `: `
                                                <div class="input-field col s6">
                                                    <select id="${item.fieldId}" class="item-select">
                                                        <option value="">--None--</option>
                                                        ${item.fieldOptions
                                                        .map(
                                                            (fieldOption) => `
                                                            <option value="${fieldOption.id}" ${(item.fieldValue && item.fieldValue === fieldOption.id) ? 'selected':''}>${fieldOption.name}</option>
                                                        `)
                                                        .join('\n')}
                                                    </select>
                                                    <label>${item.fieldLabel}</label>
                                                </div>
                                                `}
                                            `)
                                            .join('\n'): 
                                                props.content.map((item) => `
                                                    ${(item.type === 'text') ? `
                                                        <div class="input-field col s6">
                                                            <input ${(item.disabled) ? 'disabled': ''} placeholder="${item.fieldPlaceholder}" id="${item.fieldId}" type="text" class="validate" value="${item.fieldValue}">
                                                            <label for="${item.fieldId}" class="active">${item.fieldLabel}</label>
                                                        </div>
                                                    `: (item.type === 'textarea') ? ` 
                                                        <div class="input-field col s12">
                                                            <textarea id="${item.fieldId}" class="materialize-textarea">${item.fieldValue}</textarea>
                                                            <label for="${item.fieldId}" class="active">${item.fieldLabel}</label>
                                                        </div>
                                                    `: `
                                                        <div class="input-field col s6">
                                                            <select id="${item.fieldId}" class="item-select">
                                                                <option value="">--None--</option>
                                                                ${item.fieldOptions
                                                                .map(
                                                                    (fieldOption) => `
                                                                    <option value="${fieldOption.id}" ${(item.fieldValue && item.fieldValue === fieldOption.id) ? 'selected':''}>${fieldOption.name}</option>
                                                                `)
                                                                .join('\n')}
                                                            </select>
                                                            <label>${item.fieldLabel}</label>
                                                        </div>
                                                    `}
                                                `).join('\n')}
                        </div>
                    </form>
                </div>
            </div>
            <div class="modal-footer">
                <button id="${props.cancelBtn}" class="modal-close btn-floating clear-btn"><i class="material-icons">clear</i></button>
                <button id="${props.confirmBtn}" class="modal-close btn-floating"><i class="material-icons">check</i></button>
            </div>
        </div>
        `;
    }
};
export default Modal;