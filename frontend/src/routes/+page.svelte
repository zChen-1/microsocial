<script>
// @ts-nocheck
    import axios from 'axios';
    import { onMount } from 'svelte';
    import { CONTENT_API } from '../utils/api'
    import { user } from '../store'; 
    import moment from 'moment'
    import Icon from '@iconify/svelte';
    import trashBold from '@iconify/icons-ph/trash-bold';
    import commentRounded from '@iconify/icons-material-symbols/comment-rounded';    
    import likeOutline from '@iconify/icons-mdi/like-outline';
    import likeIcon from '@iconify/icons-mdi/like';
    import { data } from '../store';

    // Post
    let title = ""
    let tags = ""
    let image = null
    let description = ""
    let imgBase64 = ""
    let noOfPages = 1
    let pageNumber = 1

    onMount(async () => {
        try {
            const postResponse = await axios.get(`${CONTENT_API}/posts?page=${pageNumber}`);
            const posts = postResponse.data.result
            noOfPages = postResponse.data.noOfPages
            const postsData = []
            for(let post of posts) {
                const likeRes = await axios.get(`${CONTENT_API}/likes/post/${post.id}`)
                const likesArray = likeRes.data.result.map(like => like.username)
                const commentRes = await axios.get(`${CONTENT_API}/comments/post/${post.id}`)
                postsData.push({...post, likes: likesArray, comments: commentRes.data.result})
            }
            data.set(postsData)              
            console.log($data, noOfPages)
        } catch (error) {
            console.error(error);
        }
    });

    const handleFileChange = (event) => {
        console.log(event.target.files[0])
        image = event.target.files[0]
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if(title && description && tags) {
            if(image) {
                const reader = new FileReader()
                reader.readAsDataURL(image)
                reader.onload = async () => {
                    imgBase64 = reader.result
                    console.log(title, tags, imgBase64, description)
                    let res = await axios.post(`${CONTENT_API}/posts`, {
                        username: $user.name,
                        title: title,
                        tags: tags,
                        image: imgBase64,
                        description: description
                    })
                    const newPost = {...res.data.data, comments: [], likes: []}
                    data.update(prev => [newPost, ...prev])
                }
            } else {
                let res = await axios.post(`${CONTENT_API}/posts`, {
                    username: $user.name,
                    title: title,
                    tags: tags,
                    image: imgBase64,
                    description: description
                })
                const newPost = {...res.data.data, comments: [], likes: []}
                data.update(prev => [newPost, ...prev])
            }
            title = ""
            tags = ""
            image = null
            description = ""
            imgBase64 = ""
        }
    };

    const handleDelete = (post_id) => {
        // delete
        try {
            axios.delete(`${CONTENT_API}/posts/${post_id}`)
        } catch (error) {
            console.log(error)
        }
        data.update(prev => prev.filter((post) => post.id !== post_id)) 

    }

    const handleLike = (post_id, i, like) => {
        // console.log($data)
        try {
            axios.post(`${CONTENT_API}/likes/post`, {
                post_id: post_id,
                username: $user.name
            })
            if(like) {
                data.update(prev => {
                    prev[i].likes.push($user.name)
                    console.log(prev)
                    return [...prev]
                })
            } else {
                data.update(prev => { 
                    prev[i].likes = prev[i].likes.filter(username => username !== $user.name)
                    console.log(prev)
                    return [...prev]
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
</script>
<div class="container">
    <div class="grid-container">
        {#if $user}
            <div class="post-container">
                <h3 style="text-align: center;">Post a post</h3>
                <form on:submit={handleSubmit}>
                    <input type="text" placeholder="Title" class="title-input" bind:value={title}/>
                    <textarea type="text" placeholder="What's on your mind?" bind:value={description}/>
                    <input type="text" placeholder="Space between tags" class="tags-input" bind:value={tags}/>
                    <div class="submit-container">
                        <input type="file" id="fileinput" class="file-input" accept=".jpg, .jpeg, .heic, .heif, .png" on:change={handleFileChange}/>
                        <label for="fileinput">
                            <p class="custom-file">Image</p>
                        </label>
                        {#if title && description && tags}
                            <button class="submit-button" type="submit">Post</button>
                        {/if}
                    </div>
                </form>
            </div>
        {/if}
        {#each $data as post, i}
            <div class="post-container">
                <div style="display: flex; justify-content: space-between">
                    <div style="display: flex; gap: 15px;">
                        <p><b>{post.username}</b></p>
                        <p class="date">{moment(post.date).fromNow()}</p>
                    </div>
                    {#if post.username == $user.name}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div on:click={() => handleDelete(post.id)}>
                        <Icon icon={trashBold} color="red" style="margin-top: 10px; cursor: pointer;"/>
                    </div>
                    {/if}
                </div>
                <h3><b>{post.title}</b></h3>
                <p>{post.description}</p>
                <img src={post.image} alt=""/>
                <div style="display: flex; gap: 20px">
                    <div style="display: flex; gap: 10px">      
                        <p class="likes-comments">{post.likes?.length || 0}</p>
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        {#if !post.likes.includes($user.name)}
                            <div on:click={() => handleLike(post.id, i, true)}>
                                <Icon icon={likeOutline} color="#007bff" style="cursor: pointer; margin-top: 12px" height=20/>
                            </div>
                            {:else}
                            <div on:click={() => handleLike(post.id, i, false)}>
                                <Icon icon={likeIcon} color="#007bff" style="cursor: pointer; margin-top: 12px" height=20/>
                            </div>
                            {/if}
                        </div>
                        <div style="display: flex; gap: 10px">      
                            <p class="likes-comments">{post.comments?.length || 0}</p>
                                <Icon icon={commentRounded} color="#007bff" style="cursor: pointer; margin-top: 14px" height=20/>
                        </div>
                    </div>
            </div>
        {/each}
    </div>
</div>

<style>
    .likes-comments {
        font-family: 'Open Sans', sans-serif;
        color: gray;
    }

    img {
        height: auto;
        width: 100%;
        object-fit: contain;         
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

    .date {
        color: gray;
        font-size: small;
        margin-top: 17px;
    }
</style>