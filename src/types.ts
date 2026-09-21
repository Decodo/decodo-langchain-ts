export type DecodoBasicAuthConfig = {
  username: string;
  password: string;
  apiKey?: never;
};

export type DecodoApiKeyConfig = {
  apiKey: string;
  username?: never;
  password?: never;
};

export type DecodoConfig = DecodoBasicAuthConfig | DecodoApiKeyConfig;
