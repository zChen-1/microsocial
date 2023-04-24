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
        } catch (error) {
            console.error(error);
        }
    });

    const handleFileChange = (event) => {
        console.log(event.target.result)
        image = event.target.files[0]
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if(title && description) {
            console.log(title, tags, image, description)
            const reader = new FileReader()
            if(image) {
                reader.readAsDataURL(image)
            }
            // axios.post(`${CONTENT_API}/content/post`, {

            // })
        }
    };

</script>
<div class="container">
    <div class="grid-container">
        {#if $user}
            <div class="post-container">
                <h3>Post a post</h3>
                <form on:submit={handleSubmit}>
                    <input type="text" placeholder="Title" class="title-input" bind:value={title}/>
                    <textarea type="text" placeholder="What's on your mind?" bind:value={description}/>
                    <input type="text" placeholder="Space between tags" class="tags-input" bind:value={tags}/>
                    <div class="submit-container">
                        <input type="file" id="fileinput" class="file-input" accept=".jpg, .jpeg, .heic, .heif, .png" on:change={handleFileChange}/>
                        <label for="fileinput">
                            <p class="custom-file">Image</p>
                        </label>
                        {#if title && description}
                            <button class="submit-button" type="submit">Post</button>
                        {/if}
                    </div>
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
    h3 {
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

    .file-input {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
    }

    form {
        display: flex;
        flex-direction: column;
    }   

    .tags-input {
        width: auto;
        padding: 10px;
        font-size: 18px;
        border-radius: 5px;
        border-width: thin;
        border-color: gray;
        margin-top: 15px;        
    }

    .custom-file {
        margin-top: 15px;
        background-color: #007bff;
        color: #fff;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
    }

    .custom-file:hover {
        background-color: #0062cc;
    }
    
    .submit-container {
        display: flex;
        justify-content: space-between;
    }

    .submit-button {
        margin-top: 15px;
        background-color: #3908e9;
        color: #ffffff;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        height: 40px;
    }

    .submit-button:hover {
        background-color: #500af3;
    }
</style>