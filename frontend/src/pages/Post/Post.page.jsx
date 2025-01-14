import DOMAIN from "../../services/endpoint";
import axios from "axios";
import { ArticleCardImage } from "../../components/misc/ArticleCardImage";
import { SimpleGrid, Container } from "@mantine/core";
import { useLoaderData } from "react-router-dom";
import { Loader } from '@mantine/core';


export const PostPage = () => {
  const posts = useLoaderData();

  if (!posts) {
    return <Loader />;
  }
  
  return (
    <Container>
      <SimpleGrid cols={3}>
        {posts.map((post) => (
          <ArticleCardImage key={post.title} {...post} />
        ))}
      </SimpleGrid>
    </Container>
  );
};

export const postsLoader = async () => {
  const res = await axios.get(`${DOMAIN}/api/posts`);
  return res.data;
};
