<script setup>
import { onMounted, onUpdated, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getCategory } from '../composable/getAnnouncement'
import { QuillEditor } from '@vueup/vue-quill';

const router = useRouter()

const categoryNameSelect = ref()
const categoryValue = ref([])
onMounted(async () => {
    categoryValue.value = await getCategory()
    console.log(categoryValue.value)
    categoryNameSelect.value = categoryValue.value[0]

})
const CancelListAnnounce = () => {
    router.push({ name: 'ListAllAnnouncement' })
}

const checkDisplay = ref(false)
const publishDated = ref('')
const publishTime = ref('')
const closeDated = ref('')
const closeTime = ref('')
const enablePublishTime = ref(false)
const enableCloseTime = ref(false)

const addNewAnnounce = ref({
    announcementTitle: '',
    announcementDescription: '',
    publishDate: '-',
    closeDate: '-',
    announcementDisplay: 'N',
    categoryId: categoryValue.value.categoryId,
    view: ''
})
// date
const clearPublish = () => {
    if (publishDated.value !== '') {
        publishDated.value = ''
        publishTime.value = ''
    }
}
const clearClose = () => {
    if (closeDated.value !== '') {
        closeDated.value = ''
        closeTime.value = ''
    }
}

watch([publishDated, closeDated], () => {

    if (publishTime.value === '') {
        publishTime.value = publishDated.value !== '' ? '06:00' : ''
    }
    if (closeTime.value == '') {
        closeTime.value = closeDated.value !== '' ? '18:00' : ''
    }

}, { deep: true })

onUpdated(() => {
    if (publishDated.value !== '') {
        enablePublishTime.value = true
    }
    if (closeDated.value !== '') {
        enableCloseTime.value = true
    }
})



const createAnnounce = () => {

    addNewAnnounce.value.categoryId = categoryNameSelect.value.categoryId

    if (checkDisplay.value) {
        addNewAnnounce.value.announcementDisplay = 'Y'
    } else {
        addNewAnnounce.value.announcementDisplay = 'N'
    }

    {
        const pubDate = new Date(`${publishDated.value}T${publishTime.value}:00`);
        const closeDate = new Date(`${closeDated.value}T${closeTime.value}:00`);
        const utcPubDate = pubDate.toISOString();
        const utcCloseDate = closeDate.toISOString();
        const formattedPubDate = `${utcPubDate.slice(0, 19)}Z`
        const formattedCloseDate = `${utcCloseDate.slice(0, 19)}Z`

        if (publishDated.value !== '' && publishTime.value !== '' && closeDated.value == '' && closeTime.value == '') {
            addNewAnnounce.value.publishDate = formattedPubDate;
            addNewAnnounce.value.closeDate = null;
        } else if (closeDated.value !== '' && closeTime !== '' && publishDated.value == '' && publishTime.value == '') {
            addNewAnnounce.value.closeDate = formattedCloseDate;
            addNewAnnounce.value.publishDate = null;
        } else if (publishDated.value !== '' && publishTime.value !== '' && closeDated.value !== '' && closeTime.value !== '') {
            addNewAnnounce.value.publishDate = formattedPubDate;
            addNewAnnounce.value.closeDate = formattedCloseDate;
        } else {
            addNewAnnounce.value.publishDate = null;
            addNewAnnounce.value.closeDate = null;
        }
        return ''
    }

}

const addNewAnnouncement = async (announce) => {
    createAnnounce();

    const currentDate = new Date();

    if (announce.announcementTitle !== '' && announce.announcementDescription !== '') {
        if (
            (announce.publishDate && new Date(announce.publishDate) < currentDate) ||
            (announce.closeDate && new Date(announce.closeDate) <= new Date(announce.publishDate))
        ) {
            alert('Error: Please check the date and time again.');
            return;
        }

        try {
            const res = await fetch(import.meta.env.VITE_ROOT_API + "/api/announcements", {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    announcementTitle: announce.announcementTitle,
                    announcementDescription: announce.announcementDescription,
                    publishDate: announce.publishDate,
                    closeDate: announce.closeDate,
                    announcementDisplay: announce.announcementDisplay,
                    categoryId: announce.categoryId,
                    view: 0
                })
            })
            if (res.status === 200) {
                console.log('add successfully')
                CancelListAnnounce()
            } else throw new Error('Oops, sorry cannot add!')
        } catch (err) {
            console.log(err)
        }
    }
}


</script>
<template>
    <div class="w-full h-screen bg-gray-200">
        <div class="flex w-full h-full justify-center items-center">
            <div class="flex flex-col w-5/6  bg-white rounded-xl border">
                <div class="flex w-full h-12 justify-start items-center ">
                    <p class="text-xl font-bold text-black pl-4">Announcement Detail:</p>
                </div>
                <p class="font-bold text-black pl-4 mb-1">Title</p>
                <div class="px-4 mb-2 flex flex-col items-end">
                    <input v-model="addNewAnnounce.announcementTitle"
                        class="ann-title placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-4 pr-4 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                        maxlength="200" type="text" />
                    <p>{{ addNewAnnounce.announcementTitle.length }}/200</p>
                </div>
                <p class="font-bold text-black pl-4 mb-1">Category</p>
                <div class="w-1/3 pl-4 mb-2">
                    <select v-model="categoryNameSelect"
                        class="ann-category placeholder:italic placeholder:text-slate-400 block bg-gray-300 w-full border border-slate-300 rounded-md py-2 pl-2 pr-4 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm">
                        <option v-for="category in categoryValue" :key="category.categoryId" v-bind:value="category"
                            :selected="category === categoryValue[0]">
                            {{ category.categoryName }}
                        </option>
                    </select>
                </div>
                <p class="font-bold text-black pl-4 mb-1">Description</p>
                <div class="px-4 mb-2 flex flex-col items-start justify-center">
                    <QuillEditor theme="snow" toolbar="full" v-model:content="addNewAnnounce.announcementDescription"
                        contentType="html" maxlength="10000"
                        class="ann-description  bg-white w-full h-28 border border-slate-300 rounded-md  " />
                    <div class="flex w-full justify-end ">
                        <p>{{ addNewAnnounce.announcementDescription.length }}/10000</p>
                    </div>

                </div>
                <p class="font-bold text-black pl-4 mb-1">Publish Date</p>
                <div class="px-4 mb-2 flex flex-row space-x-3">
                    <input v-model="publishDated"
                        class="ann-publish-date placeholder:italic placeholder:text-slate-300 block bg-white w-40 border border-slate-300 rounded-md py-2  shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                        type="date" />
                    <input v-model="publishTime" :disabled="!enablePublishTime"
                        :class="!enablePublishTime ? 'cursor-not-allowed text-zinc-300' : ''"
                        class="ann-publish-time placehtimeolder:italic placeholder:text-slate-300 block bg-white w-40 border border-slate-300 rounded-md py-2  shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                        type="time" />
                    <button v-if="publishDated != ''" @click="clearPublish"
                        class="ann-button bg-red-400 hover:bg-red-500 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">clear</button>
                </div>
                <p class="font-bold text-black pl-4 mb-1">Close Date</p>
                <div class="px-4 mb-2 flex flex-row space-x-3">
                    <input v-model="closeDated"
                        class="ann-close-date placeholder:italic placeholder:text-slate-300 block bg-white w-40 border border-slate-300 rounded-md py-2  shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                        type="date" />
                    <input v-model="closeTime" :disabled="!enableCloseTime"
                        :class="!enableCloseTime ? 'cursor-not-allowed text-zinc-300' : ''"
                        class="ann-close-time placehtimeolder:italic placeholder:text-slate-300 block bg-white w-40 border border-slate-300 rounded-md py-2  shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                        type="time" />
                    <button v-if="closeTime != ''" @click="clearClose"
                        class="ann-button bg-red-400 hover:bg-red-500 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">clear</button>
                </div>
                <p class="font-bold text-black pl-4 mb-1">Display</p>
                <div class="px-4 mb-2 flex flex-row space-x-3">
                    <input type="checkbox" class="ann-display" v-model="checkDisplay" />
                    <label for="checkbox">Check to show this announcement</label>
                </div>
                <div class="px-4 flex flex-row space-x-2 mb-4 mt-2">
                    <button v-if="addNewAnnounce.announcementTitle !== '' && addNewAnnounce.announcementDescription !== ''"
                        @click="addNewAnnouncement(addNewAnnounce)"
                        class="ann-button bg-green-300 hover:bg-green-400 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button">Submit</button>
                    <button v-else
                        class="ann-button cursor-not-allowed bg-gray-300 hover:bg-gray-300 text-gray-700  font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button">Submit</button>
                    <button @click="CancelListAnnounce()"
                        class="ann-button bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>
 
<style scoped></style>
