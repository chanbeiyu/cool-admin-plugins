import {
	defineComponent,
	onMounted,
	useModel,
	PropType,
	onBeforeUnmount,
	shallowRef,
	watch,
	ref, h
} from 'vue';
import { useDark } from '@vueuse/core';
import Cherry from 'cherry-markdown';
import {useI18n} from "vue-i18n";
import { useUpload } from '/#/upload/hooks';
import { useCool, module, storage } from '/@/cool';
import { parsePx } from '/@/cool/utils';
import { locales, localMapping } from './lang';
import { defaultMediaShowSetting } from './options';
import { pinyin, isHtml } from '../utils/index';
import 'cherry-markdown/dist/cherry-markdown.css';
import './styles.scss';
import {FileParams} from "/#/markdown-cherry/components/types";


export default defineComponent({
	name: 'cl-markdown-cherry',
	props: {
		modelValue: { type: String },
		mode: { type: String as PropType<'simple' | 'default' | 'full'>, default: 'default' },
		height: { type: [String, Number], default: 600 },
		preview: { type: Boolean, default: false },
		isSpace: { type: Boolean, default: false }
	},

	setup(props, event) {
		const { t } = useI18n();
		const { setRefs } = useCool();
		const { toUpload } = useUpload();
		const config = module.config('markdown-cherry');
		const Editor = shallowRef<Cherry>();
		const modelValue = useModel(props, 'modelValue');

		function initMarkdownCherry() {
			Editor.value = new Cherry({
				id: 'markdown-container',
				value: modelValue.value,
				toolbars: {
					toolbar: config.toolbars.toolbar,
					toolbarRight: config.toolbars.toolbarRight,
					bubble: config.toolbars.bubble,
					sidebar: config.toolbars.sidebar,
					toc: config.toolbars.toc,
					customMenu: {
						lineTableChart: lineTableChart,
						barTableChart: barTableChart,
					},
					// 为了不出现警告
					shortcutKeySettings: {
						isReplace: true
					}
				},
				locales,
				isPreviewOnly: props.preview,
				locale: localMapping[storage.get('locale')],
				fileTypeLimitMap: config.fileTypeLimitMap,
				multipleFileSelection: config.multipleFileSelection,
				drawioIframeUrl: '../drawio/index.html',
				callback: {
					urlProcessor: urlProcessor,
					fileUpload: fileUpload,
					fileUploadMulti: fileUploadMulti,
					beforeImageMounted: beforeImageMounted,
					changeString2Pinyin: changeString2Pinyin
					// onPaste: onPaste
				},
				event: {
					focus: onFocus,
					blur: onBlur,
					afterChange: afterChange,
					afterInit: afterInit
				}
			});
		}

		function fileUpload(file: File, callback: (url: string, params?: FileParams) => void) {
			toUpload(file, {
				mode: props.isSpace ? 'space' : 'local'
			}).then((res: { key: string; url: string; fileId: string }) => {
				callback(res.url, {
					name: `${file.name.replace(/\.[^.]+$/, '')}`,
					width: '60%',
					height: 'auto'
				});
			});
		}

		async function fileUploadMulti(files: any, callback: any) {
			const promises: any[] = [];
			for (const file of files) {
				await toUpload(file, {
					mode: props.isSpace ? 'space' : 'local'
				}).then((res: { key: string; url: string; fileId: string }) => {
					const fileType = file.type;
					const promise: Promise<any> = new Promise(resolve => {
						if (/video|image|audio/i.test(fileType)) {
							resolve({
								url: res.url,
								params: defaultMediaShowSetting(
									`${file.name.replace(/\.[^.]+$/, '')}`
								)
							});
						} else {
							resolve({ url: res.url });
						}
					});
					promises.push(promise);
				});
			}
			Promise.all(promises).then(results => {
				callback(results);
			});
		}

		function toBase64(file: File) {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = event => {
					// 将读取的数据转换为 base64 编码的字符串
					const base64String = event.target?.result;
					// 解析为 Promise 对象，并返回 base64 编码的字符串
					resolve(base64String);
				};
				reader.onerror = function () {
					reject(new Error('Failed to load file'));
				};
			});
		}

		function urlProcessor(
			url: string,
			srcType: 'image' | 'audio' | 'video' | 'autolink' | 'link',
			callback?: any
		): string {
			return url;
		}

		function beforeImageMounted(srcProp: string, src: string) {
			return { srcProp: srcProp, src: src };
		}

		function changeString2Pinyin(str: string) {
			return pinyin(str);
		}

		function onPaste(
			clipboardData: ClipboardEvent['clipboardData'],
			cherry: any
		): string | boolean {
			const str = clipboardData?.getData('text');
			if (isHtml(str)) {
				return cherry.engine.makeMarkdown(str);
			}
			return str || '';
		}

		function afterInit(text: string, html: string) {
			onDisabled();
		}

		function afterChange(text: string, html: string) {
			modelValue.value = text;
			event.emit('change', html, text);
		}

		function onFocus(opt: { e: MouseEvent; cherry: Cherry }) {
			event.emit('focus', opt.cherry, opt.e);
		}

		function onBlur(opt: { e: MouseEvent; cherry: any }) {
			event.emit('blur', opt.cherry, opt.e);
		}

		function onDisabled() {
			if (props.preview) {
				Editor.value?.switchModel('previewOnly');
			} else {
				Editor.value?.switchModel('edit&preview');
			}
		}

		// 定义带图表表格的按钮
		const lineTableChart = Cherry.createMenuHook(t('折线图'), {
			iconName: 'trendingUp',

			onClick: (...args: any[]) => {
				Editor.value?.insert(
					'\n| :line:{x,y} | Header1 | Header2 | Header3 | Header4 |\n| ------ | ------ | ------ | ------ | ------ |\n| Sample1 | 11 | 11 | 4 | 33 |\n| Sample2 | 112 | 111 | 22 | 222 |\n| Sample3 | 333 | 142 | 311 | 11 |\n'
				);
			}
		});
		const barTableChart = Cherry.createMenuHook(t('柱状图'), {
			iconName: 'insertGantt',
			onClick: (...args: any[]) => {
				Editor.value?.insert(
					'\n| :bar:{x,y} | Header1 | Header2 | Header3 | Header4 |\n| ------ | ------ | ------ | ------ | ------ |\n| Sample1 | 11 | 11 | 4 | 33 |\n| Sample2 | 112 | 111 | 22 | 222 |\n| Sample3 | 333 | 142 | 311 | 11 |\n'
				);
			}
		});

		watch(() => [props.preview], onDisabled);
		onMounted(() => {
			initMarkdownCherry();
			const isDark = ref(useDark());
			const theme = isDark.value ? 'dark' : 'light';
			Editor.value?.setTheme(theme);
		});
		onBeforeUnmount(() => {
			if (!Editor.value) return;
			Editor.value.destroy();
		});

		return () => {
			return h(
				<div  />,
				{
					ref: setRefs('editor'),
					id: "markdown-container",
					class: "cl-markdown-cherry",
					style: { height: parsePx(props.height) }
				}
			);
		};

	}
});

