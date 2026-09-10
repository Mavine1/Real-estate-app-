const express = require("express");
const cors = require("cors");

const { pool } = require("./db");

const app = express();
const port = Number(process.env.PORT || 4000);
const host = process.env.HOST || "0.0.0.0";

app.use(cors());
app.use(express.json());

const propertyColumns = `
  p.id::text AS "$id",
  p.created_at AS "$createdAt",
  p.updated_at AS "$updatedAt",
  p.name,
  p.type,
  p.description,
  p.address,
  p.geolocation,
  p.price::float8 AS price,
  p.area,
  p.bedrooms,
  p.bathrooms,
  p.rating::float8 AS rating,
  p.facilities,
  p.image
`;

async function getPropertyDetails(property) {
  const [agentResult, reviewsResult, galleryResult] = await Promise.all([
    pool.query(
      `SELECT id::text AS "$id", name, email, avatar
       FROM agents WHERE id = $1`,
      [property.agentId]
    ),
    pool.query(
      `SELECT id::text AS "$id", created_at AS "$createdAt",
              name, avatar, review, rating
       FROM reviews WHERE property_id = $1 ORDER BY created_at DESC`,
      [property.$id]
    ),
    pool.query(
      `SELECT g.id::text AS "$id", g.image
       FROM galleries g
       JOIN property_galleries pg ON pg.gallery_id = g.id
       WHERE pg.property_id = $1 ORDER BY g.id`,
      [property.$id]
    ),
  ]);

  const { agentId, ...result } = property;
  return {
    ...result,
    agent: agentResult.rows[0] ?? null,
    reviews: reviewsResult.rows,
    gallery: galleryResult.rows,
  };
}

app.get("/health", async (_request, response, next) => {
  try {
    const result = await pool.query("SELECT current_database() AS database");
    response.json({ status: "ok", database: result.rows[0].database });
  } catch (error) {
    next(error);
  }
});

app.get("/api/properties/latest", async (_request, response, next) => {
  try {
    const result = await pool.query(
      `SELECT ${propertyColumns}, p.agent_id AS "agentId"
       FROM properties p ORDER BY p.created_at ASC LIMIT 5`
    );
    response.json(result.rows);
  } catch (error) {
    next(error);
  }
});

app.get("/api/properties", async (request, response, next) => {
  try {
    const filter = String(request.query.filter || "");
    const search = String(request.query.query || "");
    const parsedLimit = Number(request.query.limit || 100);
    const limit = Number.isFinite(parsedLimit)
      ? Math.min(Math.max(parsedLimit, 1), 100)
      : 100;

    const result = await pool.query(
      `SELECT ${propertyColumns}, p.agent_id AS "agentId"
       FROM properties p
       WHERE ($1 = '' OR $1 = 'All' OR p.type = $1)
         AND ($2 = '' OR p.name ILIKE '%' || $2 || '%'
              OR p.address ILIKE '%' || $2 || '%'
              OR p.type ILIKE '%' || $2 || '%')
       ORDER BY p.created_at DESC
       LIMIT $3`,
      [filter, search, limit]
    );
    response.json(result.rows);
  } catch (error) {
    next(error);
  }
});

app.get("/api/properties/:id", async (request, response, next) => {
  try {
    const result = await pool.query(
      `SELECT ${propertyColumns}, p.agent_id AS "agentId"
       FROM properties p WHERE p.id = $1`,
      [request.params.id]
    );

    if (!result.rows[0]) {
      return response.status(404).json({ error: "Property not found" });
    }

    response.json(await getPropertyDetails(result.rows[0]));
  } catch (error) {
    next(error);
  }
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ error: "Internal server error" });
});

const server = app.listen(port, host, () => {
  console.log(`PostgreSQL API listening on http://${host}:${port}`);
});

async function shutdown() {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
