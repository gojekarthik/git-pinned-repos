# Git Pinned Repos

`git-pinned-repos` is a CLI tool and React component generator that helps you easily create and display a GitHub pinned repositories component for your React or Next.js applications. With this tool, you can fetch and display your GitHub pinned repositories using a GitHub token and integrate the component into your project with ease.

## Features

- Fetch pinned repositories for any GitHub user.
- Generate a customizable React component.
- Easy setup for React, Vite, and Next.js projects.
- Uses GraphQL API to fetch repository data.

## Installation

To install the package, run the following command:

```bash
npm install git-pinned-repos

or

yarn add git-pinned-repos

```
can use the CLI tool to generate the component. Once installed, run the below cammand to get the component in your current directory:

```bash

npx create-git-pinned-repos

```
Add the GITHUB_TOKEN to your .env file according to the framework you use

```bash
VITE_GITHUB_TOKEN=your-github-token-here 

or

NEXT_PUBLIC_GITHUB_TOKEN=your-token

or

REACT_APP_GITHUB_TOKEN=your-token

```

Check the component on the instruction on how to use tailwind to beautify your component

