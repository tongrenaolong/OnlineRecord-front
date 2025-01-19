<template>
  <!-- 顶部导航栏 -->
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">力扣</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item"><a class="nav-link" href="#">学习</a></li>
          <li class="nav-item"><a class="nav-link" href="#">题库</a></li>
          <li class="nav-item"><a class="nav-link" href="#">竞赛</a></li>
          <li class="nav-item"><a class="nav-link" href="#">讨论</a></li>
          <li class="nav-item"><a class="nav-link" href="#">求职</a></li>
          <li class="nav-item"><a class="nav-link" href="#">商店</a></li>
        </ul>
        <ul class="navbar-nav ms-auto">
          <li class="nav-item"><a class="nav-link" href="#">🔔</a></li>
          <li class="nav-item">
            <a class="nav-link" href="#" id="account-link">{{
              record_user_info["user_info"]["account"]
            }}</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <div class="container-fluid">
    <div class="row">
      <!-- 左侧侧边栏 -->
      <aside class="col-md-3 sidebar">
        <h5>我的题单</h5>
        <div class="d-flex justify-content-between align-items-center">
          <!-- 搜索框放在创建题单按钮的左侧 -->
          <div class="input-group me-2" style="flex-grow: 1">
            <!-- <input
              type="text"
              id="search-input"
              class="form-control form-control-sm"
              placeholder="请输入题单名称"
              aria-label="搜索题单"
              @keyup.enter="showSearchSetModal"
            /> -->

            <el-button type="primary" :icon="Search" @click="showSearchSetModal">搜索题单</el-button>
          </div>
          <button
            class="btn btn-sm btn-success"
            id="add-list-btn"
            title="创建题单"
            @click="showCreateSet"
          >
            +
          </button>
        </div>
        <!-- 题单列表 -->
        <SetsToList
          :currentSetListStatus="currentSetListStatus"
          @loadSet="loadSet"
          @deleteSet="deleteSet"
        ></SetsToList>
      </aside>
      <!-- 主要内容区域 -->
      <main class="col-md-9">
        <!-- 题目列表 -->
        <SetProblems :current_set_id="current_set_id"></SetProblems>
      </main>
    </div>
  </div>
  <!-- 创建题目 -->
  <!-- 创建题单 -->
  <CreateSet
    :createSetModal="createSetModal"
    @closeCreateSetModal="closeCreateSetModal"
    @reloadSetList="reloadSetList"
  >
  </CreateSet>
  <SearchSets
    v-model="searchSetModal"
    @closeSearchSetModal="closeSearchSetModal"
    @reloadSetList="reloadSetList"
  ></SearchSets>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue'
import { onMounted, ref } from "vue";
import SetsToList from "@/components/SetsToList.vue";
import SetProblems from "@/components/SetProblems.vue";
import CreateSet from "@/components/CreateSet.vue";

onMounted(() => {
  document.title = "多人刷题记录网站"; // 动态设置页面标题
});

// 在挂载之前进行请求
// import { onBeforeMount } from "vue";
// onBeforeMount(() => {
//   getSets();
// });

import { useUserInfoStore } from "@/stores/UserInfo.js";
const record_user_info = useUserInfoStore();

import SearchSets from "@/components/SearchSets.vue";
const searchSetModal = ref(false);
const showSearchSetModal = () => {
  console.log('showSearchSetModal')
  searchSetModal.value = true;
};
const closeSearchSetModal = () => {
  searchSetModal.value = false;
};

const createSetModal = ref(false);
const closeCreateSetModal = () => {
  createSetModal.value = false;
};
const showCreateSet = () => {
  createSetModal.value = true;
};
const currentSetListStatus = ref(false);
const reloadSetList = () => {
  currentSetListStatus.value = !currentSetListStatus.value;
};

const current_set_id = ref(-1);
// 通过 set_id 加载对应的 set
const loadSet = (load_set_id) => {
  current_set_id.value = load_set_id;
};
// 当delete_set_id == current_set_id 的时候需要清空题目区
const deleteSet = (delete_set_id) => {
  if (delete_set_id == current_set_id.value) {
    current_set_id.value = -1;
  }
  console.log("deleteSet:current_set_id: ", current_set_id);
};
</script>

<style scoped>
body {
  background-color: #f7f7f7;
}

.navbar {
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.sidebar {
  background-color: #ffffff;
  box-shadow: 1px 0 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
  height: 100vh;
}

.sidebar h5 {
  margin-bottom: 20px;
}

.empty-state {
  text-align: center;
  margin-top: 50px;
  color: #aaa;
}

.empty-state h3 {
  font-weight: 300;
}

.empty-state button {
  margin-top: 20px;
}
/* 保证搜索框和按钮对齐 */
#search-input {
  width: 150px;
}

h5 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#add-list-btn {
  margin-left: 10px;
}
</style>