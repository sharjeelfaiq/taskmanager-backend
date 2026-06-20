import createError from "http-errors";

const fetchGitHubProfile = async (username) => {
  const res = await fetch(`https://api.github.com/users/${username}`, {
    headers: { Accept: "application/vnd.github.v3+json" },
  });

  if (res.status === 404) throw createError(404, "GitHub user not found");
  if (!res.ok) throw createError(502, "GitHub API unavailable");

  const data = await res.json();
  return {
    login: data.login,
    name: data.name,
    avatarUrl: data.avatar_url,
    profileUrl: data.html_url,
    publicRepos: data.public_repos,
    followers: data.followers,
    following: data.following,
  };
};

export const githubController = {
  getProfile: async (req, res, next) => {
    try {
      const profile = await fetchGitHubProfile(req.params.username);
      res.json({ success: true, data: profile });
    } catch (err) {
      next(err);
    }
  },
};
