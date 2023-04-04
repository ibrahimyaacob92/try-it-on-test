import { z } from "zod";
import imageList from "~/../public/imageList.json";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const mainRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getImages: publicProcedure.input(z.object({}).optional()).query(() => {
    // do some pagination if needed
    return imageList;
  }),
});
