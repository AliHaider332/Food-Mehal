import { driver } from '../Config/Neo4j.js';
import { asyncHandler } from './asyncHandler.js';

export const createOrderRelations = asyncHandler(async ({ userId, itemIds }) => {
  const session = driver.session();

  try {
    await session.run(
      `
      MERGE (u:User {id:$userId})

      WITH u
      UNWIND $itemIds AS itemId

      MATCH (i:Item {id:itemId})
      MERGE (u)-[:BOUGHT]->(i)

      WITH collect(i) AS items

      UNWIND items AS item1
      UNWIND items AS item2

      WITH item1, item2
      WHERE item1.id <> item2.id

      MERGE (item1)-[r:BOUGHT_WITH]->(item2)
      ON CREATE SET r.count = 1
      ON MATCH SET r.count = r.count + 1
      `,
      {
        userId,
        itemIds
      }
    );

  } finally {
    await session.close();
  }
});

export const getRecommendedItems = asyncHandler(async (itemIds) => {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      UNWIND $itemIds AS id

      MATCH (i:Item {id:id})
      -[r:BOUGHT_WITH]-
      (recommended:Item)

      WHERE NOT recommended.id IN $itemIds

      RETURN recommended.id AS id,
             sum(r.count) AS score

      ORDER BY score DESC
      LIMIT 10
      `,
      {
        itemIds
      }
    );

    return result.records.map(record => ({
      id: record.get("id"),
      score: record.get("score").toNumber()
    }));

  } finally {
    await session.close();
  }
});