import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "node:fs";
import { db } from "./database.js";

const typeDefs = readFileSync(
  new URL("./schema.graphql", import.meta.url),
  "utf8",
);

// Implementación ingenua: cada cliente provoca una consulta individual
// para recuperar sus facturas y genera el problema N+1.
const resolvers = {
  Query: {
    clientes: (_parent, _args, context) => context.db.fetchAllClientes(),
  },

  Cliente: {
    facturas: (parent, _args, context) =>
      context.db.fetchFacturasByClienteId(parent.id),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4001 },
  context: async () => ({ db }),
});

console.log(`Servidor N+1 disponible en: ${url}`);
