import React, { useEffect, useState } from "react";

const GITHUB_REPO = "payallenka/uiday1"; // Change to your repo

const GitHubRepoWidget = ({ repo = GITHUB_REPO }) => {
  const [commits, setCommits] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const [commitsRes, issuesRes] = await Promise.all([
          fetch(`https://api.github.com/repos/${repo}/commits?per_page=5`),
          fetch(`https://api.github.com/repos/${repo}/issues?per_page=5&state=open`)
        ]);
        const commitsData = await commitsRes.json();
        const issuesData = await issuesRes.json();
        setCommits(Array.isArray(commitsData) ? commitsData : []);
        setIssues(Array.isArray(issuesData) ? issuesData : []);
      } catch (err) {
        setError("Failed to fetch GitHub data");
      }
      setLoading(false);
    }
    fetchData();
  }, [repo]);

  return (
    <div className="bg-neutral-800/80 border border-neutral-700 rounded-2xl p-6 shadow-lg mb-8">
      <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <span role="img" aria-label="github"></span> GitHub Repo Activity
      </h3>
      {loading ? (
        <div className="text-white/80">Loading...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : (
        <>
          <div className="mb-4">
            <h4 className="font-semibold text-white mb-2">Latest Commits</h4>
            <ul className="space-y-2">
              {commits.map((commit) => (
                <li key={commit.sha} className="bg-neutral-900/80 border border-neutral-700 rounded-lg px-4 py-2 text-white/90 text-sm flex flex-col min-h-[48px]">
                  <a href={commit.html_url} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-400 text-black break-all">
                    {commit.commit.message ? commit.commit.message.slice(0, 60) : "No message"}
                  </a>
                  <span className="text-xs text-white/50 mt-1">by {commit.commit.author.name}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">Open Issues</h4>
            <ul className="space-y-2">
              {issues.length === 0 && <li className="text-black text-xs bg-neutral-900/80 border border-neutral-700 rounded-lg px-4 py-2">No open issues</li>}
              {issues.map((issue) => (
                <li key={issue.id} className="bg-neutral-900/80 border border-neutral-700 rounded-lg px-4 py-2 text-white/90 text-sm flex flex-col min-h-[48px]">
                  <a href={issue.html_url} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-400 text-black break-all">
                    {issue.title.slice(0, 60)}
                  </a>
                  <span className="text-xs text-white/50 mt-1">by {issue.user.login}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default GitHubRepoWidget;
