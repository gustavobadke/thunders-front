export default interface ToDoItemUpdateDto {
  id: number
  text: string
  isDone: boolean
  deadlineDateISOFormat: string | null
}
