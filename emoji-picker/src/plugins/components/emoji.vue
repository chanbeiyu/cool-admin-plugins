<template>
	<el-popover
		:ref="setRefs('popover')"
		trigger="click"
		@show="show"
		popper-style="padding: 0px; width: 280px"
	>
		<template #reference>
			<slot>
				<span>
					{{ modelValue }}
				</span>
			</slot>
		</template>
		<emoji-picker
			:ref="setRefs('emojiPicker')"
			:native="native"
			:hideSearch="hideSearch"
			:displayRecent="displayRecent"
			:hideGroupNames="hideGroupIcons"
			:disabledGroups="disabledGroups"
			:disableStickyGroupNames="disableStickyGroupNames"
			:disableSkinTones="disableSkinTones"
			:staticTexts="staticTexts"
			:groupNames="groupNames"
			:additional-groups="additionalGroups"
			:theme="isDark ? 'dark' : 'light'"
			@select="emojiPickerSelect"
		>
		</emoji-picker>
	</el-popover>
</template>

<script lang="ts" setup>
import {module} from "/@/cool/module";

defineOptions({
	name: 'cl-emoji-picker'
});

import { useModel, PropType, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDark, useCounter } from '@vueuse/core';
import { useCool } from '/@/cool/hooks';
import EmojiPicker, { EmojiExt } from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css';

const emit = defineEmits(['update:modelValue', 'textUpdate', 'select']);
const props = defineProps({
	modelValue: { type: String, default: '😁' },
	multiple: { type: Boolean, default: false },
	escapeMode: { type: String as PropType<'icon' | 'unicode' | 'name'>, default: 'icon' },
	escapeEmoji: { type: Function as PropType<(arg: string) => string>, default: null },

	native: { type: Boolean, default: true },
	hideSearch: { type: Boolean, default: false },
	hideGroupIcons: { type: Boolean, default: false },
	disabledGroups: { type: Array<never>, default: [] },
	disableSkinTones: { type: Boolean, default: true },
	disableStickyGroupNames: { type: Boolean, default: false },
	displayRecent: { type: Boolean, default: false },
});

const { t } = useI18n();
const { refs, setRefs } = useCool();
const isDark = ref(useDark());
const { count, inc, reset } = useCounter();
const config = module.config('emoji-picker');

const restValue = props.modelValue;
const modelValue = useModel(props, 'modelValue');

const additionalGroups = ref(config.additionalGroups);
const groupNames = ref({
	smileys_people: t('微笑&人'),
	animals_nature: t('动物&自然'),
	food_drink: t('食物&饮料'),
	activities: t('活动'),
	travel_places: t('旅行地点'),
	objects: t('对象'),
	symbols: t('符号'),
	flags: t('标志'),
	recent: t('最近使用')
});
const staticTexts = ref({
	placeholder: t('搜索表情'),
	skinTone: t('肤色')
});

function emojiPickerSelect(emojiExt: EmojiExt) {
	const e = parsedText(emojiExt);
	if (props.multiple) {
		if (count.value === 0) {
			modelValue.value = e;
		} else {
			modelValue.value = (modelValue.value || '') + e;
		}
	} else {
		modelValue.value = e;
		refs.popover.hide();
	}
	inc();
	emit('select', emojiExt);
}

function parsedText(emojiExt: EmojiExt) {
	switch (props.escapeMode) {
		case 'unicode':
			if (props.escapeEmoji) {
				return props.escapeEmoji(emojiExt.u);
			} else {
				return `\\u${emojiExt.u}`;
			}
		case 'name':
			if (props.escapeEmoji) {
				return props.escapeEmoji(emojiExt.n[emojiExt.n.length - 1]);
			} else {
				return `:${emojiExt.n[emojiExt.n.length - 1]}:`;
			}
		case 'icon':
			if (props.escapeEmoji) {
				return props.escapeEmoji(emojiExt.i);
			} else {
				return emojiExt.i;
			}
	}
}

function show() {
	reset();
}

function clear() {
	modelValue.value = '';
}

function resetV() {
	modelValue.value = restValue;
}

function close() {
	refs.popover.hide();
}

defineExpose({
	resetV,
	clear,
	close
});
</script>

<style lang="scss" scoped></style>
