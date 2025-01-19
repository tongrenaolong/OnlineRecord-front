<script setup>
import { ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
// 定义属性和事件
const props = defineProps({
  searchSetModal: Boolean,
});
const emit = defineEmits();

// 重载函数，关闭模态框时触发
const closeSearchModal = () => {
  clearSearchInput();
  clearSetList();
  clearJoinSetList();
  emit("closeSearchSetModal");
};
const reloadSetList = ()=>{
  emit("reloadSetList");
}

const searchInfo = ref({
  set_name: "",
  set_list: [],
});
const joinSetList = ref([]); // 记录需要加入的 set_id
const clearSearchInput = () => {
  searchInfo.value.set_name = "";
};
const clearSetList = () => {
  searchInfo.value.set_list = [];
};

const searchSetByKeyword = async () => {
  console.log(`searchSetByKeyword: ${searchInfo.value.set_name}`)
  if (searchInfo.value.set_name) {
    try {
      const response = await fetch(
        `/onlinerecord/search_problem_sets?set_name=${searchInfo.value.set_name}`
      );
      const data = await response.json();

      if (data["status_code"]) {
        clearSearchInput();
        searchInfo.value.set_list = data["set_data_list"];
      } else {
        ElMessage.warning(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }
};
const clearJoinSetList = () => {
  joinSetList.value = [];
};

// 获取选中的 set_id
const updateJoinSetList = (set_id, isChecked) => {
  if (isChecked) {
    // 如果选中，则将 set_id 添加到 joinSetList 中
    joinSetList.value.push(set_id);
  } else {
    // 如果取消选中，则从 joinSetList 中删除 set_id
    const index = joinSetList.value.indexOf(set_id);
    if (index !== -1) {
      joinSetList.value.splice(index, 1);
    }
  }
};

const JoinSetList = async () => {
  try {
    const response = await fetch("/onlinerecord/join_problem_set", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        set_id_list: joinSetList.value, // 传递选中的 set_id 列表
      }),
    });

    const data = await response.json();
    if (data.status_code) {
      ElMessage.success("成功加入题单！");
      // 关闭模态框
      closeSearchModal();
      reloadSetList();
    } else {
      ElMessage.warning(data.message);
    }
  } catch (error) {
    console.log(error);
    ElMessage.error("请求失败，请稍后再试");
  }
};
</script>
<template>
  <!-- 题单列表模态框 -->
  <el-dialog
    v-model="props.searchSetModal"
    title="搜索题单"
    width="80%"
    @close="closeSearchModal"
  >
    <!-- 搜索结果 -->
    <template #default>
      <!-- 搜索输入框 -->

      <el-input
        v-model="searchInfo.set_name"
        style="width: 240px"
        placeholder="请输入想要加入的题单名，回车确定"
        :prefix-icon="Search"
        @keyup.enter="searchSetByKeyword"
      />
      <!-- 如果有搜索结果，显示表格 -->
      <div v-if="searchInfo.set_list.length > 0">
        <table class="table">
          <thead>
            <tr>
              <th>是否加入</th>
              <th>题单名称</th>
              <th>创建者</th>
              <th>创建时间</th>
              <th>描述</th>
              <th>题目总量</th>
              <th>加入人数</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="set_info in searchInfo.set_list" :key="set_info.set_id">
              <td>
                <input
                  type="checkbox"
                  class="set-checkbox"
                  @change="
                    updateJoinSetList(set_info.set_id, $event.target.checked)
                  "
                />
              </td>
              <td>{{ set_info.set_name }}</td>
              <td>{{ set_info.account }}</td>
              <td>{{ set_info.created_at }}</td>
              <td>{{ set_info.description }}</td>
              <td>{{ set_info.total_problems }}</td>
              <td>{{ set_info.members_count }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 如果没有搜索结果，显示提示信息 -->
      <div v-else class="no-results">
        没有符合要求的题单，请重新输入关键词。
      </div>
    </template>

    <template #footer>
      <el-button type="secondary" @click="closeSearchModal">关闭</el-button>
      <el-button type="primary" @click="JoinSetList">加入刷题</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
/* 如果需要自定义样式，可以在此处添加 */
.no-results {
  text-align: center;
  color: #999;
  font-size: 16px;
  padding: 20px;
}
</style>
