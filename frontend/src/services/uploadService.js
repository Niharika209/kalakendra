const API_URL = 'http://localhost:5000/api'

/**
 * Upload a single image to Cloudinary
 * @param {File} file - The image file to upload
 * @returns {Promise<{success: boolean, url: string, public_id: string}>}
 */
export const uploadImage = async (file) => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    console.log('Uploading to:', `${API_URL}/upload/image`)
    console.log('File:', file.name, file.type, file.size)

    const response = await fetch(`${API_URL}/upload/image`, {
      method: 'POST',
      body: formData
    })

    console.log('Response status:', response.status)
    const contentType = response.headers.get('content-type')
    console.log('Response content-type:', contentType)

    if (!response.ok) {
      let errorMessage = 'Upload failed'
      try {
        if (contentType?.includes('application/json')) {
          const error = await response.json()
          errorMessage = error.message || error.error || 'Upload failed'
        } else {
          const text = await response.text()
          console.error('Non-JSON response:', text.substring(0, 200))
          errorMessage = 'Server error - check if backend is running on port 5000'
        }
      } catch (e) {
        console.error('Error parsing response:', e)
      }
      throw new Error(errorMessage)
    }

    return await response.json()
  } catch (error) {
    console.error('Upload error:', error)
    throw error
  }
}

/**
 * Upload multiple images to Cloudinary
 * @param {File[]} files - Array of image files to upload
 * @returns {Promise<{success: boolean, files: Array, count: number}>}
 */
export const uploadMultipleImages = async (files) => {
  try {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })

    const response = await fetch(`${API_URL}/upload/multiple`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Upload failed')
    }

    return await response.json()
  } catch (error) {
    console.error('Upload error:', error)
    throw error
  }
}

/**
 * Update artist profile image
 * @param {string} artistId - Artist ID
 * @param {string} imageUrl - Cloudinary image URL
 * @param {string} thumbnailUrl - Optional thumbnail URL
 * @returns {Promise<Object>}
 */
export const updateArtistProfileImage = async (artistId, imageUrl, thumbnailUrl = null) => {
  try {
    const response = await fetch(`${API_URL}/artists/${artistId}/profile-image`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl, thumbnailUrl: thumbnailUrl || imageUrl })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update profile image')
    }

    return await response.json()
  } catch (error) {
    console.error('Update profile image error:', error)
    throw error
  }
}

/**
 * Add media (images/videos) to artist gallery
 * @param {string} artistId - Artist ID
 * @param {Array<{url: string, type: string}>} mediaItems - Array of media objects with url and type
 * @returns {Promise<Object>}
 */
export const addToArtistGallery = async (artistId, mediaItems) => {
  try {
    const response = await fetch(`${API_URL}/artists/${artistId}/gallery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mediaItems })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to add gallery media')
    }

    return await response.json()
  } catch (error) {
    console.error('Add gallery media error:', error)
    throw error
  }
}

/**
 * Remove media from artist gallery
 * @param {string} artistId - Artist ID
 * @param {string} mediaUrl - Cloudinary media URL to remove
 * @returns {Promise<Object>}
 */
export const removeFromArtistGallery = async (artistId, mediaUrl) => {
  try {
    const response = await fetch(`${API_URL}/artists/${artistId}/gallery`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mediaUrl })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to remove gallery media')
    }

    return await response.json()
  } catch (error) {
    console.error('Remove gallery media error:', error)
    throw error
  }
}

/**
 * Update learner profile image
 * @param {string} learnerId - Learner ID
 * @param {string} profileImage - Cloudinary image URL
 * @returns {Promise<Object>}
 */
export const updateLearnerProfileImage = async (learnerId, profileImage) => {
  try {
    const response = await fetch(`${API_URL}/learners/${learnerId}/profile-image`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileImage })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update profile image')
    }

    return await response.json()
  } catch (error) {
    console.error('Update profile image error:', error)
    throw error
  }
}

/**
 * Delete learner profile image
 * @param {string} learnerId - Learner ID
 * @returns {Promise<Object>}
 */
export const deleteLearnerProfileImage = async (learnerId) => {
  try {
    const response = await fetch(`${API_URL}/learners/${learnerId}/profile-image`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete profile image')
    }

    return await response.json()
  } catch (error) {
    console.error('Delete profile image error:', error)
    throw error
  }
}

/**
 * Delete artist profile image
 * @param {string} artistId - Artist ID
 * @returns {Promise<Object>}
 */
export const deleteArtistProfileImage = async (artistId) => {
  try {
    const response = await fetch(`${API_URL}/artists/${artistId}/profile-image`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete profile image')
    }

    return await response.json()
  } catch (error) {
    console.error('Delete profile image error:', error)
    throw error
  }
}

/**
 * Update workshop image
 * @param {string} workshopId - Workshop ID
 * @param {string} imageUrl - Cloudinary image URL
 * @param {string} thumbnailUrl - Optional thumbnail URL
 * @param {string} token - Auth token
 * @returns {Promise<Object>}
 */
export const updateWorkshopImage = async (workshopId, imageUrl, thumbnailUrl = null, token) => {
  try {
    const response = await fetch(`${API_URL}/workshops/${workshopId}/image`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ imageUrl, thumbnailUrl: thumbnailUrl || imageUrl })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update workshop image')
    }

    return await response.json()
  } catch (error) {
    console.error('Update workshop image error:', error)
    throw error
  }
}
