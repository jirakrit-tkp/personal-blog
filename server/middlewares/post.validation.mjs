export const validateCreatePostData = (req, res, next) => {
    const { title, image, genre_ids, description, content, status_id, author_id } = req.body;

    // Validate required fields
    const missingFields = [];
    const typeErrors = [];
    
    // Check for missing fields
    if (!title || title.trim() === '') missingFields.push('title');
    if (!image || image.trim() === '') missingFields.push('image');
    if (!genre_ids || !Array.isArray(genre_ids) || genre_ids.length === 0) missingFields.push('genre_ids');
    if (!description || description.trim() === '') missingFields.push('description');
    if (!content || content.trim() === '') missingFields.push('content');
    if (!status_id) missingFields.push('status_id');
    if (!author_id) missingFields.push('author_id');
    
    // Check data types
    if (title && typeof title !== 'string') typeErrors.push('Title must be a string');
    if (image && typeof image !== 'string') typeErrors.push('Image must be a string');
    if (genre_ids && !Array.isArray(genre_ids)) typeErrors.push('Genre IDs must be an array');
    if (description && typeof description !== 'string') typeErrors.push('Description must be a string');
    if (content && typeof content !== 'string') typeErrors.push('Content must be a string');
    if (status_id && typeof status_id !== 'number') typeErrors.push('Status ID must be a number');
    if (author_id && typeof author_id !== 'string') typeErrors.push('Author ID must be a string');
    
    // Return 400 error if any required fields are missing
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Server could not create post because there are missing data from client",
        missingFields: missingFields,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    // Return 400 error if data types are incorrect
    if (typeErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Server could not create post because data types are incorrect",
        typeErrors: typeErrors,
        message: typeErrors.join(', ')
      });
    }
    
    next();
}

export const validateUpdatePostData = (req, res, next) => {
    const { title, image, category_id, description, content, status_id } = req.body;

    // Check data types for provided fields
    const typeErrors = [];
    
    if (title !== undefined && typeof title !== 'string') typeErrors.push('Title must be a string');
    if (image !== undefined && typeof image !== 'string') typeErrors.push('Image must be a string');
    if (category_id !== undefined && typeof category_id !== 'number') typeErrors.push('Category ID must be a number');
    if (description !== undefined && typeof description !== 'string') typeErrors.push('Description must be a string');
    if (content !== undefined && typeof content !== 'string') typeErrors.push('Content must be a string');
    if (status_id !== undefined && typeof status_id !== 'number') typeErrors.push('Status ID must be a number');
    
    // Return 400 error if data types are incorrect
    if (typeErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Server could not update post because data types are incorrect",
        typeErrors: typeErrors,
        message: typeErrors.join(', ')
      });
    }
    
    next();
}

export const validatePostId = (req, res, next) => {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({
            success: false,
            error: "Invalid post ID"
        });
    }
    next();
}