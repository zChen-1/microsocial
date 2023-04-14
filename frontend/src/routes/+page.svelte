<script>
// @ts-nocheck

    import axios from 'axios';
    import { onMount } from 'svelte';
    import { CONTENT_API } from '../utils/api'

    let data = []

    onMount(async () => {
        try {
            const response = await axios.get(`${CONTENT_API}/posts`);
            data = response.data.result
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    });
</script>

<h1>Microsocial Landing page</h1>
<div class="container">
    {#each data as post, i}
        <div class="post-container">
            <p>ID: {post.id}</p>
            <p>{post.username}</p>
            <p>{post.date}</p>
            <p>{post.description}</p>
            <img src={post.image} alt=""/>
            <p>{post.tags}</p>
        </div>
    {/each}
</div>

<style>
    .post-container {
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
        padding: 15px;  
    }

    .container {
        display: flex;  
        justify-content: center;
        gap: 10px;
    }
    
    h1 {
        text-align: center;
    }
</style>