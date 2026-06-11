import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { User, UserDetail, sequelize } from '@/lib/models/index.js';

export async function PUT(request) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();

    // 1. Extract text fields
    const nama = formData.get('nama');
    const email = formData.get('email');
    const no_telp = formData.get('no_telp');

    const bank = formData.get('bank');
    const nomor_rekening = formData.get('nomor_rekening');
    const pemilik_rekening = formData.get('pemilik_rekening');
    const nomor_ktp = formData.get('nomor_ktp');
    const nomor_npwp = formData.get('nomor_npwp');
    const provinsi = formData.get('provinsi');
    const kabupaten_kota = formData.get('kabupaten_kota');
    const kecamatan = formData.get('kecamatan');
    const desa_kelurahan = formData.get('desa_kelurahan');
    const alamat_lengkap = formData.get('alamat_lengkap');

    // 2. Handle File Upload if present
    const profilePicFile = formData.get('profile_picture');
    let profilePicUrl = undefined;

    if (profilePicFile && typeof profilePicFile !== 'string') {
      const bytes = await profilePicFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate a unique file name
      const originalName = profilePicFile.name;
      const fileExtension = originalName.split('.').pop();
      const filename = `profile_${userId}_${Date.now()}.${fileExtension}`;
      
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      // Ensure the directory exists
      await fs.mkdir(uploadDir, { recursive: true });

      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, buffer);

      profilePicUrl = `/uploads/${filename}`;
    }

    // 3. Database updates inside a transaction
    const result = await sequelize.transaction(async (t) => {
      // Find User
      const user = await User.findByPk(userId, { transaction: t });
      if (!user) {
        throw new Error('User not found');
      }

      // Update User fields
      const userUpdateData = {};
      if (nama) userUpdateData.nama = nama;
      if (email) userUpdateData.email = email;
      if (no_telp) userUpdateData.no_telp = no_telp;
      if (profilePicUrl !== undefined) userUpdateData.profile_picture = profilePicUrl;

      await user.update(userUpdateData, { transaction: t });

      // Update or Create UserDetail
      const [userDetail, created] = await UserDetail.findOrCreate({
        where: { user_id: userId },
        defaults: {
          bank,
          nomor_rekening,
          pemilik_rekening,
          nomor_ktp,
          nomor_npwp,
          provinsi,
          kabupaten_kota,
          kecamatan,
          desa_kelurahan,
          alamat_lengkap,
        },
        transaction: t,
      });

      if (!created) {
        const detailUpdateData = {};
        if (bank) detailUpdateData.bank = bank;
        if (nomor_rekening) detailUpdateData.nomor_rekening = nomor_rekening;
        if (pemilik_rekening) detailUpdateData.pemilik_rekening = pemilik_rekening;
        if (nomor_ktp) detailUpdateData.nomor_ktp = nomor_ktp;
        if (nomor_npwp !== null) detailUpdateData.nomor_npwp = nomor_npwp;
        if (provinsi) detailUpdateData.provinsi = provinsi;
        if (kabupaten_kota) detailUpdateData.kabupaten_kota = kabupaten_kota;
        if (kecamatan) detailUpdateData.kecamatan = kecamatan;
        if (desa_kelurahan) detailUpdateData.desa_kelurahan = desa_kelurahan;
        if (alamat_lengkap) detailUpdateData.alamat_lengkap = alamat_lengkap;

        await userDetail.update(detailUpdateData, { transaction: t });
      }

      return { user, userDetail };
    });

    return NextResponse.json(
      {
        message: 'Profile updated successfully',
        user: {
          id: result.user.id,
          username: result.user.username,
          nama: result.user.nama,
          email: result.user.email,
          no_telp: result.user.no_telp,
          role: result.user.role,
          profile_picture: result.user.profile_picture,
        },
        userDetail: result.userDetail,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Profile Update Error:', error);
    if (error.message === 'User not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
