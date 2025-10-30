// import { queryOptions } from '@tanstack/react-query'
// import axios from 'redaxios'

// export type User = {
//   id: number
//   name: string
//   email: string
// }

// export const DEPLOY_URL = 'http://localhost:3000'

// export const usersQueryOptions = () =>
//   queryOptions({
//     queryKey: ['users'],
//     queryFn: () =>
//       axios
//         .get<Array<User>>(DEPLOY_URL + '/api/users')
//         .then((r) => r.data)
//         .catch(() => {
//           throw new Error('Failed to fetch users')
//         }),
//   })

// export const userQueryOptions = (id: string) =>
//   queryOptions({
//     queryKey: ['users', id],
//     queryFn: () =>
//       axios
//         .get<User>(DEPLOY_URL + '/api/users/' + id)
//         .then((r) => r.data)
//         .catch(() => {
//           throw new Error('Failed to fetch user')
//         }),
//   })

import { queryOptions } from '@tanstack/react-query'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import axios from 'redaxios'

export type PostType = {
  id: string
  title: string
  body: string
}

export const fetchPosts = createServerFn({ method: 'GET' }).handler(
  async () => {
    console.info('Fetching posts...')
    return axios
      .get<Array<PostType>>('https://jsonplaceholder.typicode.com/posts')
      .then((r) => r.data.slice(0, 10))
  },
)

export const postsQueryOptions = () =>
  queryOptions({
    queryKey: ['posts'],
    queryFn: () => fetchPosts(),
  })

export const fetchPost = createServerFn({ method: 'GET' })
  .inputValidator((d: string) => d)
  .handler(async ({ data }) => {
    console.info(`Fetching post with id ${data}...`)
    const post = await axios
      .get<PostType>(`https://jsonplaceholder.typicode.com/posts/${data}`)
      .then((r) => r.data)
      .catch((err) => {
        console.error(err)
        if (err.status === 404) {
          throw notFound()
        }
        throw err
      })

    return post
  })

export const postQueryOptions = (postId: string) =>
  queryOptions({
    queryKey: ['post', postId],
    queryFn: () => fetchPost({ data: postId }),
  })