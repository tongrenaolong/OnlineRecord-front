<script setup>
import { ref, watch } from "vue";
import { ElMessage } from "element-plus";

const props = defineProps(["current_set_id","create_problem_modal"]);
const emit = defineEmits();

const problems = ref([
  { name: "", link: "", difficulty: "easy" }, // 初始有一行
]);

// 添加题目行
const addProblemRow = () => {
  problems.value.push({ name: "", link: "", difficulty: "easy" });
};

// 删除题目行
const removeProblemRow = (index) => {
  problems.value.splice(index, 1);
};

// 创建题目
const createProblems = async () => {
  if (problems.value.length === 0) {
    ElMessage.warning("请先添加至少一个题目");
    return;
  }

  // 检查是否所有题目填写完整
  const incomplete = problems.value.some(
    (problem) => !problem.name || !problem.link
  );
  if (incomplete) {
    ElMessage.warning("请填写完整题目信息");
    return;
  }
  try {
    // 发送请求到后端
    const response = await fetch("/onlinerecord/create_problems", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        set_id: props.current_set_id,
        questions: problems.value, // 如果没有题目，这里将为空数组
      }),
    });

    const data = response.json();
    if (data.status_code) {
      ElMessage.success(data.message);
      closeCreateProblemModal();
    } else {
      ElMessage.error(data.message);
    }
  } catch (error) {
    ElMessage.error("创建题目失败");
    console.log(error)
  }

  console.log("创建题目：", problems);
  console.log("创建题目：", problems.value.Array);

  // 清空记录
};
const closeCreateProblemModal = () => {
  problems.value = [{ name: "", link: "", difficulty: "easy" }];
  emit("closeCreateProblemModal");
};

const visible = ref(props.create_problem_modal);
watch(
  () => props.create_problem_modal,
  (newVal) => {
    visible.value = newVal; // 同步 props 的值到内部响应式变量
    console.log(
      `vaisible: ${visible.value}; props.create_problem_modal: ${props.create_problem_modal}; newValue: ${newVal}`
    );
  }
);
</script>

<template>
  <el-dialog
    v-model="visible"
    title="创建题目"
    width="800px"
    @close="closeCreateProblemModal"
  >
    <div>
      <!-- 题目表格 -->
      <table class="table table-bordered" id="problems-table">
        <thead>
          <tr>
            <th>题目名称</th>
            <th>题目链接</th>
            <th>难度</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(problem, index) in problems" :key="index">
            <td>
              <el-input v-model="problem.name" placeholder="题目名称" />
            </td>
            <td>
              <el-input
                v-model="problem.link"
                placeholder="题目链接"
                type="url"
              />
            </td>
            <td>
              <el-select v-model="problem.difficulty" placeholder="选择难度">
                <el-option label="简单" value="easy"></el-option>
                <el-option label="中等" value="medium"></el-option>
                <el-option label="困难" value="hard"></el-option>
              </el-select>
            </td>
            <td>
              <el-button
                type="danger"
                size="small"
                @click="removeProblemRow(index)"
              >
                删除
              </el-button>
            </td>
          </tr>
        </tbody>
      </table>

      <el-button type="success" @click="addProblemRow"> 添加题目 </el-button>
    </div>

    <template #footer>
      <el-button @click="closeCreateProblemModal">关闭</el-button>
      <el-button type="primary" @click="createProblems">创建题目</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.table th,
.table td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}
</style>
