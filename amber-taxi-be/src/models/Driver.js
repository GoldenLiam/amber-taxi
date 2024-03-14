import prismadb from '../../config/database';

let driverModel;

async function createDriverPrismaModel() {
  driverModel = prismadb.driver;
}

createDriverPrismaModel().then(async () => {
  await prismadb.$disconnect()
})
.catch(async (e) => {
  console.error(e)
  await prismadb.$disconnect()
  process.exit(1)
});

export default driverModel;