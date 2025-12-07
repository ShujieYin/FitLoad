## 项目名称

训练日历小程序（基于 uni-app + uniCloud）

---

# 1. 技术架构（统一 DCloud 生态）

```bash
前端：uni-app（Vue3 + Uni UI）
后端：uniCloud（阿里云）
数据库：uniCloud DB（MongoDB）
云函数：uniCloud 云函数（Node.js）
用户认证：uni-id / 微信登入（uni-id-pages）
```

推荐方案：

- **阿里云空间** → 更稳定、定价清晰
    
- 使用 **uni-id-pages** 一键集成登录（微信小程序登录最简单）
    

---

# 2. 项目总体结构

```bash
/uni-app project
  /pages
    /calendar      # 日历页
    /addRecord     # 添加/编辑训练记录
    /stats         # 统计页
  /uni_modules
    /uni-id-pages  # 身份管理
  /uniCloud
    /cloudfunctions
      addRecord
      getRecordByDate
      getMonthlySummary
    /database
      training_record.schema.json
```

---

# ⚙️ 3. 前端页面逻辑（uni-app）

## 3.1 日历页（pages/calendar）

- 读取某个月所有训练数据
    
- 渲染日历
    
- 根据训练负载映射颜色
    
- 点击某一天 → 跳转添加训练页
- 本地缓存机制：优先使用本地缓存（5 分钟内有效）加载月度数据，减少云端请求。缓存更新策略：每次成功拉取云端数据后更新缓存，新记录添加时自动刷新相关月份缓存
    

调用方式：

```js
const res = await uniCloud.callFunction({
  name: "getMonthlySummary",
  data: { month: "2025-03" }
})
```


---

## 3.2 添加记录页（pages/addRecord）

- 填写 RPE
    
- 填写训练时长（分钟）
    
- 训练类型（可选）
    
- 备注
    
- 自动计算 load = rpe × duration
    
- 提交云函数：addRecord
    

```js
await uniCloud.callFunction({
  name: "addRecord",
  data: {
    date: this.date,
    rpe: this.rpe,
    duration: this.duration,
    category: this.category
  }
})
```

---

## 3.3 统计页（pages/stats）
    
- 最近 4 周/本月训练趋势
   

云函数调用：

```js
uniCloud.callFunction({
  name: "getMonthlySummary"
})
```

---

# ⚙️ 4. 数据库设计（uniCloud DB）

## 集合：`training_record`

定义 schema（便于自动校验）

```json
{
  "bsonType": "object",
  "required": ["user_id", "date", "time of day", "rpe", "duration", "load"],
  "properties": {
    "user_id": { "bsonType": "string" },
    "date": { "bsonType": "string", "description": "yyyy-mm-dd" },
    "category": { "bsonType": "string" },
    "rpe": { "bsonType": "int" },
    "duration": { "bsonType": "int" },
    "load": { "bsonType": "int" },
    "note": { "bsonType": "string" },
    "created_at": { "bsonType": "timestamp" }
  }
}
```

---

# ⚙️ 5. 云函数设计（uniCloud）

## ⭐ addRecord（新增记录）

路径： `/uniCloud/cloudfunctions/addRecord/index.js`

```js
exports.main = async (event, context) => {
  const { rpe, duration, category, note, date } = event
  
  const load = rpe * duration
  const db = uniCloud.database()
  const userId = context.auth.uid
  
  await db.collection('training_record').add({
    user_id: userId,
    rpe, duration, category, note,
    date,
    load,
    created_at: Date.now()
  })

  return { code: 0, msg: "success" }
}
```

---

## ⭐ getMonthlySummary（汇总当月数据）

```js
exports.main = async (event, context) => {
  const { month } = event  // e.g. "2025-03"
  const userId = context.auth.uid
  const db = uniCloud.database()

  const start = `${month}-01`
  const end = `${month}-31`

  const res = await db.collection("training_record")
    .where({
      user_id: userId,
      date: db.command.gte(start).and(db.command.lte(end))
    })
    .get()

  return res.data
}
```

---


# ⚙️ 6. 权限管理（uni-id-pages）

你只需要：

`ext → 安装uni-id-pages → 勾选微信一键登录`

前端登录代码：

```js
uni.login({
  provider: "weixin",
  success: async (res) => {
    const loginRes = await uniCloud.callFunction({
      name: "uni-id-cf",
      data: {
        action: "loginByWeixin",
        params: {
          code: res.code
        }
      }
    })
  }
})
```

登录后会得到 `uid`，云函数中可以自动拿到。

---

# ⚙️ 7. 配色建议（统一 UI 方案）

因为你是健身类数据可视化，建议用：

- 蓝色系 → 负载深浅
    
- 绿/橙色 → 本周训练等级提示
    

示例负载映射函数：

```js
function loadColor(load) {
  if (load === 0) return "#EEEEEE"
  if (load < 50) return "#CDE7FF"
  if (load < 150) return "#6FB5FF"
  return "#1F78FF"
}
```

---

# ⚙️ 8. 部署流程
1）创建 uniCloud 服务空间
2）配置数据库 + 权限
3）上传云函数
4）HBuilderX → 运行到微信小程序
5）微信开发者工具真机联调
6）提交微信审核