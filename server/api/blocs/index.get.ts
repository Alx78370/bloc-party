import pool from "../../db";
import type { Bloc } from "../../../types/bloc";

export default defineEventHandler(async (event): Promise<Bloc[]> => {
  try {
    // Récupérer l'utilisateur connecté
    const userSession = await requireUserSession(event);

    const { rows } = await pool.query(
      `
      SELECT 
        b.id,
        b.salle_id,
        b.essai,
        b.type,
        b.couleur,
        b.media,
        b.titre,
        b.description,
        lower(TO_CHAR(b.date_validation, 'FMDD TMMonth YYYY')) AS date_validation,
        TO_CHAR(b.created_at, 'DD/MM/YYYY') AS created_at,
        TO_CHAR(b.updated_at, 'DD/MM/YYYY') AS updated_at,
        s.name AS salle_name
      FROM bloc b
      JOIN salle s ON s.id = b.salle_id
      WHERE b.user_id = $1
      ORDER BY b.date_validation DESC;
      `,
      [userSession.user.id],
    );

    return rows as Bloc[];
  } catch (error) {
    console.error("Erreur lors de la requête à la BDD :", error);
    throw error;
  }
});
