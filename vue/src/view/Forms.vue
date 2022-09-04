<template>
    <PageComponent>
        <!--heder strane na kojoj se prikazuju forme-->
        <template v-slot:header>
            <div class="flex justify-between items-center">
                <h1 class="text-3xl font-bold text-gray-900">Forms</h1>
                <!--ovde je dugme za dodavanje nove forme obavijeno router-linkom kako bi nas navigiralo na odgovarajucu stranu-->
                <router-link
                    :to="{ name: 'FormCreate' }"
                    class="py-2 px-3 text-white bg-emerald-500 rounded-md hover:bg-emerald-600"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 -mt-1 inline-block"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    Add new Form
                </router-link>
            </div>
        </template>
        <!--kraj hedera-->

        <div v-if="forms.loading" class="flex justify-center">Loading...</div>
        <!--omotac za sve kartice sa formama-->
        <div v-else>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                <!--od ovog div-a se iterira kroz forme i prikazuju osnovni podaci o njima-->
                <FormListItem
                    v-for="form in forms.data"
                    :key="form.id"
                    :form="form"
                    @delete="deleteForm(form)"
                />
            </div>
            <div class="flex justify-center mt-5">
                <nav
                    class="relative z-0 inline-flex justify-center rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                >
                    <a
                        v-for="(link, i) of forms.links"
                        :key="i"
                        :disabled="!link.url"
                        href="#"
                        @click="getForPage($event, link)"
                        aria-current="page"
                        class="relative inline-flex items-center px-4 py-2 border text-sm font-medium whitespace-nowrap"
                        :class="[
                            link.active
                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                            i === 0
                                ? 'rounded-l-md bg-gray-100 text-gray-700'
                                : '',
                            i === forms.links.length - 1 ? 'rounded-r-md' : '',
                        ]"
                        v-html="link.label"
                    >
                    </a>
                </nav>
            </div>
        </div>
    </PageComponent>
</template>

<script setup>
import PageComponent from "../components/PageComponent.vue";
import store from "../store";
import { computed } from "vue";
import FormListItem from "../components/FormListItem.vue";

//kupimo sve forme iz stora-a
const forms = computed(() => store.state.forms);

store.dispatch("getForms");

function deleteForm(form) {
    if (confirm("Are you sure you want to delete this form?")) {
        store.dispatch("deleteForm", form.id).then(() => {
            store.dispatch("getForms");
        });
    }
}

function getForPage(event, link) {
    event.preventDefault();
    if (!link.url || link.active) {
        return;
    }
    store.dispatch("getForms", { url: link.url });
}
</script>

<style></style>
