import prismadb from '../config/database';

let drivershiftModel;

async function createDrivershiftPrismaModel() {
    drivershiftModel = prismadb.drivershift;
}

createDrivershiftPrismaModel().then(async () => {
  await prismadb.$disconnect()
})
.catch(async (e) => {
  console.error(e)
  await prismadb.$disconnect()
  process.exit(1)
});

export default drivershiftModel;