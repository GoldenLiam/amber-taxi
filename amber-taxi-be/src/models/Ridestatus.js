import prismadb from '../../config/database';

let ridestatusModel;

async function createRidestatusPrismaModel() {
    ridestatusModel = prismadb.ridestatus;
}

createRidestatusPrismaModel().then(async () => {
  await prismadb.$disconnect()
})
.catch(async (e) => {
  console.error(e)
  await prismadb.$disconnect()
  process.exit(1)
});

export default ridestatusModel;