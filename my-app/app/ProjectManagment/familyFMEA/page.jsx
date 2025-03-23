'use client';

import React, { useState } from 'react';
import './familyFMEA.css';

export default function FamilyFmeaHandler() {
  const [blogList, setBlogList] = useState([
    { id: 1, title: 'M52', link: '../../../ffmea' },
    { id: 2, title: 'M76', link: '/blog/post2' },
    { id: 3, title: 'M78', link: '/blog/post3' },
  ]);

  const [selectedBlog, setSelectedBlog] = useState(null); // Track the selected blog post
  const [newBlogTitle, setNewBlogTitle] = useState(''); // Track the new blog post title
  const [isAddingBlog, setIsAddingBlog] = useState(false); // Track if the input field is visible

  const addNewFamilyFMEA = () => {
    if (!newBlogTitle.trim()) {
      alert('Blog post title cannot be empty!');
      return;
    }

    const newId = blogList.length + 1;
    const newBlog = {
      id: newId,
      title: newBlogTitle,
      link: `/blog/post${newId}`,
    };

    // Add the new blog post and sort the list alphabetically
    const updatedBlogList = [...blogList, newBlog].sort((a, b) =>
      a.title.localeCompare(b.title)
    );

    setBlogList(updatedBlogList); // Update the state with the sorted list
    setNewBlogTitle(''); // Clear the input field
    setIsAddingBlog(false); // Hide the input field after adding the blog
  };

  const handleBlogClick = (blog) => {
    setSelectedBlog(blog); // Set the clicked blog as the selected one
  };

  const handleOpenFamilyFMEA = () => {
    if (selectedBlog) {
      window.location.href = selectedBlog.link; // Navigate to the selected blog's link
    } else {
      alert('Please select a blog post first!'); // Alert if no blog is selected
    }
  };

  const handleRemoveBlogPost = () => {
    if (selectedBlog) {
      const updatedBlogList = blogList.filter((blog) => blog.id !== selectedBlog.id);
      setBlogList(updatedBlogList); // Update the blog list without the selected blog
      setSelectedBlog(null); // Clear the selected blog
    } else {
      alert('Please select a blog post to remove!'); // Alert if no blog is selected
    }
  };

  return (
    <div className="family-fmea-container">
      <div className="blog-box">
        <div className="nameplate">Family FMEA</div>
        <div className="blog-list">
          {blogList.map((blog) => (
            <div
              key={blog.id}
              className={`blog-item ${
                selectedBlog?.id === blog.id ? 'selected' : ''
              }`}
              onClick={() => handleBlogClick(blog)}
            >
              {blog.title}
            </div>
          ))}
          {isAddingBlog && (
            <div className="new-blog-item">
              <input
                type="text"
                className="new-blog-input"
                placeholder="Enter new blog title"
                value={newBlogTitle}
                onChange={(e) => setNewBlogTitle(e.target.value)}
              />
              <button className="action-button" onClick={addNewFamilyFMEA}>
                Add
              </button>
            </div>
          )}
        </div>
        <div className="button-container">
          <div className="action-buttons">
            <button
              className="action-button"
              onClick={() => setIsAddingBlog(true)}
            >
              New Family FMEA
            </button>
            <button className="action-button" onClick={handleOpenFamilyFMEA}>
              Open Family FMEA
            </button>
          </div>
          <button className="remove-button" onClick={handleRemoveBlogPost}>
            X
          </button>
        </div>
      </div>
    </div>
  );
}