export default interface ToDoItemCreateDto {
  id: number
  text: string
  deadlineDateISOFormat: string | null
}
