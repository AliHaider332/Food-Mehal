import neo4j from 'neo4j-driver';
import { ENV } from '../Services/env.js';

export const driver = neo4j.driver(
  ENV.NEO4J_URI,
  neo4j.auth.basic(ENV.NEO4J_USER, ENV.NEO4J_PASSWORD)
);
