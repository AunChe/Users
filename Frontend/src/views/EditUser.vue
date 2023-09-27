<script setup>
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { ref, onMounted, watch, computed} from 'vue'
import { getUserById } from '../composable/getAnnouncement'
import MenuDisplay from '../components/MenuDisplay.vue';
const annStatus = ref('');

const isFieldEdit = ref(false);
const editUser = ref({})
const editedUser = ref({})
watch(editedUser, () => {
    if (editedUser.value.username !== editUser.value.username  ||
        editedUser.value.name !== editUser.value.name  || 
        editedUser.value.email !== editUser.value.email  || 
        editedUser.value.role !== editUser.value.role) {
        isFieldEdit.value = true;
    } else {
        console.log('no edit')
        isFieldEdit.value = false;
    }
}, { deep: true })



const router = useRouter()
const { params } = useRoute()



const backListUser = () => {
    router.push({ name: 'ListAllUser' })
}

onMounted(async () => {
    editUser.value = await getUserById(parseInt(params?.id))
    console.log(editUser.value)

    editedUser.value = {
        username: editUser.value.username,
        name: editUser.value.name,
        email: editUser.value.email,
        role: editUser.value.role,
        createdOn: editUser.value.createdOn,
        updatedOn: editUser.value.updatedOn
    }

    console.log(editedUser.value)
})


const updateUser = () => {

    return editedUser.value


}


const editUsers = async () => {
    updateUser()
    try {
        const res = await fetch(import.meta.env.VITE_ROOT_API + "/api/users/" + params.id, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                username: editedUser.value.username,
                name: editedUser.value.name,
                email: editedUser.value.email,
                role: editedUser.value.role,
                createdOn: editedUser.value.createdOn,
                updatedOn: editedUser.value.updatedOn
            })
        })
        if (res.status === 200) {
            console.log('update successfully')
        } else if (res.status === 400) {
            annStatus.value = 'does not unique';
           
        } else throw new Error('Oops, sorry cannot update')
    } catch (err) {
        console.log(err)
    }

}

const nameLength = computed(() => editedUser.value.name.length); 
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
const preventSpacebar = (event) => {
    if (event.key === ' ' && event.target.value.trim() === '') {
        event.preventDefault(); // ป้องกันการใส่ Spacebar 
    }
};


</script>
<template>
    <div class="w-full h-screen bg-gray-200">
        <div class="flex flex-row w-full h-full">

            <!-- menu -->
            <MenuDisplay />

            <div class="flex w-full h-full justify-center items-center">
                <div class="flex flex-col w-5/6  bg-white rounded-xl border">
                    <div class="flex w-full h-12 justify-start items-center ">
                        <p class="text-xl font-bold text-black pl-4">User Detail:</p>
                    </div>
                    <p class="font-bold text-black pl-4 mb-1">Username</p>
                    <div class="px-4 mb-2 flex flex-col items-end">
                        <input v-model="editedUser.username"
                            class="ann-username placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-4 pr-4 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                            maxlength="45" type="text" required  @keydown="preventSpacebar($event)" />
                           <div v-if="annStatus" class=" text-red-500">
                     <div class="ann-error-username">{{ annStatus }}</div>
                   </div>

                    </div>
                    <p class="font-bold text-black pl-4 mb-1">Name</p>
                    <div class="px-4 mb-2 flex flex-col items-end">
                        <input v-model="editedUser.name"
                            class="ann-name placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-4 pr-4 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                            maxlength="100" type="text" required  @keydown="preventSpacebar($event)" />
                              <div v-if="annStatus" class=" text-red-500">
                     <div class="ann-error-name">{{ annStatus }}</div>
                   </div>
                    </div>
                    <p class="font-bold text-black pl-4 mb-1">Email</p>
                    <div class="px-4 mb-2 flex flex-col items-end">
                        <input v-model="editedUser.email"
                            class="ann-email placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-4 pr-4 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                            maxlength="150" type="text" required  @keydown="preventSpacebar($event)" />
                               <div v-if="annStatus" class=" text-red-500">
                     <div class="ann-error-email">{{ annStatus }}</div>
                   </div>
                    </div>
                    <p class="font-bold text-black pl-4 mb-1">Role</p>
                    <div class="w-1/3 pl-4 mb-2">
                        <select v-model="editedUser.role"
                            class="ann-role placeholder:italic placeholder:text-slate-400 block bg-gray-300 w-full border border-slate-300 rounded-md py-2 pl-2 pr-4 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm">
                            <option value="admin">admin</option>
                            <option value="announcer">announcer</option>
                        </select>
                    </div>
                    <div class="flex flex-row w-full pl-4 mb-2 ">
                        <div class="flex flex-row w-80 space-x-2 ">
                            <p class="font-bold text-black">Created On</p>
                            <p class="ann-created-on">{{ localTime(editedUser.createdOn) }}</p>
                        </div>
                        <div class="flex flex-row w-1/2 space-x-2 ">
                            <p class="font-bold text-black">Updated On</p>
                            <p class="ann-updated-on">{{ localTime(editedUser.updatedOn) }}</p>
                        </div>
                    </div>
                    <div class="px-4 flex flex-row space-x-2 mb-4 mt-2">
                        <button @click="editUsers()" 
                            :class="{  'bg-gray-300 text-gray-400': !isFieldEdit, 'bg-green-300 hover:bg-green-400 text-black': isFieldEdit }"
                            class="ann-button text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button">Save</button>

                        <button @click="backListUser()"
                            class="ann-button bg-gray-300 hover:bg-gray-400  font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
 
<style scoped></style>
