import React from 'react';
// import Link from '@plugins/Link';
import Menu from '@plugins/Menu';
import classnames from 'classnames';

/**
 * Editor 富文本编辑器
 */
class Editor extends React.Component{
	constructor(props){		
        super(props);
		this.state = {
			toolStatus: {
				'bold': false,
				'underline': false,
				'italic': false,
				'font-colors': false,
				'font-size': false,
				'link': false,
				'indent': false,
				'align-left': false,
				'align-center': false,
				'align-right': false,
				'image': false,
				'undo': false,
				'redo': false,
				'fullscreen': false
			}
		};
		this.fontColor = '#333333';
		this.fontColors = [
			'#000000','#E60000','#FF9900','#FFFF00','#058A00','#0066CC','#9834FF',
			'#ffffff','#FACCCC','#FFEBCC','#FFFFCC','#CCE8CC','#CCE0F5','#EBD6FF',
			'#BBBBBB','#F06666','#FFC266','#FFFF66','#67B966','#66A3E0','#C285FF',
			'#888888','#A10000','#B26B00','#B2B200','#026100','#0047B2','#6B24B2',
			'#444444','#5C0000','#663D00','#666600','#013700','#002966','#3D1566'
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
	}
	init(container){
		this._cmd('styleWithCSS');
		// new Link(this);
	}
	createRange(){
		let { anchorNode, anchorOffset, focusNode, focusOffset } = this.selection;
		let range = document.createRange();
		let selection = document.getSelection();

		if(!anchorNode)return;
		range.setStart(anchorNode, anchorOffset);
		range.setEnd(focusNode, focusOffset);
		selection.removeAllRanges();
		selection.addRange( range );
	}
	_handleToolClick(id){
		const { toolStatus } = this.state;

		if(id && id in toolStatus){
			this.setState({
				toolStatus: {
					...toolStatus,
					[id]: !toolStatus[id]
				} 
			}, () => {
				this._handleSetContent(id);
			})			
		}
	}
	_renderFontColorPicker(){
		return this.fontColors.map(color => {
			return <span 
				className="d-e-color-options" 
				key={color} 
				tabIndex="0" 
				style={{
					backgroundColor: color
				}}
				onClick={() => {
					this._handleSetContent('font-colors', color); 
				}}
			></span>;
		})
	}
	_renderFontSizePicker(){
		return Object.keys(this.fontSize).sort().reverse().map(size => {
			return <li 
				className="f-z-li" 
				key={size} 
				style={{
					fontSize: this.fontSize[size]
				}}
				onClick={() => {
					this._handleSetContent('font-size', size);
				}}
			>{this.fontSize[size]}</li>;
		})
	}

	getSelection(){
		const selection = document.getSelection();
		const { anchorNode, anchorOffset, focusNode, focusOffset } = selection;
		this.selection = {
			anchorNode, 
			anchorOffset, 
			focusNode, 
			focusOffset,
			text: selection.toString()
		};
	}
	_handleSetContent(type, params){
		const { toolStatus } = this.state;

		if(typeof type === 'string' && type in toolStatus){

			switch(type){
				case 'bold':
					this._cmd('bold');
					break;
				case 'underline':
					this._cmd('underline');
					break;
				case 'italic':
					this._cmd('italic');
					break;
				case 'font-colors':
					this._cmd('foreColor', false, params);
					break;
				case 'font-size':
					this._cmd('fontSize', false, params);
					break;
				case 'link':
					this._cmd('createLink', false, params);
					break;
				case 'indent':
					this._setIndent();
					break;
				case 'align-left':
					this._cmd('justifyLeft');
					break;
				case 'align-center':
					this._cmd('justifyCenter');
					break;
				case 'align-right':
					this._cmd('justifyRight');
					break;
				case 'undo':
					this._cmd('undo');
					break;
				case 'redo':
					this._cmd('redo');
					break;
				case 'fullscreen':
					toolStatus['fullscreen'] ? this._exitFullscreen() : this._fullScreen();
					break;
			}
		}
	}
	_fullScreen() {
        if (document.body.requestFullScreen) {
            document.body.requestFullScreen();
        } else if (document.body.webkitRequestFullScreen) {
            document.body.webkitRequestFullScreen();
        }
    }
    _exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
	_setIndent(){
		this.state.toolStatus['indent'] ? this._cmd('indent') : this._cmd('outdent');
	}
	_cmd(...args){
		document.execCommand(...args);
	}
	_hasParent(node, nodeName){
		let result = false;
		let content = document.querySelector('.d-e-content');
		
		if(!node)return result;
		do{
			if( node.parentNode.nodeName.toLowerCase() === nodeName ){
				result = true;
				break;
			}
			node = node.parentNode;
		}while(node.parentNode !== content);
		return result;
	}
	render(){
		const { toolStatus } = this.state;

		return (
			<div className="d-e-container">
				<div className="d-e-toolbar" >
					{/*<div className="d-e-menu">
						<button id="de-bold" className={classnames('d-e-button icon-bold', {
							'd-e-button-active': toolStatus['bold']
						})} onClick={() => {
							this._handleToolClick('bold');
						}}></button>
					</div>*/}
					<Menu type="bold" icon="icon-bold"  />
					<div className="d-e-menu">
						<button id="de-underline" className="d-e-button icon-underline" onClick={() => {
							this._handleToolClick('underline');
						}}></button>
					</div>
					<div className="d-e-menu">
						<button id="de-italic" className="d-e-button icon-italic" onClick={() => {
							this._handleToolClick('italic');
						}}></button>
					</div>
					<div className="d-e-menu d-e-font-color">
						<button tabIndex="0" className="d-e-button icon-font-colors" onClick={() => {
							this._handleToolClick('font-colors');
						}}></button>
						<div id="de-font-colors" className="d-e-submenu d-e-color-panel">
							{this._renderFontColorPicker()}
						</div>
					</div>
					<div className="d-e-menu d-e-font-size">
						<button tabIndex="0" className="d-e-button icon-font-size" onClick={() => {
							this._handleToolClick('font-size');
						}}></button>
						<div id="de-font-size" className="d-e-submenu d-e-font-size-list">
							<ul className="f-z-ul">
								{this._renderFontSizePicker()}
							</ul>
						</div>
					</div>
					<div className="d-e-menu">
						<button id="de-indent" className="d-e-button icon-indent" onClick={() => {
							this._handleToolClick('indent');
						}}></button>
					</div>
					<div className="d-e-menu">
						<button id="de-align-left" className="d-e-button icon-align-left" onClick={() => {
							this._handleToolClick('align-left');
						}}></button>
					</div>
					<div className="d-e-menu">
						<button id="de-align-center" className="d-e-button icon-align-center" onClick={() => {
							this._handleToolClick('align-center');
						}}></button>
					</div>
					<div className="d-e-menu">
						<button id="de-align-right" className="d-e-button icon-align-right" onClick={() => {
							this._handleToolClick('align-right');
						}}></button>
					</div>
					<div className="d-e-menu">
						<button id="de-image" className="d-e-button icon-image" onClick={() => {
							this._handleToolClick('image');
						}}></button>
					</div>
					<div className="d-e-menu">
						<button id="de-undo" className="d-e-button icon-undo" onClick={() => {
							this._handleToolClick('undo');
						}}></button>
					</div>
					<div className="d-e-menu">
						<button id="de-redo" className="d-e-button icon-redo" onClick={() => {
							this._handleToolClick('redo');
						}}></button>
					</div>
					<div className="d-e-menu d-e-fullscreen">
						<button id="de-fullscreen" className="d-e-button icon-fullscreen" onClick={() => {
							this._handleToolClick('fullscreen');
						}}></button>
					</div>
				</div>
				<div 
					className="d-e-content" 
					contentEditable="true" 
					suppressContentEditableWarning="true"
					onMouseUp={() => {
						this.getSelection();
					}}
					onKeyUp={() => {
						this.getSelection();
					}}
					>
					<p>富文本编辑器富文本编辑器富文本编辑器</p>
				</div>
			</div>
		);
	}
}

export default Editor;

