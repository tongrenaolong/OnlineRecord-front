<script setup>
import { reactive, ref, defineProps, onMounted, watch } from "vue";
import { ElMessage } from "element-plus";
import CreateProblem from "@/components/CreateProblem.vue";

const props = defineProps(["current_set_id"]);

const problems_info_list = ref([]);
const authority = ref(false);
const create_problem_modal = ref(false);
const record_problem_modal = ref(false);

const loadSet = async () => {
  if (props.current_set_id == -1) {
    problems_info_list.value = [];
    authority.value = false;
    return;
  }
  try {
    console.log(props.current_set_id);
    // 请求题单详情
    const response = await fetch(
      `/onlinerecord/get_set_problems?set_id=${props.current_set_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    if (data["status_code"]) {
      problems_info_list.value = data["problems_info_list"];
      authority.value = data["authority"];
    } else {
      console.log(data.message);
    }
  } catch (error) {
    console.log(error);
  }
};
// onMounted(async () => {
//   // console.log("props.load_set_id: ",props.load_set_id)
//   // if (props.load_set_id === -1) {
//   //   return;
//   // }
//   await loadSet();
// });

// 监听 props.load_set_id 变化
watch(
  () => props.current_set_id,
  async (new_set_id, old_set_id) => {
    console.log(`${new_set_id},${old_set_id}`);
    if (new_set_id !== old_set_id) {
      record_problem.set_id = new_set_id;
      await loadSet();
    }
  }
);

const record_problem = reactive({
  set_id: props.current_set_id,
  problem_id: -1,
  input_text: "",
  image_data: null,
  status: "completed",
});

const showCreateProblemModal = () => {
  // console.log(
  //   "showCreateProblemModal:create_problem_modal: ",
  //   create_problem_modal.value
  // );
  create_problem_modal.value = true;
  console.log(
    "showCreateProblemModal:create_problem_modal: ",
    create_problem_modal.value
  );
};

const closeCreateProblemModal = () => {
  create_problem_modal.value = false;
};

const showRecordModal = (problem_id, problem_name) => {
  // console.log(`problem_id: ${problem_id},problem_name: ${problem_name} `)
  record_problem.problem_id = problem_id;
  record_problem.problem_name = problem_name;
  console.log(
    `problem_id: ${record_problem.problem_id},problem_name: ${record_problem.problem_name} `
  );
  record_problem_modal.value = true;
};

const closeRecordModal = () => {
  record_problem_modal.value = false;
  record_problem.problem_id = "";
  record_problem.input_text = "";
  record_problem.image_data = null;
};

const handleFileUpload = (file) => {
  // 确保获取实际的 File 对象
  const actualFile = file.raw || file.file || file;

  if (!(actualFile instanceof Blob)) {
    console.error("上传的文件不是 Blob 类型");
    ElMessage.error("上传的文件格式不正确，请重新选择");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    record_problem.image_data = e.target?.result;
  };
  reader.onerror = (error) => {
    console.error("文件读取失败:", error);
    ElMessage.error("文件读取失败，请重试");
  };
  reader.readAsDataURL(actualFile); // 确保传入的是 Blob
};

const convertToFormData = (data) => {
  const formData = new FormData();

  // 遍历对象的键值对，将其添加到 FormData
  for (const [key, value] of Object.entries(data)) {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
      console.log(`${key}:${value}`);
    }
  }

  return formData;
};
const submitData = async () => {
  if (!record_problem.input_text || !record_problem.image_data) {
    ElMessage.warning("请输入内容并选择图片后再提交！");
    return;
  }

  const formData = convertToFormData(record_problem);

  try {
    const response = await fetch("/onlinerecord/upload_solution", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (data.status_code) {
      ElMessage.success("提交成功！");
      closeRecordModal();
      await loadSet();
    } else {
      ElMessage.error(data.message || "提交失败");
    }
  } catch (error) {
    ElMessage.error("提交失败，请稍后再试");
  }
};
</script>


<template>
  <div class="card mb-4">
    <div class="card-body">
      <h5 class="card-title">题目列表</h5>
    </div>
  </div>

  <!-- 当没有题目时显示提示 -->
  <p
    v-if="!problems_info_list.length"
    class="text-center text-muted"
    style="font-size: 20px"
  >
    暂无题目
  </p>

  <!-- 题目列表 -->
  <div v-else>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>是否完成</th>
          <th>题目名称</th>
          <th>难度</th>
          <th>完成情况</th>
          <th>打卡上传</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(problem, index) in problems_info_list" :key="index">
          <td>
            <input
              type="checkbox"
              :checked="problem.status === 'completed'"
              class="form-check-input"
              disabled
            />
          </td>
          <td>
            <a :href="problem.link" target="_blank">{{
              problem.problem_name
            }}</a>
          </td>
          <td>{{ problem.difficulty.toUpperCase() }}</td>
          <td>
            <div class="progress" style="height: 20px; position: relative">
              <div
                class="progress-bar bg-info text-dark"
                :style="{
                  width: `${Math.round(
                    (problem.completed / problem.all) * 100
                  )}%`,
                }"
                role="progressbar"
              >
                <span
                  style="
                    position: absolute;
                    width: 100%;
                    text-align: center;
                    color: black;
                  "
                >
                  {{ problem.completed }} / {{ problem.all }}
                </span>
              </div>
            </div>
          </td>
          <td>
            <el-button
              size="small"
              type="primary"
              @click="showRecordModal(problem.problem_id, problem.problem_name)"
            >
              打卡
            </el-button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="text-center">
    <el-button
      size="large"
      type="primary"
      style="width: 100%"
      :disabled="!authority"
      @click="showCreateProblemModal()"
    >
      + 添加题目
    </el-button>
  </div>

  <!-- 打卡模态框 -->
  <el-dialog v-model="record_problem_modal" title="打卡上传" width="600px">
    <el-form :model="record_problem" label-position="top">
      <el-form-item label="题目名称">
        <el-input v-model="record_problem.problem_name" disabled />
      </el-form-item>
      <el-form-item label="输入内容">
        <el-input
          type="textarea"
          v-model="record_problem.input_text"
          placeholder="请输入相关内容"
        />
      </el-form-item>
      <el-form-item label="上传图片">
        <el-upload action="" :auto-upload="false" :on-change="handleFileUpload">
          <el-button type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="closeRecordModal">取消</el-button>
      <el-button type="primary" @click="submitData">提交</el-button>
    </template>
  </el-dialog>

  <!-- 创建题目模态框 -->
  <!-- <CreateProblem v-if="create_problem_modal" @close="closeCreateProblemModal" /> -->
  <CreateProblem 
  :current_set_id="props.current_set_id"
  :create_problem_modal="create_problem_modal"
  @closeCreateProblemModal="closeCreateProblemModal"/>
</template>

<style scoped>
.table {
  margin-bottom: 20px;
}
</style>
