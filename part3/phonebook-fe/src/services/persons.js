import axios from 'axios'

const baseUrl = 'https://phonebook-still-field-9277.fly.dev/api/persons'

const getAll = () => {
    return axios.get(baseUrl).then(response => response.data)
}

const create = (newObject) => {
    return axios.post(baseUrl, newObject).then(response => response.data)
}

const remove = (id) => {
    return axios.delete(`${baseUrl}/${id}`).then(response => response.data)
}

const update = (changedObject) => {
    return axios.put(`${baseUrl}/${changedObject.id}`, changedObject).then(response => response.data)
}

export default { getAll, create, remove, update }
