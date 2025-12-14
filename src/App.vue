<script>
export default {
  globalData: {
    categories: ['Full Body', 'Upper Body','Lower Body',"Basketball", "Cycling","Jogging", 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms'],
    timeOfDays: ["morning", "afternoon", "night"]
  },
  onLaunch() {
    console.log("App launched");
  },
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style>
/*每个页面公共css */
</style>
