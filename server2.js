import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "node:fs";
import { db } from "./database.js";
import { createDataLoaders } from "./dataloaders.js";

const typeDefs = readFileSync(
  new URL("./schema.graphql", import.meta.url),
  "utf8",
);

// Implementación optimizada: DataLoader agrupa las solicitudes de facturas.
const resolvers = {
  Query: {
    clientes: (_parent, _args, context) => context.db.fetchAllClientes(),
  },

  Cliente: {
    facturas: (parent, _args, context) =>
      context.loaders.facturasPorCliente.load(parent.id),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4002 },
  // Se crea un conjunto de loaders por petición para aislar la caché.
  context: async () => ({
    db,
    loaders: createDataLoaders(),
  }),
});

console.log(`Servidor optimizado con DataLoader disponible en: ${url}`);
