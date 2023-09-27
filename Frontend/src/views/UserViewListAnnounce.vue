<script setup>
import { ref, onMounted, watchEffect, watch } from 'vue'
import { getCategory, getAnnouncementsByPage, getAnnouncementsByCategory } from '../composable/getAnnouncement';
import { useRouter } from 'vue-router'

const router = useRouter()
const categoryNameSelect = ref()
const categoryValue = ref([])
const switchMode = ref(true)


const savedMode = localStorage.getItem('switchMode')
if (savedMode !== null) {
    switchMode.value = JSON.parse(savedMode)
}
onMounted(async () => {
    categoryValue.value = await getCategory()
    categoryNameSelect.value = ""
})

watchEffect(() => {
    localStorage.setItem('switchMode', JSON.stringify(switchMode.value))
})


const Timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const localTime = (date) => {
    if (date === null) {
        return '-'
    }
    else {
        const datetimeString = date
        const datetimeUTC = new Date(datetimeString)
        const datetimelocal = datetimeUTC.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false, timeZone: Timezone })
        return datetimelocal
    }
}

const goToOneAnnounce = (announceId) => {
    console.log(announceId)
    router.push({
        name: 'UserViewOneAnnouncement',
        params: { id: announceId }
    })
}

// page
const page = ref(0);
const activeAnnouncements = ref([]);
const announcementClose = ref([])
const pageCount = ref(0);
const pageCount2 = ref(0);
const activeAnnouncementPage = ref(0);
const closedAnnouncementPage = ref(0);

onMounted(async () => {
    await loadPage(page.value);
    await loadPage2(page.value);
});
const filterByCategory = async () => {
    const categoryId = categoryNameSelect.value.categoryId;
    if (categoryId === undefined) {
        await loadPage(0);
    } else {
        activeAnnouncementPage.value = 0
        const announcementsAc = await getAnnouncementsByCategory('active', activeAnnouncementPage.value, categoryId);
        console.log(announcementsAc);
        activeAnnouncements.value = announcementsAc;
        pageCount.value = announcementsAc?.totalPages;

        closedAnnouncementPage.value = 0
        const announcementsCo = await getAnnouncementsByCategory('close', closedAnnouncementPage.value, categoryId);
        console.log(announcementsCo);
        announcementClose.value = announcementsCo;
        pageCount2.value = announcementsCo?.totalPages;
    }
};


const loadPage = async (page) => {
    const categoryId = categoryNameSelect.value?.categoryId;
    if (categoryId === undefined) {
        activeAnnouncements.value = await getAnnouncementsByPage('active', page);
        pageCount.value = activeAnnouncements.value?.totalPages;
    } else {

        const announcementsAc = await getAnnouncementsByCategory('active', page, categoryId);
        console.log(announcementsAc);
        activeAnnouncements.value = announcementsAc;
        pageCount.value = announcementsAc?.totalPages;
        console.log(announcementsAc);
    }
}
const loadPage2 = async (page) => {
    const categoryId = categoryNameSelect.value?.categoryId;
    if (categoryId === undefined) {
        announcementClose.value = await getAnnouncementsByPage('close', page);
        pageCount2.value = announcementClose.value?.totalPages;
    } else {

        const announcementsCo = await getAnnouncementsByCategory('close', page, categoryId);
        console.log(announcementsCo);
        announcementClose.value = announcementsCo;
        pageCount2.value = announcementsCo?.totalPages;
        console.log(announcementsCo);
    }
}

const goToPage = async (page) => {
    activeAnnouncementPage.value = page;
    await loadPage(page - 1);
}
const goToPage2 = async (page) => {
    closedAnnouncementPage.value = page;
    await loadPage(page - 1);
}

watchEffect(() => {
    page.value = 0;
    loadPage(page.value);
    loadPage2(page.value);
});

const pageNumbers = ref([]);


