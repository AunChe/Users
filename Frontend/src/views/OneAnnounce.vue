<script setup>
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { ref,onMounted } from 'vue'
import { QuillEditor } from '@vueup/vue-quill';
import { getAnnouncementById } from '../composable/getAnnouncement'

const router = useRouter()
const { params } = useRoute()
const data = ref({})

const backListAnnouce =() => {
    router.push({ name : 'ListAllAnnouncement'})
}

const goToEditAnnounce = (name,id) => {
    if(id !== undefined){
        router.push({name: name, params: {id: id}})
    }else {
        router.push({name: name})
    }
}

onMounted(async () => {
    data.value = await getAnnouncementById(parseInt(params.id))
    console.log(data.value)
})

const Timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const localTime = (date) => {
    if(date === null) {
        return '-'
    }
    else {
        const datetimeString = date
        const datetimeUTC = new Date(datetimeString)
        const datetimelocal = datetimeUTC.toLocaleString('en-GB' , { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false,timeZone: Timezone})
        return datetimelocal
    }
}

const editorOption = {
    readOnly: true
}

</script>
 
<template>
    <div class="w-full h-screen bg-gray-200">
        <div  class="flex w-full h-auto bg-gray-200 justify-center">
        <div v-if="data === undefined" class="flex w-full h-4/6  justify-center items-center">
               <div class=" font-bold text-4xl text-black">No Announcement</div>
        </div> 
        <div v-else class="flex flex-col w-5/6 h-full">
            <div class="flex flex-row w-full h-20 justify-start items-center ">
                <p class="flex w-1/2 text-3xl font-bold text-black">Announcement Detail:</p>
                <div class="flex w-1/2 h-full items-center justify-end">
                    <div class="rounded-xl bg-white  p-1 pl-2.5  flex flex-row items-center space-x-2 mt-2">
                        <img src="../components/icons/view.png" class="w-5 h-5" /><p class="text-lg font-semibold text-black pr-2 ">{{ data.view }}</p>
                    </div>
                </div>
            </div>
            
            <div  class="ann-item w-full rounded-xl border  bg-white">
                <div class="flex flex-row">
                    <p class="flex items-center w-40 h-16 pl-6  text-lg font-semibold text-black">Title</p>
                    <p class="ann-title flex items-center w-full h-16 pl-6  text-lg text-black" >{{ data.announcementTitle }}</p>
                </div>
                <div class="flex flex-row">
                    <p class="flex items-center w-40 h-16 pl-6  text-lg font-semibold text-black">Category</p>
                    <p class="ann-category flex items-center w-full h-16 pl-6  text-lg text-black" >{{ data.announcementCategory }}</p>
                </div>    
                <div class="flex flex-row">
                    <p class="flex items-center w-40 h-16 pl-6  text-lg font-semibold text-black">Description</p>
                    <div class="ann-description flex items-center w-full  pl-6  text-lg text-black" >
                        <QuillEditor toolbar="#toolbars" v-model:content="data.announcementDescription" content-type="html" class="ann-description w-full " :options="editorOption" >
                            <template #toolbar>
                                <div id="toolbars" class=" hidden"></div>
                            </template>
                    
                        </QuillEditor>
                    </div>
                </div>
                <div class="flex flex-row">
                    <p class="flex items-center w-40 h-16 pl-6  text-lg font-semibold text-black">Publish Date</p>
                    <p class="ann-publish-date flex items-center w-full h-16 pl-6  text-lg text-black" >{{ localTime(data.publishDate)}}</p>
                </div>
                <div class="flex flex-row">
                    <p class="flex items-center w-40 h-16 pl-6  text-lg font-semibold text-black">Close Date</p>
                    <p class="ann-close-date flex items-center w-full h-16 pl-6  text-lg text-black" >{{ localTime(data.closeDate) }}</p>
                </div>    
                <div class="flex flex-row">
                    <p class="flex items-center w-40 h-16 pl-6  text-lg font-semibold text-black">Display</p>
                    <p class="ann-display flex items-center w-full h-16 pl-6  text-lg text-black" >{{ data.announcementDisplay }}</p>
                </div>          

            </div>
            <div class="flex flex-row space-x-2 pb-6">
                <button @click="backListAnnouce()" class="ann-button w-14 p-1 px-3 normal-case rounded bg-gray-300 hover:bg-gray-400 mt-3 text-black" >Back</button>
                <button @click="goToEditAnnounce('EditAnnouncement',params?.id)" class="ann-button w-14 p-1 px-3 normal-case rounded bg-gray-300 hover:bg-gray-400 mt-3 text-black" >Edit</button>
            </div>
        </div>
    </div>
    </div>

    </template>
     
    <style scoped>
        p {
          word-wrap: break-word;
          max-width: 1100px;
          white-space: pre-wrap;
        }
        
    </style>