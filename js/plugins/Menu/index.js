import React from 'react';
import classnames from 'classnames';
/**
 * 菜单基础类
 */
class Menu extends React.Component {
	constructor(props) {
		super(props);
		this.cmd('styleWithCSS');
		this.indent = this.indent.bind(this);
		this.getRootParent = this.getRootParent.bind(this);
	}
	handleSetContent(type, params) {
		const { active, setMenuStatus } = this.props;

		setMenuStatus({
			[type]: !active
		})
		switch (type) {
			case 'bold':
				this.cmd('bold');
				break;
			case 'underline':
				this.cmd('underline');
				break;
			case 'italic':
				this.cmd('italic');
				break;
			case 'indent':
				this.indent(!active);
				break;
			case 'align-left':
				this.cmd('justifyLeft');
				break;
			case 'align-center':
				this.cmd('justifyCenter');
				break;
			case 'align-right':
				this.cmd('justifyRight');
				break;
			case 'undo':
				this.cmd('undo');
				break;
			case 'redo':
				this.cmd('redo');
				break;
		}
	}
	indent(active){
		let selection = document.getSelection();
		let rootParent = this.getRootParent(selection.anchorNode);
		rootParent.style.textIndent = active ? '2em' : '';
	}
	getRootParent(node){
		if(node.parentNode.getAttribute('contenteditable') === "true")return node;
		return this.getRootParent(node.parentNode);
	}
	cmd(...args) {
		document.execCommand(...args);
	}
	render() {
		const { type, icon, active } = this.props;

		return (
			<div className='r-t-menu'>
				<button
					className={classnames('r-t-button', {
						[icon]: true,
						'r-t-button-active': active
					})}
					onClick={() => {
						this.handleSetContent(type);
					}}
				/>
			</div>
		);
	}
}

export default Menu;