import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database using raw SQL...");

    await prisma.$executeRawUnsafe(`
        INSERT INTO City
            (name)
        VALUES
            ('Casablanca'), ('Fes'), ('Marrakech'), ('Tanger'), ('Sale'), ('Rabat'), ('Meknes'), ('Oujda'), 
            ('Kenitra'), ('Agadir'), ('Tetouan'), ('Taourirt'), ('Temara'), ('Safi'), ('Khenifra'), ('El Jadida'), 
            ('Laayoune'), ('Mohammedia'), ('Khouribga'), ('Beni Mellal'), ('Ait Melloul'), ('Nador'), ('Taza'), 
            ('Settat'), ('Barrechid'), ('Al Khmissat'), ('Inezgane'), ('Ksar El Kebir'), ('My Drarga'), ('Larache'), 
            ('Guelmim'), ('Berkane'), ('Ad Dakhla'), ('Bouskoura'), ('Al Fqih Ben Salah'), ('Oued Zem'), ('Sidi Slimane'), 
            ('Errachidia'), ('Guercif'), ('Oulad Teima'), ('Ben Guerir'), ('Sefrou'), ('Fnidq'), ('Sidi Qacem'), 
            ('Tiznit'), ('Moulay Abdallah'), ('Youssoufia'), ('Martil'), ('Ain Harrouda'), ('Souq Sebt Oulad Nemma'), 
            ('Skhirate'), ('Ouezzane'), ('Sidi Yahya Zaer'), ('Al Hoceïma'), ('Mdieq'), ('Midalt'), ('Azrou'), 
            ('Kelaa des Sraghna'), ('Ain Aouda'), ('Beni Yakhlef'), ('Ad Darwa'), ('Al Aaroui'), ('Qasbat Tadla'), 
            ('Boujad'), ('Jerada'), ('Mrirt'), ('El Aioun'), ('Azemmour'), ('Temsia'), ('Zagora'), ('Ait Ourir'), 
            ('Aziylal'), ('Sidi Yahia El Gharb'), ('Biougra'), ('Zaio'), ('Aguelmous'), ('El Hajeb'), ('Zeghanghane'), 
            ('Imzouren'), ('Tit Mellil'), ('Mechraa Bel Ksiri'), ('Al Attawia'), ('Demnat'), ('Arfoud'), ('Tameslouht'),
            ('Bou Arfa'), ('Sidi Smail'), ('Souk Tnine Jorf el Mellah'), ('Mehdya'), ('Ain Taoujdat'), ('Chichaoua'), 
            ('Tahla'), ('Oulad Yaïch'), ('Moulay Bousselham'), ('Iheddadene'), ('Missour'), ('Zawyat ech Cheïkh'), 
            ('Bouknadel'), ('Oulad Tayeb'), ('Oulad Barhil'), ('Bir Jdid'), ('Tifariti'), ('Oued Laou'), ('Outat El Haj'), 
            ('Marzouga'), ('Tafraoute'), ('Bouznika'), ('Tighassaline'), ('Ouarzazate'), ('Mediouna'), ('Errahma'), 
            ('Souk Larbaa'), ('Tissint Tata'), ('Tamessna'), ('Taounate'), ('Tifelt'), ('Targist'), ('Essaouira'), 
            ('Oulad Jerrar'), ('Tinghir'), ('Aklim'), ('Hociema'), ('Boujdour'), ('Sidi Ifni'), ('El Ksiba'), 
            ('Khemiss Zmamra'), ('Boumia'), ('Belfaa'), ('Souk Sebt'), ('Ain Atiq'),
        ;
    `);

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
            (name,        companyType,   phone, cityId)
        VALUES
            ('Ozone',     'Livreur',     null,    (SELECT id from City WHERE name = 'Rabat')),
            ('Alta',      'Livreur',     null,    (SELECT id from City WHERE name = 'Sale')),
            ('Redombale', 'Fournisseur', null,    (SELECT id from City WHERE name = 'Sale'));
    `);

    await prisma.$executeRawUnsafe(`
        INSERT INTO ProductType 
            (name)
        VALUES
            ('Support Impression'), ('Peinture'), ('Outils Peinture'), ('Nettoyage'), ('Outils Impression')
        ;
    `);

    await prisma.$executeRawUnsafe(`
        INSERT INTO Product 
            (name,           isSellable, isLayer, isPaint, isPrintable, isPaintTool, isPrintTool, productTypeId)
        VALUES
            ('Sac Poignet',  true,       false,   false,    true,        false,       false,       (SELECT id from ProductType WHERE name = 'Support Impression')),
            ('Sac Anse',     true,       false,   false,    true,        false,       false,       (SELECT id from ProductType WHERE name = 'Support Impression')),
            ('Calque',       false,      true,    false,    true,        false,       false,       (SELECT id from ProductType WHERE name = 'Support Impression')),

            ('Peinture PVC', false,      false,   true,     false,       false,      false,       (SELECT id from ProductType WHERE name = 'Peinture')),
            ('Peinture EAU', false,      false,   true,     false,       false,      false,       (SELECT id from ProductType WHERE name = 'Peinture')),

            ('Patte',        false,      false,   false,    false,       true,       false,       (SELECT id from ProductType WHERE name = 'Outils Peinture')),
            ('Dulio',        false,      false,   false,    false,       true,       false,       (SELECT id from ProductType WHERE name = 'Outils Peinture')),

            ('Cyclo',        false,      false,   false,    false,       false,      false,       (SELECT id from ProductType WHERE name = 'Nettoyage')),
            ('Decapant',     false,      false,   false,    false,       false,      false,       (SELECT id from ProductType WHERE name = 'Nettoyage')),

            ('La Soie',      false,      false,   false,    false,       false,      true,        (SELECT id from ProductType WHERE name = 'Outils Impression')),
            ('Cadre',        false,      false,   false,    false,       false,      true,        (SELECT id from ProductType WHERE name = 'Outils Impression')),
            ('Gelatine',     false,      false,   false,    false,       false,      true,        (SELECT id from ProductType WHERE name = 'Outils Impression')),
            ('Raclette',     false,      false,   false,    false,       false,      true,        (SELECT id from ProductType WHERE name = 'Outils Impression')),
            ('Bisagra',      false,      false,   false,    false,       false,      true,        (SELECT id from ProductType WHERE name = 'Outils Impression')),
            ('Scotche',      false,      false,   false,    false,       false,      true,        (SELECT id from ProductType WHERE name = 'Outils Impression'))
        ;
    `);

    await prisma.$executeRawUnsafe(`
        INSERT INTO ProductVariation 
            (productId,                                            colorId,                                           name,                  size,    quantity, threshold)
        VALUES 
            ((SELECT id from Product WHERE name = 'Sac Poignet'),  (SELECT id from Color WHERE name = 'Noire'),       'Poignet 25/20 Noire', '25/20', 0,        10),
            ((SELECT id from Product WHERE name = 'Sac Poignet'),  (SELECT id from Color WHERE name = 'Blanc'),       'Poignet 25/20 Blanc', '25/20', 0,        10),
            ((SELECT id from Product WHERE name = 'Sac Poignet'),  (SELECT id from Color WHERE name = 'Noire'),       'Poignet 29/22 Noire', '29/22', 0,        10),
            ((SELECT id from Product WHERE name = 'Sac Poignet'),  (SELECT id from Color WHERE name = 'Blanc'),       'Poignet 29/22 Blanc', '29/22', 0,        10),
            ((SELECT id from Product WHERE name = 'Sac Poignet'),  (SELECT id from Color WHERE name = 'Noire'),       'Poignet 35/25 Noire', '35/25', 0,        10),
            ((SELECT id from Product WHERE name = 'Sac Poignet'),  (SELECT id from Color WHERE name = 'Blanc'),       'Poignet 35/25 Blanc', '35/25', 0,        10),
            ((SELECT id from Product WHERE name = 'Sac Poignet'),  (SELECT id from Color WHERE name = 'Noire'),       'Poignet 37/30 Noire', '37/30', 0,        10),
            ((SELECT id from Product WHERE name = 'Sac Poignet'),  (SELECT id from Color WHERE name = 'Blanc'),       'Poignet 37/30 Blanc', '37/30', 0,        10),
            ((SELECT id from Product WHERE name = 'Sac Poignet'),  (SELECT id from Color WHERE name = 'Noire'),       'Poignet 50/40 Noire', '50/40', 0,        10),
            ((SELECT id from Product WHERE name = 'Sac Poignet'),  (SELECT id from Color WHERE name = 'Blanc'),       'Pognet 50/40 Blanc',  '50/40', 0,        10),
            ((SELECT id from Product WHERE name = 'Sac Poignet'),  (SELECT id from Color WHERE name = 'Noire'),       'Poignet 50/50 Noire', '50/50', 0,        10),
            ((SELECT id from Product WHERE name = 'Sac Poignet'),  (SELECT id from Color WHERE name = 'Blanc'),       'Poignet 50/50 Blanc', '50/50', 0,        10),
            ((SELECT id from Product WHERE name = 'Sac Anse'),     (SELECT id from Color WHERE name = 'Noire'),       'Anse 30/30 Noire',    '30/30', 0,        10),
            ((SELECT id from Product WHERE name = 'Sac Anse'),     (SELECT id from Color WHERE name = 'Blanc'),       'Anse 30/30 Blanc',    '30/30', 0,        10),
            ((SELECT id from Product WHERE name = 'Sac Anse'),     (SELECT id from Color WHERE name = 'Noire'),       'Anse 39/30 Noire',    '39/30', 0,        10),
            ((SELECT id from Product WHERE name = 'Sac Anse'),     (SELECT id from Color WHERE name = 'Blanc'),       'Anse 39/30 Blanc',    '39/30', 0,        10),
            ((SELECT id from Product WHERE name = 'Sac Anse'),     (SELECT id from Color WHERE name = 'Noire'),       'Anse 40/40 Noire',    '40/40', 0,        10),
            ((SELECT id from Product WHERE name = 'Sac Anse'),     (SELECT id from Color WHERE name = 'Blanc'),       'Anse 40/40 Blanc',    '40/40', 0,        10),
            ((SELECT id from Product WHERE name = 'Sac Anse'),     (SELECT id from Color WHERE name = 'Noire'),       'Anse 50/40 Noire',    '50/40', 0,        10),
            ((SELECT id from Product WHERE name = 'Sac Anse'),     (SELECT id from Color WHERE name = 'Blanc'),       'Anse 50/40 Blanc',    '50/40', 0,        10),
            ((SELECT id from Product WHERE name = 'Sac Anse'),     (SELECT id from Color WHERE name = 'Noire'),       'Anse 40/50 Noire',    '40/50', 0,        10),
            ((SELECT id from Product WHERE name = 'Sac Anse'),     (SELECT id from Color WHERE name = 'Blanc'),       'Anse 40/50 Blanc',    '40/50', 0,        10),
            ((SELECT id from Product WHERE name = 'Sac Anse'),     (SELECT id from Color WHERE name = 'Noire'),       'Anse 50/50 Noire',    '50/50', 0,        10),
            ((SELECT id from Product WHERE name = 'Sac Anse'),     (SELECT id from Color WHERE name = 'Blanc'),       'Anse 50/50 Blanc',    '50/50', 0,        10),
            ((SELECT id from Product WHERE name = 'Sac Anse'),     (SELECT id from Color WHERE name = 'Noire'),       'Anse 50/60 Noire',    '50/60', 0,        10),
            ((SELECT id from Product WHERE name = 'Sac Anse'),     (SELECT id from Color WHERE name = 'Blanc'),       'Anse 50/60 Blanc',    '50/60', 0,        10),
            ((SELECT id from Product WHERE name = 'Peinture PVC'), (SELECT id from Color WHERE name = 'Or'),          'Peinture PVC Or',     '1',     0,        0),
            ((SELECT id from Product WHERE name = 'Peinture PVC'), (SELECT id from Color WHERE name = 'Noire'),       'Peinture PVC Noire',  '1',     0,        0),
            ((SELECT id from Product WHERE name = 'Peinture PVC'), (SELECT id from Color WHERE name = 'Vert'),        'Peinture PVC Vert',   '1',     0,        0),
            ((SELECT id from Product WHERE name = 'Peinture EAU'), (SELECT id from Color WHERE name = 'Blanc'),       'Peinture EAU Blanc',  '1',     0,        0),
            ((SELECT id from Product WHERE name = 'Peinture EAU'), (SELECT id from Color WHERE name = 'Bleu'),        'Peinture EAU Bleu',   '1',     0,        0),
            ((SELECT id from Product WHERE name = 'Peinture EAU'), (SELECT id from Color WHERE name = 'Rouge'),       'Peinture EAU Rouge',  '1',     0,        0),
            ((SELECT id from Product WHERE name = 'Peinture EAU'), (SELECT id from Color WHERE name = 'Vert'),        'Peinture EAU Vert',   '1',     0,        0),
            ((SELECT id from Product WHERE name = 'Calque'),       (SELECT id from Color WHERE name = 'Transparent'), 'Calque',              '1',     0,        10),
            ((SELECT id from Product WHERE name = 'La Soie'),      (SELECT id from Color WHERE name = 'Transparent'), 'Laswa 90',            '90',    0,        0),
            ((SELECT id from Product WHERE name = 'La Soie'),      (SELECT id from Color WHERE name = 'Transparent'), 'Laswa 120',           '120',   0,        0),
            ((SELECT id from Product WHERE name = 'Patte'),        (SELECT id from Color WHERE name = 'Transparent'), 'Patte Normale',       '1',     0,        0),
            ((SELECT id from Product WHERE name = 'Patte'),        (SELECT id from Color WHERE name = 'Transparent'), 'Patte Couvrante',     '1',     0,        0),
            ((SELECT id from Product WHERE name = 'Cadre'),        (SELECT id from Color WHERE name = 'Transparent'), 'Cadre - 20/30',       '20/30', 0,        0),
            ((SELECT id from Product WHERE name = 'Cadre'),        (SELECT id from Color WHERE name = 'Transparent'), 'Cadre - 30/40',       '30/40', 0,        0),
            ((SELECT id from Product WHERE name = 'Cadre'),        (SELECT id from Color WHERE name = 'Transparent'), 'Cadre - 40/50',       '40/50', 0,        0),
            ((SELECT id from Product WHERE name = 'Cadre'),        (SELECT id from Color WHERE name = 'Transparent'), 'Cadre - L',           'L',     0,        0),
            ((SELECT id from Product WHERE name = 'Gelatine'),     (SELECT id from Color WHERE name = 'Transparent'), 'Gelatine Normale',    '1',     0,        0),
            ((SELECT id from Product WHERE name = 'Gelatine'),     (SELECT id from Color WHERE name = 'Transparent'), 'Gelatine Sati',       '1',     0,        0),
            ((SELECT id from Product WHERE name = 'Raclette'),     (SELECT id from Color WHERE name = 'Transparent'), 'Raclette 30',         '30',    0,        0),
            ((SELECT id from Product WHERE name = 'Raclette'),     (SELECT id from Color WHERE name = 'Transparent'), 'Raclette 25',         '25',    0,        0),
            ((SELECT id from Product WHERE name = 'Bisagra'),      (SELECT id from Color WHERE name = 'Transparent'), 'Bizagra',             '1',     0,        0),
            ((SELECT id from Product WHERE name = 'Dulio'),        (SELECT id from Color WHERE name = 'Transparent'), 'Dulio 1050',          '1',     0,        0),
            ((SELECT id from Product WHERE name = 'Cyclo'),        (SELECT id from Color WHERE name = 'Transparent'), 'Cyclo',               '1',     0,        0),
            ((SELECT id from Product WHERE name = 'Scotche'),      (SELECT id from Color WHERE name = 'Transparent'), 'Scotche',             '1',     0,        0),
            ((SELECT id from Product WHERE name = 'Decapant'),     (SELECT id from Color WHERE name = 'Transparent'), 'Decapot',             '1',     0,        0);
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
