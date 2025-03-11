import { promises as fs } from "fs";
import { join, extname } from "path";
import pool from "../../db";

export default defineEventHandler(async (event) => {
  try {
    const session = await getUserSession(event);
    if (!session?.user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Utilisateur non authentifié",
      });
    }

    const formData = await readMultipartFormData(event);
    if (!formData) {
      return { success: false, error: "Aucun fichier reçu." };
    }

    const file = formData.find((field) => field.name === "file");
    if (!file || !file.filename) {
      return { success: false, error: "Fichier non trouvé dans la requête." };
    }

    const uploadDir = join(process.cwd(), "public/uploads/profiles");
    await fs.mkdir(uploadDir, { recursive: true });

    const sanitizedFirstName = session.user.first_name
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "");
    const sanitizedLastName = session.user.last_name
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "");
    const fileExtension = extname(file.filename).toLowerCase();
    const fileName = `${sanitizedLastName}_${sanitizedFirstName}_pp${fileExtension}`;
    const filePath = `/uploads/profiles/${fileName}`;
    const fullFilePath = join(uploadDir, fileName);

    await fs.writeFile(fullFilePath, file.data);

    await pool.query(
      "UPDATE users SET profile_picture = $1 WHERE id = $2 RETURNING profile_picture",
      [filePath, session.user.id],
    );

    return { success: true, fileName, filePath };
  } catch {
    return {
      success: false,
      error: "Erreur lors de l'enregistrement du fichier.",
    };
  }
});
