import fetch from "node-fetch";

class HTTPResponseError extends Error {
  constructor(response, ...args) {
    super(
      `HTTP Error Response: ${response.status} ${response.statusText}`,
      ...args
    );
    this.response = response;
  }
}

const checkStatus = (response) => {
  if (response.ok) {
    // response.status >= 200 && response.status < 300
    return response;
  } else {
    throw new HTTPResponseError(response);
  }
};

export class DigitalHumani {
  constructor({ apiKey, environment, enterpriseId }) {
    // Validate apiKey, environment inputs
    if (!apiKey || apiKey === "") {
      throw Error("apiKey parameter required");
    }
    if (
      !environment ||
      !["production", "sandbox", "local"].includes(environment)
    ) {
      throw Error(
        `environment parameter required and must be one of 'production','sandbox'`
      );
    }

    // Set inputs
    this.apiKey = apiKey;
    this.environment = environment;
    this.enterpriseId = enterpriseId;

    // Set API base url based on environment
    switch (this.environment) {
      case "production":
        this.baseUrl = "https://api.digitalhumani.com";
        break;
      case "sandbox":
        this.baseUrl = "https://api.sandbox.digitalhumani.com";
        break;
      case "local":
        this.baseUrl = "http://localhost:3000";
        break;
    }

    this.headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "DigitalHumani Node SDK",
      "X-API-KEY": this.apiKey,
    };
  }

  // Get enterprise by ID
  enterprise(enterpriseId = this.enterpriseId) {
    if (typeof enterpriseId !== "string" && !enterpriseId) {
      throw new Error(`No enterpriseId provided`);
    }

    return this.request("GET", `${this.baseUrl}/enterprise/${enterpriseId}`);
  }

  // Get list of all projects
  projects() {
    return this.request("GET", `${this.baseUrl}/project`);
  }

  // Get project by ID
  project(projectId) {
    if (typeof projectId !== "string" && !projectId) {
      throw new Error(`No projectId provided`);
    }

    return this.request("GET", `${this.baseUrl}/project/${projectId}`);
  }

  // Plant tree
  plantTree(projectId, user, treeCount = 1, enterpriseId = this.enterpriseId) {
    if (typeof enterpriseId !== "string" && !enterpriseId) {
      throw new Error(`No enterpriseId provided`);
    }
    if (typeof projectId !== "string" && !projectId) {
      throw new Error(`No enterpriseId provided`);
    }
    const body = {
      enterpriseId,
      projectId,
      user,
      treeCount,
    };
    return this.request("POST", `${this.baseUrl}/tree`, body);
  }

  // Get tree by UUID
  tree(uuid) {
    if (typeof uuid !== "string" && !uuid) {
      throw new Error(`No uuid provided`);
    }
    return this.request("GET", `${this.baseUrl}/tree/${uuid}`);
  }

  // Get tree count for enterprise - for date range, month, or user

  // Send request using node-fetch
  async request(method, url, body) {
    const reqOptions = {
      method,
      headers: this.headers,
      body: JSON.stringify(body),
    };
    const response = await fetch(url, reqOptions);

    try {
      checkStatus(response);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      const errorBody = await error.response.text();
      console.error(`Error body: ${errorBody}`);
      throw error;
    }
  }
}
