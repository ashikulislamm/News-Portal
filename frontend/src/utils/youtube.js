/**
 * Parses a YouTube video URL and returns its embed equivalent.
 * Supports various formats (youtu.be, watch?v=, watch?embed, etc.)
 * @param {string} url - The YouTube video URL
 * @returns {string|null} The embed URL, or null if invalid
 */
export const getYoutubeEmbedUrl = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}`
    : null;
};