watchEffect(() => {
    pageNumbers.value = [];
    const numPages = pageCount.value + 1;
    let startPage = 1;
    let endPage = 10;
    if (numPages > 10) {
        if (activeAnnouncementPage.value >= 10) {
            startPage = activeAnnouncementPage.value - 9;
            endPage = activeAnnouncementPage.value + 1;
        } else {
            endPage = 11;
        }
        if (endPage > numPages) {
            endPage = numPages;
            startPage = endPage - 10;
        }
    } else {
        endPage = numPages;
    }
    for (let i = startPage; i < endPage; i++) {
        pageNumbers.value.push(i);

    }

});
const pageNumbers2 = ref([]);
watchEffect(() => {
    pageNumbers2.value = [];
    const numPages = pageCount2.value + 1;
    let startPage = 1;
    let endPage = 10;
    if (numPages > 10) {
        if (closedAnnouncementPage.value >= 10) {
            startPage = closedAnnouncementPage.value - 9;
            endPage = closedAnnouncementPage.value + 1;
        } else {
            endPage = 11;
        }
        if (endPage > numPages) {
            endPage = numPages;
            startPage = endPage - 10;
        }
    } else {
        endPage = numPages;
    }
    for (let i = startPage; i < endPage; i++) {
        pageNumbers2.value.push(i);

    }
});


