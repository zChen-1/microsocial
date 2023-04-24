<script>
// @ts-nocheck
    import axios from 'axios';
    import { onMount } from 'svelte';
    import { CONTENT_API } from '../utils/api'
    import { user } from '../store'; 

    let data = []

    // Post
    let title = ""
    let tags = ""
    let image = null
    let description = ""

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
<div class="container">
    <div class="grid-container">
        {#if $user}
            <div class="post-container">
                <h4>Post a post</h4>
                <form>
                    <input type="text" placeholder="Title" class="title-input" bind:value={title}/>
                    <textarea type="text" placeholder="What's on your mind" bind:value={description}/>
                </form>
            </div>
        {/if}
        {#each data as post, i}
            <div class="post-container">
                <p>ID: {post.id}</p>
                <p>{post.username}</p>
                <p>{post.date}</p>
                <p>{post.description}</p>
                <!-- <img src={post.image} alt=""/> -->
                <p>{post.tags}</p>
            </div>
        {/each}
    </div>
</div>

<style>
    h4 {
        text-align: center;
    }

    .container {
        margin: 0 auto;
        max-width: 900px;
        /* margin-top: 30px; */
        padding: 15px;
    }

    .post-container {
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.5);
        padding: 15px;  
        border-radius: 10px;
    }

    .grid-container {
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        gap: 16px;
        justify-content: center;
    }

    .title-input {        
        width: auto;
        padding: 10px;
        font-size: 18px;
        border-radius: 5px;
        border-width: thin;
        border-color: gray;
    }

    textarea {
        font-family: 'Open Sans', sans-serif;
        resize: none;
        margin-top: 15px;
        width: auto;
        padding: 10px;
        font-size: 18px;
        border-radius: 5px;
        border-width: thin;
        border-color: gray;
    }

    form {
        display: flex;
        flex-direction: column;
    }   
    
</style>