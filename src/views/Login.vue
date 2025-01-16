<script setup>
import { onMounted,ref } from "vue";

onMounted(() => {
  document.title = "登录"; // 动态设置页面标题
});

import { useUserInfoStore } from '@/stores/UserInfo.js'
const record_user_info = useUserInfoStore();
const user_info = ref({
  account: '',
  password: '',
})

const clearObj = (obj) => {
  Object.keys(obj.value).forEach((key) => {
    obj.value[key] = ''; // 清空为默认值
  });
};

import { useRouter } from 'vue-router';
import { isConstructorDeclaration } from "typescript";
const router = useRouter();

const login = async ()=>{
  let isValid = true;
  console.log("user_info: ",user_info.value);
  try{
    // 使用 fetch 或 XMLHttpRequest 将数据发送到 Flask 后端
    const response = await fetch('/test/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account: user_info.value.account,
        password: user_info.value.password,
      }),
    });
    if (!response.ok) {
        throw new Error("登录失败，请检查账号或密码！");
    }
    const data = await response.json();
    console.log(`data: ${data},data['status_code']: ${data['status_code']}, data.status_code: ${data.status_code}`);
    if(data.status_code){
      console.log(data);
      record_user_info.user_info = {
        account: data.account,
      }
      console.log(record_user_info.user_info);
      toMain();
    }else{
      alert(data.message);
    }
  }catch(error){
    console.log('登陆失败',error);
  }finally{
    clearObj(user_info);
  }
}
const toRegister = ()=>{
  router.push('/register');
}
const toMain = ()=>{
  router.push('/main');
}
</script>
<template>
  <el-container>
    <el-main class="main-center">
      <div class="form-container" id="form-container">
        <h2>登录</h2>
        <!-- 登录表单 -->
        <form id="login-form" @keydown.enter.prevent="login">
          <div class="input-group">
            <label for="login-account">账号</label>
            <input type="text" id="login-account" name="account" v-model="user_info.account" required />
          </div>
          <div class="input-group">
            <label for="login-password">密码</label>
            <input type="password" id="login-password" name="password" v-model="user_info.password" required />
          </div>
          <div class="form-footer">
            <button type="button" @click="login">登录</button>
            <p>
              没有账号？<a class="toggle-link" @click="toRegister">注册</a>
            </p>
          </div>
        </form>
      </div>
    </el-main>
  </el-container>
</template>

<style scoped>
body {
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f7fc;
}

.main-center {
  display: flex;
  justify-content: center; /* 水平方向居中 */
  align-items: center; /* 垂直方向居中 */
  height: 100vh; /* 确保主区域填满可视高度 */
}

.form-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 300px;
}

h2 {
  text-align: center;
  color: #333;
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  font-size: 14px;
  color: #555;
}

.input-group input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.input-group input:focus {
  outline-color: #007bff;
}

.form-footer {
  text-align: center;
}

.form-footer button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  font-size: 16px;
  width: 100%;
}

.form-footer button:hover {
  background-color: #0056b3;
}

.toggle-link {
  color: #007bff;
  cursor: pointer;
  text-decoration: none;
}

.toggle-link:hover {
  text-decoration: underline;
}

.error {
  color: red;
  font-size: 12px;
}
</style>