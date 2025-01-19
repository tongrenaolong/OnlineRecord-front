<script setup>
import { ElMessage } from 'element-plus';
import { ref,watch } from 'vue';

const props = defineProps({
    currentSetListStatus: Boolean,
})
watch(
    () => props.currentSetListStatus,
    ()=>{
    getSets();
})
const emit = defineEmits();

// 当前选中的 set_id
const selectedSetId = ref(null);

// 通过 set_id 加载对应的 set
const loadSetList = (load_set_id) => {
    emit('loadSet', load_set_id);
    // 设置选中的 set_id
    selectedSetId.value = load_set_id;
};

// 在组件内部删除 set之后需要将 delete_set_id 告诉外部，
// 外部需要根据 delete_set_id 判断是否需要刷新
const deleteSet = async (delete_set_id) => {
    emit('deleteSet', delete_set_id);
    try {
        const response = await fetch(
            `/onlinerecord/delete_set_id?set_id=${delete_set_id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const data = await response.json();
        console.log("data: ", data);
        if (data["status_code"]) {
            getSets();
        } else {
            alert(data["message"]);
        }
    } catch (error) {
        alert(error);
    }
};

const sets_list = ref({});
const getSets = async () => {
    try {
        const response = await fetch("/onlinerecord/get_sets", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        if (data.status_code) {
            const sets = data["sets"];
            console.log(sets);
            sets_list.value = sets;
        } else {
            ElMessage.error(data.message);
        }
    } catch (error) {
        console.log("getSets: ", error);
    }
};

import { onBeforeMount } from 'vue';
onBeforeMount(() => {
    getSets();
});
// 刷新的时候也需要重新加载
</script>

<template>
    <div>
        <ul class="list-group" id="set-list">
            <!-- 题单列表会动态加载在这里 -->
            <li
                class="list-group-item"
                v-for="set in sets_list"
                :key="set.set_id"
                :class="{ 'selected': set.set_id === selectedSetId }"
            >
                <div>
                    <strong>{{ set.set_name }}</strong>
                    <p>{{ set.description }}</p>
                    <small>创建时间：{{ set.created_at }}</small>
                </div>
                <button
                    class="btn btn-sm btn-outline-primary"
                    @click="loadSetList(set.set_id)"
                >
                    查看
                </button>
                <button
                    class="btn btn-sm btn-outline-primary"
                    @click="deleteSet(set.set_id)"
                >
                    删除
                </button>
            </li>
            <!-- 如果 sets_list 为空，显示提示信息 -->
            <li
                class="list-group-item"
                v-if="!sets_list || sets_list.length === 0"
            >
                <p class="text-center text-muted">还没加入题单</p>
            </li>
        </ul>
    </div>
</template>

<style>
/* 添加样式，选中后背景变为蓝色 */
.list-group-item.selected {
    background-color: #60d4ab; /* 蓝色背景 */
    color: white; /* 白色文字 */
}
</style>
