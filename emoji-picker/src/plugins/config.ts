import { type ModuleConfig } from '/@/cool';

export default (): ModuleConfig => {
	return {
		name: 'emoji-picker',
		enable: true,
		components: [() => import('./components/emoji.vue')],
		logo: 'https://cool-service.oss-cn-shanghai.aliyuncs.com/app%2Fbase%2Fd811766c7932496680ce31d864dff1ee_beiyu.png',
		label: 'Emoji 选择器',
		description: '基于 vue3-emoji-picker 封装的 Emoji 选择器',
		author: '北鱼',
		version: '1.0.0',
		updateTime: '2025-03-12',
		demo: [
			{
				name: '基础用法',
				component: () => import('./demo/base.vue')
			}
		],
		doc: 'https://github.com/delowardev/vue3-emoji-picker',
		options: {
			// 自定义表情，分组名暂不支持国际化 格式参考 vue3-emoji-picker 官方文档
			additionalGroups: {
				// my_custom_group1: [
				// 	{ n: ['grinning face', 'grinning'], u: '1f600' },
				// 	{ n: ['grinning face with smiling eyes', 'grin'], u: '1f601' }
				// ],
				// my_custom_group2: [
				// 	{ n: ['grinning face', 'grinning'], u: '1f600' },
				// 	{ n: ['grinning face with smiling eyes', 'grin'], u: '1f601' }
				// ]
			}
		},
		install(app, options) {}
	};
};
