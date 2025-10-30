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

import { queryOptions } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import axios from "redaxios";

export type PostType = {
  id: string;
  title: string;
  body: string;
};

export const fetchPosts = createServerFn({ method: "GET" }).handler(
  async () => {
    console.info("Fetching posts...");
    return axios
      .get<Array<PostType>>("https://jsonplaceholder.typicode.com/posts")
      .then((r) => r.data.slice(0, 10));
  }
);

export const postsQueryOptions = () =>
  queryOptions({
    queryKey: ["posts"],
    queryFn: () => fetchPosts(),
  });

export const fetchPost = createServerFn({ method: "GET" })
  .inputValidator((d: string) => d)
  .handler(async ({ data }) => {
    console.info(`Fetching post with id ${data}...`);
    const post = await axios
      .get<PostType>(`https://jsonplaceholder.typicode.com/posts/${data}`)
      .then((r) => r.data)
      .catch((err) => {
        console.error(err);
        if (err.status === 404) {
          throw notFound();
        }
        throw err;
      });

    return post;
  });

export const postQueryOptions = (postId: string) =>
  queryOptions({
    queryKey: ["post", postId],
    queryFn: () => fetchPost({ data: postId }),
  });

  // import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
//   const queryClient = useQueryClient()
// const mutation = useMutation({
//   mutationFn: (newPost) =>
//     fetch('/api/posts', {
//       method: 'POST',
//       body: JSON.stringify(newPost),
//     }),
//   onSuccess: () => {
//     queryClient.invalidateQueries(['posts'])
//   },
// })

//   const { data, isLoading, error } = useQuery({
//     queryKey: ['posts'],
//     queryFn: () => fetch('/api/posts').then(res => res.json())
//   })
// queryClient.prefetchQuery({
//   queryKey: ['post', id],
//   queryFn: () => fetch(`/api/posts/${id}`).then(r => r.json())
// })

// useQuery({
//   queryKey: ['user'],
//   queryFn: fetchUser,
//   staleTime: 1000 * 60 * 5, // 5 min
// })

// useQueries({
//   queries: [
//     { queryKey: ['user'], queryFn: fetchUser },
//     { queryKey: ['projects'], queryFn: fetchProjects },
//   ],
// })

// const user = useQuery({ queryKey: ['user'], queryFn: fetchUser })
// const projects = useQuery({
//   queryKey: ['projects', user.data?.id],
//   queryFn: () => fetchProjects(user.data.id),
//   enabled: !!user.data,
// })

// useQuery({
//   queryKey: ['posts'],
//   queryFn: fetchPosts,
//   select: (data) => data.filter(p => p.published),
// })

// NOTE: instant UI update before API resolves
// useMutation({
//   mutationFn: updatePost,
//   onMutate: async (newPost) => {
//     await queryClient.cancelQueries(['posts'])
//     const previous = queryClient.getQueryData(['posts'])
//     queryClient.setQueryData(['posts'], (old) =>
//       old.map(p => p.id === newPost.id ? { ...p, ...newPost } : p)
//     )
//     return { previous }
//   },
//   onError: (_, __, context) => {
//     queryClient.setQueryData(['posts'], context.previous)
//   },
//   onSettled: () => queryClient.invalidateQueries(['posts']),
// })