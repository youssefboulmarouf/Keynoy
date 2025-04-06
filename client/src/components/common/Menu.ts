import {uniqueId} from "lodash";

export interface Menu {
    id: string;
    title: string;
    href: string;
}

export const appMenuItems: Menu[] = [
    {
        id: uniqueId(),
        title: "Dashboard",
        href: "/",
    },{
        id: uniqueId(),
        title: "Ventes",
        href: "/ventes",
    },{
        id: uniqueId(),
        title: "Achats",
        href: "/achats",
    },{
        id: uniqueId(),
        title: "Charges",
        href: "/charges",
    }
];

export const productMenuItems: Menu[] = [
    {
        id: uniqueId(),
        title: "Produits",
        href: "/produits"
    },{
        id: uniqueId(),
        title: "Type Produits",
        href: "/type-produits"
    }
];

export const partnerMenuItems: Menu[] = [
    {
        id: uniqueId(),
        title: "Fournisseurs",
        href: "/fournisseurs"
    },{
        id: uniqueId(),
        title: "Clients",
        href: "/clients"
    },{
        id: uniqueId(),
        title: "Livreurs",
        href: "/livreurs"
    }
];

export interface ProfileType {
    href: string;
    title: string;
    subtitle: string;
    icon: string;
}

export const profileMenuItem: ProfileType[] = [
    {
        href: "/",
        title: "My Profile",
        subtitle: "Account Settings",
        icon: ""
    }
];