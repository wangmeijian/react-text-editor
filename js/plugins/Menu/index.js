import React from 'react';
import classnames from 'classnames';
/**
 * 有操作面板的菜单基础类
 */
class Menu extends React.Component {
	constructor(props) {
		super(props);
		this.cmd('styleWithCSS');
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
			case 'font-colors':
				this.cmd('foreColor', false, params);
				break;
			case 'font-size':
				this.cmd('fontSize', false, params);
				break;
			case 'link':
				this.cmd('createLink', false, params);
				break;
			case 'indent':
				active ? this.cmd('indent') : this.cmd('outdent');
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
	cmd(...args) {
		document.execCommand(...args);
	}
	render() {
		const { type, icon, active } = this.props;

		return (
			<div className='d-e-menu'>
				<button
					className={classnames('d-e-button', {
						[icon]: true,
						'd-e-button-active': active
					})}
					onClick={() => {
						this.handleSetContent(type);
					}}
					onMouseDown={() => {
						
					}}
				/>
			</div>
		);
	}
}

export default Menu;