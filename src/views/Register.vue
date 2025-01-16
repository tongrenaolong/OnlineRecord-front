<script setup>
import { onMounted, ref } from "vue";

onMounted(() => {
  document.title = "注册"; // 动态设置页面标题
});

const user_info = ref({
  account: "",
  username: "",
  password: "",
  confirm_password: "",
});
const register_confirm_password_error = ref("");

const clearObj = (obj) => {
  Object.keys(obj.value).forEach((key) => {
    obj.value[key] = ""; // 清空为默认值
  });
};
import { useRouter } from "vue-router";
const router = useRouter();

const register = async () => {
  let isValid = true;
  if (user_info.password !== user_info.confirm_password) {
    register_confirm_password_error.value = "密码不匹配";
    isValid = false;
  }
  // 如果验证通过
  if (isValid) {
    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account: user_info.account,
          username: user_info.username,
          password: user_info.password,
        }),
      });
      if (!response.ok) {
        throw new Error("注册失败，请检查账号或密码！");
      }
      const data = response.json();
      if (data.status_code) {
        alert(data.message);
        toLogin();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      clearObj(user_info);
      register_confirm_password_error.value = "";
    }
  }
};
const toLogin = () => {
  router.push("/login");
};
</script>

<template>
  <el-container>
    <el-main class="main-center">
      <div class="form-container" id="form-container">
        <h2>注册</h2>
        <!-- 注册表单（默认隐藏）-->
        <form id="register-form">
          <div class="input-group">
            <label for="register-username">用户名</label>
            <input
              type="text"
              id="register-username"
              name="username"
              v-model="user_info.username"
              required
            />
          </div>
          <div class="input-group">
            <label for="register-account">账号</label>
            <input
              type="text"
              id="register-account"
              name="account"
              v-model="user_info.account"
              required
            />
          </div>
          <div class="input-group">
            <label for="register-password">密码</label>
            <input
              type="password"
              id="register-password"
              name="password"
              v-model="user_info.password"
              required
            />
          </div>
          <div class="input-group">
            <label for="register-confirm-password">确认密码</label>
            <input
              type="password"
              id="register-confirm-password"
              name="confirm-password"
              v-model="user_info.confirm_password"
              required
            />
            <div id="register-confirm-password-error" class="error">
              {{ register_confirm_password_error }}
            </div>
          </div>
          <div class="form-footer">
            <button type="submit" @click="register">注册</button>
            <p>已经有账号？<a class="toggle-link" @click="toLogin">登录</a></p>
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