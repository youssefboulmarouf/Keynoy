import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database using raw SQL...");

    await prisma.$executeRawUnsafe(`
        INSERT INTO Color (name, htmlCode) 
            VALUES
                ('Transparent', 'rgba(0, 0, 0, 0)'),
                ('Noir', '000000'),
                ('Blanc', 'FFFFFF'),
                ('Rouge', 'FF0000'),
                ('Bleu', '0000FF'),
                ('Vert', '008000'),
                ('Jaune', 'FFFF00'),
                ('Orange', 'FFA500'),
                ('Violet', '800080'),
                ('Gris', '808080'),
                ('Rose', 'FFC0CB'),
                ('Marron', 'A52A2A'),
                ('Cyan', '00FFFF'),
                ('Magenta', 'FF00FF'),
                ('Or', 'FFD700');
    `);

    await prisma.$executeRawUnsafe(`
        INSERT INTO Company (name, type, location, phone) 
            VALUES
                ('Ozone', 'Livreurs', 'Rabat', ''),
                ('Alta', 'Livreurs', 'Sale', ''),
                ('Keynoy', 'Livreurs', 'Sale', ''),
                ('Keynoy', 'Clients', 'Sale', ''),
                ('Keynoy', 'Fournisseurs', 'Sale', '');
    `);

    await prisma.$executeRawUnsafe(`
        INSERT INTO ProductType (name, sellable) 
            VALUES
                ('Sac Poignet', true), 
                ('Sac Ance', true), 
                ('Peinture', false), 
                ('Patte', false), 
                ('Laswa', false),
                ('Cadre', false), 
                ('Gelatine', false), 
                ('Raclette', false), 
                ('Bizagra', false), 
                ('1050', false), 
                ('Cyclo', false), 
                ('Calque', false), 
                ('Scotche', false), 
                ('Decapot', false);
    `);

    await prisma.$executeRawUnsafe(`
        INSERT INTO Product (name, size, productTypeId, threshold, totalQuantity)
            VALUES
                ('25/20', '25/20', 1, 0, 0),
                ('29/22', '29/22', 1, 0, 0),
                ('35/25', '35/25', 1, 0, 0),
                ('37/30', '37/30', 1, 0, 0),
                ('50/40', '50/40', 1, 0, 0),
                ('50/50', '50/50', 1, 0, 0),
                ('30/30', '30/30', 2, 0, 0),
                ('39/30', '39/30', 2, 0, 0),
                ('40/40', '40/40', 2, 0, 0),
                ('40/50', '40/50', 2, 0, 0),
                ('50/40', '50/40', 2, 0, 0),
                ('50/50', '50/50', 2, 0, 0),
                ('50/60', '50/60', 2, 0, 0),
                ('Peinture PVC', '', 3, 0, 0),
                ('Peinture Eau', '', 3, 0, 0),
                ('Patte Normale', '', 4, 0, 0),
                ('Patte Couvrante', '', 4, 0, 0),
                ('Laswa 90', '', 4, 0, 0),
                ('Laswa 120', '', 4, 0, 0),
                ('Cadre 20/30', '20/30', 5, 0, 0),
                ('Cadre 30/40', '30/40', 5, 0, 0),
                ('Cadre 40/50', '40/50', 5, 0, 0),
                ('Cadre L', 'L', 5, 0, 0),
                ('Gelatine Normale', '', 6, 0, 0),
                ('Gelatine Salti', '', 6, 0, 0),
                ('Raclette 25', '25', 7, 0, 0),
                ('Raclette 30', '30', 7, 0, 0),
                ('Bizagra', '', 8, 0, 0),
                ('1050', '', 9, 0, 0),
                ('Cyclo', '', 10, 0, 0),
                ('Calque', '', 11, 0, 0),
                ('Scotche', '', 12, 0, 0),
                ('Decapot', '', 13, 0, 0);
    `);

    await prisma.$executeRawUnsafe(`
        INSERT INTO ProductColor (productId, colorId)
            VALUES 
                (1, 2),
                (1, 3),
                (2, 2),
                (2, 3),
                (3, 2),
                (3, 3),
                (4, 2),
                (4, 3),
                (5, 2),
                (5, 3),
                (6, 2),
                (6, 3),
                (7, 2),
                (7, 3),
                (8, 2),
                (8, 3),
                (9, 2),
                (9, 3),
                (10, 2),
                (10, 3),
                (11, 2),
                (11, 3),
                (12, 2),
                (12, 3),
                (13, 2),
                (13, 3),
                (14, 2),
                (14, 6),
                (14, 15),
                (15, 3),
                (15, 4),
                (15, 5),
                (15, 6);
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
