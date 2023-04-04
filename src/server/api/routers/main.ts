import { z } from "zod";
import imageList from "~/../public/imageList.json";
import fs from "fs";
import path from "path";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const mainRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  uploadRequest: publicProcedure
    .input(z.object({ prompt: z.string().min(10), imageUrl: z.string() }))
    .mutation(({ input }) => {
      // do some AI stuff here, probably best get user authentication as well

      const fileName = `edit-request-${new Date().getTime()}.json`;
      const publicFolder = path.join(process.cwd(), "public");
      const filePath = path.join(publicFolder, fileName);

      fs.writeFile(filePath, JSON.stringify(input), (err) => {
        if (err)
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: err.message,
          });
        // log somewhere
        console.log("Data written in json file");
      });

      return {
        message:
          "Request made, maybe wait until we email you, right now it's just in JSON format inside the project's /public folder",
      };
    }),

  getImages: publicProcedure.input(z.object({}).optional()).query(() => {
    // do some pagination if needed
    return imageList;
  }),
});
