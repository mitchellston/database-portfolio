import { z } from "zod";

import { createTRPCRouter } from "../../trpc";
import { columnsRouter } from "./columns";
import { tablesRouter } from "./tables";
import { usersRouter } from "./users";
export const portfolioRouters = createTRPCRouter({
  tables: tablesRouter,
  users: usersRouter,
  columns: columnsRouter,
});
