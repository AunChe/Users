<script setup>
import { useRouter } from 'vue-router'


const router = useRouter()

const goToListAllUser = () => {
    router.push({ name: 'ListAllUser' })
}

const goToListAnnouncements = () => {
    router.push({ name: 'ListAllAnnouncement' })

}

const goToListMatchUser = () => {
    router.push({ name: 'MatchUser' })
}
</script>
 
<template>
      <div class="flex flex-col w-2/12 h-full bg-blue-800 ">
        <div class="ann-app-title text-3xl font-bold text-white pt-2 pb-5 pl-3">SAS</div>
        <button class="ann-menu flex items-start space-x-1 text-white pt-1 pl-3 pb-1 border-b-2 border-t-2 border-gray-200"
          :class="{ 'bg-blue-600': $route.name === 'ListAllAnnouncement' }" @click="goToListAnnouncements()">
          <img src="../components/icons/announcement.png" alt="logo" class="w-5 h-5 rounded rounded-r-none ">
          <p>Announcement</p>
        </button>
        <button class="ann-menu flex items-start space-x-1 text-white pt-1 pl-3 pb-1 border-b-2 border-gray-200"
          :class="{ 'bg-blue-600': $route.name === 'ListAllUser'|| $route.name === 'AddNewUser'|| $route.name === 'EditUser' }" @click="goToListAllUser()">
          <img src="../components/icons/user.png" alt="logo" class="w-5 h-5 rounded rounded-r-none ">
          <p>User</p>
        </button>
        <button class="ann-menu flex items-start space-x-1 text-white pt-1 pl-3 pb-1 border-b-2 border-gray-200"
          :class="{ 'bg-blue-600': $route.name === 'MatchUser' }" @click="goToListMatchUser()">
          <img src="../components/icons/password.png" alt="logo" class="w-5 h-5 rounded rounded-r-none ">
          <p>Match Password</p>
        </button>
      </div>
</template>
 
<style scoped>

</style>