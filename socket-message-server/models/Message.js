import prismadb from '../config/database';

let messageModel;

async function createMessagePrismaModel() {
    messageModel = prismadb.message;
}

createMessagePrismaModel().then(async () => {
  await prismadb.$disconnect()
})
.catch(async (e) => {
  console.error(e)
  await prismadb.$disconnect()
  process.exit(1)
});

export default messageModel;