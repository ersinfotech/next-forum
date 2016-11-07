next-forum
=========================

```
export upsertTopic = async ({
  topic,
  mysql,
}) => {
  return {
    topicId,
    shouldNext,
    commentCount,
    upserted,
  }
}

export insertComment = async ({
  comment,
  mysql,
}) => {
  return {
    inserted,
  }
}
```
