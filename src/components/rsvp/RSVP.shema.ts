import { z } from "zod";

export const RSVPChoiceSchema = z.enum(["solo", "partner", "no"]);

export const NameSchema = z
  .string()
  .min(3, "Аты кемінде 3 таңба болуы керек")
  .max(255, "Аты тым ұзын")
  .nullable();

export const RSVPCreateSchema = z
  .object({
    choice: RSVPChoiceSchema,
    name: NameSchema,
    partner_name: NameSchema,
  })
  .superRefine((data, ctx) => {
    if (data.choice === "no") {
      if (data.name || data.partner_name) {
        ctx.addIssue({
          code: "custom",
          message: "Келе алмайтын болсаңыз, аттар толтырылмауы керек",
          path: ["name"],
        });
      }
    }

    if (data.choice === "solo") {
      if (!data.name) {
        ctx.addIssue({
          code: "custom",
          message: "Сіз келетін болсаңыз, аты-жөніңізді енгізіңіз",
          path: ["name"],
        });
      }
      if (data.partner_name) {
        ctx.addIssue({
          code: "custom",
          message: "Соло қатысу кезінде жұбайдың аты болмауы керек",
          path: ["partner_name"],
        });
      }
    }

    if (data.choice === "partner") {
      if (!data.name) {
        ctx.addIssue({
          code: "custom",
          message: "Сіз келетін болсаңыз, аты-жөніңізді енгізіңіз",
          path: ["name"],
        });
      }
      if (!data.partner_name) {
        ctx.addIssue({
          code: "custom",
          message: "Жұбайдың аты-жөнін енгізіңіз",
          path: ["partner_name"],
        });
      }
    }
  });

export const RSVPInDBSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
  partner_name: z.string().nullable(),
  created_at: z.string(),
  status: z.enum(["accepted_solo", "accepted_duo", "rejected"]),
});

export type RSVPInDB = z.infer<typeof RSVPInDBSchema>;
export type RSVPCreate = z.infer<typeof RSVPCreateSchema>;
export type RSVPChoice = z.infer<typeof RSVPChoiceSchema>;
