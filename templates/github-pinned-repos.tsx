import React, { useState, useEffect } from "react";

/*
 * GithubPinnedRepos component
 *
 * This component fetches and displays pinned GitHub repositories for a specific user.
 * It accepts a GitHub username as a prop and optional class names to style the component and its elements.
 *
 * Props:
 * - `username` (string): GitHub username to fetch pinned repositories for.
 * - `className` (string, optional): Class applied to the container.
 * - `repoClassName` (string, optional): Class applied to each repository card.
 * - `titleClassName` (string, optional): Class applied to repository title.
 * - `descriptionClassName` (string, optional): Class applied to repository description.
 *
 * Example usage:
 * <GithubPinnedRepos username="githubUsername" />
 */

interface PinnedRepo {
  name: string;
  description: string;
  url: string;
  homepageUrl?: string; // URL for deployed website if available
  primaryLanguage: {
    name: string;
    color: string;
  };
}

interface GithubPinnedReposProps {
  username: string;
  className?: string;
  repoClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export default function GithubPinnedRepos({
  username,
  className = "",
  repoClassName = "",
  titleClassName = "",
  descriptionClassName = "",
}: GithubPinnedReposProps) {
  const [pinnedRepos, setPinnedRepos] = useState<PinnedRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token =
    import.meta.env.VITE_GITHUB_TOKEN ||
    process.env.NEXT_APP_GITHUB_TOKEN ||
    process.env.REACT_APP_GITHUB_TOKEN;

  useEffect(() => {
    const fetchPinnedRepos = async () => {
      if (!token) {
        setError("GitHub token not found in environment variables");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("https://api.github.com/graphql", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query {
                user(login: "${username}") {
                  pinnedItems(first: 6, types: REPOSITORY) {
                    nodes {
                      ... on Repository {
                        name
                        description
                        url
                        homepageUrl
                        primaryLanguage {
                          name
                          color
                        }
                      }
                    }
                  }
                }
              }
            `,
          }),
        });

        const data = await response.json();
        setPinnedRepos(data.data.user.pinnedItems.nodes);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch pinned repositories");
        setLoading(false);
      }
    };

    fetchPinnedRepos();
  }, [username, token]);

  if (loading) {
    return (
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}
      >
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse bg-gray-200 rounded-lg p-4">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div>
      {/* Pinned Repositories */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}
      >
        {pinnedRepos.map((repo) => (
          <div
            key={repo.name}
            className={`border border-gray-200 rounded-lg p-4 ${repoClassName}`}
          >
            <h3 className={`text-lg font-semibold mb-2 ${titleClassName}`}>
              {repo.name}
            </h3>
            <p className={`text-sm text-gray-600 mb-4 ${descriptionClassName}`}>
              {repo.description}
            </p>
            {repo.primaryLanguage && (
              <span
                className="px-2 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: repo.primaryLanguage.color,
                  color: getContrastColor(repo.primaryLanguage.color),
                }}
              >
                {repo.primaryLanguage.name}
              </span>
            )}

            <div className="mt-4 flex space-x-2">
              {/* GitHub Repo Button */}
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                GitHub Repo
              </a>

              {/* Deployed Website Button (only if homepageUrl is available) */}
              {repo.homepageUrl && (
                <a
                  href={repo.homepageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  Live Site
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper function to determine text color based on background color
function getContrastColor(hexColor: string) {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
}
