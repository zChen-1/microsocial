import axios from 'axios';

export const AUTH_API = 'http://localhost:8000';
export const CONTENT_API = 'http://localhost:8001/content';

// @ts-ignore
export const fetchPosts = async (page) => {
	const postResponse = await axios.get(`${CONTENT_API}/posts?page=${page}`);
	const posts = postResponse.data.result;
	// @ts-ignore
	let noOfPages = postResponse.data.noOfPages;
	const postsData = [];
	for (let post of posts) {
		const likeRes = await axios.get(`${CONTENT_API}/likes/post/${post.id}`);
		// @ts-ignore
		const likesArray = likeRes.data.result.map((like) => like.username);
		const commentRes = await axios.get(`${CONTENT_API}/comments/post/${post.id}`);
		postsData.push({ ...post, likes: likesArray, comments: commentRes.data.result });
	}
	return { data: postsData, noOfPages: noOfPages };
};
