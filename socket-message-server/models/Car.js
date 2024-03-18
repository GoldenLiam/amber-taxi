import prismadb from '../config/database';

let carModel;

async function createCarPrismaModel() {
    carModel = prismadb.car;
}

createCarPrismaModel().then(async () => {
  await prismadb.$disconnect()
})
.catch(async (e) => {
  console.error(e)
  await prismadb.$disconnect()
  process.exit(1)
});

export default carModel;