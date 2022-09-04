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

        <!--omotac za sve kartice sa formama-->
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            <!--od ovog div-a se iterira kroz forme i prikazuju osnovni podaci o njima-->
            <FormListItem
                v-for="form in forms"
                :key="form.id"
                :form="form"
                @delete="deleteForm(form)"
            />
        </div>
    </PageComponent>
</template>

<script setup>
import PageComponent from "../components/PageComponent.vue";
import store from "../store";
import { computed } from "vue";
import FormListItem from "../components/FormListItem.vue";

//kupimo sve forme iz stora-a
const forms = computed(() => store.state.forms.data);

store.dispatch("getForms");

function deleteForm(form) {
    if (confirm("Are you sure you want to delete this form?")) {
        store.dispatch("deleteForm", form.id).then(() => {
            store.dispatch("getForms");
        });
    }
}
</script>

<style></style>
