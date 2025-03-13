import {
	CherryEditorOptions
} from 'cherry-markdown/types/cherry';

export const editor: CherryEditorOptions = {
	id: 'cherry-text',
	name: 'cherry-text',
	autoSave2Textarea: true,
	defaultModel: 'edit&preview',
	showFullWidthMark: true, // 是否高亮全角符号 ·|￥|、|：|“|”|【|】|（|）|《|》
	showSuggestList: true // 是否显示联想框
};

export function defaultMediaShowSetting(name: string) {
	return {
		name, // 回填的alt信息
		poster: null, // 封面图片地址（视频的场景下生效）
		isBorder: false, // 是否有边框样式（图片场景下生效）
		isShadow: false, // 是否有阴影样式（图片场景下生效）
		isRadius: false, // 是否有圆角样式（图片场景下生效）
		width: '60%', // 设置宽度，可以是像素、也可以是百分比（图片、视频场景下生效）
		height: 'auto' // 设置高度，可以是像素、也可以是百分比（图片、视频场景下生效）
	};
}
