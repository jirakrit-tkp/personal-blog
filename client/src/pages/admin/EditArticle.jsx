import React from 'react';
import { useParams } from 'react-router-dom';
import ArticleForm from '../../components/admin/ArticleForm';

const EditArticle = () => {
  const { id } = useParams();
  
  return <ArticleForm mode="edit" postId={id} />;
};

export default EditArticle;
