<template>
    <PageComponent title="Pocetna">
        <div v-if="loading" class="flex justify-center">Ucitava se...</div>
        <div
            v-else
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-gray-700"
        >
            <div
                class="bg-white shadow-md p-3 text-center flex flex-col order-1 lg:order-2"
            >
                <!-- Total Forms -->
                <h3 class="text-2xl font-semibold">Ukupno testova</h3>
                <div
                    class="text-8xl pb-4 font-semibold flex-1 flex items-center justify-center"
                >
                    {{ data.totalForms }}
                </div>
            </div>
            <div
                class="bg-white shadow-md p-3 text-center flex flex-col order-2 lg:order-4"
            >
                <!-- Total Answers -->
                <h3 class="text-2xl font-semibold">Ukupno odgovora</h3>
                <div
                    class="text-8xl pb-4 font-semibold flex-1 flex items-center justify-center"
                >
                    {{ data.totalAnswers }}
                </div>
            </div>

            <!-- Latest Form -->
            <div class="row-span-2 order-3 lg:order-1 bg-white shadow-md p-4">
                <h3 class="text-2xl font-semibold">Poslednji test</h3>
                <div v-if="data.latestForm">
                    <img
                        :src="data.latestForm.image_url"
                        class="w-[240px] mx-auto"
                        alt=""
                    />
                    <h3 class="font-bold text-xl mb-3">
                        {{ data.latestForm.title }}
                    </h3>
                    <div class="flex justify-between text-sm mb-1">
                        <div>Kreiran:</div>
                        <div>{{ data.latestForm.created_at }}</div>
                    </div>
                    <div class="flex justify-between text-sm mb-1">
                        <div>Istice:</div>
                        <div>{{ data.latestForm.expire_date }}</div>
                    </div>
                    <div class="flex justify-between text-sm mb-1">
                        <div>Status:</div>
                        <div>
                            {{ data.latestForm.status ? "Active" : "Draft" }}
                        </div>
                    </div>
                    <div class="flex justify-between text-sm mb-1">
                        <div>Pitanja:</div>
                        <div>{{ data.latestForm.questions }}</div>
                    </div>
                    <div class="flex justify-between text-sm mb-3">
                        <div>Odgovori:</div>
                        <div>{{ data.latestForm.answers }}</div>
                    </div>
                    <div class="flex justify-center">
                        <router-link
                            :to="{
                                name: 'FormView',
                                params: { id: data.latestForm.id },
                            }"
                            class="flex py-2 px-4 border border-transparent text-sm rounded-md text-indigo-500 hover:bg-indigo-700 hover:text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-5 w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                            </svg>
                            Izmeni test
                        </router-link>
                        <!--
                        <button
                            class="flex py-2 px-4 border border-transparent text-sm rounded-md text-indigo-500 hover:bg-indigo-700 hover:text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-5 w-5 mr-2"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path
                                    fill-rule="evenodd"
                                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                            View Answers
                        </button>-->
                    </div>
                </div>
                <div v-else class="text-gray-600 text-center py-16">
                    Jos uvek niste napravili ni jedan test
                </div>
            </div>
            <div class="bg-white shadow-md p-3 row-span-2 order-4 lg:order-3">
                <div class="flex justify-between items-center mb-3 px-2">
                    <h3 class="text-2xl font-semibold">Odgovori</h3>

                    <a
                        href="javascript:void(0)"
                        class="text-sm text-blue-500 hover:decoration-blue-500"
                    >
                        <!--Pregledaj sve-->
                    </a>
                </div>

                <div v-if="data.latest5Answers.length">
                    <a
                        href="#"
                        v-for="answer of data.latest5Answers"
                        :key="answer.id"
                        class="block p-2 hover:bg-gray-100/90"
                    >
                        <div class="font-semibold">{{ answer.form.title }}</div>
                        <small>
                            Datum odgovora:
                            <i class="font-semibold">{{ answer.end_date }}</i>
                        </small>
                    </a>
                </div>
                <div v-else class="text-gray-600 text-center py-16">
                    Jos uvek nemate ni jedan odgovor
                </div>
            </div>
        </div>
    </PageComponent>
</template>

<script setup>
import PageComponent from "../components/PageComponent.vue";
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const loading = computed(() => store.state.dashboard.loading);

const data = computed(() => store.state.dashboard.data);

store.dispatch("getDashboardData");
</script>

<style></style>
