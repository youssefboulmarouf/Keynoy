import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database using raw SQL...");

    // Insert Delivery Companies
    await prisma.$executeRawUnsafe(`
    INSERT INTO Company (name, type, location, phone) VALUES
      ('Ozone', 'Livreurs', 'Rabat', ''),
      ('Alta', 'Livreurs', 'Sale', ''),
      ('In Person', 'Livreurs', '', '');
    `);

    // Insert Product Types
    await prisma.$executeRawUnsafe(`
    INSERT INTO ProductType (name) VALUES
      ('Sac Poignet'), ('Sac Ance'), ('Peinture PVC'), ('Peinture Eau'),
      ('Laswa'), ('Cadre'), ('Gelatine'), ('Raclette'), ('Bizagra'),
      ('1050'), ('Cyclo'), ('Calque'), ('Scotche'), ('Decapot');
    `);

    // Insert Products
    await prisma.$executeRawUnsafe(`
    INSERT INTO Product (name, size, productTypeId, color, threshold, totalQuantity)
    VALUES
      ('25/20', '25/20', 1, 'black', 0, 0),
      ('25/20', '25/20', 1, 'white', 0, 0),
      ('29/22', '29/22', 1, 'black', 0, 0),
      ('29/22', '29/22', 1, 'white', 0, 0),
      ('35/25', '35/25', 1, 'black', 0, 0),
      ('35/25', '35/25', 1, 'white', 0, 0),
      ('37/30', '37/30', 1, 'black', 0, 0),
      ('37/30', '37/30', 1, 'white', 0, 0),
      ('50/40', '50/40', 1, 'black', 0, 0),
      ('50/40', '50/40', 1, 'white', 0, 0),
      ('50/50', '50/50', 1, 'black', 0, 0),
      ('50/50', '50/50', 1, 'white', 0, 0),
      ('30/30', '30/30', 2, 'black', 0, 0),
      ('30/30', '30/30', 2, 'white', 0, 0),
      ('39/30', '39/30', 2, 'black', 0, 0),
      ('39/30', '39/30', 2, 'white', 0, 0),
      ('40/40', '40/40', 2, 'black', 0, 0),
      ('40/40', '40/40', 2, 'white', 0, 0),
      ('40/50', '40/50', 2, 'black', 0, 0),
      ('40/50', '40/50', 2, 'white', 0, 0),
      ('50/40', '50/40', 2, 'black', 0, 0),
      ('50/40', '50/40', 2, 'white', 0, 0),
      ('50/50', '50/50', 2, 'black', 0, 0),
      ('50/50', '50/50', 2, 'white', 0, 0),
      ('50/60', '50/60', 2, 'black', 0, 0),
      ('50/60', '50/60', 2, 'white', 0, 0),
      ('Or', '', 3, 'gold', 0, 0),
      ('Black', '', 3, 'black', 0, 0),
      ('Green', '', 3, 'green', 0, 0),
      ('Patte Normale', '', 4, 'transparent', 0, 0),
      ('Patte Couvrante', '', 4, 'white', 0, 0),
      ('Blanc 45', '', 4, 'white', 0, 0),
      ('Couleur', '', 4, 'blue', 0, 0),
      ('Couleur', '', 4, 'red', 0, 0),
      ('Couleur', '', 4, 'black', 0, 0),
      ('Couleur', '', 4, 'yellow', 0, 0),
      ('Laswa 90', '', 5, '', 0, 0),
      ('Laswa 120', '', 5, '', 0, 0),
      ('Cadre 20/30', '20/30', 6, '', 0, 0),
      ('Cadre 30/40', '30/40', 6, '', 0, 0),
      ('Cadre 40/50', '40/50', 6, '', 0, 0),
      ('Cadre L', 'L', 6, '', 0, 0),
      ('Gelatine 1', '', 7, '', 0, 0),
      ('Gelatine Salti', '', 7, '', 0, 0),
      ('Raclette 25', '25', 8, '', 0, 0),
      ('Raclette 30', '30', 8, '', 0, 0),
      ('Bizagra', '', 9, '', 0, 0),
      ('1050', '', 10, '', 0, 0),
      ('Cyclo', '', 11, '', 0, 0),
      ('Calque', '', 12, '', 0, 0),
      ('Scotche', '', 13, '', 0, 0),
      ('Decapot', '', 14, '', 0, 0);
    `);

    console.log("Seeding completed successfully!");
}

main()
    .catch((e) => {
        console.error("Error seeding database:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
