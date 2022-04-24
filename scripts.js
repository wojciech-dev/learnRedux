const { v4 } = uuid;
const AGE_ID = 'age';
const CLEAR_BUTTON_ID = 'clear-button';
const FIRST_NAME_ID = 'firstname';
const FORM_ID = 'form';
const LAST_NAME_ID = 'lastname';
const PEOPLE_LIST_ID = 'people-list';
const SUBMIT_BUTTON_ID = 'submit-button';

const ageElem = document.getElementById(AGE_ID);
const clearButtonElem = document.getElementById(CLEAR_BUTTON_ID);
const firstNameElem = document.getElementById(FIRST_NAME_ID);
const formElem = document.getElementById(FORM_ID);
const lastNameElem = document.getElementById(LAST_NAME_ID);
const listElem = document.getElementById(PEOPLE_LIST_ID);
const submitButtonElem = document.getElementById(SUBMIT_BUTTON_ID);

formElem.addEventListener('submit', handleOnSubmit);
clearButtonElem.addEventListener('click', handleClearData);

const { createStore } = Redux;

const actions = Object.freeze({
    ADD_PERSON: 'ADD_PERSON',
    CLEAR_STORE: 'CLEAR_STORE',
    DELETE_PERSON: 'DELETE_PERSON',
    EDIT_PERSON: 'EDIT_PERSON'
});

const store = createStore(reducer);
store.subscribe(showAllPeople);

function reducer(state = [], action) {
    switch (action.type) {
        case actions.ADD_PERSON:
            return [...state, action.payload];
        case actions.DELETE_PERSON:
            return state.filter(person => person.id !== action.payload);
        case actions.EDIT_PERSON:
            return state.map(person => person.id !== action.payload.id ? person : action.payload);
        case actions.CLEAR_STORE:
            return [];
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

function deletePerson(id) {
    return {
        type: actions.DELETE_PERSON,
        payload: id
    }
}

function editPerson(person) {
    return {
        type: actions.EDIT_PERSON,
        payload: person
    }
}

function clearData() {
    return {
        type: actions.CLEAR_STORE
    }
}

function handleOnSubmit(e) {
    e.preventDefault();
    const { id } = e.target.dataset;
    const person = {
        age: Number(ageElem.value),
        firstname: firstNameElem.value,
        lastname: lastNameElem.value
    }

    if (!id) {
        store.dispatch(addPerson(person));
    } else {
        person.id = id;
        submitButtonElem.textContent = 'DODAJ';
        formElem.dataset.id = '';
        store.dispatch(editPerson(person));
    }
}

function showAllPeople() {
    while (listElem.lastElementChild) {
        listElem.removeChild(listElem.lastElementChild);
    }

    const people = store.getState();
    const elements = people.map(({ age, firstname, id, lastname }) => {
        const liElement = document.createElement('li');
        const editButton = document.createElement('button');
        const deleteButton = document.createElement('button');
        const pElement = document.createElement('p');

        pElement.textContent = `${firstname} ${lastname} ${age}lat`;

        editButton.dataset.id = id;
        editButton.textContent = 'Edytuj';
        editButton.addEventListener('click', editUser);

        deleteButton.dataset.id = id;
        deleteButton.textContent = 'Usuń';
        deleteButton.addEventListener('click', deleteUser);

        liElement.append(pElement);
        liElement.append(editButton);
        liElement.append(deleteButton);

        return liElement;
    });
    listElem.append(...elements);
}

function editUser(e) {
    const { id } = e.target.dataset;
    const data = store.getState().find(person => person.id === id);

    ageElem.value = data.age;
    firstNameElem.value = data.firstname;
    lastNameElem.value = data.lastname;
    submitButtonElem.textContent = 'EDYTUJ';
    formElem.dataset.id = id;
}

function deleteUser(e) {
    const { id } = e.target.dataset;

    store.dispatch(deletePerson(id));
}

function handleClearData() {
    return store.dispatch(clearData());
}