const getAllAnnouncement = async () => {
    try {
        const res = await fetch(
            import.meta.env.VITE_ROOT_API + "/api/announcements"
        )        
        if (res.ok) {
            const data = res.json()
            return data        
          } else throw new error('Error, cannot get data!')
    } catch (error) {
        console.log(error)
    }
    return []
  }
  const getAnnouncementById = async (id) => {
    try {
        const res = await fetch(
            import.meta.env.VITE_ROOT_API + "/api/announcements/" + id 
        )        
        if (res.ok) {
            const data = res.json()
            return data        
          } else throw new error('Error, cannot get data!')
    } catch (error) {
        console.log(error)
    }
  }
  const getAnnouncementByIdView = async (id) => {
    try {
        const res = await fetch(
            import.meta.env.VITE_ROOT_API + "/api/announcements/" + id + "?count=true"
        )        
        if (res.ok) {
            const data = res.json()
            return data        
          } else throw new error('Error, cannot get data!')
    } catch (error) {
        console.log(error)
    }
  }
  const getCategory = async () => {
    try {
        const res = await fetch(
            import.meta.env.VITE_ROOT_API + "/api/category"
        )        
        if (res.ok) {
            const data = res.json()
            return data        
          } else throw new error('Error, cannot get data!')
    } catch (error) {
        console.log(error)
    }
    return []
  }

  const getAnnouncementsByPage = async (mode, page) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_ROOT_API}/api/announcements/pages?mode=${mode}&page=${page}`
      )
      if (res.ok) {
        const data = await res.json()
        return data
      } else {
        throw new Error("Error, cannot get data!")
      }
    } catch (error) {
      console.log(error)
      return []
    }
  }
  const getAnnouncementsByCategory = async (mode, page,catId) => {
    try {
      const res = await fetch(         
        `${import.meta.env.VITE_ROOT_API}/api/announcements/pages?mode=${mode}&page=${page}&category=${catId}`
      )
      if (res.ok) {
        const data = await res.json()
        return data
      } else {
        throw new Error("Error, cannot get data!")
      }
    } catch (error) {
      console.log(error)
      return []
    }
  }
  const getAllUsers = async () => {
    try {
        const res = await fetch(
            import.meta.env.VITE_ROOT_API + "/api/users"
        )        
        if (res.ok) {
            const data = res.json()
            return data        
          } else throw new error('Error, cannot get data!')
    } catch (error) {
        console.log(error)
    }
    return []
  }
  const getUserById = async (id) => {
    try {
        const res = await fetch(
            import.meta.env.VITE_ROOT_API + "/api/users/" + id 
        )        
        if (res.ok) {
            const data = res.json()
            return data        
          } else throw new error('Error, cannot get data!')
    } catch (error) {
        console.log(error)
    }
  }

  export { getAllAnnouncement,getAnnouncementById,getCategory,getAnnouncementsByPage, getAnnouncementsByCategory,getAnnouncementByIdView,getAllUsers,getUserById}