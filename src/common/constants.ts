export enum ACTIONS {
  CLONE = 'CLONE',
  EDIT = 'EDIT',
  CREATE = 'CREATE',
}

export const modalTitle = {
  [ACTIONS.CLONE]: 'Clone',
  [ACTIONS.EDIT]: 'Edit',
  [ACTIONS.CREATE]: 'Create',
};

export const submitButtonName = {
  [ACTIONS.CLONE]: 'Clone',
  [ACTIONS.EDIT]: 'Update',
  [ACTIONS.CREATE]: 'Submit',
};

export const COPY = {
  CLONE: 'CLONE',
  EDIT: 'EDIT',
  EDIT_ENTITY: 'Edit Entity',
  CREATE_ENTITY: 'Create Entity',
};
