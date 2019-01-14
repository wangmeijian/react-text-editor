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
				'heading': false,
				'font-colors': false,
				'font-size': false,
				'link': false,
				'image': false
			},
			linkUrl: '',
			imageUrl: ''
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
		this.heading = [
			{
				tag: 'H1',
				node: <h1>标题1</h1>				
			},
			{
				tag: 'h2',
				node: <h2>标题2</h2>				
			},
			{
				tag: 'h3',
				node: <h3>标题3</h3>				
			},
			{
				tag: 'h4',
				node: <h4>标题4</h4>				
			},
			{
				tag: 'h5',
				node: <h5>标题5</h5>				
			},
			{
				tag: 'h6',
				node: <h6>标题6</h6>				
			}
		];
		this.selection = {};

		this.hasFocus = this.hasFocus.bind(this);
		this.setHeader = this.setHeader.bind(this);
		this.setMenuStatus = this.setMenuStatus.bind(this);
		this.setOneMenuStatus = this.setOneMenuStatus.bind(this);
		this.setDropMenuStatus = this.setDropMenuStatus.bind(this);
		this.setFullScreenState = this.setFullScreenState.bind(this);
		this.compareNodesOrder = this.compareNodesOrder.bind(this);
	}
	componentDidMount() {
		let anchorNode = null;
		this.container = document.querySelector('.d-e-container');
		this.content = document.querySelector('.d-e-container .d-e-content');
		document.addEventListener(
			'webkitfullscreenchange',
			this.setFullScreenState
		);
		anchorNode = this.content.querySelector('h4').childNodes[0];
		this.selection = {
			anchorNode: anchorNode,
			anchorOffset: anchorNode.length,
			focusNode: anchorNode,
			focusOffset: anchorNode.length,
			text: ''
		};
		this.createRange();
	}
	setFullScreenState(target, type) {
		this.setMenuStatus({
			fullscreen: document.fullscreenElement === this.container
		});
	}
	renderHeadingPicker(){
		return this.heading.map(head => {
			return (
				<li
					className="f-z-li"
					key={head.tag}
					onClick={() => {
						this.setDropMenuStatus({
							heading: false
						});
						this.handleSetContent('heading', head.tag);
					}}
				>
					{head.node}
				</li>
			);
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
	setHeader(tag){
		const selectText = this.selection.text;
			
		if(/\n/.test(selectText)){
			const html = selectText.split(/\n/).map(item => `<${tag}>${item}</${tag}>`);
			this.cmd('insertHTML', false, html.join(''));	
		}else{
			this.cmd('formatBlock', false, tag);
		}
	}
	handleSetContent(type, params) {
		const { menuStatus, dropMenuStatus } = this.state;
		switch (type) {
			case 'heading':
				this.createRange();
				this.setHeader(params);
				this.getSelection();
				break;
			case 'font-colors':
				this.createRange();
				this.cmd('foreColor', false, params);
				break;
			case 'font-size':
				this.createRange();
				this.cmd('fontSize', false, params);
				break;
			case 'link':
				this.createRange();
				console.log(this.selection);
				console.log(type);
				this.cmd('createLink', false, params);
				break;
			case 'fullscreen':
				menuStatus['fullscreen']
					? this.exitFullscreen()
					: this.fullScreen();
				break;
		}
	}
	// 设置单个菜单状态
	setOneMenuStatus(status) {
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
		if( anchorNode === focusNode )return;
		try {
			// 判断 anchorNode是否在focusNode之前
			let res = this.compareNodesOrder(anchorNode, focusNode);

			if( res ){
				range.setStart(anchorNode, anchorOffset);
				range.setEnd(focusNode, focusOffset);
			}else{
				range.setStart(focusNode, focusOffset);
				range.setEnd(anchorNode, anchorOffset);
			}			
			selection.removeAllRanges();
			selection.addRange(range);
		} catch (err) {
			// 不报错
		}
	}
	// 判断两个节点先后顺序，true:nodeA在nodeB前，false:nodeA不在nodeB前
	compareNodesOrder(nodeA, nodeB){
		const getRootParent = node => {
			if(node.parentNode === this.content)return node;
			return getRootParent(node.parentNode);
		}
		const xBeforey = (nodeX, nodeY) => {
			if(nodeX.nextElementSibling === null) return false;
			if(nodeX.nextElementSibling === nodeY)return true;
			return xBeforey(nodeX.nextElementSibling);
		}
		const parentA = getRootParent(nodeA);
		const parentB = getRootParent(nodeB);

		return xBeforey(parentA, parentB);
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
			'color': 'font-colors',
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
					// 设置heading再设置bold会取消heading的bold
					if (styleName === 'font-weight') {
						styleValue === 'bold' && names.push('bold');
					}else if (styleName === 'text-align') {
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
		const { menuStatus, dropMenuStatus, linkUrl, imageUrl } = this.state;

		return (
			<div className="d-e-container">
				<div className="d-e-toolbar">					
					<DropMenu
						classNames="d-e-heading"
						type="heading"
						icon="icon-header"
						active={dropMenuStatus['heading']}
						setMenuStatus={this.setDropMenuStatus}
					>
						<div className="d-e-submenu d-e-heading-panel">
							<ul className="d-e-heading-list">{this.renderHeadingPicker()}</ul>
						</div>
					</DropMenu>
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
						<div className="d-e-submenu d-e-font-size-panel" >
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
					<DropMenu
						classNames="d-e-link"
						type="link"
						icon="icon-link"
						active={dropMenuStatus['link']}
						setMenuStatus={this.setDropMenuStatus}
					>
						<div className="d-e-submenu d-e-link-panel">
							<div className="d-e-link-item">
								<span className="d-e-link-desc">链接地址：</span>
								<input type="text" tabIndex="0" value={linkUrl} onChange={e => {
									this.setState({
										linkUrl: e.target.value
									})
								}} className="d-e-link-input" />
							</div>
							<div className="d-e-link-item">
								<button onClick={() => {
									this.handleToolClick('link', linkUrl);
									this.setDropMenuStatus({
										link: false
									})
								}} className="d-e-link-save" tabIndex="0">保存</button>
								<button onClick={() => {
									this.setDropMenuStatus({
										link: false
									})
								}} className="d-e-link-cancel" tabIndex="0">取消</button>
							</div>
						</div>
					</DropMenu>
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
					autoFocus="autofocus"
					contentEditable="true"
					spellCheck="false"
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
					<h1 style={{
						textAlign: 'center'
					}}>editor-react</h1>
					<h4 style={{
						textAlign: 'center'
					}}>富文本编辑器，免费、开源</h4>
				</div>
			</div>
		);
	}
}

export default Index;