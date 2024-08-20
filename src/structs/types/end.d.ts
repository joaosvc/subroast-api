declare namespace NodeJS {
  interface ProcessEnv {
    SERVER_PORT: string;
    OPENAI_API_KEY: string;
    GITHUB_API_KEY: string;
    MYSQL_URL: string;
  }
}
