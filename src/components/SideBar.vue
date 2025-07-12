<script setup lang="ts">
import ElixRoutes from "@/router/ElixRoutes";
import { useRouter } from "vue-router";
const router = useRouter();

const navigateTo = (route?: string) => {
    if (route) {
        router.push(route);
    }
};

interface IMenu {
    title: string;
    path?: string;
    icon?: string;
    subMenus?: IMenu[];
}
const sideMenu: IMenu[] = [
    {
        title: "Customers",
        icon: "mdi-account-multiple",
        subMenus: [
            {
                title: "Register",
                icon: "mdi-account-plus",
                path: ElixRoutes.Customer.Register
            },
            {
                title: "Manage",
                icon: "mdi-account-edit",
                path: ElixRoutes.Customer.Manage
            }
        ]
    },
    {
        title: "Manage Orders",
        icon: "mdi-clipboard-list",
        subMenus: [
            { title: "Booking", icon: "mdi-calendar-check" },
            { title: "Job Card", icon: "mdi-clipboard-text" },
            { title: "Summary", icon: "mdi-file-document-outline" },
            { title: "Status", icon: "mdi-chart-box-outline" }
        ]
    },
    {
        title: "Design",
        icon: "mdi-draw",
        path: ElixRoutes.Design
    }
];

</script>
<template>
    <v-navigation-drawer>
        <v-list nav dense>
            <template v-for="menu in sideMenu" :key="menu.title">
                <v-list-group v-if="menu.subMenus" :prepend-icon="menu.icon">
                    <template #activator="{ props }">
                        <v-list-item v-bind="props" :title="menu.title" />
                    </template>
                    <v-list-item v-for="subMenu in menu.subMenus" :key="subMenu.title" :title="subMenu.title"
                        :prepend-icon="subMenu.icon" @click="navigateTo(subMenu.path)" />
                </v-list-group>

                <v-list-item v-else :title="menu.title" :prepend-icon="menu.icon" @click="navigateTo(menu.path)" />

            </template>
        </v-list>
    </v-navigation-drawer>
</template>
