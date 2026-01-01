<script>
import { initAuth } from '@/utils/auth.js'

export default {
  globalData: {
    categories: ['Full Body', "Plyometrics", 'Upper Body', 'Lower Body', "Basketball", "Cycling", "Jogging", "Others"],
    timeOfDays: ["Morning", "Afternoon", "Night"]
  },
  
  async onLaunch() {
    await initAuth()
  }
  
}
</script>

<style>
/*每个页面公共css */
</style>
