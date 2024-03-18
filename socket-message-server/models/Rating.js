import prismadb from '../config/database';

let ratingModel;

async function createRatingPrismaModel() {
  ratingModel = prismadb.rating;
}

createRatingPrismaModel().then(async () => {
  await prismadb.$disconnect()
})
.catch(async (e) => {
  console.error(e)
  await prismadb.$disconnect()
  process.exit(1)
});

export default ratingModel;