</script>
<template>
    <div class="w-full h-screen bg-gray-200">
        <div class="flex flex-col w-full h-full">
            <div class="flex w-full h-20 justify-center items-center">
                <p class="text-3xl font-bold text-black">SIT Announcement System (SAS)</p>
            </div>
            <div class="flex w-full h-full justify-center">
                <div class="flex flex-col w-5/6 h-4/6  ">
                    <div class="flex flex-col">
                        <div class="flex flex-row">
                            <div class="flex w-1/2 h-8  items-center space-x-2 ">
                                <p class="text-lg font-semibold text-black">Date/Time show in Timezone:</p>
                                <p class=" text-blue-600">{{ Timezone }}</p>
                            </div>

                        </div>
                        <div class="flex flex-row">
                            <div class="flex w-1/2 h-8  items-center space-x-2">
                                <p class="text-lg font-semibold text-black">Choose Category:</p>
                                <div class=" w-1/4 mb-1">
                                    <select v-model="categoryNameSelect" @change="filterByCategory"
                                        class="ann-category ann-category-filter bg-white text-black placeholder:italic placeholder:text-slate-400 block bg-whitew-full border border-slate-300 rounded-md py-1 pl-2 pr-4 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm">
                                        <option value="">ทั้งหมด</option>
                                        <option v-for="category in categoryValue" :key="category.categoryId"
                                            v-bind:value="category" :selected="category === categoryValue[0]">
                                            {{ category.categoryName }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="flex items-center justify-end w-1/2 pr-2 ">
                                <button v-if="switchMode"
                                    class="ann-button flex flex-row items-center normal-case rounded bg-gray-300 hover:bg-gray-400">
                                    <p class="p-1 px-3 text-black font-bold" @click="switchMode = false">Closed
                                        Announcements</p>
                                </button>
                                <button v-if="!switchMode"
                                    class="ann-button flex flex-row items-center normal-case rounded bg-gray-300 hover:bg-gray-400">
                                    <p class="p-1 px-3 text-black font-bold" @click="switchMode = true">Active Announcements
                                    </p>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="overflow-x-auto mt-2 " v-if="switchMode">
                        <table class="table w-full ">
                            <thead>
                                <tr>
                                    <th class="normal-case text-lg bg-neutral-800 text-white text-center" style="width: 5%">
                                        No.</th>
                                    <th class="normal-case text-lg bg-neutral-800 text-white" style="width: 70%">Title</th>
                                    <th class="normal-case text-lg bg-neutral-800 text-white" style="width: 15%">Category
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(announ, index) in activeAnnouncements.content" :key="announ.id"
                                    class="ann-item ">
                                    <th class=" bg-white text-black text-center border-t-2 border-gray-200">
                                        {{ index + 1 + (activeAnnouncementPage * 5) }}
                                    </th>
                                    <td style="word-wrap: break-word; white-space: pre-wrap;"
                                        class="ann-title bg-white text-black border-t-2 border-gray-200">
                                        <a class="link link-hover" @click="goToOneAnnounce(announ.id)"> {{
                                            announ?.announcementTitle }} </a>
                                    </td>
                                    <td class="ann-category bg-white text-black border-t-2 border-gray-200 ">{{
                                        announ.announcementCategory }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-if="activeAnnouncements.content && activeAnnouncements.content.length !== 0 && switchMode && pageNumbers.length > 5"
                        class="flex flex-row w-full items-center justify-center space-x-1 mt-3">
                        <button class="ann-page-prev p-2 px-4 bg-blue-500 text-white rounded-md disabled:opacity-50"
                            :disabled="activeAnnouncementPage === 1 || activeAnnouncementPage === 0"
                            @click="goToPage(activeAnnouncementPage - 1)">
                            Prev
                        </button> 
                        <button :class="{ 'active-page': activeAnnouncementPage === pageNumber || (activeAnnouncementPage === 0 && pageNumber === 1), ['ann-page-' + (index) ]: true} "
                            class="p-2 px-4 bg-blue-500 text-white rounded-md disabled:opacity-50" 
                            v-for="(pageNumber, index ) in pageNumbers" :key="pageNumber" @click="goToPage(pageNumber)">
                            {{ pageNumber }}
                        </button>
                        <button class="ann-page-next p-2 px-4 bg-blue-500 text-white rounded-md disabled:opacity-50"
                            :disabled="activeAnnouncementPage === pageCount" @click="goToPage(activeAnnouncementPage + 1)">
                            Next
                        </button>
                    </div>

                    <div class="overflow-x-auto mt-2" v-if="!switchMode">
                        <table class="table w-full">
                            <thead>
                                <tr>
                                    <th class="normal-case text-lg bg-neutral-800 text-white text-center" style="width: 5%">
                                        No.</th>
                                    <th class="normal-case text-lg bg-neutral-800 text-white" style="width: 60%">Title</th>
                                    <th class="normal-case text-lg bg-neutral-800 text-white" style="width: 15%">Closed Date
                                    </th>
                                    <th class="normal-case text-lg bg-neutral-800 text-white" style="width: 15%">Category
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(announ, index) in announcementClose.content" :key="announ.id" class="ann-item ">
                                    <th class=" bg-white text-black text-center border-t-2 border-gray-200">
                                        {{ index + 1 }}
                                    </th>
                                    <td style="word-wrap: break-word; white-space: pre-wrap;"
                                        class="ann-title bg-white text-black border-t-2 border-gray-200">
                                        <a class="link link-hover" @click="goToOneAnnounce(announ.id)"> {{
                                            announ?.announcementTitle }} </a>
                                    </td>
                                    <td class="ann-close-date bg-white text-black border-t-2 border-gray-200 ">{{
                                        localTime(announ.closeDate) }}</td>
                                    <td class="ann-category bg-white text-black border-t-2 border-gray-200 ">{{
                                        announ.announcementCategory }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-if="announcementClose.content && announcementClose.content.length !== 0 && !switchMode && pageNumbers2.length > 5"
                        class="flex flex-row w-full items-center justify-center space-x-1 mt-3">
                        <button class="ann-page-prev p-2 px-4 bg-blue-500 text-white rounded-md disabled:opacity-50"
                            :disabled="closedAnnouncementPage === 1 || closedAnnouncementPage === 0"
                            @click="goToPage2(closedAnnouncementPage - 1)">
                            Prev
                        </button>
                        <button
                            :class="{ 'active-page': closedAnnouncementPage === pageNumber || (closedAnnouncementPage === 0 && pageNumber === 1), ['ann-page-' + (index)]: true }"
                            class="p-2 px-4 bg-blue-500 text-white rounded-md disabled:opacity-50"
                            v-for="(pageNumber, index )  in pageNumbers2" :key="pageNumber" @click="goToPage2(pageNumber)">
                            {{ pageNumber }}
                        </button>
                        <button class="ann-page-next p-2 px-4 bg-blue-500 text-white rounded-md disabled:opacity-50"
                            :disabled="closedAnnouncementPage === pageCount2"
                            @click="goToPage2(closedAnnouncementPage + 1)">
                            Next
                        </button>
                    </div>
                    <div v-if="announcementClose.content && announcementClose.content.length === 0 && !switchMode"
                        class="flex w-full h-4/6  justify-center items-center">
                        <div class=" font-bold text-4xl text-gray-500">No Announcement</div>
                    </div>
                    <div v-if="activeAnnouncements.content && activeAnnouncements.content.length === 0 && switchMode"
                        class="flex w-full h-4/6  justify-center items-center">
                        <div class=" font-bold text-4xl text-gray-500">No Announcement</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
     
<style scoped>
td {
    word-wrap: break-word;
    max-width: 200px;
    white-space: pre-wrap;
}

table {
    width: 100%;
    table-layout: fixed;
}

th,
td {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.active-page {
    background-color: #33CCFF;
    color: white;
}
</style>