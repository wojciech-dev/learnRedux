const { v4 } = uuid;
const AGE_ID = 'age';
const FIRST_NAME_ID = 'firstname';
const FORM_ID = 'form';
const LAST_NAME_ID = 'lastname';
const PEOPLE_LIST_ID = 'people-list';
const SUBMIT_BUTTON_ID = 'submit-button';

const ageElem = document.getElementById(AGE_ID);
const firstNameElem = document.getElementById(FIRST_NAME_ID);
const formElem = document.getElementById(FORM_ID);
const lastNameElem = document.getElementById(LAST_NAME_ID);
const listElem = document.getElementById(PEOPLE_LIST_ID);
const submitButtonElem = document.getElementById(SUBMIT_BUTTON_ID);

formElem.addEventListener('submit', handleOnSubmit);

const { createStore } = Redux;

const store = createStore(reducer);

const actions = Object.freeze({
    ADD_PERSON: 'ADD_PERSON',
    CLEAR_STORE: 'CLEAR_STORE',
    DELETE_PERSON: 'DELETE_PERSON',
    EDIT_PERSON: 'EDIT_PERSON'
});

function reducer(state = [], action) {
    switch (action.type) {
        case actions.ADD_PERSON:
            return [...state, action.payload];
        default:
            console.log(`Nie rozpoznano akcji ${action.type}`);
            return state;
    }
}

function addPerson({ age, firstname, lastname }) {
    return {
        type: actions.ADD_PERSON,
        payload: {
            age,
            id: v4(),
            firstname,
            lastname
        }
    }
}

function handleOnSubmit(e) {
    e.preventDefault();

    const person = {
        age: Number(ageElem.value),
        firstname: firstNameElem.value,
        lastname: lastNameElem.value
    }

    store.dispatch({
        type: actions.ADD_PERSON,
        payload: person
    });
}