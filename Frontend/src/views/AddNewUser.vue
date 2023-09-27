<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import MenuDisplay from '../components/MenuDisplay.vue';

const router = useRouter()
const email = ref('')
const backListUser = () => {
    router.push({ name: 'ListAllUser' })
}


const usernameLength = computed(() => addNewuser.value.username.length);
const passwordLength = computed(() => addNewuser.value.password.length);
const nameLength = computed(() => addNewuser.value.name.length);
const emailLength = computed(() => addNewuser.value.email.length);
const annStatus = ref('');

const addNewuser = ref({
    username: '',
    password: '',
    confirmpassword: '',
    name: '',
    email: '',
    role: 'announcer'

})

//check password regex
const isPasswordValid = computed(() => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%^#&*()_+{}\[\]:;<>,.?/~\\|-])[\S]{8,14}$/
    return passwordRegex.test(addNewuser.value.password);
});


//check confirmpassword
const isPasswordMatching = computed(() => {
    return addNewuser.value.password === addNewuser.value.confirmpassword;
});


//check email regex
const isEmailValid = computed(() => {
    const emailRegex = /^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$/;
    return emailRegex.test(addNewuser.value.email);
});

const addUser = async (use) => {


    try {
        const res = await fetch(import.meta.env.VITE_ROOT_API + "/api/users", {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                username: use.username,
                password: use.password,
                confirmpassword: use.confirmpassword,
                name: use.name,
                email: use.email,
                closeDate: use.closeDate,
                role: use.role
            })
        })
        if (res.status === 200) {
            annStatus.value = 'successfully';
        } else if (res.status === 400) {
            annStatus.value = 'does not unique';
        } else if (res.status === 404) {
            annStatus.value = 'The specified username DOES NOT exist';
        } else {
            console.error('Error checking password:', res.statusText);
        }
    }  catch (err) {
        console.log(err)
    }

}

const isFieldAdd = ref(false)
watch(addNewuser, () => {
    if (addNewuser.value.username !== '' && addNewuser.value.name !== '' && addNewuser.value.email !== '') {
        isFieldAdd.value = true;
    } else {
        console.log('no add')
        isFieldAdd.value = false;
    }
}, { deep: true })

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
                    <div class=" px-4 mb-2 flex flex-col items-end">({{ usernameLength }}/45)
                      <input v-model="addNewuser.username"
                           class="ann-username placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-4 pr-4 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                             maxlength="45" type="text" required @keydown="preventSpacebar($event)" />
                             <div v-if="annStatus" class=" text-red-500">
                                <div class="ann-error-username">{{ annStatus }}</div>
                            </div>
                       </div>
                    <p class="font-bold text-black pl-4 mb-1">Password</p>
                    <div class="px-4 mb-2 flex flex-col items-end">({{ passwordLength }}/14)
                        <input v-model="addNewuser.password"
                            class="ann-password placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-4 pr-4 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                            maxlength="14" type="password"  @keydown="preventSpacebar($event)" required/>
                        <div v-if="!isPasswordValid && addNewuser.password !== ''" class="text-red-500 ann-error-password">
                            must be 8-14 characters long, at least 1 of uppercase, lowercase, number and special characters
                        </div>
                        <div v-if="passwordLength < 8 " class="text-red-500 ann-error-password">
                            Password size must be between 8 and 14
                        </div>
                    </div>
                    <p class="font-bold text-black pl-4 mb-1">Confirm Password</p>
                    <div class="px-4 mb-2 flex flex-col items-end">
                        <input v-model="addNewuser.confirmpassword"
                            class="ann-confirm-password placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-4 pr-4 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                            maxlength="14" type="password"  @keydown="preventSpacebar($event)" required>
                        <div v-if="addNewuser.confirmpassword !== '' && !isPasswordMatching" class="text-red-500 ann-error-password">
                            The password DOES NOT match
                        </div>
                    </div>
                    <p class="font-bold text-black pl-4 mb-1">Name</p>
                    <div class="px-4 mb-2 flex flex-col items-end">({{ nameLength }}/150)
                        <input v-model="addNewuser.name"
                            class="ann-name placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-4 pr-4 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                            maxlength="100" type="text" required  @keydown="preventSpacebar($event)"/>
                            <div v-if="annStatus" class=" text-red-500">
                                <div class="ann-error-name">{{ annStatus }}</div>
                            </div>

                    </div>
                    <p class="font-bold text-black pl-4 mb-1">Email</p>
                    <div class="px-4 mb-2 flex flex-col items-end">({{ emailLength }}/150)
                        <input v-model="addNewuser.email"
                            class="ann-email placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-4 pr-4 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                            maxlength="150" type="email" required   @keydown="preventSpacebar($event)" />
                        <div v-if="addNewuser.email !== ''" class="text-red-500">Email must be a
                            well-formed email address* </div>
                            <div v-if="annStatus" class=" text-red-500">
                                <div class="ann-error-email">{{ annStatus }}</div>
                            </div>
                    </div>
                    <p class="font-bold text-black pl-4 mb-1">Role</p>
                    <div class="w-1/3 pl-4 mb-2">
                        <select v-model="addNewuser.role"
                            class="ann-role placeholder:italic placeholder:text-slate-400 block bg-gray-300 w-full border border-slate-300 rounded-md py-2 pl-2 pr-4 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm">
                            <option value="admin">admin</option>
                            <option value="announcer">announcer</option>
                        </select>
                    </div>
                    <div class="px-4 flex flex-row space-x-2 mb-4 mt-2">
                        <button @click="addUser(addNewuser)"
                            :class="{ 'cursor-not-allowed': !isFieldAdd, 'bg-gray-300 text-gray-400': !isFieldAdd, 'bg-green-300 hover:bg-green-400 text-black': isFieldAdd }"
                            class="ann-button   font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button">Save</button>
                        <button @click="backListUser()"
                            class="ann-button bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
 
<style scoped></style>
