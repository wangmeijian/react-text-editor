import React from 'react';
// import Link from '@plugins/Link';
import Menu from '@plugins/Menu';
import classnames from 'classnames';

/**
 * Editor 富文本编辑器
 */
class Editor extends React.Component {
	constructor(props) {
		super(props);
		this.selection = {};

		this.hasFocus = this.hasFocus.bind(this);
		this.setMenuStatus = this.setMenuStatus.bind(this);
	}
	componentDidMount() {
		// new Link(this);
		this.content = document.querySelector('.d-e-container .d-e-content');
	}
	createRange() {
		let {
			anchorNode,
			anchorOffset,
			focusNode,
			focusOffset
		} = this.selection;
		let range = document.createRange();
		let selection = document.getSelection();

		if (!anchorNode) return;
		try {
			range.setStart(anchorNode, anchorOffset);
			range.setEnd(focusNode, focusOffset);
			selection.removeAllRanges();
			selection.addRange(range);
		} catch (err) {
			// 不报错
		}
	}
	hasFocus() {
		return document.activeElement === this.content;
	}

	getSelection() {
		const selection = document.getSelection();
		const { anchorNode, anchorOffset, focusNode, focusOffset } = selection;

		if(!this.hasFocus())return false;
		this.selection = {
			anchorNode,
			anchorOffset,
			focusNode,
			focusOffset,
			text: selection.toString()
		};
	}
	getCurrentStyle() {
		if (!this.hasFocus()) return [];
		const result = [];
		const status = {
			'font-weight': 'bold',
			'text-decoration-line': 'underline',
			'font-style': 'italic',
			color: 'font-colors',
			'font-size': 'font-size',
			'text-align': ''
		};
		const node = this.selection.anchorNode.parentNode;
		const computed = (node, names) => {
			if (node === this.content) return names;
			const styles = node.getAttribute('style');

			if (!styles) return names;
			styles.split(';').forEach(item => {
				if (!item.length) return false;
				let styleName = item.split(': ')[0].trim();
				let styleValue = item.split(': ')[1].trim();

				if (styleName in status) {
					if (styleName === 'text-align') {
						names.push(
							{
								left: 'align-left',
								center: 'align-center',
								right: 'align-right'
							}[styleValue]
						);
					} else {
						names.push(status[styleName]);
					}
				}
			});
			return computed(node.parentNode, names);
		};
		return computed(node, result);
	}
	setMenuStatus() {
		let styles = [];
		const currentStatus = {};

		this.getSelection();
		styles = this.getCurrentStyle();
		styles.forEach(item => {
			currentStatus[item] = true;
		})
		this.props.setMenuStatus(currentStatus);
	}
	render() {
		return (
			<div
				className="d-e-content"
				contentEditable="true"
				suppressContentEditableWarning="true"
				onMouseUp={this.setMenuStatus}
				onKeyUp={this.setMenuStatus}
			>
				<p>富文本编辑器富文本编辑器富文本编辑器</p>
				<p></p>
				<p>富文本编辑器富文本编辑器富文本编辑器</p>
			</div>
		);
	}
}

export default Editor;