import React, { useState, useEffect } from 'react';
import dotenv from 'dotenv';

// Load .env file
dotenv.config();

interface PinnedRepo {
  name: string;
  description: string;
  url: string;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: {
    name: string;
    color: string;
  };
}

interface GithubPinnedReposProps {
  username: string;
  className?: string;
  repoClassName?: string;
}

export default function GithubPinnedRepos({ 
  username, 
  className = "", 
  repoClassName = "" 
}: GithubPinnedReposProps) {
  const [pinnedRepos, setPinnedRepos] = useState<PinnedRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = process.env.GITHUB_TOKEN;

  useEffect(() => {
    const fetchPinnedRepos = async () => {
      if (!token) {
        setError('GitHub token not found in environment variables');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
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
                        stargazerCount
                        forkCount
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
        setError('Failed to fetch pinned repositories');
        setLoading(false);
      }
    };

    fetchPinnedRepos();
  }, [username, token]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {pinnedRepos.map((repo) => (
        <div key={repo.name} className={`border rounded-lg p-4 ${repoClassName}`}>
          <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold hover:underline">
            {repo.name}
          </a>
          <p className="text-sm text-gray-600 mt-2">{repo.description}</p>
          <div className="flex items-center mt-4 text-sm text-gray-700">
            {repo.primaryLanguage && (
              <span className="flex items-center mr-4">
                <span 
                  className="w-3 h-3 rounded-full mr-1" 
                  style={{ backgroundColor: repo.primaryLanguage.color }}
                ></span>
                {repo.primaryLanguage.name}
              </span>
            )}
            <span className="flex items-center mr-4">
              <span className="mr-1">★</span>
              {repo.stargazerCount}
            </span>
            <span className="flex items-center">
              <span className="mr-1">⑂</span>
              {repo.forkCount}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
