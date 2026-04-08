require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.travelDestination.create({ data: { placeName: 'Test', country: 'Test' } })
  .then(console.log)
  .catch(e => {
     require('fs').writeFileSync('err.txt', String(e.message) + '\n' + String(e.stack));
  });
