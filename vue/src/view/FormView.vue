<template>
    <PageComponent>
        <!--heder strane na kojoj se prikazuje svaka forma zasebno-->
        <template v-slot:header>
            <div class="flex items-center justify-between">
                <!--samo ispituje ima li model id, ako ne onda znaci da cemo dodavati novu formu pa je naslov drugaciji-->
                <h1 class="text-3xl font-bold text-gray-900">
                    {{ route.params.id ? model.title : "Kreiraj test" }}
                </h1>

                <button
                    v-if="route.params.id"
                    type="button"
                    @click="deleteForm()"
                    class="py-2 px-3 text-white bg-red-500 rounded-md hover:bg-red-600"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 -mt-1 inline-block"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clip-rule="evenodd"
                        />
                    </svg>
                    Izbrisi test
                </button>
            </div>
        </template>
        <!--kraj hedera-->

        <div v-if="formLoading" class="flex justify-center">Ucitava se...</div>
        <form v-else @submit.prevent="saveForm">
            <div class="shadow sm:rounded-md sm:overflow-hidden">
                <!--polja forme-->
                <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <!-- Image -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700">
                            Slika
                        </label>
                        <div class="mt-1 flex items-center">
                            <!--preko vue modela proveravamo ima li slike i na osnovu toga kazemo sta da prikaze-->
                            <img
                                v-if="model.image_url"
                                :src="model.image_url"
                                :alt="model.title"
                                class="w-64 h-48 object-cover"
                            />
                            <span
                                v-else
                                class="flex items-center justify-center h-12 w-12 rounded-full overflow-hidden bg-gray-100"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-[80%] w-[80%] text-gray-300"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                            </span>

                            <!-- Photo from Domain-->
                            <div
                                class="grid grid-cols-1 gap-3 mt-1 flex items-center"
                            >
                                <button
                                    type="button"
                                    class="relative overflow-hidden ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <!--ovde trigerujemo file picker-->
                                    <input
                                        type="file"
                                        @change="onImageAdd"
                                        class="absolute left-0 top-0 right-0 bottom-0 opacity-0 cursor-pointer"
                                    />
                                    Ucitaj
                                </button>
                                <input
                                    placeholder="..."
                                    v-model="search_word"
                                    class="relative overflow-hidden ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700"
                                />

                                <button
                                    type="button"
                                    class="relative overflow-hidden ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <input
                                        @click="onPhotoAdd"
                                        class="absolute left-0 top-0 right-0 bottom-0 opacity-0 cursor-pointer"
                                    />
                                    Izgenerisi
                                </button>
                            </div>
                            <!-- Photo from domain kraj -->
                        </div>
                    </div>
                    <!--/ Image -->

                    <!-- Title -->
                    <div>
                        <label
                            for="title"
                            class="block text-sm font-medium text-gray-700"
                            >Naslov</label
                        >
                        <input
                            type="text"
                            name="title"
                            id="title"
                            v-model="model.title"
                            autocomplete="form_title"
                            class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                    <!--/ Title -->

                    <!-- Description -->
                    <div>
                        <label
                            for="about"
                            class="block text-sm font-medium text-gray-700"
                        >
                            Opis
                        </label>
                        <div class="mt-1">
                            <textarea
                                id="description"
                                name="description"
                                rows="3"
                                v-model="model.description"
                                autocomplete="form_description"
                                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                placeholder="Describe your form"
                            />
                        </div>
                    </div>
                    <!-- Description -->

                    <!-- Expire Date -->
                    <div>
                        <label
                            for="expire_date"
                            class="block text-sm font-medium text-gray-700"
                            >Rok vazenja</label
                        >
                        <input
                            type="date"
                            name="expire_date"
                            id="expire_date"
                            v-model="model.expire_date"
                            class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                    <!--/ Expire Date -->

                    <!-- Status -->
                    <div class="flex items-start">
                        <div class="flex items-center h-5">
                            <input
                                id="status"
                                name="status"
                                type="checkbox"
                                v-model="model.status"
                                class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            />
                        </div>
                        <div class="ml-3 text-sm">
                            <label
                                for="status"
                                class="font-medium text-gray-700"
                                >Aktivan</label
                            >
                        </div>
                    </div>
                    <!--/ Status -->
                </div>

                <!-- Questions -->
                <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <h3
                        class="text-2xl font-semibold flex items-center justify-between"
                    >
                        Pitanja
                        <!-- Add new question -->
                        <button
                            type="button"
                            @click="addQuestion()"
                            class="flex items-center text-sm py-1 px-4 rounded-sm text-white bg-gray-600 hover:bg-gray-700"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                            Dodaj pitanje
                        </button>
                        <!--/ Add new question -->
                    </h3>
                    <!--ispitujemo ima li ova forma pitanja i ukoliko ima iteriramo kroz njih i jedan po jedan
                        saljemo QuestionEditor komponenti-->
                    <div
                        v-if="!model.questions.length"
                        class="text-center text-gray-600"
                    >
                        Jos uvek nemate kreiranih pitanja
                    </div>
                    <div
                        v-for="(question, index) in model.questions"
                        :key="question.id"
                    >
                        <!--ovde se prosledjuje pitanje i indeks tog pitanja u nizu i postavljaju se osluskivaci
                        koji se trigeruju kada se pitanja promene, obrisu...-->
                        <QuestionEditor
                            :question="question"
                            :index="index"
                            @change="questionChange"
                            @addQuestion="addQuestion"
                            @deleteQuestion="deleteQuestion"
                        />
                    </div>
                </div>
                <!--/ Questions -->

                <!-- Save -->
                <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                        type="submit"
                        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Sacuvaj
                    </button>
                </div>
            </div>
        </form>
    </PageComponent>
