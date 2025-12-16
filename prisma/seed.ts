import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    // 1. Hash the ACTUAL password you want to use
    const hashedPassword = await bcrypt.hash("PeppaBeo1206", 10)

    const user = await prisma.user.upsert({
        where: { email: '22130021@gmail.com' },
        update: {
            // Optional: Update password if the user already exists
            password: hashedPassword
        },
        create: {
            email: '22130021@gmail.com',
            name: 'Bao Bao',
            // 2. Store the HASHED password, not the plain text one
            password: hashedPassword,
        },
    })

    console.log({ user })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })