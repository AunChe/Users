<script setup>
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { ref, onMounted, watch, onUpdated } from 'vue'
import { getAnnouncementById } from '../composable/getAnnouncement'
import { getCategory } from '../composable/getAnnouncement'
import { QuillEditor } from '@vueup/vue-quill';


const isFieldEdit = ref(false);
const editAnnounce = ref({})
const editedAnnounce = ref({})
watch(editedAnnounce, () => {
    if (editedAnnounce.value.announcementTitle !== editAnnounce.value.announcementTitle ||
        editedAnnounce.value.announcementDescription !== editAnnounce.value.announcementDescription ||
        editedAnnounce.value.publishDate !== editAnnounce.value.publishDate ||
        editedAnnounce.value.closeDate !== editAnnounce.value.closeDate ||
        editedAnnounce.value.announcementDisplay !== editAnnounce.value.announcementDisplay ||
        editedAnnounce.value.announcementCategory !== editAnnounce.value.announcementCategory) {
        isFieldEdit.value = true;
    } else {
        console.log('no edit')
        isFieldEdit.value = false;
    }
}, { deep: true })

const categoryValue = ref([])
onMounted(async () => {
    categoryValue.value = await getCategory()
    console.log(categoryValue.value)

})

const router = useRouter()
const { params } = useRoute()

const backOneAnnounce = () => {
    router.push({ name: 'OneAnnouncement' })
}

const backListAnnouce = () => {
    router.push({ name: 'ListAllAnnouncement' })
}

const checkDisplay = ref(false)
let publishDated = ref('')
let publishTime = ref('')
let closeDated = ref('')
let closeTime = ref('')
onMounted(async () => {
    editAnnounce.value = await getAnnouncementById(parseInt(params?.id))
    console.log(editAnnounce.value)
    if (editAnnounce.value.announcementDisplay === 'Y') {
        checkDisplay.value = true
    } else {
        checkDisplay.value = false
    }
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const dateTime = editAnnounce.value.publishDate
    if (dateTime) {
        const date = new Date(dateTime)
        publishDated.value = date.toLocaleString('en-CA', { timeZone: timezone }).slice(0, 10)
        publishTime.value = date.toLocaleString('en-GB', { timeZone: timezone }).slice(12, 17)
    }

    const dateTime2 = editAnnounce.value.closeDate
    if (dateTime2) {
        const date = new Date(dateTime2)
        closeDated.value = date.toLocaleString('en-CA', { timeZone: timezone }).slice(0, 10)
        closeTime.value = date.toLocaleString('en-GB', { timeZone: timezone }).slice(12, 17)
    }

    editedAnnounce.value = {
        announcementTitle: editAnnounce.value.announcementTitle,
        announcementDescription: editAnnounce.value.announcementDescription,
        publishDate: editAnnounce.value.publishDate,
        closeDate: editAnnounce.value.closeDate,
        announcementDisplay: editAnnounce.value.announcementDisplay,
        announcementCategory: editAnnounce.value.announcementCategory
    }

    console.log(editedAnnounce.value)
})


const updateAnnounce = () => {
    const matchedCategory = categoryValue.value.find(category => category.categoryName === editedAnnounce.value.announcementCategory)
    if (matchedCategory) {
        editedAnnounce.value.categoryId = matchedCategory.categoryId
    }
    if (checkDisplay.value) {
        editedAnnounce.value.announcementDisplay = 'Y'
    } else {
        editedAnnounce.value.announcementDisplay = 'N'
    }
    {
        const pubDate = new Date(`${publishDated.value}T${publishTime.value}:00`);
        const closeDate = new Date(`${closeDated.value}T${closeTime.value}:00`);
        const utcPubDate = pubDate.toISOString();
        const utcCloseDate = closeDate.toISOString();
        const formattedPubDate = `${utcPubDate.slice(0, 19)}Z`
        const formattedCloseDate = `${utcCloseDate.slice(0, 19)}Z`


        if (publishDated.value !== '' && publishTime.value !== '' && closeDated.value == '' && closeTime.value == '') {
            editedAnnounce.value.publishDate = formattedPubDate;
            editedAnnounce.value.closeDate = null;
        } else if (closeDated.value !== '' && closeTime !== '' && publishDated.value == '' && publishTime.value == '') {
            editedAnnounce.value.closeDate = formattedCloseDate;
            editedAnnounce.value.publishDate = null;
        } else if (publishDated.value !== '' && publishTime.value !== '' && closeDated.value !== '' && closeTime.value !== '') {
            editedAnnounce.value.publishDate = formattedPubDate;
            editedAnnounce.value.closeDate = formattedCloseDate;
        } else {
            editedAnnounce.value.publishDate = null;
            editedAnnounce.value.closeDate = null;
        }
        return editedAnnounce.value
    }

}

