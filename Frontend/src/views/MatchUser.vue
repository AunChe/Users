<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import MenuDisplay from '../components/MenuDisplay.vue';
import { getAllUsers } from '../composable/getAnnouncement';

const router = useRouter();

const userAll = ref([]);
const enteredUsername = ref('');
const enteredPassword = ref('');
const annStatus = ref('');

onMounted(async () => {
    userAll.value = await getAllUsers();
});


const checkMatch = async () => {
    const username = enteredUsername.value;
    const password = enteredPassword.value;

    try {
        const res = await fetch(import.meta.env.VITE_ROOT_API + "/api/users/match", {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if (res.status === 200) {
            annStatus.value = 'Password Matched';
        } else if (res.status === 401) {
            annStatus.value = 'Password NOT Matched';
        } else if (res.status === 404) {
            annStatus.value = 'The specified username DOES NOT exist';
        } else {
            console.error('Error checking password:', res.statusText);
        }
    } catch (error) {
        console.error('Error checking password:', error);
    }
}



const ClearValue = () => {
    enteredUsername.value = ''
    enteredPassword.value = ''
}

</script>
<template>
    <div class="w-full h-screen bg-gray-200">
        <div class="flex flex-row w-full h-full">

            <!-- menu -->
            <MenuDisplay />

            <div class="flex flex-col space-y-2 w-full h-full justify-center items-center">

                <div v-if="annStatus"
                    :class="{ 'bg-green-300 border-green-700 text-green-700': annStatus === 'Password Matched', 'bg-red-300 border-red-700 text-red-700': annStatus === 'The specified username DOES NOT exist' || annStatus === 'Password NOT Matched' }"
                    class="ann-status flex w-3/5 h-14  rounded-xl border justify-center items-center">
                 <div class="ann-message">{{ annStatus }}</div>
                </div>

                <div class="flex flex-col  w-3/5  bg-white rounded-xl border">
                    <div class="flex w-full h-12 justify-start items-center ">
                        <p class=" text-3xl font-bold text-black pl-4">Match Password</p>
                    </div>
                    <p class="font-bold text-black pl-4 mb-1">Username</p>
                    <div class="px-4 mb-2 flex flex-col items-end">
                        <input v-model="enteredUsername"
                            class="ann-username placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-4 pr-4 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                            maxlength="45" type="text" />
                    </div>
                    <p class="font-bold text-black pl-4 mb-1">Password</p>
                    <div class="px-4 mb-2 flex flex-col items-end">
                        <input v-model="enteredPassword"
                            class="ann-password placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-4 pr-4 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                            maxlength="100" type="password"
                            pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!])[A-Za-z\d@#$%^&+=!]{8,14}$" />
                    </div>
                    <div class="px-4 flex flex-row space-x-2 mb-4 mt-2">
                        <button @click="checkMatch(), ClearValue()"
                            class="ann-button text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline  bg-gray-300 hover:bg-gray-400 "
                            type="button">Match or not</button>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style></style>