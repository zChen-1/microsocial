<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fetchOnePost } from '../../../utils/api.js';
	import Comment from '../../../components/Comment.svelte';

	const id = $page.params.slug;
	let data = {}
    onMount(async () => {
        try {
			const res = await fetchOnePost(id)
			data = res
			console.log(data)
        } catch (error) {
            console.error(error);
        }
    });
</script>

<h1>Post's id: {id}</h1>
<!-- <Comment data="data"/> -->
<style>
</style>
