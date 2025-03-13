# 基于 vue3-emoji-picker 的 emoji 选择器

## 介绍
基于 vue3-emoji-picker 的 emoji 选择器。支持特性如下：

- 多种格式支持：emoji、emoji 名称、Unicode 编码
- 添加自定义 emoji 
- 多语言支持
- 跟随主题调整组件黑白模式

## 安装

**前端依赖**

```
pnpm install vue3-emoji-picker
```

**后端依赖**

无

**安装组件**

复制 emoji-picker 文件夹到前端项目的 src/plugins 目录下

## 使用说明

[vue3-emoji-picker 官方文档](https://github.com/delowardev/vue3-emoji-picker)

**组件使用**

```html
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
```

## 更新计划
- 暂无

## 更新日志

### v1.0.0(2025-03-13)



