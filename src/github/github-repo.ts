import { GitHubProfile, GitHubRepo } from "../models/github-models";

export default class GithubRepo {
  public static async getData(username: string) {
    const headers: any = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "github-roast.pages.dev",
      ...(process.env.GITHUB_API_KEY && {
        Authorization: `token ${process.env.GITHUB_API_KEY}`,
      }),
    };

    const profileResponse: GitHubProfile | null = await this.requestJson(
      `https://api.github.com/users/${username}`,
      headers
    );

    if (!profileResponse) {
      throw new Error("Failed to fetch github profile");
    }

    const reposResponse = await this.requestJson(
      `https://api.github.com/users/${username}/repos?sort=updated`,
      headers
    );

    if (!reposResponse) {
      throw new Error("Failed to fetch github repositories");
    }

    const readmeResponse =
      (await this.requestText(
        `https://raw.githubusercontent.com/${username}/${username}/main/README.md`,
        headers
      )) ||
      (await this.requestText(
        `https://raw.githubusercontent.com/${username}/${username}/master/README.md`,
        headers
      ));

    return {
      name: profileResponse.name,
      bio: profileResponse.bio,
      company: profileResponse.company,
      location: profileResponse.location,
      followers: profileResponse.followers,
      following: profileResponse.following,
      public_repos: profileResponse.public_repos,
      profile_readme: readmeResponse,
      last_15_repositories: (reposResponse as GitHubRepo[])
        .map((repo) => ({
          name: repo.name,
          description: repo.description,
          language: repo.language,
          stargazers_count: repo.stargazers_count,
          open_issues_count: repo.open_issues_count,
          license: repo.license,
          fork: repo.fork,
        }))
        .slice(0, 15),
    };
  }

  private static async requestJson(url: string, headers: any) {
    try {
      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}`);
      }

      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  private static async requestText(url: string, headers: any) {
    try {
      const response = await fetch(url, { headers });

      if (response.ok) {
        return await response.text();
      }
    } catch (error) {
      console.error(error);
    }

    return "";
  }
}