</template>

<script setup>
import PageComponent from "../components/PageComponent.vue";
import { ref, watch, computed } from "vue";
import store from "../store";
import { useRoute, useRouter } from "vue-router";
import QuestionEditor from "../components/editor/QuestionEditor.vue";
import { v4 as uuidv4 } from "uuid";

const route = useRoute();
const router = useRouter();

const formLoading = computed(() => store.state.currentForm.loading);

//ovde referenciramo prazan model, sto je ok kada se otvori stranica za dodavanje nove forme
let model = ref({
    title: "",
    status: false,
    description: "",
    image: null,
    expire_date: null,
    questions: [],
});

let search_word = ref(null);

watch(
    () => store.state.currentForm.data,
    (newVal, oldVal) => {
        model.value = {
            ...JSON.parse(JSON.stringify(newVal)),
            status: newVal.status !== "draft",
            //expire_date: ,
        };
    }
);
//ovde pravimo model ukoliko je pozvana stranica za izmenu podataka forme
//pristupa se pozvanoj ruti i ukoliko sadrzi parametar id onda se modelu dodeljuju vrednosti one
//forme iz store.js za koja ima isti id kao sto je prosledjen id parametar u ruti
if (route.params.id) {
    store.dispatch("getForm", route.params.id);
}

function onImageAdd(event) {
    console.log("tu tu tu");

    //fajl koji saljemo na back
    const file = event.target.files[0];
    console.log(file);
    const reader = new FileReader();
    reader.onload = () => {
        //za back
        model.value.image = reader.result;
        //za front
        model.value.image_url = reader.result;
    };
    reader.readAsDataURL(file);
}

function onPhotoAdd() {
    store.dispatch("getPhotoFromDomain", search_word.value).then((res) => {
        console.log(res.data.value[0]);
        model.value.image_url = res.data.value[0].url;
        model.value.image = res.data.value[0].url;
    });
}

//kada se okine dogadjaj addQuestion, odnosno kad niza komponenta emituje neki dogadjaj...
//pravi novo pitanje, dodeljuje nov id, a ostala polja postavlja na default
function addQuestion(index) {
    const newQuestion = {
        id: uuidv4(),
        type: "text",
        question: "",
        description: null,
        data: {},
    };

    model.value.questions.splice(index, 0, newQuestion);
}

//slicno kao za opcije u QuestionEditor-u, setujemo pitanja na sva ona ciji id nije isti onom koji je prosledjen
function deleteQuestion(question) {
    model.value.questions = model.value.questions.filter((q) => q !== question);
}

function questionChange(question) {
    model.value.questions = model.value.questions.map((q) => {
        if (q.id === question.id) {
            return JSON.parse(JSON.stringify(question));
        }
        return q;
    });
}

//poziv store.js za cuvanje forme i redirekcija
function saveForm() {
    store
        .dispatch("saveForm", model.value)
        .then((res) => {
            store.commit("notify", {
                type: "success",
                message: "Test je uspesno sacuvan!",
            });
        })
        .catch((err) => {
            store.commit("notify", {
                type: "faild",
                message: "Greska! Proverite polja forme!",
            });
        });
}

function deleteForm() {
    if (confirm(`Are you sure?`)) {
        store.dispatch("deleteForm", model.value.id).then(() => {
            router.push({
                name: "Forms",
            });
        });
    }
}
</script>
