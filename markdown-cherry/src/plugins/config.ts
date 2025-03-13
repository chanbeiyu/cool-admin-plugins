import { type ModuleConfig, storage } from '/@/cool';
import Cherry from 'cherry-markdown';
import echartsEngine from 'cherry-markdown/dist/addons/advance/cherry-table-echarts-plugin';
import * as echarts from 'echarts';

export default (): ModuleConfig => {
	return {
		name: 'markdown-cherry',
		enable: true,
		components: [() => import('./components/cherry')],
		logo: 'https://cool-service.oss-cn-shanghai.aliyuncs.com/app%2Fbase%2Fd811766c7932496680ce31d864dff1ee_beiyu.png',
		label: 'Cherry 编辑器',
		description: '基于 cherry-markdown 封装的富文本编辑器',
		author: '北鱼',
		version: '1.0.0',
		updateTime: '2025-03-11',
		demo: [
			{
				name: '基础用法',
				component: () => import('./demo/base.vue')
			}
		],
		doc: 'https://github.com/Tencent/cherry-markdown',
		options: {
			toolbars: {
				toolbar: ['bold', 'italic', 'strikethrough', 'underline', 'sub', 'sup', 'ruby', '|', 'size', 'color', 'header', '|', 'ol', 'ul', 'checklist', 'justify', 'panel', 'detail', '|',
					{ insert: ['link', 'hr', 'br', 'code', 'inlineCode', 'formula', 'toc', 'table', 'image', 'audio', 'video', 'pdf', 'word', 'file']},
					// lineTableChart、barTableChart 为自定义按钮，根据表格显示统计图
					{ graph: ['drawIo', 'lineTableChart', 'barTableChart'] },
					'|', 'shortcutKey'
				],
				toolbarRight: ['fullScreen', '|', 'export', 'codeTheme', 'wordCount'],
				bubble: ['bold', 'italic', 'underline', 'strikethrough', 'sub', 'sup', 'quote', 'ruby', '|', 'size', 'color'],
				sidebar: ['togglePreview', 'search', 'mobilePreview', 'copy', 'theme'],
				toc: {
					/** 要不要更新URL的hash */
					updateLocationHash: false,
					/** pure: 精简模式/缩略模式，只有一排小点； full: 完整模式，会展示所有标题 */
					defaultModel: 'full',
					/** 是否显示自增序号 */
					showAutoNumber: true,
					/** 悬浮目录的悬浮方式。当滚动条在cherry内部时，用 absolute；当滚动条在cherry外部时，用fixed */
					position: 'absolute',
					/** 额外样式 */
					cssText: 'cherry-toc-style'
				}
			},
			// 上传文件的时候用来指定文件类型
			fileTypeLimitMap: {
				video: 'video/*',
				audio: 'audio/*',
				image: 'image/*',
				word: '.doc,.docx',
				pdf: '.pdf',
				file: '*'
			},
			// 上传文件的时候是否开启多选
			multipleFileSelection: {
				video: true,
				audio: true,
				image: true,
				word: false,
				pdf: false,
				file: false
			},
		},
		install(app, options) {
			if (echarts) {
				Cherry.usePlugin(echartsEngine, { echarts });
				window.echarts = echarts;
			}
		}
	};
};
