<template>
	<cl-emoji-picker :ref="setRefs('emoji')" v-model="value" multiple value-mode="name" :escape-emoji="escapeEmoji">
		<template #default>
			 <el-button>{{ value }}</el-button>
		</template>
	</cl-emoji-picker>
	<el-button @click="resetV" type="primary">重 置</el-button>
	<el-button @click="clear" type="danger">清 空</el-button>
	<el-button @click="close" type="warning">关 闭</el-button>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import ClEmojiPicker from "/#/emoji-picker/components/emoji.vue";
import {useCool} from "/@/cool/hooks";

const { refs, setRefs } = useCool();

const value = ref("😁");

// emoji 字符解析后处理
function escapeEmoji(emoji: string) {
	return `:${emoji}:`;
}
// 重置为初始值
function resetV() {
	return refs.emoji.resetV();
}
// 清空值
function clear() {
	return refs.emoji.clear();
}
// 关闭 emoji 选择窗口
function close() {
	return refs.emoji.close();
}
</script>
