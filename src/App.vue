<script>
import { initAuth } from '@/utils/auth.js'

export default {
  globalData: {
    categories: ['Full Body', 'Upper Body','Lower Body',"Basketball", "Cycling","Jogging", 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms'],
    timeOfDays: ["morning", "afternoon", "night"]
  },
  
  async onLaunch() {
    await initAuth()
  }
  
}
</script>

<style>
/*每个页面公共css */
</style>
