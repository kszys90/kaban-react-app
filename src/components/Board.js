import React from "react";
import Columns from './Columns'
import { StructureContext } from './contexts/contexts'
import validateForm from './validateForm'

const Board = function () {
    const { structure } = React.useContext(StructureContext)

    const fields = [
        { name: 'name', type: 'text', label: 'Task name: ', placeholder: 'type here', validation: { isRequired: true } },
        { name: 'user', type: 'text', label: 'User name: ', placeholder: 'type here', validation: { isRequired: true } }
    ]

    const exampleTasks = [
        { name: 'Task1', column: 2, user: 'Krzyś', error: '' },
        { name: 'Task2', column: 2, user: 'Krzyś', error: '' },
        { name: 'Task3', column: 3, user: 'Krzyś', error: '' },
        { name: 'Task4', column: 3, user: 'Krzyś', error: '' },
        { name: 'Task5', column: 3, user: 'Krzyś', error: '' },
        { name: 'Task6', column: 4, user: 'Krzyś', error: '' }
    ]

    const init = createInitTasks()

    function createInitTasks() {
        const initTasks = []
        // eslint-disable-next-line array-callback-return
        exampleTasks.map(task => {
            const newTask = { ...task, id: initTasks.length }
            initTasks[initTasks.length] = newTask
        })
        return initTasks
    }

    function updateTasks(newTasks) {
        localStorage.setItem('tasks', JSON.stringify(newTasks))
    }

    function reducer(state, action) {
        switch (action.type) {
            case 'delete': {
                const filteredState = state.filter((task) => task.id !== action.id)
                const newState = filteredState.map(task => {
                    const newTask = { ...task, error: '' }
                    return task = newTask
                })
                updateTasks(newState)
                return (state = newState)
            }
            case 'left': {
                const colElements = state.filter(task => task.column === action.column - 1)
                if (colElements.length >= structure[action.column - 2].limit) {
                    const newState = state.map(el => {
                        if (el.id === action.id) {
                            const newEl = { ...el, error: `Cannot move ${el.name}, tasks limit exceeded` }
                            return el = newEl
                        }
                        return el
                    })
                    updateTasks(newState)
                    return state = newState
                }
                const newState = state.map((task) => {
                    const newTask = { ...task, error: '' }
                    if (task.id === action.id) {
                        const newTask = { ...task, column: action.column - 1, error: '' }
                        return task = newTask
                    }
                    return task = newTask
                })
                updateTasks(newState)
                return (state = newState)
            }
            case 'right': {
                const colElements = state.filter(e => e.column === action.column + 1)
                if (colElements.length >= structure[action.column].limit) {
                    const newState = state.map(el => {
                        if (el.id === action.id) {
                            el.error = `Cannot move ${el.name}, tasks limit exceeded`
                            return el
                        }
                        return el
                    })
                    updateTasks(newState)
                    return state = newState
                }
                const newState = state.map((task) => {
                    const newTask = { ...task, error: '' }
                    if (task.id === action.id) {
                        const newTask = { ...task, column: action.column + 1, error: '' }
                        return task = newTask
                    }
                    return task = newTask
                })
                updateTasks(newState)

                return (state = newState)
            }
            case 'add': {
                console.log(action.newTask)
                if (action.task.id === state.length) {
                    const newState = [...state, action.task]
                    updateTasks(newState)
                    return state = newState
                }
                return state
            }
            default: return state
        }

    }

    const [state, dispatchTasks] = React.useReducer(reducer, init)

    const [formErrors, setFormErrors] = React.useState([])

    const initFields = {}

    fields.forEach(field => {
        initFields[field.name] = ''
    })

    const formReducer = function (data, action) {
        switch (action.type) {
            case 'change': {
                return { ...data, [action.key]: action.value }
            }
            default: return data
        }
    }

    const [data, dispatchForm] = React.useReducer(formReducer, initFields)

    function renderTableBody(e) {
        return (
            <td key={`tableBody${e.id}`} className={'table-body--element td'}>
                {state.map((task) => {
                    if (e.id === task.column) {
                        return (
                            <div key={`table-body-item-${task.id}`} className="table-body--item">
                                <div>
                                    Task name: {task.name}
                                </div>
                                <div className={'table-body--item__user'}>
                                    user: {task.user}
                                </div>
                                <div>
                                    <button
                                        onClick={e => dispatchTasks({ type: 'left', id: task.id, column: task.column })}
                                        className={'task__button'}
                                        disabled={task.column === 1}>
                                        {'<'}
                                    </button>

                                    <button onClick={e => dispatchTasks({ type: 'delete', id: task.id })} className={'task__button'}> delete </button>
                                    <button onClick={e => dispatchTasks({ type: 'right', id: task.id, column: task.column })} className={'task__button'} disabled={task.column === structure.length}> {'>'} </button>
                                </div>
                            </div>
                        )
                    }
                    return null
                })}
            </td >
        )
    }

    function renderTasksErrors() {
        const errors = state.filter(task => task.error !== '')
        if (errors.length > 0) {
            return (
                <div className={'errors__div'}>
                    <ul>
                        {errors.map(el => { return <li key={`error${el.id}`}>{el.error}</li> })}
                    </ul>
                </div >
            )
        }
    }

    function renderForm() {
        return (
            <div className={'form-section__container'}>
                <div className={'form-section-items__container'}>
                    <div className={'form-title__container'}>
                        <h2>Add new task</h2>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className={'form-items__container'}>
                            <div className={'form-inputs__container'}>
                                {renderFields()}
                                <input className={'form-input-submit'} type={'submit'} value={'Send'} />
                            </div>
                        </div>
                    </form>
                    <div>
                        {renderFormErrors()}
                    </div>
                </div>
            </div >

        )
    }

    function renderFormErrors() {
        return formErrors.length > 0 ? <ul>{formErrors.map((error, index) => <li key={index} className={'errors__div'}>{error}</li>)}</ul> : null
    }

    function renderFields() {
        return fields.map(field => {
            return (
                <label key={`input${field.name}`} htmlFor={field.name}>{field.label}
                    <input
                        onChange={e => dispatchForm({ type: 'change', key: field.name, value: e.target.value })}
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        value={data[field.name]}
                    />
                </label>
            )
        })
    }

    function addNewTask() {
        const newTask = { name: data.name, user: data.user, column: 1, error: '', id: state.length }
        dispatchTasks({ type: 'add', task: newTask })
        return state
    }

    function handleSubmit(e) {
        e.preventDefault()
        setFormErrors(validateForm(structure, state, fields, data))
        if (validateForm(structure, state, fields, data).length === 0) {

            addNewTask()
            localStorage.setItem("tasks", JSON.stringify(addNewTask()))
        }
        return formErrors
    }

    return (
        <>
            <div className={'table__container'}>
                <table className={'table'}>
                    <caption><h1>Kaban System</h1></caption>
                    <thead>
                        <Columns />
                    </thead>
                    <tbody>
                        <tr className={'tr'}>
                            {structure.map((element) => {
                                return renderTableBody(element)
                            })}
                        </tr>
                    </tbody>
                </table>
                {renderTasksErrors()}
            </div>
            {renderForm()}
        </>
    )
}



export default Board