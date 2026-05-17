export const getTimeAgo = (dateString: Date) => {
  const createdAt = new Date(dateString);
  const now = new Date();

  const diffMs = now.getTime() - createdAt.getTime();

  const minutes = Math.floor(diffMs / 1000 / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) {
    return `${minutes} mins ago`;
  }

  if (hours < 24) {
    return `${hours} hours ago`;
  }

  return `${days} days ago`;
};