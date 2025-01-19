<script setup>
import { ElMessage } from "element-plus";
import { ref,watch } from 'vue';

const props = defineProps({
  createSetModal: Boolean, // 确保传入的是一个布尔值
});

const emit = defineEmits();

// 关闭 Modal
const closeModal = () => {
  emit("closeCreateSetModal"); // 触发父组件更新 createSetModal 的值
  clearContent();
};

const create_set = ref({
  title: "", // 后端的字段是 set_name，后续可以进行修改
  description: "", // 添加描述字段
  questions: [
    {
      name: "",
      link: "",
      difficulty: "easy",
    },
  ], // 如果没有题目，这里将为空数组
});

// 检查是否所有题目填写完整
// const incomplete = create_set.questions.some(
//   (problem) => !problem.name || !problem.link
// );
const incomplete = Array.isArray(create_set.value.questions) && create_set.value.questions.some(
  (problem) => !problem.name || !problem.link
);

const checkComplete = () => {
  // console.log(`incomplete: ${incomplete} && create_set.title: ${create_set.title !== ''}, checkComplete: ${incomplete && create_set.title}`)
  return incomplete && create_set.title !== '';
};
const clearContent = () => {
  create_set.value = {
    title: "", // 后端的字段是 set_name，后续可以进行修改
    description: "", // 添加描述字段
    questions: [
      {
        problem_name: "",
        link: "",
        difficulty: "easy",
      },
    ], // 如果没有题目，这里将为空数组
  };
};
const reloadSetList = () => {
  emit("reloadSetList");
};

// 添加题目行
const addProblemRow = () => {
  create_set.value.questions.push({ problem_name: "", link: "", difficulty: "easy" });
};
// 删除题目行
const removeProblemRow = (index) => {
  create_set.value.questions.splice(index, 1);
};
const createSet = async () => {
  if (!checkComplete()) {
    ElMessage.warning("请填写完整题目信息");
    return;
  }
  try {
    // 发送请求到后端
    const response = await fetch("/onlinerecord/create_set", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(create_set.value),
    });
    const data = await response.json();
    if (data["status_code"]) {
      ElMessage.success(data.message);
      closeModal();
      reloadSetList();
    } else {
      ElMessage.error(data.message);
    }
  } catch (error) {
    ElMessage.error(error);
    console.log(error)
  }
};
</script>

<template>
  <!-- 创建题单 Modal -->
  <div
    v-if="createSetModal"
    class="modal fade show"
    id="createQuizModal"
    tabindex="-1"
    aria-labelledby="createQuizModalLabel"

    style="display: block"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="createQuizModalLabel">创建新题单</h5>
          <button
            type="button"
            class="btn-close"
            @click="closeModal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="quiz-title" class="form-label">题单标题</label>
            <input
              type="text"
              class="form-control"
              id="quiz-title"
              placeholder="请输入题单标题"
              v-model="create_set.title"
            />
          </div>

          <!-- 题单描述 -->
          <div class="mb-3">
            <label for="quiz-description" class="form-label"
              >题单描述（可选）</label
            >
            <textarea
              class="form-control"
              id="quiz-description"
              rows="3"
              placeholder="请输入题单描述"
              v-model="create_set.description"
            ></textarea>
          </div>

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
                <tr v-for="(problem, index) in create_set.questions" :key="index">
                  <td>
                    <el-input v-model="problem.problem_name" placeholder="题目名称" />
                  </td>
                  <td>
                    <el-input
                      v-model="problem.link"
                      placeholder="题目链接"
                      type="url"
                    />
                  </td>
                  <td>
                    <el-select
                      v-model="problem.difficulty"
                      placeholder="选择难度"
                    >
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

            <el-button type="success" @click="addProblemRow">
              添加题目
            </el-button>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">
            关闭
          </button>
          <button
            type="button"
            class="btn btn-primary"
            id="create-quiz-btn"
            @click="createSet"
          >
            创建题单
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
