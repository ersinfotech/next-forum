export const upsertTopic = async ({
  topic,
  mysql,
}) => {
  const topics = await mysql('forum_topic').where({
    url: topic.url,
  })

  let topicId
  let shouldNext = true
  let commentCount = 0
  let upserted = false

  if (!(topics && topics.length)) {
    [topicId] = await mysql('forum_topic').insert({
      website_name: topic.from,
      area_name: topic.in,
      url: topic.url,
      title: topic.title,
      author: topic.by,
      release_date: topic.date,
      reply: topic.comments,
      hits: topic.hits,
      status: -1,
      create_time: new Date,
      modify_on: new Date,
    })
    upserted = true
  } else {
    topicId = topics[0].row_id
    const storedTopic = topics[0]

    if (topic.hits > storedTopic.hits || topic.comments > storedTopic.reply) {
      await mysql('forum_topic').where({
        url: topic.url,
      }).update({
        reply: topic.comments,
        hits: topic.hits,
        modify_on: new Date,
      })
      upserted = true

      if (topic.comments <= storedTopic.reply) {
        shouldNext = false
      }

      [{commentCount}] = await mysql('forum_comment').where({
        url: topic.url,
      }).count('row_id as commentCount')
    } else {
      shouldNext = false
    }
  }

  return {
    topicId,
    shouldNext,
    commentCount,
    upserted,
  }
}

export const insertComment = async ({
  comment,
  mysql,
}) => {
  let inserted = false

  const comments = await mysql('forum_comment').where({
    url: comment.url,
    position: comment.position,
  })

  if (!(comments && comments.length)) {
    await mysql('forum_comment').insert({
      topic_id: comment.topicId,
      website_name: comment.from,
      area_name: comment.in,
      url: comment.url,
      title: comment.title,
      author: comment.by,
      release_date: comment.date,
      position: comment.position,
      content: comment.content,
      create_time: new Date,
      modify_on: new Date,
    })
    inserted = true
  }

  return {
    inserted,
  }
}
