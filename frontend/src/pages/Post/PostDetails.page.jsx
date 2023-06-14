import DOMAIN from "../../services/endpoint";
import axios from "axios";
import { useLoaderData } from "react-router-dom";
import { Button, Paper, TextInput,  Image,  SimpleGrid, Stack, Container, useMantineTheme, px } from "@mantine/core";
import { useNavigation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function PostDetailsPage() {
  console.log('PostDetailsPage rendered');
  const post = useLoaderData();
  const { navigate } = useNavigation();
  const [editMode, setEditMode] = useState(false);
  const [editedPost, setEditedPost] = useState(post);
  
  const handleChange = e => {
    setEditedPost({
      ...editedPost,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.put(`${DOMAIN}/api/posts/${post.id}`, editedPost)
      .then(res => {
        setEditMode(false);
      })
      .catch(err => {
        console.error(err);
      });
  };

  console.log(post);

  if (!post || post.error) {
    return <div>Loading...</div>;
  }

  const authorName = post.userEmail?.split('@')[0];

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  if(editMode) {
  return (
    <Paper padding="md" shadow="xs">
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Title"
          name="title"
          value={editedPost.title}
          onChange={handleChange}
          required
        />
        <TextInput
          label="Category"
          name="category"
          value={editedPost.category}
          onChange={handleChange}
          required
        />
        <TextInput
          label="Content"
          name="content"
          value={editedPost.content}
          onChange={handleChange}
          multiline
          required
        />
        <TextInput
          label="Image URL"
          name="image"
          value={editedPost.image}
          onChange={handleChange}
          required
        />
        <Button type="submit">Update</Button>
      </form>
    </Paper>
  );
}

  return (
    <Container my="md">
      <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'xs', cols: 1 }]}>
        <Stack spacing="md">
          <h2>{authorName}</h2>
          <h3>{post.title}</h3>
          <p>{post.category}</p>
          <p>{post.content}</p>
          {currentUser && post.userId === currentUser.id && 
            <Button type="submit" onClick={() => setEditMode(true)}>Edit</Button>
          }
        </Stack>
        <Image src={post.image} alt={post.title} />
      </SimpleGrid>
    </Container>
  );
  
}

export const postDetailsLoader = async ({ params }) => {
  console.log('postDetailsLoader called with params:', params);
  try {
    const res = await axios.get(`${DOMAIN}/api/posts/${params.id}`);
    console.log(res.data); 
    return res.data;
  } catch (error) {
    console.error('Failed to load post details:', error);
    return { error: true, message: error.message }; 
  }
};

export default PostDetailsPage;