const checkDates = () => {
    const currentDateTime = new Date();
    const publishDateTime = new Date(`${publishDated.value} ${publishTime.value}`);
    const closeDateTime = new Date(`${closeDated.value} ${closeTime.value}`);

    if (publishDateTime < currentDateTime) {
        alert("Error: Please check the date and time again.");
        return false; 
    }
    if (closeDateTime < publishDateTime) {
        alert("Error: Please check the date and time again.");
        return false
    }
    if (closeDateTime <= currentDateTime) {
        alert("Error: Please check the date and time again.");
        return false
    }
    return true

};
const editAnnouncement = async () => {
    updateAnnounce()

    if (editedAnnounce.value.announcementTitle !== '' && editedAnnounce.value.announcementDescription !== '' && checkDates() == true) {
        console.log(editedAnnounce.value)
        try {
            const res = await fetch(import.meta.env.VITE_ROOT_API + "/api/announcements/" + params.id, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    announcementTitle: editedAnnounce.value.announcementTitle,
                    announcementDescription: editedAnnounce.value.announcementDescription,
                    publishDate: editedAnnounce.value.publishDate,
                    closeDate: editedAnnounce.value.closeDate,
                    announcementDisplay: editedAnnounce.value.announcementDisplay,
                    categoryId: editedAnnounce.value.categoryId
                })
            })
            if (res.status === 200) {
                console.log('update successfully')
                backListAnnouce()
            } else throw new Error('Oops, sorry cannot update')
        } catch (err) {
            console.log(err)
        }
    }
}
watch([closeDated, closeTime], ([newCloseDated, newCloseTime], [oldCloseDated, oldCloseTime]) => {
    if (newCloseDated !== oldCloseDated || newCloseTime !== oldCloseTime) {
        isFieldEdit.value = true;
    } else {
        console.log('no edit')
        isFieldEdit.value = false;
    }
})
watch([publishDated, publishTime], ([newPublishDated, newPublishTime], [oldPublishDated, oldPublishTime]) => {
    if (newPublishDated !== oldPublishDated || newPublishTime !== oldPublishTime) {
        isFieldEdit.value = true;
    } else {
        console.log('no edit')
        isFieldEdit.value = false;
    }
})
watch(checkDisplay, () => {
    if (editedAnnounce.value.announcementDisplay !== checkDisplay.value) {
        isFieldEdit.value = true;
    } else {
        isFieldEdit.value = false;
    }
})
//date
const enablePublishTime = ref(false)
const enableCloseTime = ref(false)
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
                    <input v-model="editedAnnounce.announcementTitle"
                        class="ann-title placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-4 pr-4 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                        maxlength="200" type="text" />
                    <p>{{ editedAnnounce.announcementTitle?.length }}/200</p>
                </div>
                <p class="font-bold text-black pl-4 mb-1">Category</p>
                <div class="w-1/3 pl-4 mb-2">
                    <select v-model="editedAnnounce.announcementCategory"
                        class="ann-category placeholder:italic placeholder:text-slate-400 block bg-gray-300 w-full border border-slate-300 rounded-md py-2 pl-4 pr-4 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm">
                        <option v-for="category in categoryValue" :key="category.categoryId" :value="category.categoryName">
                            {{ category.categoryName }}</option>
                    </select>
                </div>
                <p class="font-bold text-black pl-4 mb-1  ">Description</p>
                <div class="px-4 mb-2 flex flex-col items-start justify-center">
                    <QuillEditor theme="snow" toolbar="full" v-model:content="editedAnnounce.announcementDescription"
                        contentType="html" maxlength="10000"
                        class="ann-description  bg-white w-full h-28 border border-slate-300 rounded-md  " />
                    <div class="flex w-full justify-end ">
                        <p>{{ editedAnnounce.announcementDescription?.length }}/10000</p>
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
                    <input type="checkbox" class="ann-display" :checked="checkDisplay" v-model="checkDisplay" />
                    <label for="checkbox">Check to show this announcement</label>
                </div>
                <div class="px-4 flex flex-row space-x-2 mb-4 mt-2">
                    <button @click="editAnnouncement()" :disabled="!isFieldEdit"
                        class="ann-button  font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        :class="!isFieldEdit ? 'cursor-not-allowed bg-gray-300 hover:bg-gray-300 text-gray-700' : 'bg-green-300 hover:bg-green-400 text-black'"
                        type="button">Submit
                    </button>
                    <button @click="backOneAnnounce()"
                        class="ann-button bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>
 
<style scoped></style>
