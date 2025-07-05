<script setup lang="ts">
import ElixRoutes from "@/router/ElixRoutes";
import { useRouter } from "vue-router";
var router = useRouter();

const navigateTo = (route?: string) => {
    if (route)
        router.push(route);
};

interface IMenu {
    title: string,
    path?: string,
    subMenus?: IMenu[]
}

const sideMenu: IMenu[] = [
    {
        title: "Customers",
        subMenus: [
            {
                title: "Register",
                path: ElixRoutes.Customer.Register
            },
            {
                title: "Manage",
                path: ElixRoutes.Customer.Manage
            }
        ]
    },
    {
        title: "Manage Orders",
        subMenus: [
            {
                title: "Booking",
            },
            {
                title: "Job Card",
            },
            {
                title: "Summary",
            },
            {
                title: "Status",
            }
        ]
    }
]

</script>
<template>
    <v-navigation-drawer>
        <v-expansion-panels multiple>
            <v-expansion-panel v-for="menu in sideMenu" :key="menu.title">
                <v-expansion-panel-title>{{ menu.title }}</v-expansion-panel-title>
                <v-expansion-panel-text>
                    <v-list class="pa-0">
                        <v-list-item v-for="subMenu in menu.subMenus" :title="subMenu.title"
                            @click="navigateTo(subMenu.path)" />
                    </v-list>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-navigation-drawer>
</template>