<script setup>
import { ref, onMounted } from 'vue'
import { getAllAnnouncement } from '../composable/getAnnouncement'
import { useRouter } from 'vue-router'
import MenuDisplay from '../components/MenuDisplay.vue';
import TimezoneDisplay from '../components/TimezoneDisplay.vue';

const announcement = ref([])
onMounted(async () => {
  announcement.value = await getAllAnnouncement()
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

const router = useRouter()

const goToOneAnnounce = (announceId) => {
  console.log(announceId)
  router.push({
    name: 'OneAnnouncement',
    params: { id: announceId }
  })
}

const goToAddAnnounce = () => {
  router.push({ name: 'AddNewAnnouncement' })
}



const deleteAnnounce = async (id) => {
  try {
    if (confirm("Are you sure you want to delete this announcement?")) {
      const res = await fetch(import.meta.env.VITE_ROOT_API + "/api/announcements/" + id, {
        method: 'DELETE'
      })
      if (res.ok) {
        announcement.value = announcement.value.filter((ann) => {
          return ann.id !== id
        })
      }
      else throw new Error('Oops, sorry cannot delete')
    }
  }
  catch (err) {
    console.log(err)
  }
}


</script>
 
<template>
  <div class="w-full h-screen">
    <div class="flex flex-row w-full h-full">

      <!-- menu -->
      <MenuDisplay />

      <div class="flex flex-col w-full h-full  bg-gray-300 items-center">
        <div class="flex w-full h-16  bg-gray-300 justify-center items-center">
          <p class="ann-title text-2xl font-bold text-black">SIT Announcement System (SAS)</p>
        </div>
        <div class="w-full h-4/5 bg-gray-300  p-6">
          <div class="w-full h-full bg-white rounded p-7">
            <div class="flex flex-col w-full h-full ">

              <!-- Date/Time -->
              <div class="flex flex-row w-full h-10 ">
                <TimezoneDisplay />
                <div class="flex items-center justify-end w-1/2 pr-2">
                  <button @click="goToAddAnnounce()"
                    class="ann-button flex flex-row items-center normal-case rounded bg-green-500 hover:bg-green-600 text-black">
                    <img src="../components/icons/add.png" alt="logo" class="w-7 h-7 rounded rounded-r-none bg-green-400">
                    <p class="pr-3 pl-3 text-white font-bold">Add Announcement</p>
                  </button>
                </div>
              </div>

              <!-- Table -->
              <div class="overflow-x-auto mt-2 ">
                <table class="table w-full">
                  <thead class="sticky top-0 ">
                    <tr>
                      <th class="normal-case text-lg bg-neutral-200 text-black text-center">No.</th>
                      <th class="normal-case text-lg bg-neutral-200 text-black">Title</th>
                      <th class="normal-case text-lg bg-neutral-200 text-black">Category</th>
                      <th class="normal-case text-lg bg-neutral-200 text-black">Publish Date</th>
                      <th class="normal-case text-lg bg-neutral-200 text-black">Close Date</th>
                      <th class="normal-case text-lg bg-neutral-200 text-black text-center">Display</th>
                      <th class="normal-case text-lg bg-neutral-200 text-black text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(announ, index) in announcement" :key="announ.id" class="ann-item ">
                      <td class=" bg-white text-black text-center border-t-2 border-gray-200">{{ index + 1 }}</td>
                      <td style="word-wrap: break-word; white-space: pre-wrap;"
                        class="ann-title bg-white text-black border-t-2 border-gray-200">{{ announ?.announcementTitle }}
                      </td>
                      <td class="ann-category bg-white text-black border-t-2 border-gray-200">
                        {{ announ.announcementCategory }}</td>
                      <td class="ann-publish-date bg-white text-black border-t-2 border-gray-200">
                        {{ localTime(announ.publishDate) }}</td>
                      <td class="ann-close-date bg-white text-black border-t-2 border-gray-200">
                        {{ localTime(announ.closeDate) }}</td>
                      <td class="ann-display bg-white text-black text-center border-t-2 border-gray-200">
                        {{ announ.announcementDisplay }}</td>
                      <td class=" bg-white border-t-2 border-gray-200 text-center">
                        <div class="flex flex-row w-full space-x-2 justify-center">
                          <button @click="goToOneAnnounce(announ.id)"
                            class="ann-button w-14 p-1 px-3 normal-case rounded bg-blue-400 hover:bg-blue-500 text-black">view</button>
                          <button class="ann-button  p-1 px-3 normal-case rounded bg-red-400 hover:bg-red-500 text-black"
                            @click="deleteAnnounce(announ.id)">delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-if="announcement && announcement.length === 0"
                class="flex w-full h-4/6  justify-center items-center">
                <div class=" font-bold text-4xl text-gray-500">No Announcement</div>
              </div>

            </div>
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
}</style>
