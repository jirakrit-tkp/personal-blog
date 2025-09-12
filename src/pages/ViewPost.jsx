import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { NavBar, Footer } from '../components/WebSection.jsx'
import { useSinglePost } from '../hooks/useSinglePost'
import Post from '../components/Post'

function ViewPost() {
  const { id } = useParams();
  const { post, loading } = useSinglePost(id);

  // Scroll to top when component mounts or id changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <>
      <NavBar />
      <Post post={post} loading={loading} />
      <Footer />
    </>
  )
}

export default ViewPost
