import '@css/index.less';
import React from 'react';
// import Link from '@plugins/Link';
import Menu from '@plugins/Menu';
import DropMenu from '@plugins/DropMenu';
import classnames from 'classnames';

class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			menuStatus: {
				'bold': false,
				'underline': false,
				'italic': false,
				'indent': false,
				'align-left': false,
				'align-center': false,
				'align-right': false,
				'undo': false,
				'redo': false,
				'fullscreen': false
			},
			dropMenuStatus: {
				'font-colors': false,
				'font-size': false,
				'link': false,
				'image': false
			}
		};
		this.fontColors = [
			'#000000',
			'#E60000',
			'#FF9900',
			'#FFFF00',
			'#058A00',
			'#0066CC',
			'#9834FF',
			'#ffffff',
			'#FACCCC',
			'#FFEBCC',
			'#FFFFCC',
			'#CCE8CC',
			'#CCE0F5',
			'#EBD6FF',
			'#BBBBBB',
			'#F06666',
			'#FFC266',
			'#FFFF66',
			'#67B966',
			'#66A3E0',
			'#C285FF',
			'#888888',
			'#A10000',
			'#B26B00',
			'#B2B200',
			'#026100',
			'#0047B2',
			'#6B24B2',
			'#444444',
			'#5C0000',
			'#663D00',
			'#666600',
			'#013700',
			'#002966',
			'#3D1566'
		];
		this.fontSize = {
			'1': 'x-small',
			'2': 'small',
			'3': 'nromal',
			'4': 'large',
			'5': 'x-large',
			'6': 'xx-large'
		};
		this.selection = {};

		this.hasFocus = this.hasFocus.bind(this);

		this.setMenuStatus = this.setMenuStatus.bind(this);
		this.setOneMenuStatus = this.setOneMenuStatus.bind(this);
		this.setDropMenuStatus = this.setDropMenuStatus.bind(this);
		this.setFullScreenState = this.setFullScreenState.bind(this);
	}
	componentDidMount() {
		this.container = document.querySelector('.d-e-container');
		this.content = document.querySelector('.d-e-container .d-e-content');
		document.addEventListener(
			'webkitfullscreenchange',
			this.setFullScreenState
		);
	}
	setFullScreenState(target, type) {
		this.setMenuStatus({
			fullscreen: document.fullscreenElement === this.container
		});
	}
	renderFontColorPicker() {
		return this.fontColors.map(color => {
			return (
				<span
					className="d-e-color-options"
					key={color}
					tabIndex="0"
					style={{
						backgroundColor: color
					}}
					onClick={() => {
						this.setDropMenuStatus({
							'font-colors': false
						})
						this.createRange();
						this.handleSetContent('font-colors', color);
					}}
				/>
			);
		});
	}
	renderFontSizePicker() {
		return Object.keys(this.fontSize)
			.sort()
			.reverse()
			.map(size => {
				return (
					<li
						className="f-z-li"
						key={size}
						style={{
							fontSize: this.fontSize[size]
						}}
						onClick={() => {
							this.setDropMenuStatus({
								'font-size': false
							})
							this.handleSetContent('font-size', size);
						}}
					>
						{this.fontSize[size]}
					</li>
				);
			});
	}
	handleToolClick(id) {
		this.handleSetContent(id);
	}
	cmd(...args) {
		document.execCommand(...args);
	}
	handleSetContent(type, params) {
		const { menuStatus, dropMenuStatus } = this.state;
		switch (type) {
			case 'font-colors':
				this.createRange();
				this.cmd('foreColor', false, params);
				break;
			case 'font-size':
				this.createRange();
				this.cmd('fontSize', false, params);
				break;
			case 'link':
				this.cmd('createLink', false, params);
				break;
			case 'fullscreen':
				menuStatus['fullscreen']
					? this.exitFullscreen()
					: this.fullScreen();
				break;
		}
	}
	// 单个菜单状态
	setOneMenuStatus(status) {
		this.createRange();
		this.setState(
			{
				dropMenuStatus: this.state.dropMenuStatus,
				menuStatus: {
					...this.state.menuStatus,
					...status
				}
			},
			() => {
				// 更新同类菜单状态，如左/中/右对齐
				this.setMenuStatus();
			}
		);
	}
	setMenuStatus(status) {
		let styles = [];
		const menuStatus = {};
		const currentStatus = {};
		// reset
		for (let menu in this.state.menuStatus) {
			if (menu !== 'fullscreen') menuStatus[menu] = false;
		}

		this.getSelection();
		styles = this.getCurrentStyle();
		styles.forEach(item => {
			currentStatus[item] = true;
		});
		this.setState({
			dropMenuStatus: this.state.dropMenuStatus,
			menuStatus: {
				...menuStatus,
				...currentStatus,
				...status
			}
		});
	}
	setDropMenuStatus(status){
		this.setState({
			menuStatus: this.state.menuStatus,
			dropMenuStatus: {
				...this.state.dropMenuStatus,
				...status
			}
		})
	}

	fullScreen() {
		if (this.container.requestFullScreen) {
			this.container.requestFullScreen();
		} else if (this.container.webkitRequestFullScreen) {
			this.container.webkitRequestFullScreen();
		}
	}
	exitFullscreen() {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
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

		if (!this.hasFocus()) return false;
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

	render() {
		const { menuStatus, dropMenuStatus } = this.state;

		return (
			<div className="d-e-container">
				<div className="d-e-toolbar">
					<Menu
						setMenuStatus={this.setOneMenuStatus}
						type="bold"
						icon="icon-bold"
						active={menuStatus.bold}
					/>
					<Menu
						setMenuStatus={this.setOneMenuStatus}
						type="underline"
						icon="icon-underline"
						active={menuStatus.underline}
					/>
					<Menu
						setMenuStatus={this.setOneMenuStatus}
						type="italic"
						icon="icon-italic"
						active={menuStatus.italic}
					/>
					<DropMenu
						classNames="d-e-font-color"
						type="font-colors"
						icon="icon-font-colors"
						active={dropMenuStatus['font-colors']}
						setMenuStatus={this.setDropMenuStatus}
					>
						<div className="d-e-submenu d-e-color-panel">
							{this.renderFontColorPicker()}
						</div>
					</DropMenu>
					<DropMenu
						classNames="d-e-font-size"
						type="font-size"
						icon="icon-font-size"
						active={dropMenuStatus['font-size']}
						setMenuStatus={this.setDropMenuStatus}
					>
						<div
							id="de-font-size"
							className="d-e-submenu d-e-font-size-list"
						>
							<ul className="f-z-ul">
								{this.renderFontSizePicker()}
							</ul>
						</div>
					</DropMenu>
					<Menu
						setMenuStatus={this.setOneMenuStatus}
						type="indent"
						icon="icon-indent"
						active={menuStatus.indent}
					/>
					<Menu
						setMenuStatus={this.setOneMenuStatus}
						type="align-left"
						icon="icon-align-left"
						active={menuStatus['align-left']}
					/>
					<Menu
						setMenuStatus={this.setOneMenuStatus}
						type="align-center"
						icon="icon-align-center"
						active={menuStatus['align-center']}
					/>
					<Menu
						setMenuStatus={this.setOneMenuStatus}
						type="align-right"
						icon="icon-align-right"
						active={menuStatus['align-right']}
					/>
					<div className="d-e-menu">
						<button
							id="de-image"
							className="d-e-button icon-image"
							onClick={() => {
								this.handleToolClick('image');
							}}
						/>
					</div>
					<Menu
						setMenuStatus={this.setOneMenuStatus}
						type="undo"
						icon="icon-undo"
					/>
					<Menu
						setMenuStatus={this.setOneMenuStatus}
						type="redo"
						icon="icon-redo"
					/>
					<div className="d-e-menu d-e-fullscreen">
						<button
							id="de-fullscreen"
							className={classnames(
								'd-e-button icon-fullscreen',
								{
									'd-e-button-active': menuStatus.fullscreen
								}
							)}
							onClick={() => {
								this.handleToolClick('fullscreen');
							}}
						/>
					</div>
				</div>
				<div
					className="d-e-content"
					contentEditable="true"
					suppressContentEditableWarning="true"
					onMouseUp={() => {
						setTimeout(() => {
							this.setMenuStatus();
						}, 10);
					}}
					onKeyUp={() => {
						this.setMenuStatus();
					}}
				>
					<p>富文本编辑器富文本编辑器富文本编辑器</p>
					<p />
					<p>富文本编辑器富文本编辑器富文本编辑器</p>
				</div>
			</div>
		);
	}
}

export default Index;