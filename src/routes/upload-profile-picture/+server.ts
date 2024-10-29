// /routes/upload-profile-picture/+server.ts
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { error, json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const POST = async ({ request, locals }) => {
    const currentUser = locals.user;
    if (!currentUser) throw error(401, 'Unauthorized');

    const formData = await request.formData();
    const file = formData.get('profilePicture') as File;

    if (!file || file.size > 2 * 1024 * 1024 || !['image/jpeg', 'image/png'].includes(file.type)) {
        throw error(400, 'Invalid file or file too large');
    }

    const fileName = `${currentUser.id}-${uuidv4()}.jpg`;
    const filePath = path.join('static/uploads/profiles', fileName);
    const fileBuffer = await file.arrayBuffer();

    await writeFile(filePath, Buffer.from(fileBuffer));

    const profilePictureUrl = `/uploads/profiles/${fileName}`;

    // Mettre à jour la photo de profil dans la base de données
    await db.update(user)
        .set({ profilePicture: profilePictureUrl })
        .where(eq(user.id, currentUser.id));

    // Mettre à jour locals.user pour refléter le changement immédiatement
    if (locals.user) {
        locals.user.profile_picture = profilePictureUrl;
    }

    return json({ profilePictureUrl });
};
