const endpoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

const requiredVariables = {
  EXPO_PUBLIC_APPWRITE_ENDPOINT: endpoint,
  EXPO_PUBLIC_APPWRITE_PROJECT_ID: projectId,
  APPWRITE_API_KEY: apiKey,
};

const missingVariables = Object.entries(requiredVariables)
  .filter(([, value]) => !value)
  .map(([name]) => name);

if (missingVariables.length) {
  console.error(`Missing environment variables: ${missingVariables.join(", ")}`);
  process.exit(1);
}

const seedUsers = [
  {
    userId: "seed-tenant",
    name: "Demo Tenant",
    email: "tenant@barakahomes.test",
    password: "Tenant@123",
    role: "tenant",
  },
  {
    userId: "seed-agent",
    name: "Demo Agent",
    email: "agent@barakahomes.test",
    password: "Agent@123",
    role: "agent",
  },
  {
    userId: "seed-caretaker",
    name: "Demo Caretaker",
    email: "caretaker@barakahomes.test",
    password: "Caretaker@123",
    role: "caretaker",
  },
  {
    userId: "seed-owner",
    name: "Demo Owner",
    email: "owner@barakahomes.test",
    password: "Owner@123",
    role: "owner",
  },
];

const headers = {
  "Content-Type": "application/json",
  "X-Appwrite-Project": projectId,
  "X-Appwrite-Key": apiKey,
};

async function request(path, method, body) {
  const response = await fetch(`${endpoint.replace(/\/$/, "")}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const details = await response.text();
    const error = new Error(`${method} ${path} failed (${response.status}): ${details}`);
    error.status = response.status;
    throw error;
  }

  return response.status === 204 ? null : response.json();
}

async function seedUser(user) {
  let created = false;

  try {
    await request("/users", "POST", {
      userId: user.userId,
      email: user.email,
      password: user.password,
      name: user.name,
    });
    created = true;
  } catch (error) {
    if (error.status !== 409) throw error;

    const userPath = `/users/${encodeURIComponent(user.userId)}`;
    await request(`${userPath}/email`, "PATCH", { email: user.email });
    await request(`${userPath}/password`, "PATCH", { password: user.password });
    await request(`${userPath}/name`, "PATCH", { name: user.name });
  }

  await request(`/users/${encodeURIComponent(user.userId)}/labels`, "PUT", {
    labels: [user.role],
  });
  await request(`/users/${encodeURIComponent(user.userId)}/prefs`, "PATCH", {
    prefs: { provider: "email" },
  });

  console.log(`${created ? "Created" : "Updated"} ${user.role}: ${user.email}`);
}

for (const user of seedUsers) {
  await seedUser(user);
}

console.log("Seeded Tenant, Agent, Caretaker, and Owner accounts successfully.");
