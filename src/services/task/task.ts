import type { ListProject } from './listProject'
import { completedSmartProject, trashSmartProject } from './smartProject'

export enum TaskState {
  ACTIVE = 1,
  COMPLETED = 2,
  GIVE_UP = 3,
  REMOVED = 4,
}

export interface Task {
  id: string
  title: string
  state: TaskState
  content: string
  project?: ListProject
  previousProject?: ListProject
}

export function createTask(
  title: string,
  id: string = crypto.randomUUID(),
  content = '',
): Task {
  return {
    id,
    title,
    content,
    state: TaskState.ACTIVE,
  }
}

export function addTask(task: Task, project: ListProject) {
  task.project = project
  task.state = TaskState.ACTIVE
  project.tasks.unshift(task)
}

export function removeTask(task: Task) {
  _removeTaskFromProject(task)
  addTask(task, trashSmartProject)
  task.state = TaskState.REMOVED
}

export function completeTask(task: Task) {
  _removeTaskFromProject(task)
  addTask(task, completedSmartProject)
  task.state = TaskState.COMPLETED
}

export function restoreTask(task: Task) {
  const previousProject = task.previousProject
  _removeTaskFromProject(task)
  if (previousProject)
    addTask(task, previousProject)
}

function _removeTaskFromProject(task: Task) {
  const { project } = task
  if (project) {
    task.previousProject = project
    project.tasks = project.tasks.filter((item) => {
      return task.id !== item.id
    })
  }
}
