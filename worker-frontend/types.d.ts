interface userTask{
    "id": number,
    "title": string,
    "amount": number,
    "options":
      {
        "id": number,
        "image_url": string,
        "task_id": number
      }[]
}