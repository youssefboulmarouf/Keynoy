import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database using raw SQL...");

    await prisma.$executeRawUnsafe(`
        INSERT INTO Color 
            (name,          htmlCode)
        VALUES
            ('Transparent', 'rgba(0, 0, 0, 0)'),
            ('Noire',       '000000'),
            ('Blanc',       'FFFFFF'),
            ('Rouge',       'FF0000'),
            ('Bleu',        '0000FF'),
            ('Vert',        '008000'),
            ('Jaune',       'FFFF00'),
            ('Orange',      'FFA500'),
            ('Violet',      '800080'),
            ('Gris',        '808080'),
            ('Rose',        'FFC0CB'),
            ('Marron',      'A52A2A'),
            ('Cyan',        '00FFFF'),
            ('Magenta',     'FF00FF'),
            ('Or',          'FFD700');
    `);

    await prisma.$executeRawUnsafe(`
        INSERT INTO Company 
            (name,          companyType,    location,   phone)
        VALUES
            ('Ozone',       'Livreur',      'Rabat',    '06123'),
            ('Alta',        'Livreur',      'Sale',     '06456'),
            ('Redombale',   'Fournisseur',  'Sale',     '06789'),
            ('Client',      'Client',       'Sale',     '06147');
    `);

    await prisma.$executeRawUnsafe(`
        INSERT INTO ProductType 
            (name,                  isPrintable,    isPaint,    isTool)
        VALUES
            ('Support Impression',  true,           false,      false),
            ('Peinture',            false,          true,       false),
            ('Support Peinture',    true,           true,       false),
            ('Nettoyage',           false,          false,      true),
            ('Outil',               false,          false,      true)
        ;
    `);

    await prisma.$executeRawUnsafe(`
        INSERT INTO Product 
            (name,              isSellable,     isLayer,    productTypeId)
        VALUES
            ('Sac Poignet',     true,           false,      (SELECT id from ProductType WHERE name = 'Support Impression')),
            ('Sac Anse',        true,           false,      (SELECT id from ProductType WHERE name = 'Support Impression')),
            ('Calque',          false,          true,       (SELECT id from ProductType WHERE name = 'Support Impression')),

            ('Peinture PVC',    false,          false,      (SELECT id from ProductType WHERE name = 'Peinture')),
            ('Peinture EAU',    false,          false,      (SELECT id from ProductType WHERE name = 'Peinture')),

            ('Patte',           false,          false,      (SELECT id from ProductType WHERE name = 'Support Peinture')),
            ('Dulio',           false,          false,      (SELECT id from ProductType WHERE name = 'Support Peinture')),

            ('Cyclo',           false,          false,      (SELECT id from ProductType WHERE name = 'Nettoyage')),
            ('Decapot',         false,          false,      (SELECT id from ProductType WHERE name = 'Nettoyage')),

            ('Laswa',           false,          false,      (SELECT id from ProductType WHERE name = 'Outil')),
            ('Cadre',           false,          false,      (SELECT id from ProductType WHERE name = 'Outil')),
            ('Gelatine',        false,          false,      (SELECT id from ProductType WHERE name = 'Outil')),
            ('Raclette',        false,          false,      (SELECT id from ProductType WHERE name = 'Outil')),
            ('Bizagra',         false,          false,      (SELECT id from ProductType WHERE name = 'Outil')),
            ('Scotche',         false,          false,      (SELECT id from ProductType WHERE name = 'Outil'))
        ;
    `);

    await prisma.$executeRawUnsafe(`
        INSERT INTO ProductVariation 
            (productId,                                             colorId,                                            name,                   size,       quantity,   threshold)
        VALUES 
            ((SELECT id from Product WHERE name = 'Sac Poignet'),   (SELECT id from Color WHERE name = 'Noire'),        'Poignet 25/20 Noire',  '25/20',    100,        10),
            ((SELECT id from Product WHERE name = 'Sac Poignet'),   (SELECT id from Color WHERE name = 'Blanc'),        'Poignet 25/20 Blanc',  '25/20',    100,        10),
            ((SELECT id from Product WHERE name = 'Sac Poignet'),   (SELECT id from Color WHERE name = 'Noire'),        'Poignet 29/22 Noire',  '29/22',    100,        10),
            ((SELECT id from Product WHERE name = 'Sac Poignet'),   (SELECT id from Color WHERE name = 'Blanc'),        'Poignet 29/22 Blanc',  '29/22',    100,        10),
            ((SELECT id from Product WHERE name = 'Sac Poignet'),   (SELECT id from Color WHERE name = 'Noire'),        'Poignet 35/25 Noire',  '35/25',    100,        10),
            ((SELECT id from Product WHERE name = 'Sac Poignet'),   (SELECT id from Color WHERE name = 'Blanc'),        'Poignet 35/25 Blanc',  '35/25',    100,        10),
            ((SELECT id from Product WHERE name = 'Sac Poignet'),   (SELECT id from Color WHERE name = 'Noire'),        'Poignet 37/30 Noire',  '37/30',    100,        10),
            ((SELECT id from Product WHERE name = 'Sac Poignet'),   (SELECT id from Color WHERE name = 'Blanc'),        'Poignet 37/30 Blanc',  '37/30',    100,        10),
            ((SELECT id from Product WHERE name = 'Sac Poignet'),   (SELECT id from Color WHERE name = 'Noire'),        'Poignet 50/40 Noire',  '50/40',    100,        10),
            ((SELECT id from Product WHERE name = 'Sac Poignet'),   (SELECT id from Color WHERE name = 'Blanc'),        'Pognet 50/40 Blanc',   '50/40',    100,        10),
            ((SELECT id from Product WHERE name = 'Sac Poignet'),   (SELECT id from Color WHERE name = 'Noire'),        'Poignet 50/50 Noire',  '50/50',    100,        10),
            ((SELECT id from Product WHERE name = 'Sac Poignet'),   (SELECT id from Color WHERE name = 'Blanc'),        'Poignet 50/50 Blanc',  '50/50',    100,        10),
            ((SELECT id from Product WHERE name = 'Sac Anse'),      (SELECT id from Color WHERE name = 'Noire'),        'Anse 30/30 Noire',     '30/30',    100,        10),
            ((SELECT id from Product WHERE name = 'Sac Anse'),      (SELECT id from Color WHERE name = 'Blanc'),        'Anse 30/30 Blanc',     '30/30',    100,        10),
            ((SELECT id from Product WHERE name = 'Sac Anse'),      (SELECT id from Color WHERE name = 'Noire'),        'Anse 39/30 Noire',     '39/30',    100,        10),
            ((SELECT id from Product WHERE name = 'Sac Anse'),      (SELECT id from Color WHERE name = 'Blanc'),        'Anse 39/30 Blanc',     '39/30',    100,        10),
            ((SELECT id from Product WHERE name = 'Sac Anse'),      (SELECT id from Color WHERE name = 'Noire'),        'Anse 40/40 Noire',     '40/40',    100,        10),
            ((SELECT id from Product WHERE name = 'Sac Anse'),      (SELECT id from Color WHERE name = 'Blanc'),        'Anse 40/40 Blanc',     '40/40',    100,        10),
            ((SELECT id from Product WHERE name = 'Sac Anse'),      (SELECT id from Color WHERE name = 'Noire'),        'Anse 50/40 Noire',     '50/40',    100,        10),
            ((SELECT id from Product WHERE name = 'Sac Anse'),      (SELECT id from Color WHERE name = 'Blanc'),        'Anse 50/40 Blanc',     '50/40',    100,        10),
            ((SELECT id from Product WHERE name = 'Sac Anse'),      (SELECT id from Color WHERE name = 'Noire'),        'Anse 40/50 Noire',     '40/50',    100,        10),
            ((SELECT id from Product WHERE name = 'Sac Anse'),      (SELECT id from Color WHERE name = 'Blanc'),        'Anse 40/50 Blanc',     '40/50',    100,        10),
            ((SELECT id from Product WHERE name = 'Sac Anse'),      (SELECT id from Color WHERE name = 'Noire'),        'Anse 50/50 Noire',     '50/50',    100,        10),
            ((SELECT id from Product WHERE name = 'Sac Anse'),      (SELECT id from Color WHERE name = 'Blanc'),        'Anse 50/50 Blanc',     '50/50',    100,        10),
            ((SELECT id from Product WHERE name = 'Sac Anse'),      (SELECT id from Color WHERE name = 'Noire'),        'Anse 50/60 Noire',     '50/60',    100,        10),
            ((SELECT id from Product WHERE name = 'Sac Anse'),      (SELECT id from Color WHERE name = 'Blanc'),        'Anse 50/60 Blanc',     '50/60',    100,        10),
            ((SELECT id from Product WHERE name = 'Peinture PVC'),  (SELECT id from Color WHERE name = 'Or'),           'Peinture PVC Or',      '1',        1,          0),
            ((SELECT id from Product WHERE name = 'Peinture PVC'),  (SELECT id from Color WHERE name = 'Noire'),        'Peinture PVC Noire',   '1',        1,          0),
            ((SELECT id from Product WHERE name = 'Peinture PVC'),  (SELECT id from Color WHERE name = 'Vert'),         'Peinture PVC Vert',    '1',        1,          0),
            ((SELECT id from Product WHERE name = 'Peinture EAU'),  (SELECT id from Color WHERE name = 'Blanc'),        'Peinture EAU Blanc',   '1',        1,          0),
            ((SELECT id from Product WHERE name = 'Peinture EAU'),  (SELECT id from Color WHERE name = 'Bleu'),         'Peinture EAU Bleu',    '1',        1,          0),
            ((SELECT id from Product WHERE name = 'Peinture EAU'),  (SELECT id from Color WHERE name = 'Rouge'),        'Peinture EAU Rouge',   '1',        1,          0),
            ((SELECT id from Product WHERE name = 'Peinture EAU'),  (SELECT id from Color WHERE name = 'Vert'),         'Peinture EAU Vert',    '1',        1,          0),
            ((SELECT id from Product WHERE name = 'Calque'),        (SELECT id from Color WHERE name = 'Transparent'),  'Calque',               '1',        100,        10),
            ((SELECT id from Product WHERE name = 'Laswa'),         (SELECT id from Color WHERE name = 'Transparent'),  'Laswa 90',             '90',       1,          0),
            ((SELECT id from Product WHERE name = 'Laswa'),         (SELECT id from Color WHERE name = 'Transparent'),  'Laswa 120',            '120',      1,          0),
            ((SELECT id from Product WHERE name = 'Patte'),         (SELECT id from Color WHERE name = 'Transparent'),  'Patte Normale',        '1',        1,          0),
            ((SELECT id from Product WHERE name = 'Patte'),         (SELECT id from Color WHERE name = 'Transparent'),  'Patte Couvrante',      '1',        1,          0),
            ((SELECT id from Product WHERE name = 'Patte'),         (SELECT id from Color WHERE name = 'Transparent'),  'Patte 45',             '1',        1,          0),
            ((SELECT id from Product WHERE name = 'Cadre'),         (SELECT id from Color WHERE name = 'Transparent'),  'Cadre - 20/30',        '20/30',    1,          0),
            ((SELECT id from Product WHERE name = 'Cadre'),         (SELECT id from Color WHERE name = 'Transparent'),  'Cadre - 30/40',        '30/40',    1,          0),
            ((SELECT id from Product WHERE name = 'Cadre'),         (SELECT id from Color WHERE name = 'Transparent'),  'Cadre - 40/50',        '40/50',    1,          0),
            ((SELECT id from Product WHERE name = 'Cadre'),         (SELECT id from Color WHERE name = 'Transparent'),  'Cadre - L',            'L',        1,          0),
            ((SELECT id from Product WHERE name = 'Gelatine'),      (SELECT id from Color WHERE name = 'Transparent'),  'Gelatine Normale',     '1',        1,          0),
            ((SELECT id from Product WHERE name = 'Gelatine'),      (SELECT id from Color WHERE name = 'Transparent'),  'Gelatine Sati',        '1',        1,          0),
            ((SELECT id from Product WHERE name = 'Raclette'),      (SELECT id from Color WHERE name = 'Transparent'),  'Raclette 30',          '30',       1,          0),
            ((SELECT id from Product WHERE name = 'Raclette'),      (SELECT id from Color WHERE name = 'Transparent'),  'Raclette 25',          '25',       1,          0),
            ((SELECT id from Product WHERE name = 'Bizagra'),       (SELECT id from Color WHERE name = 'Transparent'),  'Bizagra',              '1',        1,          0),
            ((SELECT id from Product WHERE name = 'Dulio'),         (SELECT id from Color WHERE name = 'Transparent'),  'Dulio 1050',           '1',        1,          0),
            ((SELECT id from Product WHERE name = 'Cyclo'),         (SELECT id from Color WHERE name = 'Transparent'),  'Cyclo',                '1',        1,          0),
            ((SELECT id from Product WHERE name = 'Scotche'),       (SELECT id from Color WHERE name = 'Transparent'),  'Scotche',              '1',        1,          0),
            ((SELECT id from Product WHERE name = 'Decapot'),       (SELECT id from Color WHERE name = 'Transparent'),  'Decapot',              '1',        1,          0);
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
