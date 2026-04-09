import { z } from "zod";
import { RSVPInDBSchema } from "@/components/rsvp/RSVP.shema";

export const PaginatedRSVPSchema = z.object({
  page: z.number(),
  page_size: z.number(),
  total: z.number(),
  contents: z.array(RSVPInDBSchema),
});

export type PaginatedRSVP = z.infer<typeof PaginatedRSVPSchema>;
