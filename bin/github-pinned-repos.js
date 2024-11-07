#!/usr/bin/env node

const { program } = require("commander");
const fs = require("fs-extra");
const path = require("path");

program
  .version("1.0.0")
  .description("Generate a GitHub Pinned Repos component")
  .action(() => {
    const templateDir = path.join(__dirname, "..", "templates");
    const currentDir = process.cwd();

    // Copy GithubPinnedRepos.tsx
    fs.copyFileSync(
      path.join(templateDir, "github-pinned-repos.tsx"),
      path.join(currentDir, "github-pinned-repos.tsx")
    );
    console.log(
      "GithubPinnedRepos.tsx has been created in your current directory."
    );

    // Copy README.md
    fs.copyFileSync(
      path.join(templateDir, "README.md"),
      path.join(currentDir, "README.md")
    );
    console.log("README.md has been created in your current directory.");
  });

program.parse(process.argv);
