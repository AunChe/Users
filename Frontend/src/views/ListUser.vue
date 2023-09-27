<script setup>
import { ref, onMounted } from 'vue'
import { getAllUsers } from '../composable/getAnnouncement'
import { useRouter } from 'vue-router'
import TimezoneDisplay from '../components/TimezoneDisplay.vue';
import MenuDisplay from '../components/MenuDisplay.vue';

const router = useRouter()
const goToAddNewUser = () => {
  router.push({ name: 'AddNewUser' })
}

const goToOneUser = (userId) => {
  console.log(userId)
  router.push({
    name: 'EditUser',
    params: { id: userId }
  })
}

const userAll = ref([])
onMounted(async () => {
    userAll.value = await getAllUsers()
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

const deleteUser = async (id) => {
  try {
    if (confirm("Are you sure you want to delete this user?")) {
      const res = await fetch(import.meta.env.VITE_ROOT_API + "/api/users/" + id, {
        method: 'DELETE'
      })
      if (res.ok) {
        userAll.value = userAll.value.filter((use) => {
          return use.id !== id
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
                    <p class="ann-title text-2xl font-bold text-black">User Management</p>
                </div>
                <div class="w-full h-4/5 bg-gray-300  p-6">
                    <div class="w-full h-full bg-white rounded p-7">
                        <div class="flex flex-col w-full h-full ">

                            <!-- Date/Time -->
                            <div class="flex flex-row w-full h-10 ">
                                <TimezoneDisplay />
                                <div class="flex items-center justify-end w-1/2 pr-2">
                                    <button @click="goToAddNewUser()"
                                        class="ann-button flex flex-row items-center normal-case rounded bg-green-500 hover:bg-green-600 text-black">
                                        <img src="../components/icons/add.png" alt="logo"
                                            class="w-7 h-7 rounded rounded-r-none bg-green-400">
                                        <p class="pr-3 pl-3 text-white font-bold">Add User</p>
                                    </button>
                                </div>
                            </div>

                            <!-- Table -->
                            <div class="overflow-x-auto mt-2 ">
                                <table class="table w-full">
                                    <thead class="sticky top-0 ">
                                        <tr>
                                            <th class="normal-case text-lg bg-neutral-200 text-black text-center">No.</th>
                                            <th class="normal-case text-lg bg-neutral-200 text-black">Username</th>
                                            <th class="normal-case text-lg bg-neutral-200 text-black">Name</th>
                                            <th class="normal-case text-lg bg-neutral-200 text-black">Email</th>
                                            <th class="normal-case text-lg bg-neutral-200 text-black">Role</th>
                                            <th class="normal-case text-lg bg-neutral-200 text-black text-center">Created On
                                            </th>
                                            <th class="normal-case text-lg bg-neutral-200 text-black text-center">Updated On
                                            </th>
                                            <th class="normal-case text-lg bg-neutral-200 text-black text-center">Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(user, index) in userAll" :key="user.id" class="ann-item ">
                                            <td class=" bg-white text-black text-center border-t-2 border-gray-200">{{ index + 1 }}</td>
                                            <td style="word-wrap: break-word; white-space: pre-wrap;"
                                                class="ann-username bg-white text-black border-t-2 border-gray-200">{{ user?.username }}
                                            </td>
                                            <td class="ann-name bg-white text-black border-t-2 border-gray-200">{{ user?.name }}</td>
                                            <td class="ann-email bg-white text-black border-t-2 border-gray-200">{{ user?.email }}</td>
                                            <td class="ann-role bg-white text-black border-t-2 border-gray-200">{{ user?.role }}</td>
                                            <td class="ann-created-on bg-white text-black border-t-2 border-gray-200">{{ localTime(user?.createdOn) }}</td>
                                            <td class="ann-updated-on bg-white text-black text-center border-t-2 border-gray-200">{{ localTime(user?.updatedOn) }}</td>
                                            <td class=" bg-white border-t-2 border-gray-200 text-center">
                                                <div class="flex flex-row w-full space-x-2 justify-center">
                                                    <button @click="goToOneUser(user.id)"
                                                        class="ann-button w-14 p-1 px-3 normal-case rounded bg-yellow-300 hover:bg-yellow-400 text-black">edit</button>
                                                    <button
                                                        class="ann-button  p-1 px-3 normal-case rounded bg-red-400 hover:bg-red-500 text-black"
                                                        @click="deleteUser(user.id)">delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-if="userAll && userAll.length === 0"
                                class="flex w-full h-4/6  justify-center items-center">
                                <div class=" font-bold text-4xl text-gray-500">No User</div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
 
<style scoped></style>