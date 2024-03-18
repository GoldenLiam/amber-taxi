import prismadb from '../config/database';

let rideModel;

async function createRidePrismaModel() {
  rideModel = prismadb.ride;
}

createRidePrismaModel().then(async () => {
  await prismadb.$disconnect()
})
.catch(async (e) => {
  console.error(e)
  await prismadb.$disconnect()
  process.exit(1)
});

export default rideModel;