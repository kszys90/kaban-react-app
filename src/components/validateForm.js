
const ValidateForm = function (structure, state, fields, data) {
    const formErrors = []
    const colElements = state.filter(task => task.column === 1)
    if (colElements.length >= structure[0].limit) {
        const error = 'Cannot add new task. Tasks limit exceeded'
        formErrors.push(error)
    }
    fields.forEach(element => {
        const value = data[element.name]
        if (element.validation.isRequired && value === '') {
            const error = `Field '${element.label}' is required`
            formErrors.push(error)
        }
        return formErrors
    })
    return formErrors
}

export default ValidateForm