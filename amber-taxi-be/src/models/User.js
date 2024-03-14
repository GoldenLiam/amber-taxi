import prismadb from '../../config/database';

let userModel;

async function createUserPrismaModel() {
  userModel = prismadb.user;
}

createUserPrismaModel().then(async () => {
  await prismadb.$disconnect()
})
.catch(async (e) => {
  console.error(e)
  await prismadb.$disconnect()
  process.exit(1)
});

export default userModel;