export default interface ToDoItemModel {
  id: number
  text: string
  isDone: boolean
  deadline: string | null
  createdAt: string
}
