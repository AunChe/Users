<script setup>
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { getAnnouncementByIdView } from '../composable/getAnnouncement'
import { QuillEditor } from '@vueup/vue-quill';

const router = useRouter()
const { params } = useRoute()
const data = ref({})
onMounted(async () => {
    data.value = await getAnnouncementByIdView(parseInt(params.id))
    console.log(data.value)
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
const backListAnnouce = () => {
    router.push({ name: 'UserViewListAnnouncement' })
}
const editorOption = {
    readOnly: true
}

</script>
 
<template>
    <div class=" w-screen h-screen bg-gray-200">
        <div class="w-full h-full flex justify-center ">
            <div class="w-4/6 h-auto flex flex-col ">
                <div class=" w-full h-1/6 mt-10 pt-5 bg-white rounded-b-none rounded-xl border border-gray-300">
                    <div class="flex flex-col w-full h-4/5 bg-white">
                        <div class="ann-title flex items-center justify-start pl-4 w-full h-2/3 text-black font-semibold">{{
                            data.announcementTitle }}</div>
                        <div class="flex flex-row w-full h-1/1 bg-white">
                            <div class="ann-category flex w-1/2 h-full items-center justify-start pl-4 text-gray-400">{{
                                data.announcementCategory }}</div>
                            <div class="ann-close-date flex w-1/2 h-full items-center justify-end pr-4 space-x-2">
                                <p class="text-red-400 ">Closed on : </p>
                                <p class=" text-gray-400">{{ localTime(data.closeDate) }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    class="ann-description flex items-center justify-start  w-full bg-white  border border-gray-300 border-t-0 py-5">
                    <QuillEditor toolbar="#toolbars" v-model:content="data.announcementDescription" content-type="html"
                        class="ann-description  text-black w-full" :options="editorOption">
                        <template #toolbar>
                            <div id="toolbars" class=" hidden"></div>
                        </template>

                    </QuillEditor>
                </div>
                <div
                    class="flex items-center justify-start pl-4 w-full h-14 rounded-t-none rounded-xl border border-t-0 border-gray-300 bg-white">
                    <button @click="backListAnnouce()"
                        class="ann-button w-14 p-1 px-3 normal-case rounded bg-gray-300 hover:bg-gray-400  text-black">Back</button>
            </div>
        </div>
    </div>

</div></template>
 
<style scoped></style>