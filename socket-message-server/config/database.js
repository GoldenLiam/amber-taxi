//Singleton

// Mỗi khi có thay đổi database chạy lần lượt 2 lệnh (ở folder project, lưu ý phải ngừng chạy project)
// npx prisma db pull
// npx prisma generate

import { PrismaClient } from '@prisma/client';

let prisma;

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
}

export default prisma;