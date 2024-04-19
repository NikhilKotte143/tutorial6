const express = require('express')
const sqlite3 = require('sqlite3')
const {open} = require('sqlite')
const path = require('path')

const databasePath = path.join(__dirname, 'todoApplication.db')
const format = require('date-fns/format')
const isMatch = require('date-fns/isMatch')
const isValid = require('date-fns/isValid')
const app = express()
app.use(express.json())
let database

const initializeAndServer = async () => {
  try {
    databse = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () =>
      console.log('Server Running at http://localhost:3000/'),
    )
  } catch (error) {
    console.log(`DB Error: ${error.messaage}`)
    process.exit(1)
  }
}
initializeAndServer()

const hasPriorityAndStatusProperties = requestQuery => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  )
}

const hasPriorityProperty = requestQuery => {
  return requestQuery.priority !== undefined
}

const hasStatusProperty = requestQuery => {
  return requestQuery.status !== undefined
}

const hasCategoryyAndStatus = requestQuery => {
  return (
    requestQuery.category !== undefined && requestQuery.status !== undefined
  )
}
const hasCategoryyAndpriority = requestQuery => {
  return (
    requestQuery.category !== undefined && requestQuery.priority !== undefined
  )
}

const hasSearchProperty = requestQuery => {
  return requestQuery.search_q !== undefined
}

const hasCategoryProperty = requestQuery => {
  return requestQuery.category !== undefined
}

const outPutResult = each => {
  return {
    id: each.id,
    todo: each.todo,
    priority: each.priority,
    status: each.status,
    category: each.category,
    dueDate: each.due_date,
  }
}

app.get('/todos/', async (request, response) => {
  let data = null
  const {search_q = '', priority, status, category} = request.query
  let getTodoQuery = ''
  switch (true) {
    case hasPriorityAndStatusProperties(request.query):
      if (priority == 'HIGH' || priority == 'MEDIUM' || priority == 'LOW') {
        if (status == 'TO DO' || status == 'IN PROGRESS' || status == 'DONE') {
          getTodoQuery = `
      SELECT * FROM todo WHERE status='${status}' AND priority='${priority}';`
          data = await databse.all(getTodoQuery)
          response.send(data.map(each => outPutResult(each)))
        } else {
          response.status(400)
          response.send('Invalid Todo Status')
        }
      } else {
        response.status(400)
        response.send('Invalid Todo Priority')
      }
      break

    case hasCategoryyAndStatus(request.query):
      if (category == 'WORK' || category == 'HOME' || category == 'LEARNING') {
        if (status == 'HIGH' || status == 'MEDIUM' || status == 'LOW') {
          getTodoQuery = `
        SELECT * FROM todo WHERE category='${category}' AND status='${status}';`
          data = await databse.all(getTodoQuery)
          response.send(data.map(each => outPutResult(each)))
        } else {
          response.status(400)
          response.send('Invalid Todo Status')
        }
      } else {
        response.status('400')
        response.send('Invaid Todo Category')
      }
      break
    case hasCategoryyAndpriority(request.query):
      if (category == 'WORK' || category == 'HOME' || category == 'LEARNING') {
        if (priority == 'HIGH' || priority == 'MEDIUM' || priority == 'LOW') {
          getTodoQuery = `
        SELECT * FROM todo WHERE category='${category}' AND priority='${priority}';`
          data = await databse.all(getTodoQuery)
          response.status(200)
          response.send(data.map(each => outPutResult(each)))
        } else {
          response.status(400)
          response.send('Invalid Todo Priority')
        }
      } else {
        response.status('400')
        response.send('Invaid Todo Category')
      }
      break

    case hasPriorityProperty(request.query):
      if (priority == 'HIGH' || priority == 'MEDIUM' || priority == 'LOw') {
        getTodoQuery = `
      SELECT * FROM todo WHERE priority='${priority}';`
        data = await databse.all(getTodoQuery)
        response.send(data.map(each => outPutResult(each)))
      } else {
        response.status('400')
        response.send('Invaid Todo priority')
      }
      break

    case hasStatusProperty(request.query):
      if (status == 'HIGH' || status == 'MEDIUM' || status == 'LOW') {
        getTodoQuery = `
        SELECT * FROM todo WHERE status='${status}';`
        data = await databse.all(getTodoQuery)
        response.send(data.map(each => outPutResult(each)))
      } else {
        response.status(400)
        response.send('Invalid Todo Status')
      }
      break

    case hasSearchProperty(request.query):
      getTodoQuery = `
        SELECT * FROM todo WHERE todo LIKE '%${search_q}%';`
      data = await databse.all(getTodoQuery)
      response.send(data.map(each => outPutResult(each)))

      break

    case hasCategoryProperty(request.query):
      if (category == 'WORK' || category == 'HOME' || category == 'LEARNING') {
        getTodoQuery = `
      SELECT * FROM todo WHERE category='${category}'`
        data = await databse.all(getTodoQuery)
        response.send(data.map(each => outPutResult(each)))
      } else {
        response.status(400)
        response.send('Invalid Todo Category')
      }

      break

    default:
      getTodoQuery = `SELECT * FROM todo;`
      data = await database.all(getTodoQuery)
      response.send(data.map(each => outPutResult(each)))
  }
})
module.exports = app
